import React, { useRef, useEffect, useState } from "react";
import { Box } from "@mui/system";
import { Typography, Button, Select, MenuItem, TextField } from "@mui/material";
import { useUserData } from "../../context/user_data_context";
import {
  DeleteUser,
  EditUserData,
  GetUserDataByEmail,
  UserData,
} from "../../services/user";
import { getAverageRGB } from "../../utils";
import { useNavigate, useParams } from "react-router-dom";
import { useLoading } from "../../context/loading_context";
import validator from "validator";
import { getUserVideos, VideoData, VideoOrderBy } from "../../services/video";
import { format } from "timeago.js";
import { VideoList } from "../../components/VideoList";
import {
  GetSubscription,
  ManageSubscription,
} from "../../services/subscription";
import { doLogout, isLogged } from "../../services/auth";
import { useSnack } from "../../context/snack_context";
import { DeleteModal } from "../../components/DeleteModal";

export const Profile = () => {
  const baseUrl = process.env.REACT_APP_MEDIA_ENDPOINT;
  const imgRef = useRef<HTMLImageElement>(null);
  const [bgColor, setBgColor] = useState("rgb(255, 0, 0)");
  const { email } = useParams();
  const loading = useLoading();
  const navigate = useNavigate();
  const [otherUserData, setOtherUserData] = useState<UserData>();
  const [videosData, setVideosData] = useState<VideoData[]>([]);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [orderBy, setOrderBy] = useState(VideoOrderBy.Recent);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { userData, setUserData } = useUserData();
  const [editingName, setEditingName] = useState(false);
  const [editValue, setEditValue] = useState("");
  const editRef = useRef<HTMLInputElement>(null);
  const snack = useSnack();
  const fileRef = useRef<HTMLInputElement>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (otherUserData) getBgColor(`${baseUrl}/${otherUserData.avatar}`);
  }, [otherUserData]);

  const getBgColor = async (src: string) => {
    const newColor = await getAverageRGB(src);
    setBgColor(newColor);
  };

  useEffect(() => {
    if (email && validator.isEmail(email)) {
      getUserData(email);
    } else navigate("/");
  }, [userData]);

  const getUserData = async (email: string) => {
    if (isLogged() && !userData.email) return;
    loading.show();
    try {
      const [user, videos] = await Promise.all([
        GetUserDataByEmail(email),
        getUserVideos(email, page, rows, orderBy),
      ]);

      if (user.email !== userData.email && isLogged()) {
        const subscription = await GetSubscription(email);
        setIsSubscribed(subscription);
      }
      setOtherUserData(user);
      setVideosData(videos);
    } catch (error) {}
    loading.hide();
  };

  const handleSubscription = async () => {
    if (!otherUserData) return;

    try {
      loading.show();
      const res = await ManageSubscription(otherUserData.email);
      const user = await GetUserDataByEmail(otherUserData.email);
      setIsSubscribed(res);
      setOtherUserData(user);
    } catch (error) {}
    loading.hide();
  };

  const loadMoreVideos = async (email: string, page: number) => {
    loading.show();
    try {
      const videos = await getUserVideos(email, page, rows, orderBy);
      const newVideos = videosData;
      newVideos.push(...videos);
      setVideosData([...newVideos]);
    } catch (error) {}
    loading.hide();
  };

  const loadChangeOrderVideos = async (
    email: string,
    page: number,
    orderBy: number
  ) => {
    loading.show();
    try {
      const videos = await getUserVideos(email, page, rows, orderBy);
      setVideosData(videos);
    } catch (error) {}
    loading.hide();
  };

  const changePage = () => {
    if (email && validator.isEmail(email)) {
      loadMoreVideos(email, page + 1);
      setPage((page) => page + 1);
    }
  };

  const changeOrderBy = (order: number) => {
    if (email && validator.isEmail(email)) {
      setOrderBy(order);
      setPage(1);
      loadChangeOrderVideos(email, 1, order);
    }
  };

  const keyPressEditEvent = async (e: any) => {
    try {
      if (e.key === "Escape") {
        setEditingName(false);
      }
      if (e.key === "Enter") {
        if (editValue.length < 5) {
          snack.error("The comment have to be at least 3 characteres");
          return;
        }
        if (editValue.length > 200) {
          snack.error("The comment can have 50 max");
          return;
        }
        if (editValue === otherUserData?.name) {
          return;
        }
        loading.show();
        const newUserData = await EditUserData({ name: editValue });
        setOtherUserData(newUserData);
        setUserData(newUserData)
        setEditingName(false);
        setEditValue("");
      }
    } catch (error) {
      snack.error("Erro ao editar o nome");
    }
    loading.hide();
  };

  const handleClickOutside = (event: any) => {
    if (editRef.current && !editRef.current.contains(event.target)) {
      setEditingName(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    if (editingName) editRef.current?.focus();
  }, [editingName]);

  const editUserAvatar = async (avatar: File) => {
    loading.show();
    try {
      const newUserData = await EditUserData({ avatar });
      setOtherUserData(newUserData);
      setUserData(newUserData)
    } catch (error) {
      snack.error("Erro ao editar o avatar");
    }
    loading.hide();
  };

  const deleteVideo = async () => {
    loading.show();
    try {
      await DeleteUser()
      doLogout()
      navigate('/')
    } catch (error) {
      snack.error("Erro ao editar o avatar");
    }
    loading.hide();
  }

  return (
    <>
      <DeleteModal
        title="Deltar canal"
        description="Tem certeza que quer deletar o canal?"
        open={deleting}
        close={() => setDeleting(false)}
        okClick={deleteVideo}
      />
      <input
        type="file"
        style={{ display: "none" }}
        accept="image/png, image/jpeg, image/gif"
        onChange={(e) => {
          const file = e.target.files ? e.target.files[0] : null;
          if (file) {
            editUserAvatar(file);
          }
        }}
        ref={fileRef}
      />
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            width: "100%",
            height: "150px",
            background: bgColor,
            position: "relative",
          }}
        >
          <Box
            component="img"
            src={`${baseUrl}/${otherUserData?.avatar}`}
            sx={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              position: "absolute",
              left: "50%",
              top: "100%",
              transform: "translate(-50%, -50%)",
              "&:hover": {
                width: '125px',
                height: '125px'
              },
              transition: '0.3s',
              cursor: isLogged() && userData.email === otherUserData?.email ? 'pointer' : 'default'
            }}
            ref={imgRef}
            onClick={() => {
              if (isLogged() && userData.email === otherUserData?.email) {
                fileRef.current?.click()
              }
            }}
          />
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            p: "20px",
          }}
        >
          <Box>
            {!editingName ? (
              <Typography
                sx={{ fontSize: "20px" }}
                onClick={() => {
                  if (isLogged() && userData.email === otherUserData?.email) {
                    setEditingName(true);
                    otherUserData && setEditValue(otherUserData.name);
                  }
                }}
              >
                {otherUserData?.name}
              </Typography>
            ) : (
              <TextField
                sx={{
                  border: "none",
                  borderBottom: "2px solid rgba(255, 255, 255, 0.05)",
                  input: { color: "#FFF", outline: "hidden" },
                  mt: "10px",
                  width: "100%",
                }}
                inputRef={editRef}
                value={editValue}
                onKeyDown={keyPressEditEvent}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="New name"
                inputProps={{
                  style: {
                    padding: 2,
                    fontSize: 20,
                    color: "#FFF",
                  },
                  maxLength: 50,
                }}
              />
            )}
            <Typography sx={{ color: "rgba(183, 185, 210, 0.7)" }}>
              {otherUserData?.subsCount} followers
            </Typography>
          </Box>
          {otherUserData?.email !== userData.email ? (
            <Button
              variant="contained"
              sx={{
                color: "#FFF",
                background: isSubscribed ? "blue" : "#FF7551",
                borderRadius: "5px",
                height: "50px",
                width: "150px",
                ml: "30px",
                textTransform: "none",
                "&.MuiButtonBase-root:hover": {
                  background: isSubscribed ? "blue" : "#FF7551",
                },
              }}
              onClick={handleSubscription}
            >
              {isSubscribed ? "Following" : "Follow"}
            </Button>
          ) : 
          <Button
              variant="contained"
              sx={{
                color: "#FFF",
                background: 'red',
                borderRadius: "5px",
                height: "50px",
                width: "150px",
                ml: "30px",
                textTransform: "none",
                "&.MuiButtonBase-root:hover": {
                  background: 'red',
                },
              }}
              onClick={() => setDeleting(true)}
            >
              Delete channel
            </Button>
          }
        </Box>
        <VideoList
          changePage={changePage}
          orderBy={orderBy}
          rows={rows}
          videosData={videosData}
          changeOrderBy={changeOrderBy}
          flexDirection={"row"}
        />
      </Box>
    </>
  );
};
