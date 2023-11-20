import { ApolloServer } from '@apollo/server';
import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloServerPluginLandingPageGraphQLPlayground } from '@apollo/server-plugin-landing-page-graphql-playground';

export async function buildGateway(port) {
  const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
      subgraphs: [
        {
          name: 'subgraph_foo',
          url: 'http://localhost:4001/graphql',
        },
        {
          name: 'subgraph_bar',
          url: 'http://localhost:4002/graphql',
        },
      ],
    }),
  });

  const server = new ApolloServer({
    gateway,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port },
  });

  console.log(`Federation Playground running at ${url}`);
}
