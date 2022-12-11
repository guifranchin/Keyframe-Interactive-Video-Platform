import {
  Drawer,
  List,
  ListItemIcon,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { navMenu } from "./nav";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../Header";
import { PlaylistModal } from "../PlaylistModal";
import { useLoading } from "../../context/loading_context";
import {
  CreatePlaylist,
  GetUserPlaylists,
  PlaylistData,
} from "../../services/playlist";

const DrawerContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openPlaylists, setOpenPlaylists] = useState(false);
  const [playlists, setPlaylists] = useState<PlaylistData[]>([]);
  const loading = useLoading();

  const OpenModal = async () => {
    loading.show();
    try {
      const res = await GetUserPlaylists();
      setPlaylists(res);
      setOpenPlaylists(true);
    } catch (error) {}
    loading.hide();
  };

  const handleCreatePlaylist = async (
    title: string,
    description?: string,
    videoId?: number
  ) => {
    loading.show();
    try {
      const playlist = await CreatePlaylist({ title, description, videoId });

      const newPlaylists = playlists;
      newPlaylists.push(playlist);
      setPlaylists([...newPlaylists]);
    } catch (error) {}
    loading.hide();
  };

  return (
    <>
      <Box
        sx={{
          background: "#00040F",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          fontWeight: "normal",
        }}
      >
        <Box component="img" src="/logo.png" sx={{ padding: "20px" }} />
        <Typography sx={{ color: "#9B9CAF", px: "20px" }}>Menu</Typography>
        <List>
          {navMenu.map((nav, index) => (
            <ListItem key={index} disablePadding sx={{ color: "#FFF" }}>
              <ListItemButton
                sx={{ px: "20px", py: "10px" }}
                onClick={() => {
                  if (nav.link === "/playlists") OpenModal();
                  else navigate(nav.link);
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "#FFF",
                    background:
                      (location.pathname === nav.link && !openPlaylists) ||
                      (nav.link === "/playlists" && openPlaylists)
                        ? "#FF7551"
                        : "rgba(255, 255, 255, 0.1)",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "12px",
                    minWidth: "40px",
                  }}
                >
                  {nav.icon}
                </ListItemIcon>
                <ListItemText
                  primary={nav.text}
                  sx={{
                    ml: "20px",
                    color:
                      (location.pathname === nav.link && !openPlaylists) ||
                      (nav.link === "/playlists" && openPlaylists)
                        ? "#9B9CAF"
                        : "#FFF",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <PlaylistModal
        open={openPlaylists}
        playlists={playlists}
        setOpen={setOpenPlaylists}
        handleCreatePlaylist={handleCreatePlaylist}
      />
    </>
  );
};

interface Props {
  drawerWidth: number;
}

const LeftPanel = ({ drawerWidth }: Props) => {
  const [showMobile, setShowMobile] = useState(false);

  return (
    <>
      <Header drawerWidth={drawerWidth} setShowMobile={setShowMobile} />
      <Box>
        <Drawer
          variant="temporary"
          anchor="left"
          open={showMobile}
          onClose={() => setShowMobile(false)}
          PaperProps={{
            sx: {
              border: "none",
              width: drawerWidth,
              display: { xs: "block", lg: "none" },
            },
          }}
        >
          <DrawerContent />
        </Drawer>
        <Drawer
          variant="permanent"
          anchor="left"
          PaperProps={{
            sx: {
              border: "none",
              width: drawerWidth,
              display: { xs: "none", lg: "block" },
            },
          }}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <DrawerContent />
        </Drawer>
      </Box>
    </>
  );
};

export default LeftPanel;
