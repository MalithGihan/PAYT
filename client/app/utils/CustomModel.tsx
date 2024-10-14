import React, { FC } from "react";
import { Modal, Box } from "@mui/material";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  component: FC<any>; // Accept any component that will receive props
  [key: string]: any; // Allow any other props
};

const CustomModel: FC<Props> = ({ open, setOpen, component: Component, ...rest }) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow py-2 px-4 outline-none">
        {/* Pass the setOpen and any additional props using ...rest */}
        <Component setOpen={setOpen} {...rest} />
      </Box>
    </Modal>
  );
};

export default CustomModel;
