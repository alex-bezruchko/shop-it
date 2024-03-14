
import './App.css';
import {Route, Routes} from 'react-router-dom';
import Layout from './layouts/Layout.jsx';
import axios from 'axios';
import {UserContextProvider} from './components/UserContext.jsx';
import AccountPage from './pages/AccountPage.jsx';
import IndexPage from './pages/IndexPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

axios.defaults.baseURL = import.meta.env.VIVITE_SERVER_URL;
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/account" element={<AccountPage/>}/>
          <Route index element={<IndexPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App
