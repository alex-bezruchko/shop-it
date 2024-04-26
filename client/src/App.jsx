
import React, { lazy, Suspense } from 'react'
import {Route, Routes} from 'react-router-dom';
import axios from 'axios';
import { Provider } from 'react-redux';
import store from './store';
import {UserContextProvider} from './components/UserContext.jsx';
import { PlaceProvider } from './components/PlaceContext.jsx';
import { RequestContextProvider } from './components/RequestContext.jsx'; // Import RequestContextProvider
import Layout from './layouts/Layout.jsx';

const AccountPage = lazy(() => import('./pages/AccountPage.jsx'));
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage.jsx'));
const NewPasswordPage = lazy(() => import('./pages/NewPasswordPage.jsx'));
const FriendsPage = lazy(() => import('./pages/FriendsPage.jsx'));
const PlacesPage = lazy(() => import('./pages/PlacesPage.jsx'))  
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

import { LoadScript } from '@react-google-maps/api';
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API;
axios.defaults.withCredentials = true;
axios.defaults.headers = true;

// Wrap lazy-loaded components with Suspense and specify a fallback UI
const SuspenseLoader = ({ children }) => (
  <Suspense fallback={<div><img src="/loading.gif" className='w-8 mx-auto mb-6'/></div>}>
    {children}
  </Suspense>
);

function App() {
  return (
    <Provider store={store}>
      <UserContextProvider>
        <PlaceProvider>
          <RequestContextProvider>
            <LoadScript googleMapsApiKey={googleApiKey}>
              <Routes>
                <Route path="/" element={<Layout/>}>
                  <Route index element={<SuspenseLoader><HomePage/></SuspenseLoader>}/>
                  <Route path="/login" element={<SuspenseLoader><LoginPage/></SuspenseLoader>}/>
                  <Route path="/register" element={<SuspenseLoader><RegisterPage /></SuspenseLoader>}/>
                  <Route path="/password-request" element={<SuspenseLoader><ResetPasswordPage /></SuspenseLoader>} />
                  <Route path="/password-reset" element={<SuspenseLoader><NewPasswordPage /></SuspenseLoader>} />
                  <Route path="/account/:subpage?" element={<SuspenseLoader><AccountPage /></SuspenseLoader>} />
                  <Route path="/account/:subpage?/:listId" element={<SuspenseLoader><AccountPage /></SuspenseLoader>} />
                  <Route path="/friends/:subpage?" element={<SuspenseLoader><FriendsPage /></SuspenseLoader>} />
                  <Route path="/friends/:subpage?/:friendId" element={<SuspenseLoader><FriendsPage /></SuspenseLoader>} />
                  <Route path="/places/:subpage?" element={<SuspenseLoader><PlacesPage /></SuspenseLoader>} />
                  <Route path="*" element={<SuspenseLoader><NotFoundPage /></SuspenseLoader>} />
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
