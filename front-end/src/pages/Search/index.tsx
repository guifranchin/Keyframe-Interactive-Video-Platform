import React, {useEffect, useState} from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { VideoList } from '../../components/VideoList';
import { useLoading } from '../../context/loading_context';
import { SearchVideos, VideoData, VideoOrderBy } from '../../services/video';

export const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate()
  const loading = useLoading()
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState(10)
  const [query, setQuery] = useState("")
  const [orderBy, setOrderBy] = useState(VideoOrderBy.Recent);
  const [videos, setVideos] = useState<VideoData[]>([])

  useEffect(() => {
    const query = searchParams.get("query");
    if(!query){
        navigate('/')
        return;
    }
    getVideos(page, query, orderBy)
    setQuery(query)
  }, [])

  const getVideos = async (page: number, query: string, orderBy: number, append?: boolean) => {
    loading.show()
    try {
        const res = await SearchVideos(query, page, rows, orderBy)
        if(append){
            const newVideos = [...videos]
            newVideos.push(...res)
            setVideos(newVideos)
        } else {
            setVideos([...res])
        }
        
    } catch (error) {
        
    }
    loading.hide()
  }
  return (
    <VideoList
        flexDirection='row'
        rows={rows}
        videosData={videos}
        showCreatorName
        changePage={() => {
            setPage(prev => prev+1)
            getVideos(page+1, query, orderBy, true)
        }}
        orderBy={orderBy}
        changeOrderBy={(order: number) => {
            setOrderBy(order);
            setPage(1);
            getVideos(1, query, order)
        }}
    />
  )
}
