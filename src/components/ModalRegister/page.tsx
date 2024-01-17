'use client'
import { Box, Button, Input, Modal, Typography, FormGroup, FormLabel, Checkbox, Switch } from '@mui/material'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { Form, useFormik } from 'formik';
import EventDB from '@/database/wrappers/event';
import IRegister from '@/interfaces/register';
import Image from 'next/image';
import Suafoto from '../../assets/fotoaqui.png'
import { DefaultContext } from '@/contexts/default';
import CircularProgress from '@mui/material/CircularProgress';






const ModalRegisterEvent = ({ open, setIsOpen, setIsClose, editData }: IRegister) => {
  const { user } = useContext(DefaultContext)
  const [loading, setloading] = useState(false);

  const convertStringToDate = (dateString: string) => {
    const dateObject = new Date(dateString);
    if (isNaN(dateObject.getTime())) {
      return '';
    }
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    return `${year}-${day}-${month}`;
  };

  useEffect(() => {
    if (!open) return formik.resetForm();
    setloading(false);
    if (editData) {
      const { name, date, address, status, image_url } = editData;
      const { street, city, neighborhood } = address;

      formik.setValues({
        name,
        date: convertStringToDate(date),
        city,
        street,
        neighborhood,

        image: null,
        image_url,
        status
      });
    }
  }, [editData, open]);

  const formik = useFormik({
    initialValues: {
      name: '',
      city: '',
      street: '',
      neighborhood: '',

      date: '',
      status: false,
      image: null,
      image_url: '',
    },
    onSubmit: async (values) => {
      setloading(true)
      function convertDateFormat(inputDate: string) {
        return inputDate.split('-').reverse().join('/');
      }
      const { name, city, street, neighborhood, date, image_url, image } = values;

      console.log(user)
      const data = {
        name,
        address: {
          city,
          street,
          neighborhood
        },
        date: convertDateFormat(date),
        status: false,
        image_url,
        createdBy: user?.id,
        image,
      };

      console.log(data);
      if (editData) {
        await new EventDB().update(editData.id, data).then(() => setloading(true));
      } else {
        await new EventDB().create(data).then(() => setloading(true));
      }
      setIsClose();
    }
  });

  const handleImage = useCallback((e) => {
    const [file] = Array.from(e.target.files)

    formik.setValues({
      ...formik.values,
      image: file,
      image_url: URL.createObjectURL(file)
    })
  }, [formik.values])

  return (
    <Modal
      open={open}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      className="flex justify-center items-center"
    >
      <Box className="bg-white w-2/4  rounded-xl p-5">
        <Box className="flex justify-between items-center mb-5">

          <Typography
            id="server-modal-title"
            variant="h6"
            component="h2"
            className="font-bold uppercase"
          >
            {!editData ? 'Cadastro de evento' : 'Atualização de evento'}
          </Typography>

          <Button onClick={setIsClose}>
            <CloseIcon className="text-red text-4xl" />
          </Button>
        </Box>

        <form className="px-3" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col">
            <div id='image_url' className='flex justify-center'>
              <label >
                <figure >
                  <input id='image_url' type="file" accept="image/*" multiple onChange={handleImage} className='hidden' />
                  <Image src={formik.values.image_url || Suafoto} alt='Imagem do evento' width={150}
                    height={150} className='cursor-pointer ' />
                </figure>
              </label>
            </div>
            <FormGroup className="pb-2">
              <FormLabel className="font-bold text-xl text-black pb-1">
                Nome do evento
              </FormLabel>
              <Input
                id="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                placeholder="Nome do evento..."
                disableUnderline
                className="shadow rounded-md py-1 px-2 "
              />
            </FormGroup>

            <FormGroup className="pb-2">
              <FormLabel className="font-bold text-xl text-black pb-1">
                Data
              </FormLabel>
              <Input
                id="date"
                type="date"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.date}
                disableUnderline
                className="shadow rounded-md py-1 px-2 "
              />
            </FormGroup>


            <FormGroup className='flex flex-row justify-between'>

              <FormGroup className="pb-2">
                <FormLabel className="font-bold text-xl text-black pb-1">
                  Cidade
                </FormLabel>
                <Input
                  id="city"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.city}
                  placeholder="Nome da cidade..."
                  disableUnderline
                  className="shadow rounded-md py-1 px-2 w-full"
                />
              </FormGroup>

              <FormGroup className="pb-2">
                <FormLabel className="font-bold text-xl text-black pb-1">
                  Bairro
                </FormLabel>
                <Input
                  id="neighborhood"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.neighborhood}
                  placeholder="Nome do bairro..."
                  disableUnderline
                  className="shadow rounded-md py-1 px-2 w-full"
                />
              </FormGroup>

              <FormGroup >
                <FormLabel className="font-bold text-xl text-black pb-1">
                  Rua
                </FormLabel>
                <Input
                  id="street"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.street}
                  placeholder="Nome da rua..."
                  disableUnderline
                  className="shadow rounded-md py-1 px-2 w-full"
                />
              </FormGroup>
            </FormGroup>
          </div>

          <Box className="pt-5 mt-auto flex justify-end gap-8">
            <Button
              className="text-white bg-red rounded-lg font-bold py-2 px-4"
              onClick={setIsClose}
            >
              Cancelar
            </Button>



            {loading ? (
              <Button
                className="text-white bg-primary rounded-lg font-bold py-2 px-4 gap-2"

              >
                <CircularProgress color='success'  size={20}/>
                Carregando...
              </Button>
            ) : (
              <Button
                className="text-white bg-primary rounded-lg font-bold py-2 px-4"
                type="submit"
                disabled={loading}
              >
                {editData ? 'Atualizar' : 'Confirmar'}
              </Button>
            )}

          </Box>
        </form>
      </Box >
    </Modal >
  );
};

export default ModalRegisterEvent;
