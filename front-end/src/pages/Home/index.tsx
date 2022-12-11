import React, {useState, useEffect, useRef} from 'react'
import { VideoList } from '../../components/VideoList'
import { useLoading } from '../../context/loading_context'
import { getHomeVideos, VideoData } from '../../services/video'
import {Box} from '@mui/system'

export const Home = () => {
  const [videos, setVideos] = useState<VideoData[]>([])
  const [page, setPage] = useState(1)
  const rows = useRef(20)
  const loading = useLoading()

  useEffect(() => {
    getVideos(page)
  }, [])

  const getVideos = async (page: number) => {
    loading.show()
    try {
        const res = await getHomeVideos(page, rows.current)
        const v = videos
        v.push(...res)
        setVideos(v)
    } catch (error) {
        
    }
    loading.hide()
  }


  return (
    <Box sx={{width: '100%', p: '10px'}}>
        <VideoList
        videosData={videos}
        flexDirection='row'
        rows={rows.current}
        showCreatorName={true}
        changePage={() => {
            setPage(prev => prev+1)
            getVideos(page+1)
        }}
    />
    </Box>
  )
}
