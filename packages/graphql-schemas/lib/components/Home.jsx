import React from 'react';
import { registerComponent, Components } from 'meteor/vulcan:core';
import EndpointFetch from './EndpointFetch';

class Home extends React.Component {
  state = {
    endpoint: '',
  };
  handleEnpointChange = e => {
    this.setState({ endpoint: e.target.value });
  };
  render() {
    return (
      <div>
        <Components.FormControl
          type="search"
          placeholder="sidebar.io/graphql"
          value={this.state.endpoint}
          onChange={this.handleEnpointChange}
        />
        <div>
          <EndpointFetch endpoint={this.state.endpoint}/>
        </div>
      </div>
    );
  }
}
registerComponent({ name: 'Home', component: Home });
