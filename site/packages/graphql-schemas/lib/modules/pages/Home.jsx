import React from 'react';
import { registerComponent, Components } from 'meteor/vulcan:core';

class Home extends React.Component {
  render() {
    return (
      <div>
        <Components.SchemaList />
      </div>
    );
  }
}
registerComponent({ name: 'Home', component: Home });
