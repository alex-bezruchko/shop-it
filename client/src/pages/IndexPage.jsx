import {useNavigate} from "react-router-dom";
import { useContext } from "react"; // Importing useState
import { UserContext } from "./../contextComponents/UserContext.jsx";

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