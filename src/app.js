const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');

const createConnection = require('./database/createConnection');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers/index');

async function startApolloServer() {
    createConnection();

    const app = express();
    const corsOptions = {   
        origin: '*',
        credentials: true,
    };
    
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    const httpServer = createServer(app);
  
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
      context: ({ req }) => ({ req })
    });
  
    await server.start();
    server.applyMiddleware({
		app,
		path: '/graphql'
    });
  
    await new Promise(resolve => httpServer.listen({ port: process.env.PORT }, resolve));
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`);
}

module.exports = { startApolloServer };