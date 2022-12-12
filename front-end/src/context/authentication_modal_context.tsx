import React, {useContext, createContext, useState} from 'react'
import { AuthenticationModal } from '../components/AuthenticationModal'

export interface ContextInfo{
    show(): void
}

const contextDefault : ContextInfo = {
    show: () => {}
}

const ModalContext = createContext<ContextInfo>(contextDefault)

export function useAuthenticationModal(){
    return useContext(ModalContext)
}

interface Props{
    children: React.ReactNode
}

export function ModalProvider({children} : Props){
    const [open, setOpen] = useState(false)

    const show = () => {
        setOpen(true)
    }

    const doneCallback = () => {
        setOpen(false)
    }

    return (
        <ModalContext.Provider value={{show}}>
            <AuthenticationModal open={open} setOpen={setOpen} doneCallback={doneCallback}/>
            {children}
        </ModalContext.Provider>
    )
}