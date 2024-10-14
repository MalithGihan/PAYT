import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import { styles } from "../../../app/styles/style";
import { AiOutlineCamera } from "react-icons/ai";
import avatarIcon from "../../../public/assests/avatar.png";
import {
  useEditProfileMutation,
  useUpdateAvatarMutation,
} from "@/redux/features/user/userApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import toast from "react-hot-toast";

type Props = {
  avatar: string | null;
  user: any;
};

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
  const [name, setName] = useState(user && user.name);
  const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();
  const [editProfile, { isSuccess: success, error: updateError }] =
    useEditProfileMutation();
  const [loadUser, setLoadUser] = useState(false);
  const {} = useLoadUserQuery(undefined, { skip: loadUser ? false : true });

  const imageHandler = async (e: any) => {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      if (fileReader.readyState === 2) {
        const avatar = fileReader.result;
        updateAvatar({
          avatar,
        });
      }
    };
  };

  useEffect(() => {
    if (isSuccess || success) {
      setLoadUser(true);
    }
    if (error || updateError) {
      console.log(updateError);
    }
    if (success) {
      toast.success("Profile updated successfully.");
    }
  }, [isSuccess, error, success, updateError]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (name !== "") {
      await editProfile({
        name: name,
      });
    }
  };

  return (
    <>
      <div className=" flex flex-col mt-5">
        <h1 className="dark:text-white text-black font-medium text-[20px]">
          Welcome,
        </h1>
        <h1 className="dark:text-white text-black font-bold text-[30px]">
          {" "}
          {user.name}{" "}
        </h1>
      </div>

      <div className="w-full flex justify-center">
        <div className="relative">
          <Image
            src={user.avatar || avatar ? user.avatar.url || avatar : avatarIcon}
            alt=""
            width={120}
            height={120}
            className="w-[120px] h-[120px] cursor-pointer border-[3px] border-[#37a39a] rounded-full"
          />
        </div>
        <input
          type="file"
          name=""
          id="avatar"
          className="hidden"
          onChange={imageHandler}
          accept="image/png,image/jpg,image/jpeg,image/webp"
        />

        <label htmlFor="avatar">
          <div className="w-[30px] h-[30px] bg-slate-900 rounded-full absolute  flex items-center justify-center cursor-pointer">
            <AiOutlineCamera size={20} className="z-1" />
          </div>
        </label>
      </div>
      <br />
      <br />
      <div className="w-full pl-6 800px:pl-10">
        <form onSubmit={handleSubmit}>
          <div className="800px:w-[50%] m-auto block pb-1">
            <div className="w-[100%] mb-5">
              <label className="block dark:text-white text-black font-medium text-[15px]">
                Full Name
              </label>
              <input
                type="text"
                className={`${styles.input} !w-[95%] 800:mb-0`}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="w-[100%] mb-5">
              <label className="block dark:text-white text-black font-medium text-[15px]">
                Email Address
              </label>
              <input
                type="text"
                className={`${styles.input} !w-[95%] 800:mb-0`}
                required
                value={user.email}
              />
            </div>
            <div className="w-[100%] mb-5">
              <label className="block dark:text-white text-black font-medium text-[15px]">
                Address
              </label>
              <input
                type="text"
                className={`${styles.input} !w-[95%] 800:mb-0`}
                required
                value={user.address}
              />
            </div>
            <input
              className={`w-[95%] 800px:w-[250px] h-[40px] border bg-green-300 dark:bg-white text-center dark:text-[#000] text-green-600 rounded-[8px] mt-4 mb-5 cursor-pointer`}
              required
              value="Upadate"
              type="submit"
            />
          </div>
        </form>
        <br />
      </div>
    </>
  );
};

export default ProfileInfo;
