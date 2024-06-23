import express from 'express';
import MarkdownIt from 'markdown-it';
import markdownItContainer from 'markdown-it-container';
import ObsidianNoteApi from './main';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schema';
import { ObsidianNoteApiSettings } from './settings';

/**
 * Starts the Apollo Server and the express HTTP server.
 * @param plugin 
 * @param settings 
 */
export async function startHttpServer(plugin: ObsidianNoteApi, settings: ObsidianNoteApiSettings): Promise<void> {
  const app = express();
  const port = settings.port;

  // Configure MarkdownIt
  const md: MarkdownIt  = new MarkdownIt().use(markdownItContainer, 'info');

  // Configure Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({ dataSources: { obsidian: plugin, md } }),
    formatError: (err) => {
      console.error('GraphQL error:', err);
      return err;
    },
  });

  // Start server and configure routes
  await server.start();
  server.applyMiddleware({ app });

  app.get('/', (req, res) => {
    return res.status(200).json({ message: 'Obsidian Note API is working!' });
  });

  plugin.server = app.listen(port, () => {
    console.log(`HTTP server running at http://localhost:${port}${server.graphqlPath}`);
  });
}
