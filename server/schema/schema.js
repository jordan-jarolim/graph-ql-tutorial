// 3 main responsibilities
// 1 - define types,  2 - define relationships between types, 3 - define root queries (entry points into the graph)

const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;



// dummy data
/* var books = [
  { name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1' },
  { name: 'The final empire', genre: 'Fantasy', id: '2', authorId: '2' },
  { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3' },
  { name: 'The Hero of Ages', genre: 'Fantasy', id: '4', authorId: '2' },
  { name: 'The Colour of Magic', genre: 'Fantasy', id: '5', authorId: '3' },
  { name: 'The Light Fantastic', genre: 'Fantasy', id: '6', authorId: '3' },
];

var authors = [
  { name: 'Patrick Rothfuss', age: 44, id: '1' },
  { name: 'Brandon Sanderson', age: 42, id: '2' },
  { name: 'Terry Pratchet', age: 66, id: '3' },
];
 */

const BookType = new GraphQLObjectType({
  name: 'Book',
  // must be a function, the other types would not know what the type of referenced object - this is a function
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      // If user requests author inside the request for a book this resolve function will take care of it
      resolve(parent, args) {
        // mongoDB model
        return Author.findById(parent.authorId);
/*         return _.find(authors, { id: parent.authorId });
 */      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  // must be a function, the other types would not know what the type of referenced object - this is a function
  // dependencies on one type to another, graphql might not recognize those dependencies, because one might be defined before the other
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({ authorId: parent.id })
/*         return _.filter(books, { authorId: parent.id });
 */      }
    }
  })
});

// how we jump into the graph
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  // different root queries
  fields: {
    book: {
      type: BookType,
      // when requesting book, expecting id provided
      args: { id: { type: GraphQLID } },
      // parent - relation between data, args contains id param
      resolve(parent, args) {
        return Book.findById(args.id);
        /*         return _.find(books, { id: args.id });
         */
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Author.findById(args.id);
/*         return _.find(authors, { id: args.id })
 */      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({})
/*         return books;
 */      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return Author.find({})
/*         return authors;
 */      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        // local mongo model imported from model definition in models
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save();
      }
    },

    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        // local mongo model imported from model definition in models
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        });
        return book.save();
      }
    }
  }
})

/* book(id: '123'){
  name
  genre
} */


module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

