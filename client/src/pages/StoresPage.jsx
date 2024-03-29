import { useEffect, useContext, useState } from "react";
import { UserContext } from "../components/UserContext";
import GoogleSearchComponent from "../components/GoogleSearchComponent";

import { Navigate, useParams, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';

// import { connect } from 'react-redux';
// import { setAlert } from '../../src/actions/alertActions';

export default function StoresPage() {
  
    const dispatch = useDispatch();
    const { ready, user } = useContext(UserContext);
    const [redirect, setRedirect] = useState(false);
    const [currentListLink, setCurrentListLink] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
   
    }, []);


    if (!ready) {
        return 'Loading...';
    }
    if (ready && !user) {
        return <Navigate to={'/login'}/>
    }
    return (
        <div className="mt-10">
            <GoogleSearchComponent/>
        </div>
    )
}