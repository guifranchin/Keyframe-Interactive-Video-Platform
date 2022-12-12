import React from "react";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import { PlaylistData } from "../../services/playlist";
import { VideoData } from "../../services/video";
import { format } from "timeago.js";
import { useNavigate } from "react-router-dom";

interface Props {
  playlist: PlaylistData;
  currentVideo: VideoData;
}

export const PlaylistCard = ({ playlist, currentVideo }: Props) => {
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_MEDIA_ENDPOINT;

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: {xs: '100%', md: '70%'},
          border: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <Box
          sx={{
            width: "100%",
            background: "rgba(255, 255, 255, 0.05)",
            p: "15px",
          }}
        >
          <Typography>{playlist.title}</Typography>
          <Typography>{playlist.videos.length} videos</Typography>
        </Box>
        <Box sx={{ width: "100%" }}>
          {playlist.videos.map((video) => (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                p: "15px",
                transition: "0.5s",
                cursor: "pointer",
                "&:hover": {
                  filter: "brightness(120%)",
                  background: "rgba(255, 255, 255, 0.05)",
                },
                background: video.id === currentVideo.id ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
              }}
              onClick={() =>
                navigate(`/video/${video.id}?playlistId=${playlist.id}`)
              }
            >
              <Box
                sx={{
                  width: "20%",
                  height: "50px",
                  backgroundImage: `url(${baseUrl}/${video.thumbnail})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "100% 100%",
                  borderRadius: "6px",
                }}
                
              ></Box>
              <Box>
                <Typography
                  sx={{ ml: "10px" }}
                >
                  {video.title}
                </Typography>
                <Box sx={{ ml: "10px" }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: "rgba(183, 185, 210, 0.7)",
                      }}
                    >
                      {video.created_by.name} •{" "}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        ml: "5px",
                        color: "rgba(183, 185, 210, 0.7)",
                      }}
                    >
                      {video.viewsCount} views •{" "}
                    </Typography>
                    <Typography
                      sx={{
                        ml: "5px",
                        fontSize: "12px",
                        color: "rgba(183, 185, 210, 0.7)",
                      }}
                    >
                      {format(video.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
