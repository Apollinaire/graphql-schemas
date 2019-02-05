import React from 'react';

function withIntrospection(wrappedComponent){
  const res = class extends React.Component{
    render(){
      return null;
    }
  }
  res.displayName = `withIntrospection(${wrappedComponent.displayName || ''})`;
  return res;
}

export default withIntrospection;