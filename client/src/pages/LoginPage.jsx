import {Link, Navigate} from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../components/UserContext";
import { useDispatch } from 'react-redux';
import { Validation } from "../components/Validation";
import ValidationErrorDisplay from "./../components/ValidationErrors";

import axios from 'axios';

export default function LoginPage() {
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [errors, setErrors] = useState([]);
    const { ready, user, setUser } = useContext(UserContext);
    const [loading, setLoading] = useState(false);

    async function handleSubmitLogin(e) {
        e.preventDefault();
        let body = { email, password };
        const validationErrors = Validation(body);
        if (validationErrors.length > 0) {
            setErrors(validationErrors)
        } else {
            setLoading(true)
            try {
                setErrors([])
                const {data} = await axios.post(`/users/login`, body, {withCredentials: true});
                setUser(data);
                setLoading(false)
                setRedirect(true);
                dispatch({ type: 'REMOVE_ALERT', payload: {} });
    
            } catch(e) {
                setLoading(false)
                dispatch({ type: 'SET_ALERT', payload: {message: 'Invalid credentials', alertType: 'primaryRed'} });
                console.log(e)
            }
        }
        
    }
    if (!ready) {
        let htmlString = '<div><img src="https://media.tenor.com/wpSo-8CrXqUAAAAi/loading-loading-forever.gif" class="size-10 mt-6 mx-auto mb-6"></div>'
        return (
            <div dangerouslySetInnerHTML={{ __html: htmlString }} />
        )
    }
    if (ready && !user) {
        return <Navigate to={'/login'}/>
    }
    return (
        <div className="p-2 mt-4 flex grow items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center">Login</h1>
                { loading && (
                    <img src="https://media.tenor.com/wpSo-8CrXqUAAAAi/loading-loading-forever.gif" className='size-20 mx-auto my-6'/>
                )}
                {errors.length > 0 && (
                    <ValidationErrorDisplay errors={errors} className="mb-2"/>
                )}    
                <form className="max-w-md mx-auto mt-5" onSubmit={handleSubmitLogin}>
                    <input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        type="email" 
                        placeholder="email"
                        className="mb-2"
                    />
                    <input
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password" 
                        placeholder="password"
                        className="mb-2"
                    />
                    <button className="primaryBlue w-full">Login</button>
                    <div className="text-center py-2 text-gray-500">
                        Don't have an account yet? 
                        <Link to={'/register'} className="underline text"> Register now</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}