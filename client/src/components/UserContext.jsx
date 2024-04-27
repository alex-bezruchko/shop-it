// import { createContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from 'axios';

// export const UserContext = createContext({});

// export function UserContextProvider({ children }) {
//     const [user, setUser] = useState({ email: '', name: '', _id: '' });
//     const [ready, setReady] = useState(false);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const { data } = await axios.get(`/users/profile`, { withCredentials: true });
//                 setUser(data);
//                 setReady(true);
//             } catch (error) {
//                 setUser({ email: '', name: '', _id: '' });
//                 setReady(true);
//                 navigate(`/login`);
//             }
//         };

//         if (!ready) {
//             fetchData();
//         }
//     }, [ready, navigate]);
    
//     return (
//         <UserContext.Provider value={{ user, setUser, ready }}>
//             {children}
//         </UserContext.Provider>
//     );
// }
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState({ email: '', name: '', _id: '' });
    const [ready, setReady] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem('token');
            if (token && token !== null) {
                try {
                    const decodedToken = parseJwt(token);
                    const isExpired = decodedToken.exp < Date.now() / 1000;
                    if (isExpired) {
                        await handleExpiredToken();
                    } else {
                        setUser({
                            email: decodedToken.email,
                            name: decodedToken.name,
                            _id: decodedToken.id
                        });
                        setReady(true);
                    }
                } catch (error) {
                    console.error('Error decoding token:', error);
                    setUser({ email: '', name: '', _id: '' });
                    setReady(true);
                }
            } else {
                handleMissingToken();
            }
        };

        checkToken();
    }, []);

    const handleExpiredToken = async () => {
        try {
            await axios.post(`/users/logout`);
            localStorage.removeItem('token');
            setUser({ email: '', name: '', _id: '' });
            setReady(true);
        } catch (error) {
            console.error('Error logging out:', error);
            setReady(true);
        }
    };

    const handleMissingToken = () => {
        setUser({ email: '', name: '', _id: '' });
        setReady(true);
        navigate('/login');
    };

    function parseJwt(token) {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    }

    // console.log('user', user);
    // console.log('ready', ready);
    
    return (
        <UserContext.Provider value={{ user, setUser, ready }}>
            {children}
        </UserContext.Provider>
    );
}