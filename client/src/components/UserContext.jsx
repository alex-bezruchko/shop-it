import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { useDispatch } from 'react-redux';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState({ email: '', name: '', _id: '' });
    const [ready, setReady] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!ready) {
            axios.get(`/users/profile`, { withCredentials: true })
                .then(({ data }) => {
                    setUser(data);
                    setReady(true);
                    // initializePusher(data._id);
                    // localStorage.setItem('pusherConnectionMade', 'true');
                })
                .catch(error => {
                    setUser({ email: '', name: '', _id: '' });
                    setReady(true);
                    console.log(error);
                });
        } else {
            setReady(true);
        }
    }, [ready]);

    

    return (
        <UserContext.Provider value={{ user, setUser, ready }}>
            {children}
        </UserContext.Provider>
    );
}
