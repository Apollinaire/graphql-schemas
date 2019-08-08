import React from 'react';
import { registerComponent, Components } from 'meteor/vulcan:core';
import { buildClientSchema, introspectionFromSchema } from 'graphql';
import SchemaDisplay from './SchemaDisplay';
import TextTypes from './TextTypes';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { getTypeGraph } from '../modules/utils/buildGraph';
import { simplifySchema } from '../modules/utils/introspection';
import { assignTypesAndIDs } from '../modules/utils/assignTyepsAndIds';
import { getNodesAndEdges } from '../modules/utils/getNodesAndEdges';
import DocExplorer from './DocExplorer';

class Home extends React.Component {
  state = {
    endpoint: '',
  };

  query = gql`
    query getIntrospectionSchema($endpoint: String!) {
      getSchema(endpoint: $endpoint)
    }
  `;

  handleEnpointChange = e => {
    this.setState({ endpoint: e.target.value });
  };

  handleSubmit = async () => {
    const { client } = this.props;
    const { endpoint } = this.state;
    try {
      const { data = {} } = await client.query({
        query: this.query,
        variables: { endpoint },
      });
      // console.log(data.getSchema);
      const schema = buildClientSchema(data.getSchema);
      const introspection = introspectionFromSchema(schema);
      // console.log(introspection);
      const { nodes, edges } = getNodesAndEdges(introspection)
      // console.log(nodes, edges)
      const simpleSchema = simplifySchema(introspection.__schema);
      console.log(simpleSchema);
      assignTypesAndIDs(simpleSchema);
      const typeGraph = getTypeGraph(simpleSchema);
      // console.log(typeGraph)
      this.setState({
        simpleSchema,
        schema,
        typeGraph,
        nodes,
        edges
      });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { nodes, edges } = this.state;


    // const nodes={
    //   'A': {},
    //   'B': {},
    //   'C': {},
    //   'D': {},
    //   'E': {},
    // };
    // const edges = [
    //   ['A','B', {}],
    //   ['B','C', {}],
    //   ['B','D', {}],
    //   ['C','E', {}],
    //   ['D','E', {}],
    // ]
    return (
      <div>
        <Components.FormControl
          type='search'
          placeholder='sidebar.io/graphql'
          value={this.state.endpoint}
          onChange={this.handleEnpointChange}
        />
        <Components.Button onClick={this.handleSubmit}>Submit</Components.Button>
        <div>
          {this.state.simpleSchema && <DocExplorer simpleSchema={this.state.simpleSchema}/>}
        </div>
        <div>
          <TextTypes simpleSchema={this.state.simpleSchema} />
        </div>
        {/* <div className='dagreD3Graph'>{this.state.schema && <SchemaDisplay nodes={nodes} edges={edges}  />}</div> */}
      </div>
    );
  }
}
registerComponent({ name: 'Home', component: Home, hocs: [withApollo] });
