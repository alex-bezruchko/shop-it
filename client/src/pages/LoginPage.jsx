import {Link, Navigate} from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../components/UserContext";
import { useDispatch } from 'react-redux';

import axios from 'axios';

export default function LoginPage() {
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUser} = useContext(UserContext)

    async function handleSubmitLogin(e) {
        e.preventDefault();
        let body = { email, password };
        try {
            const {data} = await axios.post(`/users/login`, body, {withCredentials: true});
            setUser(data);
            setRedirect(true);
            dispatch({ type: 'REMOVE_ALERT', payload: {} });

        } catch(e) {
            dispatch({ type: 'SET_ALERT', payload: {message: 'Invalid credentials', alertType: 'primaryRed'} });
            console.log(e)
        }
    }
    if (redirect) {
        return <Navigate to={'/'} />
    }
    return (
        <div className="p-2 mt-4 flex grow items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center">Login</h1>
                <form className="max-w-md mx-auto" onSubmit={handleSubmitLogin}>
                    <input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        type="email" 
                        placeholder="email"
                    />
                    <input
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password" 
                        placeholder="password"
                    />
                    <button className="primaryBlue">Login</button>
                    <div className="text-center py-2 text-gray-500">
                        Don't have an account yet? 
                        <Link to={'/register'} className="underline text"> Register now</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}