import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MainVideo from "../../components/MainVideo";
import { DeleteVideo, getRelatedVideos, getVideo, VideoData } from "../../services/video";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useLoading } from "../../context/loading_context";
import { useSnack } from "../../context/snack_context";
import {
  PostCommentEvaluation,
  PostVideoEvaluation,
} from "../../services/evaluation";
import { isLogged } from "../../services/auth";
import {
  Comment,
  CreateVideoComment,
  CreateVideoCommentResponse,
  DeleteComment,
  EditComment,
  GetComment,
  GetCommentResponses,
  GetVideoComments,
} from "../../services/comment";
import { CommentSection } from "../../components/CommentSection";
import { VideoList } from "../../components/VideoList";
import {
  GetSubscription,
  ManageSubscription,
} from "../../services/subscription";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import {
  AddVideoToPlaylist,
  CreatePlaylist,
  GetPlaylist,
  GetUserPlaylists,
  PlaylistData,
  RemoveVideoFromPlaylist,
} from "../../services/playlist";
import { PlaylistModal } from "../../components/PlaylistModal";
import { useUserData } from "../../context/user_data_context";
import SwitchVideoIcon from "@mui/icons-material/SwitchVideo";
import { PlaylistCard } from "../../components/PlaylistCard";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import QueueMusicOutlinedIcon from "@mui/icons-material/QueueMusicOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import { DeleteModal } from "../../components/DeleteModal";

