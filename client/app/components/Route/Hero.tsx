import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { BiSearch } from "react-icons/bi";

type Props = {};

const Hero: FC<Props> = (props) => {
  return (
    <div className="w-full h-[80vh] flex items-center justify-center">
  <div className="relative w-full max-w-[600px]">
    <input
      type="search"
      placeholder="Search Courses..."
      className="bg-transparent border dark:border-none dark:bg-white placeholder:text-black dark:placeholder:text-black rounded-[5px] p-2 h-[50px] w-full outline-none text-black text-[20px] font-[500] font-Josefin pr-[50px]" // Add right padding
    />
    <div className="absolute right-0 top-0 flex items-center justify-center w-[50px] h-full bg-black dark:bg-[#39c1f3] rounded-e-[5px] cursor-pointer">
      <BiSearch className="text-white" size={25} />
    </div>
  </div>
</div>


  );
};

export default Hero;
