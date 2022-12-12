import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  Stack,
  Divider,
  Checkbox,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { PlaylistData } from "../../services/playlist";
import { VideoData } from "../../services/video";
import { Box } from "@mui/system";
import { useSnack } from "../../context/snack_context";
import { useNavigate } from "react-router-dom";

interface Props {
  open: boolean;
  setOpen(v: boolean): void;
  playlists: PlaylistData[];
  video?: VideoData | undefined;
  handleVideoInPlaylist?(
    playlistId: number,
    videoId: number,
    addVideo: boolean
  ): Promise<void>;
  handleCreatePlaylist(
    title: string,
    description?: string,
    videoId?: number,
  ): Promise<void>;
}

export const PlaylistModal = ({
  open,
  setOpen,
  playlists,
  video,
  handleVideoInPlaylist,
  handleCreatePlaylist
}: Props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [createPlaylist, setCreatePlaylist] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const snack = useSnack()
  const navigate = useNavigate()

  const getCheckedPlaylist = (playlist: PlaylistData) => {
    if (playlist.videos.find((v) => v.id === video?.id)) return true;
    return false;
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validatePlaylist = () => {
    if(!title){
        snack.error("Title is obrigatory")
        return false
    }

    if(title.length < 3 ){
        snack.error("Title has to be at least 3 characteres")
        return false
    }

    if(title.length > 20){
        snack.error("Title has to be at max 20 characteres")
        return false
    }

    if(description && description.length < 5 ){
        snack.error("Description has to be at least 5 characteres")
        return false
    }

    if(description && description.length > 25){
        snack.error("Description has to be at max 25 characteres")
        return false
    }

    return true
  }

  return (
    <Dialog open={open} onClose={handleClose} fullScreen={fullScreen}>
      <DialogTitle sx={{ textAlign: "center" }}>Playlists</DialogTitle>
      <DialogContent>
        {!createPlaylist && (
          <Stack
            sx={{ width: "300px" }}
            direction="column"
            divider={<Divider orientation="horizontal" flexItem />}
          >
            {playlists.map((playlist) => (
              <Stack
                sx={{ width: "100%", p: "10px" }}
                alignItems="center"
                direction="row"
                justifyContent="space-between"
              >
                <Box sx={{cursor: 'pointer'}} onClick={() => {
                  if(video && playlist.videos.find(v => v.id === video.id)){
                    window.location.href = `/video/${video.id}?playlistId=${playlist.id}`
                  }
                  else if(playlist.videos.length > 0){
                    window.location.href = `/video/${playlist.videos[0].id}?playlistId=${playlist.id}`
                  }
                }}>
                  <Typography>{playlist.title}</Typography>
                  <Typography sx={{ fontSize: "12px" }}>
                    {playlist?.description}
                  </Typography>
                  <Typography sx={{ fontSize: "12px" }}>
                    {playlist?.videos.length}{" "}
                    {"video".concat(playlist?.videos.length !== 1 ? "s" : "")}
                  </Typography>
                </Box>
                {video && <Checkbox
                  checked={getCheckedPlaylist(playlist)}
                  onChange={(e) => {
                    if (!video) return;
                    if (!getCheckedPlaylist(playlist))
                    handleVideoInPlaylist && handleVideoInPlaylist(playlist.id, video.id, true);
                    else handleVideoInPlaylist && handleVideoInPlaylist(playlist.id, video.id, false);
                  }}
                />}
              </Stack>
            ))}
          </Stack>
        )}
        {createPlaylist && (
          <Stack sx={{ width: "400px" }} alignItems="center">
            <TextField
              variant="standard"
              sx={{
                width: "90%",
                input: {
                  border: "none",
                  borderBottom: "2px solid rgba(183, 185, 210, 0.7)",
                },
              }}
              inputProps={{
                maxLength: 20,
              }}
              InputProps={{
                disableUnderline: true,
              }}
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              variant="standard"
              sx={{
                width: "90%",
                input: {
                  border: "none",
                  borderBottom: "2px solid rgba(183, 185, 210, 0.7)",
                },
                mt: "20px",
              }}
              inputProps={{
                maxLength: 25,
              }}
              InputProps={{
                disableUnderline: true,
              }}
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Stack
          justifyContent="space-between"
          direction="row"
          sx={{ width: "100%" }}
        >
          <Button onClick={() => {
            if(createPlaylist)
                setCreatePlaylist(false)
            else
                handleClose()
          }}>{createPlaylist ? "Back" : "Close"}</Button>
          <Button
            onClick={() => {
              if (!createPlaylist) setCreatePlaylist(true);
              else if(validatePlaylist()) {
                handleCreatePlaylist(title, description, video ? video.id : undefined)
                setCreatePlaylist(false)
                setTitle("")
                setDescription("")
              }
            }}
          >
            Create new playlist
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
