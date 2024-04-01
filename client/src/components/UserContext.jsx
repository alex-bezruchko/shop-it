import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const UserContext = createContext({});

export function UserContextProvider({children}) {
    const [user, setUser] = useState({email: '', name: '', _id: ''});
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if(!user._id) {
            axios.get(`/users/profile`, {withCredentials: true}).then(({data}) => {
                setUser(data);
                setReady(true);
                console.log(user)
            }).catch(error => {
                console.log(error)
            });
        }
    }, []);
    console.log(user)
    return (
        <UserContext.Provider value={{user, setUser, ready}}>
            {children}
        </UserContext.Provider>
    )
}
