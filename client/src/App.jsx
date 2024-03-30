
import './App.css';
import {Route, Routes} from 'react-router-dom';
import Layout from './layouts/Layout.jsx';
import axios from 'axios';
import { Provider } from 'react-redux';
import store from './store';
import {UserContextProvider} from './components/UserContext.jsx';
import AccountPage from './pages/AccountPage.jsx';
import IndexPage from './pages/IndexPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import StoresPage from './pages/StoresPage.jsx';
import FriendsPage from './pages/FriendsPage.jsx';

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers = true;
function App() {
  return (
    <Provider store={store}>
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route index element={<IndexPage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/stores" element={<StoresPage/>}/>
            <Route path="/account/:subpage?" element={<AccountPage/>}/>
            <Route path="/account/:subpage?/:listId" element={<AccountPage/>}/>
            <Route path="/friends/:subpage?" element={<FriendsPage/>}/>
          </Route>
        </Routes>
      </UserContextProvider>
    </Provider>
  )
}

export default App
