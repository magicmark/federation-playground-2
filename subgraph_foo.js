import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { startStandaloneServer } from '@apollo/server/standalone';
import gql from 'graphql-tag';

const businesses = {
  1: { address: '123 fake st' },
  2: { address: '456 made up ave' },
  3: { address: '789 dummy drive' },
};

export async function buildSubgraph(port) {
  const typeDefs = gql`
    extend schema @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable", "@override"])
    
    type Business @key(fields: "id") {
      id: ID!
      address: String
    }
  `;

  const resolvers = {
    Business: {
      __resolveReference({ id }) {
        return businesses[id];
      },
    },
  };

  const schema = buildSubgraphSchema({ typeDefs, resolvers });
  const server = new ApolloServer({ schema });
  const { url } = await startStandaloneServer(server, {
    listen: { port },
  });
  console.log(`Subgraph A running on ${url}`);
}
