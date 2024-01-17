'use client'
import React, { useContext, useEffect, useState } from 'react'
import Filter from '@/components/Filter/page'
import { Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ModalRegisterEvent from '@/components/ModalRegister/page';
import Event from '@/database/entities/event';
import events from 'events';
import { DefaultContext } from '@/contexts/default';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PlaceIcon from '@mui/icons-material/Place';
import Image from 'next/image';
import { FILTER_TYPE } from '@/types/filter';
import { ROLE } from '@/types/roles';
import EventDB from '@/database/wrappers/event';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

const FilterOptions = [
  {
    text: 'Aprovados',
    type: 0
  },
  {
    text: 'Em espera',
    type: 1
  },
  {
    text: 'Todos',
    type: 2
  }
];

const MyEvents = () => {
  const { events, user, usersdicionary } = useContext(DefaultContext);
  const [filterOption, setFilterOption] = useState(2)
  const [openRegister, setOpenRegister] = useState(false);
  const [dataSelected, setDataSelected] = useState<Event | null>(null);
  const [eventsFilter, setEventsFilter] = useState<Event[]>([]);

  console.log(usersdicionary)


  const handleFilterChange = (option: number) => {
    setFilterOption(option);
  };

  const handleOpenEdit = (item: any) => {
    setOpenRegister(true);
    setDataSelected(item);
  };

  const handleOpenRegister = () => {
    setOpenRegister(true);
  };
  const handleCloseRegister = () => {
    setOpenRegister(false);
  };

  const handleChangeStatus = (event: Event) => {
    const data = {
      ...event,
      status: !event.status,
    }
    if (user?.role === ROLE.SUPER_ADMIN) {
      new EventDB().update(event.id, data)
    }
  }

  useEffect(() => {
    if (filterOption === FILTER_TYPE.ALL && user?.role === ROLE.SUPER_ADMIN) {
      setEventsFilter(events);
    } else if (filterOption === FILTER_TYPE.APPROVED && user?.role === ROLE.SUPER_ADMIN) {
      const eventsFilter = events.filter((event) => event.status);
      setEventsFilter(eventsFilter);
    } else if (filterOption === FILTER_TYPE.ONHOLD && user?.role === ROLE.SUPER_ADMIN) {
      const eventsFilter = events.filter((event) => !event.status);
      setEventsFilter(eventsFilter);
    }
  }, [filterOption, events]);

  useEffect(() => {
    if (filterOption === FILTER_TYPE.ALL && user?.role === ROLE.COMMON_USER) {
      const eventsFilter = events.filter((event) => event.createdBy === user?.id);
      setEventsFilter(eventsFilter);
    } else if (filterOption === FILTER_TYPE.APPROVED && user?.role === ROLE.COMMON_USER) {
      const eventsFilter = events.filter((event) => event.status && event.createdBy === user?.id);
      setEventsFilter(eventsFilter);
    } else if (filterOption === FILTER_TYPE.ONHOLD && user?.role === ROLE.COMMON_USER) {
      const eventsFilter = events.filter((event) => !event.status && event.createdBy === user?.id);
      setEventsFilter(eventsFilter);
    }
  }, [filterOption, events]);

  return (
    <>
      <main className="flex justify-center bg-[#f1f1f1dd] py-[80px]">
        <div className="center">
          <div className=" flex flex-row gap-4 items-center justify-beetween  w-full">

            <Filter
              options={FilterOptions}
              onFilterChange={handleFilterChange}
              filterOption={filterOption}
            />

            <Button
              className="flex mt-2 rounded-3xl text-xl bg-primary px-4 font-bold justify-center items-center text-white py-4"
              sx={{
                border: '1px solid #006D3E',
                '&:hover': {

                  border: '1px solid #006D3E',
                  color: '#006D3E',

                },
              }}
              onClick={handleOpenRegister}
            >
              <AddIcon />
              Criar evento
            </Button>



          </div>

          <div className='flex w-full justify-center gap-5 mt-10 flex-wrap'>
            {eventsFilter.map((event: Event) => (
              <div key={event.id} className='flex flex-col w-[264px] h-[400px]'>
                <div className='shadow rounded-t-md h-full'>
                  <div className=''>
                    <Image
                      src={event.image_url || ''}
                      width={300}
                      height={0}
                      className='w-[300px] h-[200px] rounded-xl'
                      alt='Imagem do evento'
                    />

                    <div className='p-2'>
                      <p className='text-center uppercase font-bold text-xl overflow-hidden whitespace-nowrap'>
                        {event.name.length > 10 ? `${event.name.substring(0, 10)}...` : event.name}
                      </p>

                      <div className='flex gap-2 my-2'>
                        <CalendarMonthIcon />
                        <p className='font-bold'>{event.date}</p>
                      </div>
                      <div className='flex gap-2 my-2'>
                        <PlaceIcon />
                        <p className='font-bold text-sm'>{event.address.city}</p>

                      </div>
                      {/* 
                      <div className='flex gap-2 my-2'>
                        <PlaceIcon />
                        <p className='font-bold text-sm'>{event.address.neighborhood}, </p>

                      </div>

                      
                      <div className='flex gap-2 my-2'>
                        
                        <p className='font-bold text-sm'>{event.address.street}</p>

                      </div> */}
                      

                      {user?.role === ROLE.SUPER_ADMIN &&
                        <p className='font-bold text-sm'>Por: {usersdicionary[event?.createdBy]?.name?.substring(0, 20)}</p>

                      }
                    </div>
                  </div>
                </div>

                <div className='flex flex-col justify-between h-full'>
                  <Button
                    className={`${event.status ? 'bg-primary' : 'bg-yellow'}  w-full text-white font-bold`}
                    onClick={() => handleChangeStatus(event)}
                  >
                    {event.status ? 'APROVADO' : 'EM ESPERA'}
                  </Button>

                  <Button
                    className='bg-[#00031F] w-full text-white font-bold mt-2'
                    onClick={() => handleOpenEdit(event)}
                  >
                    Editar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <ModalRegisterEvent
        open={openRegister}
        setIsOpen={handleOpenRegister}
        setIsClose={handleCloseRegister}
        editData={dataSelected}


      />
    </>
  )
}

export default MyEvents