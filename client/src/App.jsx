
import {Route, Routes} from 'react-router-dom';
import Layout from './layouts/Layout.jsx';
import axios from 'axios';
import { Provider } from 'react-redux';
import store from './store';
import {UserContextProvider} from './components/UserContext.jsx';
import { PlaceProvider } from './components/PlaceContext.jsx';
import { RequestContextProvider } from './components/RequestContext.jsx'; // Import RequestContextProvider
import AccountPage from './pages/AccountPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import NewPasswordPage from './pages/NewPasswordPage.jsx';
import FriendsPage from './pages/FriendsPage.jsx';
import PlacesPage from './pages/PlacesPage.jsx';
import { LoadScript } from '@react-google-maps/api';
import NotFoundPage from './pages/NotFoundPage.jsx';

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API;
axios.defaults.withCredentials = true;
axios.defaults.headers = true;

function App() {
  return (
    <Provider store={store}>
      <UserContextProvider>
        <PlaceProvider>
          <RequestContextProvider>
            <LoadScript googleMapsApiKey={googleApiKey}>
              <Routes>
                <Route path="/" element={<Layout/>}>
                  <Route index element={<AccountPage/>}/>
                  <Route path="/login" element={<LoginPage/>}/>
                  <Route path="/register" element={<RegisterPage/>}/>
                  <Route path="/password-request" element={<ResetPasswordPage/>}/>
                  <Route path="/password-reset" element={<NewPasswordPage />} />
                  <Route path="/account/:subpage?" element={<AccountPage/>}/>
                  <Route path="/account/:subpage?/:listId" element={<AccountPage/>}/>
                  <Route path="/friends/:subpage?" element={<FriendsPage/>}/>
                  <Route path="/friends/:subpage?/:friendId" element={<FriendsPage />} />
                  <Route path="/places/:subpage?" element={<PlacesPage/>}/>
                  <Route path="*" element={<NotFoundPage />} />

                </Route>
              </Routes>

            </LoadScript>
          </RequestContextProvider>
        </PlaceProvider>
      </UserContextProvider>
    </Provider>
  )
}

export default App
