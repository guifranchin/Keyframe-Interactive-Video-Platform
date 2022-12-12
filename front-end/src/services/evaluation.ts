import { Comment } from "./comment"
import { get, post } from "./generic"
import { VideoData } from "./video"

export async function GetVideoEvaluation(videoId: number) : Promise<boolean | null>{
    try {
        const res = await get("/video/evaluation/" + videoId)
        return res
    } catch (error) {
        throw error
    }
}

export async function PostVideoEvaluation(videoId: number, isPositive: boolean) : Promise<VideoData>{
    try {
        const res = await post("/video/evaluation", {videoId, isPositive})
        return res
    } catch (error) {
        throw error
    }
}

export async function GetCommentEvaluation(commentId: number) : Promise<boolean | null>{
    try {
        const res = await get("/video/comment/evaluation/" + commentId)
        return res
    } catch (error) {
        throw error
    }
}

export async function PostCommentEvaluation(commentId: number, isPositive: boolean) : Promise<Comment>{
    try {
        const res = await post("/video/comment/evaluation", {commentId, isPositive})
        return res
    } catch (error) {
        throw error
    }
}