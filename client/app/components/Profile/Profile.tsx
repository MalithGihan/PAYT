"use client";
import React, { FC, useState } from "react";
import SlideBarProfile from "./SlideBarProfile";
import { useLogOutQuery } from "../../../redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import Activities from "../User/Activities";

type Props = {
  user: any;
};

const Profile: FC<Props> = ({ user }) => {
  const [scroll, setScroll] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [active, setActive] = useState(1);
  const [logout, setLogout] = useState(false);
  const {} = useLogOutQuery(undefined, {
    skip: !logout ? true : false,
  });

  const logOutHandler = async () => {
    setLogout(true);
    await signOut();
    redirect("/");
  };

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.screenY > 85) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    });
  }

  return (
    <div className="w-[85%] flex mx-auto">
      <div
        className={`w-[30%] 800px:w-[310px] h-full dark:bg-slate-900 bg-opacity-90 bg-slate-300 dark:border-[#ffffff1d] border-white rounded-[5px] shadow-xl mt-[80px] mb-[80px] sticky p-[5px] ${
          scroll ? "top-[120px]" : "top-[30px]"
        } left-[30px]`}
      >
        <SlideBarProfile
          user={user}
          active={active}
          avatar={avatar}
          setActive={setActive}
          logoutHandler={logOutHandler}
        />
      </div>

      {active === 1 && (
        <div className="w-full h-screen bg-transparent mt-[80px] dark:bg-slate-900 bg-opacity-90 bg-slate-300 dark:border-[#ffffff1d] border-white rounded-[5px] shadow-xl mx-6 px-5 mb-10">
          <ProfileInfo avatar={avatar} user={user} />
        </div>
      )}

      {active === 2 && (
        <div className="w-full h-full bg-transparent mt-[80px]  dark:bg-slate-900 bg-opacity-90 bg-slate-300 dark:border-[#ffffff1d] border-white rounded-[5px] shadow-xl mx-6 px-5 mb-10">
          <ChangePassword />
        </div>
      )}

      {active === 3 && (
        <div className="w-full h-full bg-transparent mt-[80px]  dark:bg-slate-900 bg-opacity-90 bg-slate-300 dark:border-[#ffffff1d] border-white rounded-[5px] shadow-xl mx-6 p-5 mb-7">
          <Activities />
        </div>
      )}
    </div>
  );
};

export default Profile;
