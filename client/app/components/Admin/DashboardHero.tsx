import React from 'react'
import DashboardHeader from './DashboardHeader'
import DashboardRequests from './DashboardRequests'
import UserBin from './UsersBin'
import Complain from './Complain'

type Props = {}

const DashboardHero = (props: Props) => {
  return (
    <div>
      {/* <DashboardHeader /> */}
        {/* <DashboardRequests/> */}
      {/* <Complain /> */}
      <UserBin />

    </div>
  )
}

export default DashboardHero