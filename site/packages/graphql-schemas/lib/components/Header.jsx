import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { Components, useCurrentUser } from 'meteor/vulcan:core';
import { useSignout } from 'meteor/vulcan:accounts';

const UserOptions = () => {
  const handleSignout = useSignout();
  const { data, loading: userLoading, error: userError } = useCurrentUser();
  if (userLoading || userError) {
    return null;
  }
  if (data.currentUser) {
    const user = data.currentUser;
    return (
      <Dropdown alignRight>
        <Dropdown.Toggle
          style={{
            border: 'none',
            padding: '0 0 0 12px',
            backgroundColor: 'transparent',
            color: 'white',
          }}
        >
          <img className='rounded-circle img-fluid' height={40} width={40} src={user.avatarUrl} />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
  return <Components.AccountsLoginForm />;
};

const Header = () => {
  return (
    <header className='navbar navbar-expand navbar-dark'>
      <Link className='navbar-brand' to='/'>
        GraphQL <b>Schemas</b>
      </Link>
      <div className='navbar-nav ml-auto'>
        <a href='https://github.com/apollinaire/graphql-schemas' className='nav-link'>
          Github
        </a>
        <UserOptions />
      </div>
    </header>
  );
};

export default Header;
