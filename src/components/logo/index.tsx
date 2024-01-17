import { Button } from '@mui/material'
import React from 'react'
import { useRouter } from 'next/navigation'

const style = 'text-primary font-bold text-xl uppercase'
const Logo = () => {
  const route = useRouter()
  return (
    <Button
      className="flex flex-col items-center justify-center"
      onClick={() => route.push('/')}
    >
      <p className={style}>Badaro</p>
      <p className={style}>Eventos</p>
    </Button>
  )
}

export default Logo
