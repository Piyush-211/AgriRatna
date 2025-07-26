import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import AddEquip from './pages/AddEquip';
import IndexPage from './pages/First';
import EquipmentsList from './pages/BookEquip'
import { useState } from 'react';
import RefrshHandler from './RefereshHandler';
import Profile from './pages/EditProfile';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />
  }

  return (
    <div className="App">
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path='/' element={<IndexPage/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<PrivateRoute element={<Home />} />} />
         <Route path='/addEquip' element={<PrivateRoute element={<AddEquip />} />} />
         <Route path='/disEquip' element={<PrivateRoute element={<EquipmentsList />} />} />
        <Route path='/editProfile' element={<PrivateRoute element={<Profile />} />} />

      </Routes>
    </div>
  );
}

export default App;
