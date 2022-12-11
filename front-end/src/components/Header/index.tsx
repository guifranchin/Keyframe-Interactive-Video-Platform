import React, { useRef, useState } from "react";
import { AppBar, TextField, Link, IconButton, Menu, MenuItem } from "@mui/material";
import { Box } from "@mui/system";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuthenticationModal } from "../../context/authentication_modal_context";
import { useUserData } from "../../context/user_data_context";
import { doLogout, isLogged } from "../../services/auth";
import { useNavigate } from "react-router-dom";

interface Props {
  drawerWidth: number;
  setShowMobile(value: boolean): void;
}

const Header = ({ drawerWidth, setShowMobile }: Props) => {
  const modal = useAuthenticationModal();
  const { userData, setUserData } = useUserData();
  const appBarRef = useRef<HTMLDivElement>(null);
  const baseUrl = process.env.REACT_APP_MEDIA_ENDPOINT;
  const navigate = useNavigate()
  const [query, setQuery] = useState("")

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigateToProfile = () => {
    navigate(`/profile/${userData.email}`)
    handleClose()
  }

  const logout = () => {
    doLogout()
    setUserData({})
    handleClose()
    window.location.reload()
  }

  return (
    <AppBar
      position="sticky"
      sx={{
        width: { xs: "100%", lg: `calc(100% - ${drawerWidth}px)` },
        ml: { xs: "0", lg: `${drawerWidth}px` },
      }}
      ref={appBarRef}
    >
      <Box
        sx={{
          background: "#00040F",
          width: "100%",
          display: "flex",
          padding: "20px",
          alignItems: "center",
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={() => setShowMobile(true)}
          sx={{ mr: 2, display: { xs: "block", lg: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Box
          sx={{
            ml: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            width: { xs: "80%", md: "50%" },
            mr: '20px'
          }}
        >
          <TextField
            sx={{
              width: "70%",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "10px",
              color: "#FFF",
              outline: "none",
              mr: "30px",
              input: { color: "#FFF", outline: "hidden" },
            }}
            InputProps={{
              endAdornment: (
                <SearchIcon
                  sx={{ color: "#FFF", transform: "rotate(90deg)", cursor: 'pointer' }}
                  onClick={() => {
                    if (query) {
                      setQuery("")
                      window.location.href = `/search?query=${query}`
                    }
                  }}
                />
              ),
            }}
            placeholder="Search"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            onKeyDown={(e: any) => {
              if (e.key === "Enter" && query) {
                setQuery("")
                window.location.href = `/search?query=${query}`
              }
            }}
          />
          {isLogged() ? (
            <>
              <Box
                component="img"
                src={`${baseUrl}/${userData?.avatar}`}
                sx={{ width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer" }}
                onClick={handleClick}
              />
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                sx={{mt: '10px'}}
              >
                <MenuItem onClick={navigateToProfile}>Perfil</MenuItem>
                <MenuItem onClick={logout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Link onClick={() => modal.show()} sx={{ cursor: "pointer" }}>
              Login
            </Link>
          )}
        </Box>
      </Box>
    </AppBar>
  );
};

export default Header;
