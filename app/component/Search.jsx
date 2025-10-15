'use client'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import React, { useState } from 'react'

const Search = () => { 
  const[query, setQuery] = useState('')
  return (
    <div className='w-full relative md:max-w-[480px]'>
     <div className='flex h-[52px] flex-1 items-center gap-3 rounded-full px-4 shadow-drop-3'>
      <Image 
      src='/assets/icons/search.svg'
      alt='search'
      height={24}
      width={24}
      />
      <Input
      value={query}
      placeholder='Search'
      className='body-2 shad-no-focus placeholder:body-1 w-full border-none p-0 shadow-none placeholder:text-light-100'
      onChange={(e)=> setQuery(e.target.value)}
      />
     </div>
    </div>
  )
}

export default Search
