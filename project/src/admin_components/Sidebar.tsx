import React from 'react';

import { Link } from 'react-router-dom';
import {
  BsBuilding,
  BsFile,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsListCheck,
  BsGearWideConnected,
} from 'react-icons/bs';
import { FaSignOutAlt } from 'react-icons/fa';

interface SidebarProps {
  openSidebarToggle: boolean;
  OpenSidebar: () => void;
}

const AdminSidebar: React.FC<SidebarProps> = ({ openSidebarToggle, OpenSidebar }) => {
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='sidebar-title'>
        <div className='sidebar-brand' style={{color: 'white'}}>
          <BsBuilding className='icon_header' /> HOTEL
        </div>
        <span className='icon close_icon' onClick={OpenSidebar}>
          X
        </span>
      </div>
      <ul className='sidebar-list'>
        <li className='sidebar-list-item'>
          <Link to="/dashboard">
            <BsFile className='icon'/> Dashboard
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/rooms">
            <BsFillArchiveFill className='icon'/> Rooms
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/reservations">
            <BsListCheck className='icon'/> Client History Pay List
          </Link>
        </li>
        
        <li className='sidebar-list-item'>
          <Link to="/userlist">
            <BsPeopleFill className='icon'/> Customers
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/admin">
            <FaSignOutAlt className='icon'/> Logout
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default AdminSidebar;
