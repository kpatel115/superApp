// server.js

const express = require('express');
const app = express();

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

// Example usage of Prisma Client for querying user data
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany(); // Fetch all users
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const { buildSchema } = require('graphql')
const { graphqlHTTP } = require('express-graphql');


const schema = buildSchema(`
  type User {
    id: Int
    email: String
    name: String
  }

  type Query {
    getUser(id: Int!): User
    getUsers: [User]
  }

  type Mutation {
    createUser(email: String!, name: String): User
  }

`)

// Root resolver
// const root = {
//   getUser: ({ id }) => {
//     // Logic to fetch user from database (using Prisma)
//     return { id, email: 'example@example.com', name: 'John Doe' }; // Dummy data for illustration
//   },
//   getUsers: () => {
//     // Logic to fetch all users from database (using Prisma)
//     return [{ id: 1, email: 'example1@example.com', name: 'John Doe' }, { id: 2, email: 'example2@example.com', name: 'Jane Doe' }]; // Dummy data for illustration
//   },
//   createUser: ({ email, name }) => {
//     // Logic to create a new user in the database (using Prisma)
//     const newUser = { id: 3, email, name }; // Dummy data for illustration
//     return newUser;
//   }
// };


// Add GraphQL middleware to Express app
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true  // Enable GraphiQL for testing
}));


// Node Server 
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
