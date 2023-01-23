const express = require("express");

// extract http module from express-graphql
const expressGraphQL = require("express-graphql").graphqlHTTP;

//GET SCHEMA
const schema = require("./schema/schema");

const app = express();

// GraphQL config
app.use(
  "/graphql",
  expressGraphQL({
    schema: schema,
    graphiql: true,
  })
);

// Server entrypoint
app.listen(4000, () => {
  console.log("server started");
});
