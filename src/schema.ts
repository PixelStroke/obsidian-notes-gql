import { gql } from 'apollo-server-express';
import { TFile } from 'obsidian';

export const typeDefs = gql`
  type Note {
    content: String
    html: String
  }

  type Query {
    note(name: String!): Note
  }
`;

export const resolvers = {
  Query: {
    note: async (_: any, { name }: { name: string }, { dataSources }: any) => {
      const fileName = name.endsWith('.md') ? name : `${name}.md`;
      const file = dataSources.obsidian.app.vault.getAbstractFileByPath(fileName);
      if (file && file instanceof TFile) {
        try {
          const content = await dataSources.obsidian.app.vault.read(file);
          const htmlContent = dataSources.md.render(content);
          return { content, html: htmlContent };
        } catch (err) {
          throw new Error('Error reading note');
        }
      } else {
        throw new Error('Note not found');
      }
    },
  },
};
