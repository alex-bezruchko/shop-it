
import './App.css';
import {Route, Routes} from 'react-router-dom';
import Layout from './layouts/Layout.jsx';
import axios from 'axios';
import { Provider } from 'react-redux';
import store from './store';
import {UserContextProvider} from './components/UserContext.jsx';
import { PlaceProvider } from './components/PlaceContext.jsx';
import AccountPage from './pages/AccountPage.jsx';
import IndexPage from './pages/IndexPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import FriendsPage from './pages/FriendsPage.jsx';
import PlacesPage from './pages/PlacesPage.jsx';
import { LoadScript } from '@react-google-maps/api';

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API;
axios.defaults.withCredentials = true;
axios.defaults.headers = true;
function App() {
  return (
    <Provider store={store}>
      <UserContextProvider>
        <PlaceProvider>
          <LoadScript googleMapsApiKey={googleApiKey}>
            <Routes>
              <Route path="/" element={<Layout/>}>
                <Route index element={<AccountPage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                {/* <Route path="/stores" element={<StoresPage/>}/> */}
                <Route path="/account/:subpage?" element={<AccountPage/>}/>
                <Route path="/account/:subpage?/:listId" element={<AccountPage/>}/>
                <Route path="/friends/:subpage?" element={<FriendsPage/>}/>
                <Route path="/friends/:subpage?/:friendId" element={<FriendsPage />} />
                <Route path="/places/:subpage?" element={<PlacesPage/>}/>
              </Route>
            </Routes>
          </LoadScript>
        </PlaceProvider>
      </UserContextProvider>
    </Provider>
  )
}

export default App
