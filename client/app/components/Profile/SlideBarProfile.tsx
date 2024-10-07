import React, { FC } from "react";
import Image from "next/image";
import avatarDefault from "../../../public/assests/avatar.png";
import { RiLockPasswordLine } from "react-icons/ri";
import { SiCoursera } from "react-icons/si";
import { FaTrashRestore } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import Link from "next/link";

type Props = {
  user: any;
  active: number;
  avatar: string | null;
  setActive: (active: number) => void;
  logoutHandler: any;
};

const SlideBarProfile: FC<Props> = ({
  user,
  active,
  avatar,
  setActive,
  logoutHandler,
}) => {
  return (
    <div className="w-full flex flex-col">
      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
          active === 1 ? "dark:bg-slate-800 bg-white" : "bg-transparent"
        }`}
        onClick={() => setActive(1)}
      >
        <Image
          src={user.avatar || avatar ? user.avatar || avatar : avatarDefault}
          alt=""
          width={20}
          height={20}
          className="w-[20px] h-[20px] 800px:w-[30px] 800px:h-[30px] cursor-pointer rounded-full"
        />
        <h5 className="pl-4 font-Poppins dark:text-white text-black font-medium">
          My Account
        </h5>
      </div>
      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
          active === 2 ? "dark:bg-slate-800 bg-white" : "bg-transparent"
        }`}
        onClick={() => setActive(2)}
      >
        <RiLockPasswordLine size={20} className="text-black dark:text-white" /> 
        <h5 className="pl-4 font-Poppins dark:text-white text-black font-medium">
          Change Password
        </h5>
      </div>
      {user.role !== "admin" && (
        <div
          className={`w-full flex items-center px-3 py-4 cursor-pointer ${
            active === 3 ? "dark:bg-slate-800 bg-white" : "bg-transparent"
          }`}
          onClick={() => setActive(3)}
        >
          <FaTrashRestore size={20} className="text-black dark:text-white" />
          <h5 className="pl-4 font-Poppins dark:text-white text-black font-medium">
            Activities
          </h5>
        </div>
      )}

      {user.role === "admin" && (
        <Link
          className={`w-full flex items-center px-3 py-4 cursor-pointer ${
            active === 5 ? "dark:bg-slate-800 bg-white" : "bg-transparent"
          }`}
          href="/admin"
        >
          <MdOutlineAdminPanelSettings size={20} className="text-black dark:text-white" />
          <h5 className="pl-4 font-Poppins dark:text-white text-black font-medium">
            Admin Dashboard
          </h5>
        </Link>
      )}
      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
          active === 4 ? "dark:bg-slate-800 bg-white" : "bg-transparent"
        }`}
        onClick={() => logoutHandler()}
      >
        <AiOutlineLogout size={20} className="text-black dark:text-white" />
        <h5 className="pl-4 font-Poppins dark:text-red-600 text-red-600 font-medium">
          Log Out
        </h5>
      </div>
    </div>
  );
};

export default SlideBarProfile;
