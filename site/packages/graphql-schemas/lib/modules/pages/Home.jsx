import React from 'react';
import { registerComponent, Components } from 'meteor/vulcan:core';

class Home extends React.Component {
  render() {
    return (
      <div>
        <Components.FeaturedSchemas limit={6} />
      </div>
    );
  }
}
registerComponent({ name: 'Home', component: Home });
