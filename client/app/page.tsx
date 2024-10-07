"use client";
import React, { FC, useState,useEffect } from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";
import Footer from "./components/Fotter";

interface Props {}

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");

  useEffect(() => {
    // Any browser-specific logic or re-render logic can be here
  }, []);

  return (
    <div>
      <Heading
        title="Elearning"
        description=" Elaeaning is dun to learn"
        keywords="MERN,HTML,JAVA"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />

      <Hero />

      <Footer/>

    </div>
  );
};

export default Page;
