'use client'
import CardEvent from '@/components/cardEvent'
import SearchBar from '@/components/searchBar'
import { useState } from 'react'


export default function Home() {
  const [search, setSearch] = useState('');

  console.log(search, 'aq')

  return (
    <main className="flex  justify-center bg-[#f1f1f1dd]">
      <div className="center">
        <div className="mt-[60px] flex flex-col items-center justify-center">
          <SearchBar search={search} setsearch={setSearch}/>
          <CardEvent search={search} />

        </div>
      </div>
    </main>
  )
}
