import React from 'react';

interface HeaderProps {
  OpenSidebar: () => void;
}

const UserHeader: React.FC<HeaderProps> = ({ OpenSidebar }) => {
  const userEmail = localStorage.getItem("userEmail");

  return (
    <header className='header' style={{ color: 'white', display: 'flex', justifyContent: 'flex-end', backgroundColor: "black"}}>
      {userEmail ? (
        <div className='header' style={{ marginLeft: '120px' }}>
          Welcome, {userEmail}!
        </div>
      ) : (
        <div className='header'></div>
      )}
    </header>
  );
};

export default UserHeader;
