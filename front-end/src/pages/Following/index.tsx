import { Box, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VideoList } from "../../components/VideoList";
import { useLoading } from "../../context/loading_context";
import {
  GetSubscriptions,
  GetSubscriptionsVideos,
} from "../../services/subscription";
import { UserData } from "../../services/user";
import { VideoData } from "../../services/video";

export const Following = () => {
  const loading = useLoading();
  const [recentVideos, setRecentVideos] = useState<VideoData[]>([]);
  const [popularVideos, setPopularVideos] = useState<VideoData[]>([]);
  const [subs, setSubs] = useState<UserData[]>([]);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(5);
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_MEDIA_ENDPOINT;

  useEffect(() => {
    getSubscriptions();
    getSubscriptionsVideos(page, rows);
  }, []);

  const getSubscriptionsVideos = async (page: number, rows: number) => {
    loading.show();
    try {
      const videos = await GetSubscriptionsVideos(page, rows);
      const newRecent = recentVideos;
      const newPopular = popularVideos;
      newRecent.push(...videos.recent);
      newPopular.push(...videos.popular);
      setRecentVideos([...newRecent]);
      setPopularVideos([...newPopular]);
    } catch (error) {}
    loading.hide();
  };

  const getSubscriptions = async () => {
    loading.show();
    try {
      const res = await GetSubscriptions();
      setSubs(res);
    } catch (error) {}
    loading.hide();
  };

  return (
    <Box sx={{ width: "100%", p: "20px" }}>
    <Typography sx={{ fontSize: "20px", mt: "20px" }}>
        Subscriptions
    </Typography>
      <Stack
        sx={{ width: "100%", py: '20px', px: '15px'}}
        direction="row"
        flexWrap={"wrap"}
        spacing={3}
      >
        {subs.map((sub) => (
          <Box
            component="img"
            src={`${baseUrl}/${sub.avatar}`}
            sx={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              cursor: "pointer",
            }}
            onClick={() => navigate("/profile/" + sub.email)}
            title={sub.name}
          />
        ))}
      </Stack>
      <Box sx={{ width: "100%" }}>
        <Typography sx={{ fontSize: "20px", mb: "20px" }}>
          Recent videos
        </Typography>
        <VideoList
          changePage={() => {}}
          rows={rows}
          videosData={recentVideos}
          flexDirection={"row"}
          hideLoadMore={true}
        />
        <Typography sx={{ fontSize: "20px", my: "20px" }}>
          Popular videos
        </Typography>
        <VideoList
          changePage={() => {}}
          rows={rows}
          videosData={popularVideos}
          flexDirection={"row"}
          hideLoadMore={true}
        />
      </Box>
    </Box>
  );
};
