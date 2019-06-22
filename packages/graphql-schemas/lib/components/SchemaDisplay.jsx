import React from 'react';
import Dagre from './Dagre';
import Voyager from './Voyager';

const SchemaDisplay = props => {
  return (
    <div>
      <div>
        <Dagre {...props} />
      </div>
      <div>
        <Voyager {...props} />
      </div>
    </div>
  );
};

export default SchemaDisplay;
