const createError = require('http-errors');
const express = require('express');
const chalk = require('chalk');
const basicPino = require('pino');
const basicPinoLogger = basicPino({
	prettyPrint: { colorize: chalk.supportsColor },
});
const expressPino = require('express-pino-logger')({
	logger: basicPinoLogger,
});
const resolvers = require('./resolvers');
const { User } = require('./models');

const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const models = require('./models');

const { ApolloServer } = require('apollo-server-express');

// Some fake data
const books = [
	{
		title: "Harry Potter and the Sorcerer's stone",
		author: 'J.K. Rowling',
	},
	{
		title: 'Jurassic Park',
		author: 'Michael Crichton',
	},
];

// The GraphQL schema in string form
// type Query { books: [Book] }
const typeDefs = `
	type Query { users: [User!] }
	type User {
	id: ID!
	firstName: String
	lastName: String
	email: String
	password: String
}
 type Mutation {
    addUser(firstName: String, lastName:String, email:String): [User!]
  }
  type Book { title: String, author: String }
`;

// The resolvers
// const resolvers = {
// 	Query: { books: () => books },
// };

const app = express();
const gpath = '/graphql';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressPino);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/auth', authRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
// 	next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

// sync database
models.sequelize
	.sync()
	.then(function() {
		console.log('Database looks fine!');
	})
	.catch(function(err) {
		console.log('Something went wrong with database: ', err);
	});

const apolloServer = new ApolloServer({
	typeDefs,
	resolvers,
	context: { User },
});

apolloServer.applyMiddleware({ app, gpath });

console.log(
	`🚀 Server ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
);

module.exports = app;
