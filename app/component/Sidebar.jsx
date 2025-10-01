'use client'
import { navItems } from '@/constansts'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Sidebar = ({fullName, email}) => {
    const pathName = usePathname()
  return (
    <aside className='remove-scrollbar hidden h-screen w-[90px] flex-col overflow-auto px-5 py-7 sm:flex lg:w-[280px] xl:w-[325px]'>
        <Link href='/'>
        <Image
        src='/assets/icons/logo-full-brand.svg'
        width={160}
        height={50}
        alt='logo'
        className='hidden h-auto lg:block'
        />

        <Image
        src='/assets/icons/logo-brand.svg'
        width={52}
        height={52}
        alt='logo'
        className='lg:hidden'
        />
        </Link>
        {/* NAvbAr  */}

        <nav className='sidebar-nav'>
           <ul className='flex flex-col gap-6 flex-1'>
           {navItems.map(({url, name, icon}) => (
            <Link href={url} key={name} className='lg:w-full '>
                <li className={cn("sidebar-nav-item", pathName===url && "shad-active")}>
                    <Image src={icon} alt={name} width={24} height={24} className={cn ('nav-icon',pathName===url && 'nav-icon-active')}/>
                    <p className='hidden lg:block'>{name}</p>
                </li>
            </Link>
           ))}
            </ul> 
        </nav>

        <Image
        src='/assets/images/files-2.png'
        alt='logo'
        width={510}
        height={420}
        className='w-full'
        />

           <div className='bg-brand/10 mt-4 gap-3 flex items-center justify-centerp-1 text-light-100  rounded-full lg:justify-start lg:p-3'>
            <Image
            src='/assets/images/avatar.png'
            width={44}
            height={44}
            alt='Avatar'
            />

           <div className='hidden lg:block'>
            <p className='subtitle-2 capitalize font-bold'> {fullName}</p>
            <p className='caption'>{email}</p>
           </div>


           </div>

    </aside>
  )
}

export default Sidebar
