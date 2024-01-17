'use client'
import {
  Box,
  Button,
  CircularProgress,
  FormGroup,
  FormLabel,
  Input,
  Switch,
  Typography,
} from '@mui/material'
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth } from '@/database/config';
import { useFormik } from 'formik'
import React, { useContext, useState } from 'react'
import UserDB from '@/database/wrappers/user';
import { ROLE } from '@/types/roles';
import User from '@/database/entities/user';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { DefaultContext } from '@/contexts/default';

const Login = () => {
  const [register, setregister] = useState(false)
  const [loading, setloading] = useState(false)
  const [sucessRegister, setsucessRegister] = useState(false)
  const { user } = useContext(DefaultContext);
  const router = useRouter();


  const LoginForm = () => {
    const [labelError, setLabelError] = useState('');
    const formik = useFormik({
      enableReinitialize: true,
      initialValues: {
        email: '',
        password: '',
      },
      onSubmit: async (values) => {
        setloading(true);
        console.log(values, '');
        if (values.email && values.password) {
          console.log('CAIU AQ')
          const res = await signIn('credentials', {
            email: values.email,
            password: values.password,
            redirect: false,
          });
          console.log(res);
          if (res?.ok) {
            setloading(false);
            router.push('/');
            console.log('resposta login: ', res);
          } else {
            setloading(false);
            console.log('resposta login: ', res);
            setLabelError('Opa, algo está errado, tente novamente.');

          }
        } else {
          setLabelError('Email e senha precisam ser preenchidos.');
        }
      },
    })
    return (
      <form
        className="flex w-1/3 flex-col justify-between rounded-2xl bg-white px-10 py-10 shadow"
        onSubmit={formik.handleSubmit}
      >
        <div className="flex flex-col gap-6">
          <p className="text-center text-lg">Acesse sua conta</p>
          <FormGroup>
            <FormLabel className="pb-2  font-bold">E-mail</FormLabel>
            <Input
              id="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              disableUnderline
              className="rounded-md px-2 py-1 shadow-md "
            />
          </FormGroup>
          <FormGroup>
            <FormLabel className="pb-2  font-bold">Senha</FormLabel>
            <Input
              id="password"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              disableUnderline
              className="rounded-md px-2 py-1 shadow-md "
            />
          </FormGroup>

          {labelError && <p className='text-red'>{labelError}</p>}
        </div>

        {loading ? (
          <Button
            className="text-white bg-primary rounded-lg font-bold py-2 px-4 gap-2"

          >
            <CircularProgress color='success' size={20} />
            Carregando...
          </Button>
        ) : (
          <Button
            type="submit"
            className="mt-10 rounded-md border px-4 font-bold text-primary"
            sx={{
              border: '1px solid #006D3E',
              '&:hover': {
                bgcolor: '#006D3E',
                color: '#FFFFFF',
              },
            }}
          >
            Acessar sua conta
          </Button>
        )}

        <Button
          className="mt-2 rounded-md  bg-primary px-4 font-bold text-white"
          sx={{
            border: '1px solid #006D3E',
            '&:hover': {
              bgcolor: 'white',
              border: '1px solid #006D3E',
              color: '#006D3E',
            },
          }}
          onClick={() => setregister(true)}
        >
          Crie sua conta
        </Button>
      </form>
    )
  }

  const RegisterForm = () => {
    const [labelError, setLabelError] = useState('');


    const formik = useFormik({
      initialValues: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: ROLE.COMMON_USER
      },
      onSubmit: async (values) => {
        console.log(values);
        if (!values.email || !values.password || !values.confirmPassword || !values.name) {
          console.log('TA CAINDO AQ')
          setLabelError('Todos os campos devem ser preenchidos.')
          return;
        }
        if (values.password.length < 6) {
          setLabelError('Sua senha deve ser maior que 6 caracteres.')
        }
        if (values.password !== values.confirmPassword) {
          setLabelError('As senhas devem coincidir.')
          return;
        }


        const userCredential = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password,
        );

        const data: User = {
          name: values.name,
          email: values.email,
          role: values.role
        }
        const user = userCredential.user;
        if (user) {
          new UserDB().createWithCustomId(user.uid, data).then(() => setsucessRegister(true))

        }
      },
    })

    return (
      <form
        className="flex w-1/3 flex-col justify-between rounded-2xl bg-white px-10 py-10 shadow"
        onSubmit={formik.handleSubmit}
      >
        <div className="flex flex-col gap-6">
          <p className="text-center text-lg">Faça seu registro</p>
          <FormGroup>
            <FormLabel className="pb-2  font-bold">Nome</FormLabel>
            <Input
              id="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              disableUnderline
              className="rounded-md px-2 py-1 shadow-md "
            />
          </FormGroup>
          <FormGroup>
            <FormLabel className="pb-2  font-bold">E-mail</FormLabel>
            <Input
              id="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              disableUnderline
              className="rounded-md px-2 py-1 shadow-md "
            />
          </FormGroup>
          <FormGroup>
            <FormLabel className="pb-2  font-bold">Senha</FormLabel>
            <Input
              id="password"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              disableUnderline
              className="rounded-md px-2 py-1 shadow-md "
            />
          </FormGroup>

          <FormGroup>
            <FormLabel className="pb-2  font-bold">
              Confirme sua senha
            </FormLabel>
            <Input
              id="confirmPassword"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
              disableUnderline
              className="rounded-md px-2 py-1 shadow-md "
            />
          </FormGroup>

          {labelError &&
            <p className="text-red">{labelError}</p>
          }
        </div>

        <Button
          type="submit"
          className="mt-10 rounded-md border px-4 font-bold text-primary"
          sx={{
            border: '1px solid #006D3E',
            '&:hover': {
              bgcolor: '#006D3E',
              color: '#FFFFFF',
            },
          }}
        >
          Criar conta
        </Button>
        <Button
          className="mt-2 rounded-md  bg-primary px-4 font-bold text-white"
          sx={{
            border: '1px solid #006D3E',
            '&:hover': {
              bgcolor: 'white',
              border: '1px solid #006D3E',
              color: '#006D3E',
            },
          }}
          onClick={() => setregister(false)}
        >
          Faça seu login
        </Button>
      </form>
    )
  }

  const SucessRegister = () => {
    return (
      <div className="flex w-1/3 flex-col items-center justify-center rounded-2xl bg-white px-10 py-10 shadow">
        <h1 className='text-2xl font-bold text-primary mb-7'>Conta criada com sucesso.</h1>

        <Button
          className="mt-2 rounded-md  bg-primary px-4 font-bold text-white"
          sx={{
            border: '1px solid #006D3E',
            '&:hover': {
              bgcolor: 'white',
              border: '1px solid #006D3E',
              color: '#006D3E',
            },
          }}
          onClick={() => {
            setregister(false);
            setsucessRegister(false);
          }}
        >
          Faça login para continuar
        </Button>


      </div>
    )
  }

  const IsLoggedIn = () => {
    return (
      <div className="flex w-1/3 flex-col items-center justify-center rounded-2xl bg-white px-10 py-10 shadow">
        <h1 className='text-4xl font-bold text-primary mb-7'>OPA!</h1>
        <h1 className='text-2xl font-bold text-primary mb-7'>Você já está logado.</h1>
      </div>
    )
  }


  return (
    <div className=" flex h-screen items-center justify-center bg-[#f1f1f1dd]">
      {!user && !register && !sucessRegister && <LoginForm />}
      {!user && register && !sucessRegister && <RegisterForm />}
      {!user && sucessRegister && <SucessRegister />}
      {user && <IsLoggedIn />}
    </div>
  )
}

export default Login
