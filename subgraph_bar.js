import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { startStandaloneServer } from '@apollo/server/standalone';
import gql from 'graphql-tag';

const businesses = {
  1: { id: 1, name: 'mcdonalds', rating: 4 },
  2: { id: 2, name: 'burger king', rating: 5 },
  3: { id: 3, name: 'starbucks', rating: 5 },
};

export async function buildSubgraph(port) {
  const typeDefs = gql`  
    extend schema @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable", "@override"])

    type Business @key(fields: "id") {
      id: ID!
      name: String
      rating: Float
    }
    
    type Query {
      business(id: Int!): Business
    }  
  `;

  const resolvers = {
    Query: {
      business: (_, args) => {
        const { id } = args;
        return businesses[id];
      },
    },
  };

  const schema = buildSubgraphSchema({ typeDefs, resolvers });
  const server = new ApolloServer({ schema });
  const { url } = await startStandaloneServer(server, {
    listen: { port },
  });
  console.log(`subgraph_bar running on ${url}`);
}
