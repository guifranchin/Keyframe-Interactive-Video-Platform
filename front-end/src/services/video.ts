import { del, get, post, put } from "./generic";
import { UserData } from "./user";

export interface VideoData {
  createdAt: Date;
  created_by: UserData;
  description?: string;
  deslikesCount: number;
  likesCount: number;
  id: number;
  path: string;
  thumbnail: string;
  title: string;
  viewsCount: number;
  commentCount: number;
  evaluation?: boolean | null;
}

export async function getVideo(id: number): Promise<VideoData> {
  try {
    const res = await get(`/video/${id}`);
    return res;
  } catch (error) {
    throw error;
  }
}

export enum VideoOrderBy{
  Views = 1,
  Recent = 2
}

export async function getHomeVideos(page: number, rows: number): Promise<VideoData[]> {
  try {
    let url = `/video/home?page=${page}&rows=${rows}`
    const res = await get(url);
    return res;
  } catch (error) {
    throw error;
  }
}

export async function SearchVideos(search: string, page: number, rows: number, orderBy?: number): Promise<VideoData[]> {
  try {
    let url = `/video/search?page=${page}&rows=${rows}`
    if(orderBy)
      url += `&orderBy=${orderBy}`
    const res = await post(url, {search});
    return res;
  } catch (error) {
    throw error;
  }
}

export async function getUserVideos(email: string, page: number, rows: number, orderBy?: number): Promise<VideoData[]> {
  try {
    let url = `/video/user/${email}?page=${page}&rows=${rows}`
    if(orderBy)
      url += `&orderBy=${orderBy}`
    const res = await get(url);
    return res;
  } catch (error) {
    throw error;
  }
}

export async function getRelatedVideos(videoId: number, page: number, rows: number): Promise<VideoData[]> {
  try {
    let url = `/video/related/${videoId}?page=${page}&rows=${rows}`
    const res = await get(url);
    return res;
  } catch (error) {
    throw error;
  }
}

interface UploadVideoInterface {
  title: string;
  description?: string;
  thumbnail: File;
  video: File;
}

export async function UploadVideo(infos: UploadVideoInterface) : Promise<number> {
  try {
    const formData = new FormData();
    formData.append("title", infos.title);
    if (infos.description) formData.append("description", infos.description);
    formData.append("thumbnail", infos.thumbnail);
    formData.append("video", infos.video);
    const id = await post("/video", formData, true);
    return id
  } catch (error) {
    throw error;
  }
}

interface EditVideoInterface {
  title?: string;
  description?: string;
  thumbnail?: File;
  id: number
}

export async function EditVideo(infos: EditVideoInterface) : Promise<number> {
  try {
    const formData = new FormData();
    if (infos.title) formData.append("title", infos.title);
    if (infos.description) formData.append("description", infos.description);
    if (infos.thumbnail) formData.append("thumbnail", infos.thumbnail);
    formData.append("id", infos.id.toString());

    const id = await put("/video", formData, true);
    return id
  } catch (error) {
    throw error;
  }
}

export async function DeleteVideo(id: number): Promise<void> {
  try {
    const res = await del(`/video/${id}`);
    return res;
  } catch (error) {
    throw error;
  }
}