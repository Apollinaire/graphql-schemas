import React from 'react';
import { Components } from 'meteor/vulcan:core';

const Header = () => {
  return (
    <header className='navbar navbar-expand navbar-dark'>
      <div className='navbar-brand'>Logo</div>
      <div className='navbar-nav ml-md-auto'>
        <a href='https://github.com/apollinaire/graphql-schemas'>Github</a>
        <Components.AccountsLoginForm />
      </div>
    </header>
  );
};

export default Header;
