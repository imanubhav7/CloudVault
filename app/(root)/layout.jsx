import React from 'react'
import Sidebar from '../component/Sidebar'
import MobileNavigation from '../component/MobileNavigation'
import Header from '../component/Header'
import { getCurrentUser } from '@/action/user-action'
import { redirect } from 'next/navigation'

const layout = async({children}) => {

    const currentUser = await getCurrentUser()
    console.log(currentUser);
    
    if(!currentUser)
       return redirect('/sign-in')

  return (
    <main className='flex h-screen'>
        {/* Sidebar  */}
        <Sidebar fullName={currentUser.fullName} email={currentUser.email}/>

        <section className='flex h-full flex-1 flex-col'>
            {/* mobileNavigation  */}
            <MobileNavigation fullName={currentUser.fullName} email={currentUser.email} userId={currentUser.id}/>
             {/* Header */}
             <Header userId={currentUser.id}/>
            <div>{children}</div>
        </section>
        
    </main>
  )
}

export default layout
