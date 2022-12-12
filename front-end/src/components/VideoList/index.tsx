import React, { useEffect } from "react";
import { Box } from "@mui/system";
import { Typography, Button, Select, MenuItem } from "@mui/material";
import { VideoData, VideoOrderBy } from "../../services/video";
import { useNavigate } from "react-router-dom";
import { format } from "timeago.js";

interface Props {
  videosData: VideoData[];
  orderBy?: number;
  changeOrderBy?(order: number): void;
  rows: number;
  changePage(): void;
  flexDirection: "row" | "column";
  showCreatorName?: boolean;
  hideLoadMore?: boolean
}

export const VideoList = ({
  videosData,
  orderBy,
  changeOrderBy,
  rows,
  changePage,
  flexDirection,
  showCreatorName,
  hideLoadMore
}: Props) => {
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_MEDIA_ENDPOINT;

  return (
    <>
      {orderBy && (
        <Box sx={{ display: "flex", alignItems: "center", p: "20px" }}>
          <Typography>Order by: </Typography>
          <Select
            sx={{
              background: "#FFF",
              ml: "10px",
            }}
            value={orderBy}
            onChange={(e: any) => {
              changeOrderBy && changeOrderBy(e.target.value);
            }}
          >
            {(
              Object.keys(VideoOrderBy).filter(
                (v) => !isNaN(Number(v))
              ) as Array<keyof typeof VideoOrderBy>
            ).map((key) => (
              <MenuItem value={Number(key)}>{VideoOrderBy[key]}</MenuItem>
            ))}
          </Select>
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: flexDirection === "row" ? "wrap" : "no-wrap",
          mt: flexDirection === "row" ? "15px" : "10px",
          width: "100%",
          justifyContent: "start",
          flexDirection: flexDirection,
        }}
      >
        {videosData.map((video, index) => (
          <Box
            sx={{
              transition: "0.5s",
              cursor: "pointer",
              "&:hover": {
                filter: "brightness(120%)",
              },
              width: flexDirection === "row" ? { xs: "48%", md: "21%" } : "70%",
              m: flexDirection === "row" ? {xs: "1%", md: '2%'} : "0",
              mt: flexDirection === "column" && index > 0 ? "15px" : "0",
            }}
            onClick={() => navigate(`/video/${video.id}`)}
          >
            <Box
              sx={{
                width: "100%",
                height: "175px",
                backgroundImage: `url(${baseUrl}/${video.thumbnail})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% 100%",
                borderRadius: "6px",
              }}
            ></Box>
            <Box sx={{ display: "flex", mt: "10px" }}>
              {showCreatorName && (
                <Box
                  component="img"
                  src={`${baseUrl}/${video.created_by.avatar}`}
                  sx={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                />
              )}
              <Box sx={{ ml: showCreatorName ? "10px" : "0", }}>
                <Typography>{video.title}</Typography>
                <Box sx={{ display: {xs: 'none', md: 'block'}, alignItems: "center" }}>
                  {showCreatorName && (
                    <Typography sx={{ fontSize: "13px", color: "rgba(183, 185, 210, 0.7)"}}>
                      {video.created_by.name} 
                    </Typography>
                  )}
                  <Box sx={{display: 'flex'}}>
                  <Typography
                    sx={{ fontSize: "13px", color: "rgba(183, 185, 210, 0.7)"}}
                  >
                    {video.viewsCount} views 
                  </Typography>
                  <Typography
                    sx={{ ml: "5px", fontSize: "13px", color: "rgba(183, 185, 210, 0.7)"}}
                  >
                    • {format(video.createdAt)}
                  </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: {xs: 'block', md: 'none'}}}>
                  <Typography
                    sx={{ fontSize: "13px", color: "rgba(183, 185, 210, 0.7)"}}
                  >
                    {video.viewsCount} views
                  </Typography>
                  <Typography
                    sx={{ fontSize: "12px", color: "rgba(183, 185, 210, 0.7)"}}
                  >
                    {format(video.createdAt)}
                  </Typography>
                </Box>
              </Box>
              
            </Box>
          </Box>
        ))}
      </Box>
      {videosData.length % rows === 0 && !hideLoadMore && videosData.length > 0 && (
        <Box sx={{ display: "flex", width: "100%", justifyContent: "center" }}>
          <Button
            variant="contained"
            sx={{
              color: "#FFF",
              background: "#FF7551",
              borderRadius: "5px",
              height: "50px",
              width: "150px",
              mt: "30px",
              textTransform: "none",
              "&.MuiButtonBase-root:hover": {
                background: "#FF7551",
              },
            }}
            onClick={changePage}
          >
            Load more
          </Button>
        </Box>
      )}
    </>
  );
};
