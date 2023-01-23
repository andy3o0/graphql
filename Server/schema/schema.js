const graphql = require("graphql");
// LODASH TO MANIUPLATE OR SEARCH TABLES DATA
const _ = require("lodash");

// extract objecttype from graphql
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
} = graphql;

// DUMMY DATA
const users = [
  { id: "1", firstName: "Andy", age: 20, companyId: "2" },
  { id: "2", firstName: "Usman", age: 21, companyId: "1" },
];

const companies = [
  { id: "1", name: "A" },
  { id: "2", name: "B" },
];

// CREATE NEW TABLE TYPES DATA
const CompanyType = new GraphQLObjectType({
  // TABLE NAME
  name: "Company",
  // TABLE VARIABLES
  //   CLOSE IN ARROW FUNCTION OTHERWISE INTIALIZATION ERROR OF USERTYPE WILL OCCUR
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        // RETURN AS ARRAY BECAUSE TYPE IS GRAPHQLLIST
        return _.filter(users, { companyId: parentValue.id });
      },
    },
  }),
});

// CREATE NEW TABLE TYPES DATA
const UserType = new GraphQLObjectType({
  // TABLE NAME
  name: "User",
  // TABLE VARIABLES
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        // console.log(parentValue, args);
        return _.find(companies, { id: parentValue.companyId });
      },
    },
  }),
});

// ROOT QUERY TO ACCESS SPECIFIC USER
// NOTE THIS IS ENTRY POINT FOR QUERY AND JUST DEFINE TYPE FOR DATA
// DATA IS NOT REALLY STORED HERE
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // CONNECT USER TABLE TYPE DATA TO ROOT QUERY
    // NOTE THE NAME OF OBJECT HERE (eg user) will be user as a table name in query
    user: {
      type: UserType,
      // Required  PARAMETER THAT WILL  BE USED FOR QUERY
      args: { id: { type: GraphQLString } },
      //   FUNCTION TO PERFORM ACTION
      resolve(parentValue, args) {
        // FROM HERE WE CAN RETRIEVE DATA FROM ANY DATABASE
        return _.find(users, { id: args.id });
      },
    },
    //////////////////////////////
    company: {
      type: CompanyType,
      // Required  PARAMETER THAT WILL  BE USED FOR QUERY
      args: { id: { type: GraphQLString } },
      //   FUNCTION TO PERFORM ACTION
      resolve(parentValue, args) {
        // FROM HERE WE CAN RETRIEVE DATA FROM ANY DATABASE
        return _.find(companies, { id: args.id });
      },
    },
  },
});

// MUTATE DATA
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, args) {
        users.push(args);
        return _.find(users, { id: args.id });
      },
    },
    ////////////////////////////
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, args) {
        return _.remove(users, { id: args.id })[0];
      },
    },
  },
});

// EXPORT SCHEMA
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation,
});
