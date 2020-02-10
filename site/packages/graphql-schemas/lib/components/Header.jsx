import React from 'react';
import { Link } from 'react-router-dom';
import { Components } from 'meteor/vulcan:core';

const Header = () => {
  return (
    <header className='navbar navbar-expand navbar-dark'>
      <Link className='navbar-brand' to='/'>GraphQL <b>Schemas</b></Link>
      <div className='navbar-nav ml-auto'>
        <a href='https://github.com/apollinaire/graphql-schemas' className='nav-link'>Github</a>
        <Components.AccountsLoginForm />
      </div>
    </header>
  );
};

export default Header;
