import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'
import Search from './Search'
import FileUploader from './FileUploader'
import { toast } from 'sonner'
import { Logout, signOut } from '@/action/auth'

const Header = ({userId}) => {
   
  return (
    <header className='hidden items-center justify-between gap-5 p-5 sm:flex lg:py-7 xl:gap-10' >
        {/* Search */}
        <Search/>
        <div className='flex-center min-w-fit gap-4 '>
            {/* FileUploader  */}
            <FileUploader ownerId={userId} />

            <form action={
                async() => {
                'use server';
                try {
                    await signOut();
                    toast.success("You have been logged out successfully")
                } catch (error) {
                    toast.error("Logout Failed")
                }
            }}>
                <Button className='flex-center h-[52px] min-w-[54px] items-center rounded-full bg-brand/10 p-0 text-brand shadow-none transition-all hover:bg-brand/20'
                >
                    <Image
                    src='/assets/icons/logout.svg'
                    alt='logo'
                    width={20}
                    height={20}
                    className='w-6'
                    />
                </Button>
            </form>
        </div>
    </header>
  )
}

export default Header
