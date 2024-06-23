import express from 'express';
import request from 'supertest';
import { ApolloServer } from 'apollo-server-express';
import { startHttpServer } from '../src/server';
import ObsidianNoteApi from '../src/main';
import { ObsidianNoteApiSettings } from '../src/settings';

jest.mock('apollo-server-express');
jest.mock('markdown-it');
jest.mock('markdown-it-container');

const MockApolloServer = ApolloServer as jest.MockedClass<typeof ApolloServer>;

describe('startHttpServer', () => {
  let plugin: ObsidianNoteApi;
  let settings: ObsidianNoteApiSettings;
  let app: express.Application;
  let port: number;

  beforeEach(async () => {
    plugin = {} as ObsidianNoteApi;
    port = 3000 + Math.floor(Math.random() * 1000); // Random port to avoid conflicts
    settings = { port, languages: [] };

    MockApolloServer.mockClear();
    MockApolloServer.prototype.start = jest.fn().mockResolvedValue(undefined);
    MockApolloServer.prototype.applyMiddleware = jest.fn().mockImplementation(({ app }: { app: express.Application }) => {
      app.use('/graphql', (req, res) => res.status(200).json({ data: 'graphql response' }));
    });

    await startHttpServer(plugin, settings);
    app = plugin.server;
  });

  afterEach(() => {
    if (plugin.server) {
      plugin.server.close();
    }
  });

  test('should start the HTTP server and respond to health check', async () => {
    expect.assertions(3);

    const response = await request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toEqual({ message: 'Obsidian Note API is working!' });
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).toBe(200);
  });

  test('should handle GraphQL requests', async () => {
    expect.assertions(3);

    const query = { query: '{ testQuery }' };
    const response = await request(app)
      .post('/graphql')
      .send(query)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toEqual({ data: 'graphql response' });
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).toBe(200);
  });
});
