import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { Validation } from "../components/utilsComponents/Validation";
import ValidationErrorDisplay from "./../components/utilsComponents/ValidationErrors";

export default function NewPasswordPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const location = useLocation();
    const token = new URLSearchParams(location.search).get('token');
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    async function handleNewPassword(e) {
        e.preventDefault();
        let body = { newPassword, confirmPassword };
        const validationErrors = Validation(body, true);
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors([])
        }
        try {
            setLoading(true);
            console.log('token', token)
            const response = await axios.post('/users/password-reset', { newPassword, token }, { withCredentials: true });
            dispatch({ type: 'SET_ALERT', payload: { message: response.data.message, alertType: 'primaryGreen' } });
            navigate('/login')
        } catch (error) {
            console.log('error', error)
            dispatch({ type: 'SET_ALERT', payload: { message: error.response.data.message, alertType: 'primaryRed' } });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-2 mt-4 flex grow items-center justify-around">
            <div className="mb-64 w-full mx-5">
                <h1 className="text-3xl lora text-center mb-6">Reset Password</h1>
                { loading && (
                    <img src="/loading.gif" className='w-8 mx-auto my-6'/>
                )}
                {errors.length > 0 && (
                    <ValidationErrorDisplay errors={errors} />
                )}
                <div>
                    <form  className="max-w-md mx-auto mt-5" onSubmit={handleNewPassword}>
                        <label htmlFor="newPassword" className="block text-md nunito font-medium leading-6 text-gray-900 pb-0">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="mb-2"
                        />
                        <label htmlFor="confirmPassword" className="block text-md nunito font-medium leading-6 text-gray-900 pb-0">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mb-2"
                        />
                        <button aria-label="Loading Or Confirm Password button" type="submit" className="primaryBlue nunito w-full mt-3" disabled={loading}>
                            {loading ? 'Loading...' : 'Confirm Password'}
                        </button>
                    </form>
                    <div className="text-center nunito py-2 text-gray-500">
                        Already a member? 
                        <Link to={'/login'} className="ml-3 nunito text text-primaryBlue"> Login here</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}