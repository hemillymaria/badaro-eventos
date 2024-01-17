'use client';
import { Button } from '@mui/material';
import React, { useState } from 'react';
interface Option {
  text: string;
  type: number;
}
const Filter = ({ options, onFilterChange, filterOption }: any) => {
  return (
    <div className="shadow-xl rounded-3xl flex justify-between items-center flex-row p-4 px-4 bg-white flex-1 ">
      {options.map(({ text, type }: Option) => (
        <Button
          key={type}
          className={`${
            filterOption === type
              ? 'bg-primary rounded-lg text-white'
              : 'text-primary'
          } uppercase text-xl font-bold`}
          onClick={() => onFilterChange(type)}
        >
          {text}
        </Button>
      ))}
    </div>
  );
};

export default Filter;
