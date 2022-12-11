import { get, post } from "./generic"
import { UserData } from "./user"
import { VideoData } from "./video"

export async function GetSubscription(subscribeTo: string) : Promise<boolean>{
    try {
        const res = await get("/subscription/" + subscribeTo)
        return res
    } catch (error) {
        throw error
    }
}

export async function GetSubscriptions() : Promise<UserData[]>{
    try {
        const res = await get("/subscription")
        return res
    } catch (error) {
        throw error
    }
}

export interface SubscriptionsVideos{
    recent: VideoData[]
    popular: VideoData[]
}

export async function GetSubscriptionsVideos(page: number, rows: number) : Promise<SubscriptionsVideos>{
    try {
        const res = await get(`/subscription/videos?page=${page}&rows=${rows}`)
        return res
    } catch (error) {
        throw error
    }
}

export async function ManageSubscription(subscribeTo: string) : Promise<boolean>{
    try {
        const res = await post("/subscription", {subscribeTo})
        return res
    } catch (error) {
        throw error
    }
}