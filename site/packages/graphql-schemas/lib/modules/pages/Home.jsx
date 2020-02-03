import React from 'react';
import { registerComponent, Components } from 'meteor/vulcan:core';
import { buildClientSchema, introspectionFromSchema } from 'graphql';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { getTypeGraph } from '../utils/buildGraph';
import { simplifySchema } from '../utils/introspection';
import { assignTypesAndIDs } from '../utils/assignTyepsAndIds';
import { getNodesAndEdges } from '../utils/getNodesAndEdges';
import DocExplorer from '../../components/DocExplorer';

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
      const schema = buildClientSchema(data.getSchema);
      const introspection = introspectionFromSchema(schema);
      const { nodes, edges } = getNodesAndEdges(introspection);
      const simpleSchema = simplifySchema(introspection.__schema);
      assignTypesAndIDs(simpleSchema);
      const typeGraph = getTypeGraph(simpleSchema);
      this.setState({
        simpleSchema,
        schema,
        typeGraph,
        nodes,
        edges,
      });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { nodes, edges } = this.state;

    return (
      <div>
        <Components.FormControl
          type='search'
          placeholder='sidebar.io/graphql'
          value={this.state.endpoint}
          onChange={this.handleEnpointChange}
        />
        <Components.Button onClick={this.handleSubmit}>Submit</Components.Button>
        <div>{this.state.simpleSchema && <DocExplorer simpleSchema={this.state.simpleSchema} />}</div>
        <div>{/* <TextTypes simpleSchema={this.state.simpleSchema} /> */}</div>
        {/* <div className='dagreD3Graph'>{this.state.schema && <SchemaDisplay nodes={nodes} edges={edges}  />}</div> */}
        <div>
          <Components.SchemaList />
        </div>
      </div>
    );
  }
}
registerComponent({ name: 'Home', component: Home, hocs: [withApollo] });
