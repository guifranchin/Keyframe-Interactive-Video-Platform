import { get, post } from "./generic"
import { UserData } from "./user"
import { VideoData } from "./video"

export interface PlaylistData{
    id: number
    title: string
    description?: string | null
    created_by: UserData
    videos: VideoData[]
}

export async function GetUserPlaylists() : Promise<PlaylistData[]> {
    try {
        const playlists = await get("/playlist")
        return playlists
    } catch (error) {
        throw error
    }
}

export async function GetPlaylist(id: number) : Promise<PlaylistData> {
    try {
        const playlists = await get("/playlist/" + id)
        return playlists
    } catch (error) {
        throw error
    }
}

export interface ManageVideoInPlaylist{
    videoId: number
    playlistId: number
}

export async function AddVideoToPlaylist(body: ManageVideoInPlaylist) : Promise<PlaylistData> {
    try {
        const playlist = await post("/playlist/add", body)
        return playlist
    } catch (error) {
        throw error
    }
}

export async function RemoveVideoFromPlaylist(body: ManageVideoInPlaylist) : Promise<PlaylistData> {
    try {
        const playlist = await post("/playlist/remove", body)
        return playlist
    } catch (error) {
        throw error
    }
}

export interface CreatePlaylistInterface{
    title: string
    description?: string
    videoId?: number
}

export async function CreatePlaylist(body: CreatePlaylistInterface) : Promise<PlaylistData> {
    try {
        const playlist = await post("/playlist", body)
        return playlist
    } catch (error) {
        throw error
    }
}