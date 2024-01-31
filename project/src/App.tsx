import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './Apps.css';
import Login from './LoginPage/Login';

// Add AdminLogin component
import UserList from './admin_components/UsersList';
import EditUser from './admin_components/EditUser';
import EditRoom from './admin_components/EditRoom';
import AddUser from './admin_components/AddUser';
import Room from './admin_components/Room';
import AddRoom from './admin_components/AddRoom';
import UserSidebar from './user_componets/UserSidebar';
import UserHeader from './user_componets/UserHeader';
import AdminHeader from './admin_components/Header';
import AdminSidebar from './admin_components/Sidebar';
import UserRent from './user_componets/UserRent';

import Roomreserve from './user_componets/Roomreserve';
import Dashboard from './admin_components/Dashboard';
import Register from './RegisterPage/Register';
import UserReservation from './user_componets/UserReservation';
import UserProceed from './user_componets/UserProceed';
import UserHistory from './user_componets/UserHistory';
import UserPayment from './user_componets/UserPayment';
import UserPay_history from './user_componets/UserPay_history';
import ClientHistory from './admin_components/ClientHistory';
import Admin from './AdminPage/Admin';
import AdminAuth from './chat/AdminAuth';
import Auth from './chat/Auth';

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const loggedIn = localStorage.getItem('logged') === 'true';
    setIsAuthenticated(loggedIn);
  }, []);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const isLoginPage = location.pathname === '/';
  const isAdminLogin = location.pathname === '/admin/login';
  const isAdminPage = location.pathname === '/admin';
  const isAuth = location.pathname === '/auth';
  const isRegisterPage = location.pathname === '/register';
  const isRoomServePage = location.pathname === '/roomserve';
  const isReservePage = location.pathname === '/reserve';
  const isUserReservationPage = location.pathname === '/reservation';
  const isUserHistorytionPage = location.pathname === '/history';
  const isUserPaymentPage = location.pathname === '/payment';
  const isUserPayHistoryPage = location.pathname === '/checkout';
  const isUserRentPage = /^\/(reserve|rent)\/\d+$/.test(location.pathname);
  const isUserProceedRentPage = /^\/(reservation|proceed)\/\d+$/.test(location.pathname);
  const isPaymetRentPage = /^\/(payment|payment)\/\d+$/.test(location.pathname);

// Determine whether to show the admin or client header
  const showAdminHeader = !isRoomServePage && !isReservePage && !isUserRentPage && !isUserReservationPage && !isUserProceedRentPage && !isUserHistorytionPage && isUserPaymentPage && isPaymetRentPage && isUserPayHistoryPage && isAuth;
  const showUserHeader = isRoomServePage || isReservePage || isUserRentPage || isUserReservationPage || isUserProceedRentPage || isUserHistorytionPage || isUserPaymentPage || isPaymetRentPage || isUserPayHistoryPage || isAuth;

  return (
    <>
      {!isLoginPage && !isRegisterPage && !isAdminLogin && !isAdminPage && (
        <div className={`grid-container ${isRoomServePage ? 'client' : ''}`}>
          {showAdminHeader ? (
            <AdminHeader OpenSidebar={OpenSidebar} />
          ) : showUserHeader ? (
            <UserHeader OpenSidebar={OpenSidebar} />
          ) : null}
          {isRoomServePage || isReservePage || isUserRentPage || isUserReservationPage || isUserProceedRentPage || isUserHistorytionPage || isUserPaymentPage || isPaymetRentPage || isUserPayHistoryPage || isAuth? (
            <UserSidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
          ) : (
            <AdminSidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
          )}
          <div className='content-container'>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/userlist" element={<UserList />} />
              <Route path="/reserve" element={<Roomreserve />} />
              <Route path="/edit/:id" element={<EditUser />} />
              <Route path="/rooms/:id/edit" element={<EditRoom />} />
              <Route path="/add" element={<AddUser />} />
              <Route path="/rooms" element={<Room />} />
              <Route path="/addrooms" element={<AddRoom />} />
              <Route path="/rent/:id" element={<UserRent />} />
              <Route path="/proceed/:id" element={<UserProceed />} />
              <Route path="/payment/:id" element={<UserPayment />} />
              <Route path="/reservation" element={<UserReservation />} />
              <Route path="/reservations" element={<ClientHistory />} />
              <Route path="/payment" element={<UserPayment />} />
              <Route path="/history" element={<UserHistory />} />
              <Route path="/checkout" element={<UserPay_history />} />
              <Route path="/admin" element={<Admin />} />
               <Route path="/auth" element={<Auth />} />
               <Route path="/adminauth/:id" element={<AdminAuth />} />

            </Routes>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
}

export default App;