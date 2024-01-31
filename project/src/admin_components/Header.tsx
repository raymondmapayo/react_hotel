import React from 'react';

interface HeaderProps {
  OpenSidebar: () => void;
}

const AdminHeader: React.FC<HeaderProps> = ({ OpenSidebar }) => {
  // Change the variable name to adminEmail
  const adminEmail = localStorage.getItem("adminEmail");

  return (
    <header className='header' style={{ color: 'white', display: 'flex', justifyContent: 'flex-end', backgroundColor: "black"}}>
      {adminEmail ? (
        <div className='header' style={{ marginLeft: '120px' }}>
          Welcome, {adminEmail}!
        </div>
      ) : (
        <div className='header'></div>
      )}
    </header>
  );
};

export default AdminHeader;
