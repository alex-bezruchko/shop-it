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
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState({ email: '', name: '', _id: '' });
    const [ready, setReady] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
    
                if (token && token !== null) {
                    const decodedToken = parseJwt(token);
                    const isExpired = decodedToken.exp < Date.now() / 1000;
                    if (isExpired) {
                        axios.post(`/users/logout`)
                            .then(res => {
                                dispatch({ type: 'SET_ALERT', payload: {message: 'Logged out successfully', alertType: 'primaryGreen'} });
                                localStorage.setItem('token', null);
                                setUser({ email: '', name: '', _id: '' });
                                navigate('/login');
                            }).catch(err => {
                                localStorage.setItem('token', null);
                                setUser({ email: '', name: '', _id: '' });
                                navigate('/login');
                            }); 
                    } else {
                        const { email, name, id } = decodedToken;
                        setUser({email: email, name: name, _id: id});
                        setReady(true);
                    }
                } else {
                    setUser({ email: '', name: '', _id: '' });
                    localStorage.setItem('token', null);
                    setReady(true);
                    navigate('/login');
                    throw new Error('No token found');
                }
            } catch (error) {
                localStorage.setItem('token', null);
                setUser({ email: '', name: '', _id: '' });
                setReady(true);
                navigate('/login');
            }
        };
    
        if (!ready) {
            fetchData();
        }
    }, [ready, navigate]);

    // Function to parse JWT token
    function parseJwt(token) {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    }
    
    return (
        <UserContext.Provider value={{ user, setUser, ready }}>
            {children}
        </UserContext.Provider>
    );
}

