
"use client"
import React,{FC,useState} from 'react'
import { ThemeSwitcher } from '@/app/utils/ThemeSwitcher'


const DashboardHeader = (props: Props) => {

  return (
    <div className='w-full flex items-center justify-end p- fixed top-5 right-5'>
      <ThemeSwitcher />
    </div>
  )
}

    

export default DashboardHeader;
