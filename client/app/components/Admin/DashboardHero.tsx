import React from 'react'
import DashboardHeader from './DashboardHeader'
import DashboardRequests from './DashboardRequests'
import UserBin from './UsersBin'

type Props = {}

const DashboardHero = (props: Props) => {
  return (
    <div>
        <DashboardHeader />
        <DashboardRequests/>
        <UserBin/>

    </div>
  )
}

export default DashboardHero