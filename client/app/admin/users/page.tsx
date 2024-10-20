'use client'
import React from 'react'
import Sidebar from '@/app/components/Admin/sidebar/AdminSidebar'
import Heading from '@/app/utils/Heading' 
import Users from '@/app/components/Admin/Users/Users'
import DashboardHeader from '@/app/components/Admin/DashboardHeader'


type Props = {}

const page = (props: Props) => {
  return (
    <div>
        <Heading
          title="Elearning"
          description=" Elaeaning is dun to learn"
          keywords="MERN,HTML,JAVA"
        />
        <div className='flex'>
             <div className='1500px:w-[16%] w-1/5'>
                   <Sidebar />
             </div>
             <div className='w-[85%]'>
                 <DashboardHeader />
                 <Users />
             </div>
        </div>
    </div>
  )
}

export default page