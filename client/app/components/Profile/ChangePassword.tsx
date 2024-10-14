/* eslint-disable jsx-a11y/role-supports-aria-props */
import React, { FC, useEffect, useState } from "react";
import { styles } from "../../../app/styles/style";
import { useUpdatePasswordMutation } from "@/redux/features/user/userApi";
import toast from "react-hot-toast";

type Props = {};

const ChangePassword: FC<Props> = (props) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatePassword, { isSuccess, error }] = useUpdatePasswordMutation();

  const passwordChangeHandler = async (e: any) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Confirm password do not match with new password");
    } else {
      await updatePassword({ oldPassword, newPassword });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Password changed successfully");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error]);

  return (
    <div className="w-full pl-7 px-2 800px:px-5 800px:pl-0">
      <h1 className="block text-[25px] font-Poppins text-center font-[500] dark:text-[#fff] text-black pb-2 mt-5">
        Change Password
      </h1>
      <div className="w-full p-5">
        <form
          aria-required
          onSubmit={passwordChangeHandler}
          className="flex flex-col items-center"
        >
          <div className="w-[100%] 00px:w-[60%] mt-5">
            <label className="block pb-2 text-black dark:text-[#fff] font-medium text-[15px]">
              Enter Your old password
            </label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mt-4 800px:mb-0 text-black dark:text-[#fff]`}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="w-[100%] 00px:w-[60%] mt-5">
            <label className="block pb-2 text-black dark:text-[#fff] font-medium text-[15px]">
              Enter Your new password
            </label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mt-4 800px:mb-0 text-black dark:text-[#fff]`}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="w-[100%] 00px:w-[60%] mt-5">
            <label className="block pb-2 text-black dark:text-[#fff] font-medium text-[15px]">
              Enter Your confirm password
            </label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mt-4 800px:mb-0 text-black dark:text-[#fff]`}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="w-[100%] 00px:w-[60%] mt-5">
            <input
              type="submit"
              className={`w-[95%] 800px:w-[250px] h-[40px] border bg-green-300 dark:bg-white text-center dark:text-[#000] text-green-600 rounded-[8px] mt-4 mb-5 cursor-pointer`}
              value="Update"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
