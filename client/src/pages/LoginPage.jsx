import { Link, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../components/contextComponents/UserContext"
import { useDispatch } from 'react-redux';
import { Validation } from "../components/utilsComponents/Validation";
import ValidationErrorDisplay from "./../components/utilsComponents/ValidationErrors";

import axios from 'axios';

export default function LoginPage() {
    const dispatch = useDispatch();
    const { setUser } = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [errors, setErrors] = useState([]);
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
                const response = await axios.post(`/users/login`, body, {withCredentials: true});
                setUser(response.data.user);
                localStorage.setItem('token', response.data.token);
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
    if (redirect) {
        return <Navigate to={'/account'}/>
    }
    return (
        <div className="p-2 mt-4 flex grow items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl lora text-center mb-5">Login</h1>
                { loading && (
                    <img src="/loading.gif" className='size-8 mx-auto my-6'/>

                )}
                {errors.length > 0 && (
                    <ValidationErrorDisplay errors={errors} className="mb-0"/>
                )}    
                <form className="max-w-md mx-auto mt-0" onSubmit={handleSubmitLogin}>
                    <input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        type="email" 
                        placeholder="email"
                        className="mb-2 mt-0"
                    />
                    <input
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password" 
                        placeholder="password"
                        className="mb-2"
                    />
                    <button aria-label="Login button" className="primaryBlue w-full nunito mt-4">Login</button>
                    <div className="text-center nunito py-2 text-gray-500 mt-2">
                        Don't have an account yet? 
                        <Link to={'/register'} className="ml-3 nunito text text-primaryBlue"> Register now</Link>
                    </div>
                    <div className="text-center nunito py-2 pt-0 text-gray-500">
                        Forgot your password? 
                        <Link to={'/password-request'} className="ml-3 nunito text text-primaryBlue"> Reset Password</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}