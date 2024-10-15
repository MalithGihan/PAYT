"use client";
import { FC, useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography } from "@mui/material";
import "react-pro-sidebar/dist/css/styles.css";
import {
  HomeOutlinedIcon,
  ArrowBackIosIcon,
  ArrowForwadIosIcon,
  ReceiptOutlinedIcon,
  BarChartOutlinedIcon,
  GroupsIcon,
  WysiwygIcon,
  ExitToAppIcon,
  QuizIcon,
  MapOutlinedIcon,
} from "./Icon";
import avatarDefault from "../../../../public/assests/avatar.png";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";


interface itemProps {
  title: string;
  to?: string; 
  icon: JSX.Element;
  selected: string;
  setSelected: any;
  onClick?: () => void; 
}


const Item: FC<itemProps> = ({ title, to, icon, selected, setSelected, onClick}) => {
  return (
    <MenuItem
      active={selected === title}
      onClick={() => {
        setSelected(title);
        if (onClick) onClick(); 
      }}
      icon={icon}
    >
      <Typography className="!text-[16px] !font-Poppins text-sm">{title}</Typography>
      {to && <Link href={to} />} 
    </MenuItem>
  );
};

const Sidebar = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [logout, setLogout] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  const logOutHandler = async () => {
    await signOut({ callbackUrl: "/" }); // Automatically redirect to "/" after logout
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${
            theme === "dark" ? "#111C43 !important" : "#86EFAC !important"
          }`,
        },
        "& .pro-sidebar-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item:hover": {
          colour: "#fff !important",
        },
        "& .pro-menu-item.active": {
          color: "#000 !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
          opacity: 1,
        },
        "@ .pro-menu-item": {
          color: `${theme !== "#fff" && "#000"}`,
        },
      }}
      className="!bg-[#86EFAC] dark:bg-white"
    >
      <ProSidebar
        collapsed={isCollapsed}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: isCollapsed ? "0%" : "16%",
        }}
      >
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <ArrowForwadIosIcon /> : undefined}
            style={{ margin: "10px 0 20px 0" }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
                ml="15px"
              >
                <IconButton
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="inline-block"
                >
                  <ArrowBackIosIcon className="text-[#000] dark:text-white" />
                </IconButton>
                <Link href="/">
                  <h3 className="text-[20px] font-medium font-Poppins uppercase text-[#000] dark:text-white">
                    PAYT
                  </h3>
                </Link>
              </Box>
            )}
          </MenuItem>
          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <Image
                  alt="profile-user"
                  width={100}
                  height={100}
                  src={user.avatar ? user.avatar.url : avatarDefault}
                  style={{
                    cursor: "pointer",
                    borderRadius: "50%",
                    border: "2px solid #2b6fe6",
                  }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h4"
                  className="!text-[20px] text-white dark:text-[#fff]"
                  sx={{ m: "10px 0 0 0 " }}
                >
                  {user?.name}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ m: "10px 0 0 0 " }}
                  className="!text-[15px] text-white dark:text-[#fff] capitalize"
                >
                  - {user?.role}
                </Typography>
              </Box>
            </Box>
          )}
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/admin"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h5"
              sx={{ m: "15px 0 5px 25px" }}
              className="!text-[18px] text-white dark:text-[#fff] capitalize !font-[400]"
            >
              {" "}
              {!isCollapsed && "Data"}
            </Typography>
            <Item
              title="Users"
              to="/admin/users"
              icon={<GroupsIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Collection Requests"
              to="/admin/collectionRequests"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h5"
              sx={{ m: "15px 0 5px 25px" }}
              className="!text-[18px] text-white dark:text-[#fff] capitalize !font-[400]"
            >
             
              {" "}
              {!isCollapsed && "Customization"}
            </Typography>
            <Item
              title="Complaints"
              to="/admin/complaints"
              icon={<QuizIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Requests"
              to="/admin/requests"
              icon={<WysiwygIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            
            <Typography
              variant="h5"
              sx={{ m: "15px 0 5px 25px" }}
              className="!text-[18px] text-white dark:text-[#fff] capitalize !font-[400]"
            >
              {" "}
              {!isCollapsed && "Analytics"}
            </Typography>
            <Item
              title="Bin Register"
              to="/admin/collection-analytics"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            
            <Typography
              variant="h5"
              sx={{ m: "15px 0 5px 25px" }}
              className="!text-[18px] text-white dark:text-[#fff] capitalize !font-[400]"
            >
              {" "}
              {!isCollapsed && "Extras"}
            </Typography>
            <Item
              title="Log Out"
              icon={<ExitToAppIcon />}
              selected={selected}
              setSelected={setSelected}
              onClick={logOutHandler} 
            />

          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
