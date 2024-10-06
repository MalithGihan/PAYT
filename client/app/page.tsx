"use client";
import React, { FC, useState } from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";
import Footer from "./components/Fotter";

interface Props {}

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");

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

      {/* <Footer
        activeItem={activeItem}
        isMobile={false} // or use a state to detect mobile if needed
        onNavItemClick={(item) => console.log(item)} // You can define a function to handle the navigation
      /> */}
    </div>
  );
};

export default Page;
