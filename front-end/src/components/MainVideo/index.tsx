import React from "react";
import { Box } from "@mui/system";
import { Typography, Button } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { maskDateInFull } from "../../utils";
import { UserData } from "../../services/user";
import { useUserData } from "../../context/user_data_context";
import { useNavigate } from "react-router-dom";

interface Props {
  videoUrl: string
  description?: string
  title: string
  createdBy: Partial<UserData>
  viewsCount: number
  likesCount: number
  deslikesCount: number
  evaluation?: boolean | null
  createdAt: Date
  handleChangeEvaluation?(isPositive: boolean): Promise<void>;
  isSubscribed?: boolean
  handleSubscription?(): void
}

export const MainVideo = ({
  videoUrl,
  description,
  title,
  createdBy,
  viewsCount,
  likesCount,
  deslikesCount,
  evaluation,
  createdAt,
  handleChangeEvaluation,
  isSubscribed,
  handleSubscription
}: Props) => {
  const baseUrl = process.env.REACT_APP_MEDIA_ENDPOINT;
  const {userData} = useUserData()
  const navigate = useNavigate()

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column",           px: {xs: '10px', md: '0'}
  }}>
      <Box
        component="video"
        src={videoUrl}
        controls
        sx={{ width: "100%", borderRadius: "20px", height: {xs: '250px', md: '500px'}}}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          mt: "10px",
        }}
      >
        <Typography sx={{ fontSize: "20px" }}>{title}</Typography>
        <Typography sx={{ color: "#808191", fontSize: "14px" }}>
          {viewsCount} views • {maskDateInFull(createdAt)}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          mt: "20px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            component="img"
            src={`${baseUrl}/${createdBy.avatar}`}
            sx={{ width: "40px", height: "40px", borderRadius: "50%", cursor: 'pointer'}}
            onClick={() => navigate("/profile/" + createdBy.email)}
          />
          <Box
            sx={{
              ml: "10px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ color: "#CFD1D2", fontSize: "14px" }}>
              {createdBy.name}
            </Typography>
            <Typography
              sx={{ color: "rgba(183, 185, 210, 0.7)", fontSize: "14px" }}
            >
              {createdBy.subsCount} Followers
            </Typography>
          </Box>
          {userData.email !== createdBy.email && <Button
            variant="contained"
            sx={{
              color: "#FFF",
              background: isSubscribed ? 'blue' : "#FF7551",
              borderRadius: "5px",
              height: "25px",
              width: "75px",
              ml: "30px",
              textTransform: "none",
              "&.MuiButtonBase-root:hover": {
                background: isSubscribed ? 'blue' : "#FF7551",
              },
            }}
            onClick={() => handleSubscription && handleSubscription()}
          >
            {isSubscribed ? 'Following' : 'Follow'}
          </Button>}
        </Box>
        <Box sx={{ color: "#80819", fontSize: "12px" }}>
          <Box sx={{ display: "flex", alignItems: "flex-end" }}>
            <Box sx={{ mr: "15px" }}>{likesCount}</Box>
            <ThumbUpIcon
              sx={{ color: evaluation ? "blue" : "#80819", cursor: 'pointer' }}
              onClick={() => handleChangeEvaluation && handleChangeEvaluation(true)}
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "flex-end", mt: "5px" }}>
            <Box sx={{ mr: "15px" }}>{deslikesCount}</Box>
            <ThumbDownIcon
              sx={{ color: evaluation === false ? "blue" : "#80819", cursor: 'pointer' }}
              onClick={() => handleChangeEvaluation && handleChangeEvaluation(false)}
            />
          </Box>
        </Box>
      </Box>
      <Typography sx={{ mt: "30px", color: "#808191", fontSize: "13px" }}>
        {description}
      </Typography>
    </Box>
  );
};

export default MainVideo;
