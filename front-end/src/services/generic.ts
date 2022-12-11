import axios from 'axios'

function getInstance(multipart?: boolean) {
    const baseURL = process.env.REACT_APP_API_ENDPOINT
    const headers = {
        'Content-Type': !multipart ? 'application/json' : 'multipart/form-data',
        token: localStorage.getItem("token")
    }

    return axios.create({
        baseURL,
        headers
    })
}

export async function get(endpoint: string){
    try {
        const axios = getInstance()
        const res = await axios.get(endpoint)
        return res.data
    } catch (error: any) {
        throw error.response
    }
}

export async function post(endpoint: string, body: any, multipart?: boolean){
    try {
        const axios = getInstance(multipart)
        const res = await axios.post(endpoint, body)
        return res.data
    } catch (error: any) {
        throw error.response
    }
}

export async function put(endpoint: string, body: any, multipart?: boolean){
    try {
        const axios = getInstance(multipart)
        const res = await axios.put(endpoint, body)
        return res.data
    } catch (error: any) {
        throw error.response
    }
}

export async function del(endpoint: string){
    try {
        const axios = getInstance()
        const res = await axios.delete(endpoint)
        return res.data
    } catch (error: any) {
        throw error.response
    }
}