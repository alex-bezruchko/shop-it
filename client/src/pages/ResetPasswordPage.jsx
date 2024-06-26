import {Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { Validation } from "../components/utilsComponents/Validation";
import ValidationErrorDisplay from "./../components/utilsComponents/ValidationErrors";

export default function ResetPasswordPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    async function initiatePasswordReset(e) {
        e.preventDefault();
        let body = { email };
        console.log(body)
        
        const validationErrors = Validation(body, true);
        if (validationErrors.length > 0) {
            // Handle validation errors here
            setErrors(validationErrors);
        } else {
            setErrors([]);
        }
        try {
            setLoading(true);
            const response = await axios.post('/users/initiate-reset-password', { email, withCredentials: false });
            dispatch({ type: 'SET_ALERT', payload: { message: response.data.message, alertType: 'primaryGreen' } });
            navigate('/login');
        } catch (error) {
            console.log('error', error)
            setLoading(false)
            dispatch({ type: 'SET_ALERT', payload: { message: error.response.data.message, alertType: 'primaryRed' } });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-2 mt-4 flex grow items-center justify-around">
            <div className="mb-64 w-full">
                <h1 className="text-3xl lora text-center mb-6">Reset Password</h1>
                { loading && (
                    <img src="/loading.gif" className='w-8 mx-auto my-6'/>
                )}
                {errors.length > 0 && (
                    <ValidationErrorDisplay errors={errors} />
                )}
                <div>
                <form className="max-w-md mx-auto mt-0" onSubmit={initiatePasswordReset}>
                    <div>
                        <label htmlFor="email" className="block text-lg nunito font-medium leading-6 text-gray-900 pb-3">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button aria-label="Loading Or Reset Password button" type="submit" className="primaryBlue w-full mt-4 nunito text-md" disabled={loading}>
                        {loading ? 'Loading...' : 'Reset Password'}
                    </button>
                </form>
                <div className="text-center py-2 nunito text-gray-500">
                        Already a member? 
                        <Link to={'/login'} className="ml-3 nunito text text-primaryBlue"> Login here</Link>
                    </div>
            </div>
            </div>
        </div>
    )
}