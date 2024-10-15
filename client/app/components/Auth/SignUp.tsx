import React, { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { styles } from "../../../app/styles/style";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";

type Props = {
  setRoute: (route: string) => void;
};

const schema = Yup.object().shape({
  name: Yup.string().required("Please enter your name!"),
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email"),
  password: Yup.string().required("Please enter your password").min(6),
});

const SignUp: FC<Props> = ({ setRoute }) => {
  const [show, setShow] = useState(false);
  const [register,{data,error,isSuccess}] = useRegisterMutation()

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Registration Successful");
      setRoute("Verification");
    }
    if (error) {
      
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  }, [isSuccess, error, data, setRoute]);

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "",houseOwnerName:"", address:"" },
    validationSchema: schema,
    onSubmit: async ({name, email, password,houseOwnerName,address }) => {
      const data = {
        name, email, password,houseOwnerName,address
      }
      await register(data);
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="w-full">
      <h1 className={`${styles.title}`}>Join to PAYT</h1>
      <form onSubmit={handleSubmit}>
        <div >
          <label className={`${styles.label}`} htmlFor="email">
            Enter your name
          </label>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            id="name"
            placeholder="Malith"
            className={`${errors.name && touched.name && "border-red-500"} ${
              styles.input
            }`}
          />
          {errors.name && touched.name && (
            <span className="text-red-500 pt-2 block">{errors.name}</span>
          )}
        </div>
        <div >
          <label className={`${styles.label}`} htmlFor="houseOwnerName">
            Enter house owner address
          </label>
          <input
            type="text"
            name="houseOwnerName"
            value={values.houseOwnerName}
            onChange={handleChange}
            id="name"
            placeholder="Malith"
            className={`${errors.houseOwnerName && touched.houseOwnerName && "border-red-500"} ${
              styles.input
            }`}
          />
          {errors.houseOwnerName && touched.houseOwnerName && (
            <span className="text-red-500 pt-2 block">{errors.houseOwnerName}</span>
          )}
        </div>
        <div >
          <label className={`${styles.label}`} htmlFor="address">
            Enter your name
          </label>
          <input
            type="text"
            name="address"
            value={values.address}
            onChange={handleChange}
            id="name"
            placeholder="No/90, Lakman Uyana, Maharagama"
            className={`${errors.address && touched.address && "border-red-500"} ${
              styles.input
            }`}
          />
          {errors.address && touched.address && (
            <span className="text-red-500 pt-2 block">{errors.address}</span>
          )}
        </div>
        <label className={`${styles.label}`} htmlFor="email">
          Enter your email
        </label>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          id="email"
          placeholder="loginemail@gmail.com"
          className={`${errors.email && touched.email && "border-red-500"} ${
            styles.input
          }`}
        />
        {errors.email && touched.email && (
          <span className="text-red-500 pt-2 block">{errors.email}</span>
        )}
        <div className="w-full relative">
          <label className={`${styles.label}`} htmlFor="email">
            Enter your password
          </label>
          <input
            type={!show ? "password" : "text"}
            name="password"
            value={values.password}
            onChange={handleChange}
            id="password"
            placeholder="password!@%"
            className={`${
              errors.password && touched.password && "border-red-500"
            } ${styles.input}`}
          />
          {!show ? (
            <AiOutlineEyeInvisible
              className="absolute bottom-2 right-2 z-1 cursor-pointer mb-4"
              size={20}
              onClick={() => setShow(true)}
            />
          ) : (
            <AiOutlineEyeInvisible
              className="absolute bottom-2 right-2 z-1 cursor-pointer mg-4"
              size={20}
              onClick={() => setShow(false)}
            />
          )}
        </div>
        {errors.password && touched.password && (
          <span className="text-red-500 pt-2 block">{errors.password}</span>
        )}

        <div className="w-full mt-8">
          <input type="submit" value="Sign Up" className={`${styles.button}`} />
        </div>
        <br />
        <h5 className="text-center pt-2 font-Poppins text-[14px] text-black dark:text-white">
          Or join with
        </h5>
        <div className="flex items-center justify-center my-3">
          <FcGoogle size={30} className="cursor-pointer mr-2" />
          
        </div>
        <h5 className="text-center pt-3 font-Poppins text-[14px] text-black dark:text-white">
          Already have an account ?{" "}
          <span
            className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => setRoute("Login")}
          >
            Sign in
          </span>
        </h5>
      </form>
      <br />
    </div>
  );
};

export default SignUp;