const Video = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState<VideoData>();
  const [relatedVideos, setRelatedVideos] = useState<VideoData[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsPage, setCommentsPage] = useState(1);
  const [commentsRows, setCommentsRows] = useState(10);
  const [videosPage, setVideosPage] = useState(1);
  const [videosRows, setVideosRows] = useState(5);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const loading = useLoading();
  const snack = useSnack();
  const [playlists, setPlaylists] = useState<PlaylistData[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<PlaylistData>();
  const [openPlaylistModal, setOpenPlaylistModal] = useState(false);
  const { userData } = useUserData();
  const [searchParams] = useSearchParams();
  const [showMobileRelatedVideos, setShowMobileRelatedVideos] = useState(false);
  const [showMobilePlaylist, setShowMobilePlaylist] = useState(false);
  const baseUrl = process.env.REACT_APP_MEDIA_ENDPOINT;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  useEffect(() => {
    setVideoData(undefined);
    setComments([]);
    setRelatedVideos([]);
    setCurrentPlaylist(undefined);
    setVideosPage(1);
    setShowMobilePlaylist(false);
    setShowMobileRelatedVideos(false);
  }, [id]);

  useEffect(() => {
    getVideoData();
  }, [userData]);

  const getPlaylist = async () => {
    const playlistId = searchParams.get("playlistId");
    if (!playlistId || isNaN(Number(playlistId))) return;

    loading.show();
    try {
      const res = await GetPlaylist(Number(playlistId));
      if (res.videos.find((v) => v.id === Number(id))) {
        setCurrentPlaylist(res);
        setShowMobilePlaylist(true);
      }
    } catch (error) {}
    loading.hide();
  };

  const getVideoData = async () => {
    try {
      if (!id || isNaN(Number(id))) {
        return;
      }
      if (isLogged() && !userData.email) return;

      loading.show();
      const res = await getVideo(Number(id));
      setVideoData(res);
      loadRelatedVideos(res.id, videosPage);
      getPlaylist();
      HandleGetVideoComments(commentsPage, commentsRows);

      if (isLogged() && userData.email !== res.created_by.email) {
        const subscription = await GetSubscription(res.created_by.email);
        setIsSubscribed(subscription);
      }
    } catch (error) {
      snack.error("Video não encontrado");
      navigate("/");
    }
    loading.hide();
  };

  const handleSubscription = async () => {
    if (!videoData) return;

    try {
      loading.show();
      const res = await ManageSubscription(videoData?.created_by.email);
      const video = await getVideo(videoData.id);
      setIsSubscribed(res);
      setVideoData(video);
    } catch (error) {}
    loading.hide();
  };

  const loadRelatedVideos = async (videoId: number, page: number) => {
    try {
      loading.show();
      const res = await getRelatedVideos(videoId, page, videosRows);
      const newRelatedVideos = relatedVideos;
      for (const video of res) {
        if (newRelatedVideos.find((v) => v.id === video.id)) continue;
        newRelatedVideos.push(video);
      }
      setRelatedVideos([...newRelatedVideos]);
    } catch (error) {}
    loading.hide();
  };

  const handleChangeEvaluation = async (isPositive: boolean) => {
    if (!isLogged()) return;

    try {
      loading.show();
      const video = await PostVideoEvaluation(Number(id), isPositive);
      setVideoData(video);
    } catch (error) {}
    loading.hide();
  };

  const HandleGetVideoComments = async (page: number, rows: number) => {

    try {
      loading.show();
      const res = await GetVideoComments(Number(id), page, rows);
      const newComments = [...comments];
      for (const comment of res) {
        if (!newComments.find((c) => c.id === comment.id))
          newComments.push(comment);
      }
      setComments([...newComments]);
    } catch (error) {}
    loading.hide();
  };

  const handleChangeCommentEvaluation = async (
    commentId: number,
    isPositive: boolean,
    isResponse: boolean,
    mainCommentId?: number
  ) => {
    if (!isLogged()) return;

    try {
      loading.show();
      const newComment = await PostCommentEvaluation(commentId, isPositive);
      const newComments = [...comments];
      if (!isResponse) {
        const index = newComments.findIndex((c) => c.id === commentId);
        newComment.responses = newComments[index].responses;
        newComments[index] = newComment;
      } else {
        const mainIndex = newComments.findIndex((c) => c.id === mainCommentId);
        newComments[mainIndex].responses = newComments[
          mainIndex
        ].responses?.map((c) => {
          if (c.id === newComment.id) c = newComment;
          return c;
        });
      }
      setComments([...newComments]);
    } catch (error) {}
    loading.hide();
  };

  const sendNewComment = async (content: string) => {
    loading.show();
    try {
      const comment = await CreateVideoComment(Number(id), content);
      const res = await getVideo(Number(id));
      setVideoData(res);
      const newComments = [...comments];
      newComments.unshift(comment);
      setComments([...newComments]);
    } catch (error) {}
    loading.hide();
  };

  const sendNewCommentResponse = async (commentId: number, content: string) => {
    loading.show();
    try {
      const commentResponse = await CreateVideoCommentResponse(
        commentId,
        content
      );
      const comment = await GetComment(commentId);
      const newComments = [...comments];

      const index = newComments.findIndex((c) => c.id === commentId);
      newComments[index].responses?.unshift(commentResponse);

      comment.responses = newComments[index].responses;
      newComments[index] = comment;

      setComments([...newComments]);
    } catch (error) {}
    loading.hide();
  };

  const loadCommentResponses = async (commentId: number, page: number) => {
    loading.show();
    try {
      const responses = await GetCommentResponses(commentId, page, 5);
      const newComments = [...comments];
      const index = newComments.findIndex((c) => c.id === commentId);

      for (const response of responses) {
        if (!newComments[index].responses?.find((c) => c.id === response.id))
          newComments[index].responses?.push(response);
      }

      setComments([...newComments]);
    } catch (error) {}
    loading.hide();
  };

  window.onscroll = () => {
    if (!videoData) return;
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      if (videoData.commentCount > comments.length) {
        HandleGetVideoComments(commentsPage + 1, commentsRows);
        setCommentsPage((prevPage) => prevPage + 1);
      }
    }
  };
  const changePage = () => {
    if (videoData) {
      loadRelatedVideos(videoData.id, videosPage + 1);
      setVideosPage((page) => page + 1);
    }
  };

  const OpenModal = async () => {
    loading.show();
    try {
      const res = await GetUserPlaylists();
      setPlaylists(res);
      setOpenPlaylistModal(true);
    } catch (error) {}
    loading.hide();
  };

  const handleVideoInPlaylist = async (
    playlistId: number,
    videoId: number,
    addVideo: boolean
  ) => {
    loading.show();
    try {
      let playlist: PlaylistData;
      if (addVideo)
        playlist = await AddVideoToPlaylist({ playlistId, videoId });
      else playlist = await RemoveVideoFromPlaylist({ playlistId, videoId });

      const newPlaylists = playlists;
      const index = newPlaylists.findIndex((p) => p.id === playlist.id);
      newPlaylists[index] = playlist;
      setPlaylists([...newPlaylists]);
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

  const deleteVideo = async () => {
    if(!videoData)
      return
    loading.show();
    try {
      await DeleteVideo(videoData.id)
      snack.success("Video deletado com sucesso!")
      navigate('/')
    } catch (error) {}
    loading.hide();
  };

  const handleEditComment = async (
    commentId: number,
    content: string,
    isResponse: boolean,
    mainCommentId?: number
  ) => {
    if (!isLogged()) return;

    try {
      loading.show();
      const newComment = await EditComment(commentId, content)
      const newComments = [...comments];
      if (!isResponse) {
        const index = newComments.findIndex((c) => c.id === commentId);
        newComment.responses = newComments[index].responses;
        newComments[index] = newComment;
      } else {
        const mainIndex = newComments.findIndex((c) => c.id === mainCommentId);
        newComments[mainIndex].responses = newComments[
          mainIndex
        ].responses?.map((c) => {
          if (c.id === newComment.id) c = newComment;
          return c;
        });
      }
      setComments([...newComments]);
    } catch (error) {}
    loading.hide();
  };

  const handleDeleteComment = async (
    commentId: number,
    isResponse: boolean,
    mainCommentId?: number
  ) => {
    if (!isLogged()) return;

    try {
      loading.show();
      await DeleteComment(commentId)
      const newComments = [...comments];
      if (!isResponse) {
        const index = newComments.findIndex((c) => c.id === commentId);
        newComments.splice(index, 1)
        const res = await getVideo(Number(id));
        setVideoData(res);
      } else if(mainCommentId){
        const mainIndex = newComments.findIndex((c) => c.id === mainCommentId);
        const index = newComments[mainIndex].responses?.findIndex((c) => c.id === commentId);
        index !== undefined && newComments[mainIndex].responses?.splice(index, 1)

        const mainComment = await GetComment(mainCommentId)
        mainComment.responses = newComments[mainIndex].responses
        newComments[mainIndex] = mainComment
      }
      setComments([...newComments]);
    } catch (error) {}
    loading.hide();
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          pt: "20px",
          pl: { xs: "0", md: "40px" },
        }}
      >
        <Box sx={{ width: { xs: "100%", md: "65%" } }}>
          {videoData && (
            <MainVideo
              createdAt={videoData.createdAt}
              createdBy={videoData.created_by}
              deslikesCount={videoData.deslikesCount}
              likesCount={videoData.likesCount}
              videoUrl={`${baseUrl}/${videoData.path}`}
              title={videoData.title}
              viewsCount={videoData.viewsCount}
              description={videoData.description}
              evaluation={videoData.evaluation}
              handleChangeEvaluation={handleChangeEvaluation}
              handleSubscription={handleSubscription}
              isSubscribed={isSubscribed}
            />
          )}
          <Box sx={{ display: "flex", alignItems: "center", mt: "30px" }}>
            {isLogged() && userData.email === videoData?.created_by.email && (
              <>
                <IconButton color="primary">
                <SettingsIcon
                  sx={{ cursor: "pointer", ml: { xs: "10px", md: "0" } }}
                  titleAccess="Configurations"
                  onClick={(e: any) => setAnchorEl(e.currentTarget)}
                />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                sx={{mt: '10px'}}
              >
                <MenuItem onClick={() => navigate(`/edit/${videoData?.id}`)}>Editar</MenuItem>
                <MenuItem onClick={() => setOpenDeleteModal(true)}>Deletar</MenuItem>
              </Menu>
              </>
            )}
            <IconButton color="primary">
              <AddToPhotosIcon
                sx={{ cursor: "pointer", ml: { xs: "10px", md: "0" } }}
                titleAccess="Manage playlists"
                onClick={OpenModal}
              />
            </IconButton>
            <IconButton color="primary">
              <SwitchVideoIcon
                sx={{
                  cursor: "pointer",
                  ml: currentPlaylist ? "30px" : "10px",
                  display: { xs: "block", md: "none" },
                }}
                titleAccess="Show related videos"
                onClick={() => {
                  setShowMobilePlaylist(false);
                  setShowMobileRelatedVideos(true);
                }}
              />
            </IconButton>
            {videoData && currentPlaylist && currentPlaylist.videos.length > 0 && (
              <IconButton color="primary">
                <QueueMusicOutlinedIcon
                  sx={{
                    cursor: "pointer",
                    ml: "30px",
                    display: { xs: "block", md: "none" },
                  }}
                  titleAccess="Show playlist"
                  onClick={() => {
                    setShowMobilePlaylist(true);
                    setShowMobileRelatedVideos(false);
                  }}
                />
              </IconButton>
            )}
          </Box>

          {!showMobileRelatedVideos && !showMobilePlaylist && (
            <CommentSection
              commentCount={videoData?.commentCount ?? 0}
              comments={comments}
              handleChangeCommentEvaluation={handleChangeCommentEvaluation}
              sendNewComment={sendNewComment}
              loadCommentResponses={loadCommentResponses}
              sendNewCommentResponse={sendNewCommentResponse}
              handleEditComment={handleEditComment}
              handleDeleteComment={handleDeleteComment}
            />
          )}

          {(showMobileRelatedVideos || showMobilePlaylist) && (
            <Box
              sx={{
                width: "100%",
                background: "rgba(255, 255, 255, 0.05)",
                mt: "15px",
                display: { xs: "block", md: "none" },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                  p: "15px",
                }}
              >
                <ClearOutlinedIcon
                  onClick={() => {
                    setShowMobileRelatedVideos(false);
                    setShowMobilePlaylist(false);
                  }}
                />
              </Box>
              {showMobileRelatedVideos && (
                <VideoList
                  changePage={changePage}
                  videosData={relatedVideos}
                  flexDirection={"row"}
                  rows={videosRows}
                  showCreatorName={true}
                />
              )}
              {videoData &&
                currentPlaylist &&
                currentPlaylist.videos.length > 0 &&
                showMobilePlaylist && (
                  <PlaylistCard
                    playlist={currentPlaylist}
                    currentVideo={videoData}
                  />
                )}
            </Box>
          )}
        </Box>
        <Box sx={{ width: "35%", display: { xs: "none", md: "block" } }}>
          {videoData &&
            currentPlaylist &&
            currentPlaylist.videos.length > 0 && (
              <PlaylistCard
                playlist={currentPlaylist}
                currentVideo={videoData}
              />
            )}
          <VideoList
            changePage={changePage}
            videosData={relatedVideos}
            flexDirection={"column"}
            rows={videosRows}
            showCreatorName={true}
          />
        </Box>
      </Box>
      <PlaylistModal
        open={openPlaylistModal}
        setOpen={setOpenPlaylistModal}
        playlists={playlists}
        video={videoData}
        handleVideoInPlaylist={handleVideoInPlaylist}
        handleCreatePlaylist={handleCreatePlaylist}
      />
      <DeleteModal
        open={openDeleteModal}
        close={() => setOpenDeleteModal(false)}
        okClick={deleteVideo}
        title="Deltar vídeo"
        description="Tem certeza que quer deletar o vídeo?"
      />
    </>
  );
};

export default Video;
