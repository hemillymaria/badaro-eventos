'use client'
import React, { useContext, useEffect, useState } from 'react'
import EventDB from '@/database/wrappers/event'
import Event from '@/database/entities/event'
import user from '@/database/wrappers/user'
import { orderBy, where } from 'firebase/firestore'
import Image from 'next/image'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PlaceIcon from '@mui/icons-material/Place';
import { DefaultContext } from '@/contexts/default'



const CardEvent = ({search}) => {
  const { eventsHome} = useContext(DefaultContext);

  const searchLowercase= search.toLowerCase();
  const events = eventsHome.filter(event => event.name.toLowerCase().includes(searchLowercase));

  return (
    <div className='flex w-full justify-center gap-5 my-10 flex-wrap'>
      {events.map((event: Event) => (
        <div className='shadow rounded-md w-1/4 '>
          <div className=''>
            <Image
              src={event.image_url || ''}
              width={300}
              height={0}
              className='w-[300px] h-[200px] rounded-xl '
              alt='Imagem do'
            />

            <div className='p-2'>
              <p className='text-center uppercase font-bold text-xl'>{event.name}</p>
              <div className='flex gap-2 my-2'>
                <CalendarMonthIcon />
                <p className='font-bold'>{event.date}</p>
              </div>
              <div className='flex gap-2 my-2'>
                <PlaceIcon />
                <p className='font-bold text-sm'>{event.address.city}, {event.address.neighborhood}, {event.address.street}</p>
              </div>


            </div>

          </div>
        </div>
      ))}
    </div>
  )
}

export default CardEvent
