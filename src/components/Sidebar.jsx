import { useContext } from "react"
import { MainContext } from "./TaskProvider"
import PlaceholderPFP from "../assets/PlaceholderPFP.jpg"


export default function Sidebar(){
    const { userInfo } = useContext(MainContext)
    return (
        <>
            <div className="w-1/5 outline flex flex-col h-full">
                <div className="flex flex-col items-center">
                    <img src={PlaceholderPFP} alt="User profile picture" width="50px" height="50px" className="py-3"/>
                    <h1>{userInfo.name}</h1>
                </div>
                <div>
                    <p>Crazy statistics</p>
                </div>
            </div>
        </>
    )
}