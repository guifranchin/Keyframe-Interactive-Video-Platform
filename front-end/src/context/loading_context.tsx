import React, { useContext, createContext, useState } from "react";
import { CircularProgress, Modal } from "@mui/material";
import { Box } from "@mui/system";

export interface LoadingInfo {
  show(): void;
  hide(): void;
}

const loadingDefault: LoadingInfo = {
  show: () => {},
  hide: () => {},
};

const LoadingContext = createContext<LoadingInfo>(loadingDefault);

export function useLoading() {
  return useContext(LoadingContext);
}

interface Props {
  children: React.ReactNode;
}

export function LoadingProvider({ children }: Props) {
  const [open, setOpen] = useState(0);

  const show = () => {
    setOpen((prev) => prev + 1);
  };

  const hide = () => {
    setOpen((prev) => prev - 1);
  };

  return (
    <LoadingContext.Provider value={{ show, hide }}>
      <Modal open={Boolean(open)}>
        <Box
          sx={{
            transform: "translate(-50px, -100px)",
            position: "absolute",
            top: "50%",
            left: "50%",
            outline: "none",
          }}
        >
          <CircularProgress size="100px"/>
        </Box>
      </Modal>
      {children}
    </LoadingContext.Provider>
  );
}
