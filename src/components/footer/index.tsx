import React from 'react'
import Logo from '../logo'

const Footer = () => {
  const style = 'text-white font-bold text-sm uppercase'

  return (
    <div className='w-full  bg-primary flex'>
      <div className='center p-4 flex justify-between items-center'>
        <div
          className="flex flex-col items-center justify-center"

        >
          <p className={style}>Badaro</p>
          <p className={style}>Eventos</p>
        </div>
        <p className='font-normal  text-white'>
          @ Copyright (c) 2024 Badaró Eventos Todos os direitos reservados.
        </p>

      </div>
    </div>
  )
}

export default Footer