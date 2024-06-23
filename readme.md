# Obsidian Note API
An API to query all of your notes within your vault.

## Features
- GraphQL
- Token authentication


### Sample Query
Queries for the note `fresh-ideas.md` within the folder `Notes/`
```gql
query {
    notes(name: "Notes/fresh-ideas") {
        content
        html
    }
}
```
