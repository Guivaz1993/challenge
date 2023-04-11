import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import { getItem } from '../utils/storage';

function ProtectedRoutes({ redirectTo }: { redirectTo: string }) {
  const isAuth = getItem('token');
  return isAuth ? <Outlet /> : <Navigate to={redirectTo} />;
}

function MyRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/login' element={<Login />} />
      <Route element={<ProtectedRoutes redirectTo="/" />}>
      <Route path='/home' element={<Home />} />
      </Route>

      {/* <Route path="/room/:id" element={<Room />} /> */}
    </Routes>
  );
}

export default MyRoutes;

