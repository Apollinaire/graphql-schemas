import React from 'react';
import Header from './Header';
import Footer from './Footer';

const layoutRowStyle = {
  minHeight: '90vh',
};

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div style={layoutRowStyle}>{children}</div>
      <Footer />
    </>
  );
};

export default Layout;
