import { gql } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from '../src/schema';
import { TFile } from 'obsidian';

// Mock dependencies
jest.mock('obsidian', () => ({
  TFile: class TFile {},
}));

describe('GraphQL Schema', () => {
  let server: ApolloServer;
  let mockDataSources: any;

  beforeEach(async () => {
    mockDataSources = {
      obsidian: {
        app: {
          vault: {
            getAbstractFileByPath: jest.fn(),
            read: jest.fn(),
          },
        },
      },
      md: {
        render: jest.fn(),
      },
    };

    const schema = makeExecutableSchema({
      typeDefs,
      resolvers,
    });

    server = new ApolloServer({
      schema,
      dataSources: () => mockDataSources,
    });

    await server.start();
  });

  afterEach(async () => {
    if (server) {
      await server.stop();
    }
  });

  test('should return note content and HTML for a valid note', async () => {
    expect.assertions(2);

    const noteContent = 'Note content';
    const noteHTML = '<p>Note content</p>';

    mockDataSources.obsidian.app.vault.getAbstractFileByPath.mockReturnValue(new TFile());
    mockDataSources.obsidian.app.vault.read.mockResolvedValue(noteContent);
    mockDataSources.md.render.mockReturnValue(noteHTML);

    const result = await server.executeOperation({
      query: gql`
        query GetNote($name: String!) {
          note(name: $name) {
            content
            html
          }
        }
      `,
      variables: { name: 'test' },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual({
      note: {
        content: noteContent,
        html: noteHTML,
      },
    });
  });

  test('should return an error if the note is not found', async () => {
    expect.assertions(2);

    mockDataSources.obsidian.app.vault.getAbstractFileByPath.mockReturnValue(null);

    const result = await server.executeOperation({
      query: gql`
        query GetNote($name: String!) {
          note(name: $name) {
            content
            html
          }
        }
      `,
      variables: { name: 'nonexistent' },
    });

    expect(result.errors).not.toBeUndefined();
    expect(result.errors![0].message).toBe('Note not found');
  });

  test('should return an error if reading the note fails', async () => {
    expect.assertions(2);

    mockDataSources.obsidian.app.vault.getAbstractFileByPath.mockReturnValue(new TFile());
    mockDataSources.obsidian.app.vault.read.mockRejectedValue(new Error('Read error'));

    const result = await server.executeOperation({
      query: gql`
        query GetNote($name: String!) {
          note(name: $name) {
            content
            html
          }
        }
      `,
      variables: { name: 'test' },
    });

    expect(result.errors).not.toBeUndefined();
    expect(result.errors![0].message).toBe('Error reading note');
  });

  test('should return an error if note name is empty', async () => {
    expect.assertions(2);

    const result = await server.executeOperation({
      query: gql`
        query GetNote {
          note(name: "") {
            content
            html
          }
        }
      `,
    });

    expect(result.errors).not.toBeUndefined();
    expect(result.errors![0].message).toBe('Note not found');
  });

  test('should handle note with different file extension', async () => {
    expect.assertions(2);

    const noteContent = 'Note content';
    const noteHTML = '<p>Note content</p>';

    mockDataSources.obsidian.app.vault.getAbstractFileByPath.mockReturnValue(new TFile());
    mockDataSources.obsidian.app.vault.read.mockResolvedValue(noteContent);
    mockDataSources.md.render.mockReturnValue(noteHTML);

    const result = await server.executeOperation({
      query: gql`
        query GetNote($name: String!) {
          note(name: $name) {
            content
            html
          }
        }
      `,
      variables: { name: 'test.txt' },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual({
      note: {
        content: noteContent,
        html: noteHTML,
      },
    });
  });

  test('should handle missing dataSources', async () => {
    expect.assertions(1);

    const schema = makeExecutableSchema({
      typeDefs,
      resolvers,
    });

    const faultyServer = new ApolloServer({
      schema,
      dataSources: () => ({}),
    });

    await faultyServer.start();

    const result = await faultyServer.executeOperation({
      query: gql`
        query GetNote($name: String!) {
          note(name: $name) {
            content
            html
          }
        }
      `,
      variables: { name: 'test' },
    });

    expect(result.errors).not.toBeUndefined();

    await faultyServer.stop();
  });
});
