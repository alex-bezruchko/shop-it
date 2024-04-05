import {Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { Validation } from "../components/Validation";
import ValidationErrorDisplay from "./../components/ValidationErrors";

export default function RegisterPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);

    async function registerUser(e) {
        e.preventDefault();
        let body = { name, email, password };
        
        const validationErrors = Validation(body, true);
        if (validationErrors.length > 0) {
            // Handle validation errors here
            setErrors(validationErrors)
        } else {
            setErrors([])

            try {
                body.incomingRequests = [];
                body.outgoingRequests = [];
                let response = await axios.post(`/users/register`, body);
                if (response) {
                    dispatch({ type: 'SET_ALERT', payload: {message: 'Registered successfully', alertType: 'primaryGreen'} });
                    navigate('/login')
                }
            } catch(e) {
                dispatch({ type: 'SET_ALERT', payload: {message: ' Unable to register', alertType: 'primaryRed'} });
            }
        }
    }

    return (
        <div className="p-2 mt-4 flex grow items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center">Register</h1>
                {errors.length > 0 && (
                    <ValidationErrorDisplay errors={errors} />
                )}
                <form className="max-w-md mx-auto mt-5" onSubmit={registerUser}>
                    <input 
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="mb-2"
                        placeholder="Jean-Luq Picard"/>
                    <input 
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="mb-2"
                        placeholder="email"/>
                    <input 
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="mb-2"
                        placeholder="password"/>
                    <button className="primaryBlue w-full">Register</button>
                    <div className="text-center py-2 text-gray-500">
                        Already a member? 
                        <Link to={'/login'} className="underline text"> Login here</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}