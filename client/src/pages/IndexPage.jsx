import {Link, useNavigate} from "react-router-dom";
import Header from "./../components/Header.jsx";
import { useContext } from "react"; // Importing useState
import { UserContext } from "./../components/UserContext.jsx";

export default function IndexPage() {
    const { user } = useContext(UserContext);
    
    const navigate = useNavigate();
    if (!user) {
        navigate('/login');
    }
    return (
        <div>
            index page
        </div>
    )
}