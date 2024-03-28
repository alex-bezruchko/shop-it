import {Link} from "react-router-dom";
import { useState } from "react";
import axios from 'axios';
import { useDispatch } from 'react-redux';

export default function RegisterPage() {
    const dispatch = useDispatch();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    async function registerUser(e) {
        e.preventDefault();
        let body = { name, email, password };
        try {
            let response = await axios.post(`/register`, body);
            if (response) {
                dispatch({ type: 'SET_ALERT', payload: {message: 'Registered successfully', alertType: 'primaryGreen'} });
            }
        } catch(e) {
            dispatch({ type: 'SET_ALERT', payload: {message: ' Unable to register', alertType: 'primaryRed'} });
        }

    }

    return (
        <div className="p-2 mt-4 flex grow items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center">Register</h1>
                <form className="max-w-md mx-auto" onSubmit={registerUser}>
                    <input 
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Jean-Luq Picard"/>
                    <input 
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="email"/>
                    <input 
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="password"/>
                    <button className="primaryBlue">Register</button>
                    <div className="text-center py-2 text-gray-500">
                        Already a member? 
                        <Link to={'/login'} className="underline text"> Login here</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}