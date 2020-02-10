import React from 'react';
import { registerComponent } from 'meteor/vulcan:core';
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

registerComponent({ name: 'Layout', component: Layout });
