import { Box } from "@mui/system";
import React, { useState } from "react";
import LeftPanel from "../LeftPanel";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  const [drawerWidth, setDrawerWidth] = useState(200);

  return (
    <>
      <LeftPanel drawerWidth={drawerWidth} />
      <Box
        sx={{
          width: { xs: "100%", lg: `calc(100% - ${drawerWidth}px)` },
          ml: { xs: "0", lg: `${drawerWidth}px` },
          background: "#00040F",
          color: "#FFF",
          minHeight: "100vh"        
        }}
      >
        {children}
      </Box>
    </>
  );
};

export default Layout;
