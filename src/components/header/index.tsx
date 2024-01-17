'use client'
import React, { useContext } from 'react'
import Logo from '../logo'
import { Button } from '@mui/material'
import { useRouter ,usePathname} from 'next/navigation'
import { useSession } from 'next-auth/react'
import User from '../userAvatar'
import { DefaultContext } from '@/contexts/default'
import { MENU, MENU_PT_BR } from '@/types/menu'

const Header = () => {
  const router = useRouter()
  const pathname = usePathname();
  const {user} = useContext(DefaultContext)



  const handleNavigate = () => {
    console.log('CLICADO')
    router.push('/login')
  }
  return (
    <header className="shadow-md bg-white">
      <main className="center flex h-20 items-center justify-between px-7">
        <Logo />


        {pathname === MENU.MY_EVENT && 
          <h1 className='uppercase text-primary font-bold text-2xl'>Meus eventos</h1>
        }
        {!user &&
          <Button
            className="bg-primary px-6 font-bold text-white"
            sx={{
              '&:hover': {
                bgcolor: 'white',
                border: '1px solid #006D3E',
                color: '#006D3E',
              },
            }}
            onClick={handleNavigate}
          >
            Login
          </Button>
        }
        {user &&
          <User user={user}/>
        }
      </main>
    </header>
  )
}

export default Header
