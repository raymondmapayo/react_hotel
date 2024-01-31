import React from 'react';
import { FaBook, FaComments, FaHistory, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {
  BsCreditCard,
  BsFillArchiveFill,

} from 'react-icons/bs';

interface SidebarProps {
  openSidebarToggle: boolean;
  OpenSidebar: () => void;
  
}

const UserSidebar: React.FC<SidebarProps> = ({ openSidebarToggle, OpenSidebar }) => {
    
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='sidebar-title'>
        <div className='sidebar-brand'>
        </div>
        <span className='icon close_icon' onClick={OpenSidebar}>
          X
        </span>
      </div>
      <ul className='sidebar-list'>
        <li className='sidebar-list-item'>
          <Link to="/reserve">
            <BsFillArchiveFill className='icon'/> Rooms
          </Link>
        </li>   
          <li className='sidebar-list-item'>
          <Link to="/reservation">
            <FaBook className='icon'/> Reservation
          </Link>
        </li>
         <li className='sidebar-list-item'>
          <Link to="/history">
            <FaHistory className='icon'/> User History Room
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/checkout">
            <BsCreditCard className='icon'/> My Payment
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/auth">
            <FaComments className='icon'/> Chat
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/">
            <FaSignOutAlt className='icon'/> Logout
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default UserSidebar;
