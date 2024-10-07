import {createContext, useState} from 'react'

const MainContext = createContext();

// eslint-disable-next-line react/prop-types
const TaskProvider = ({ children }) => {
    const [tasks, setTasks ] = useState("No");
    const [userInfo, setUserInfo] = useState({name: "John"})

    return (
        <MainContext.Provider value={{tasks, setTasks, userInfo, setUserInfo}}>
            {children}
        </MainContext.Provider>     
    )
}

export { TaskProvider, MainContext }