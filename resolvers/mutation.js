module.exports = {
	addUser: (parent, args, { User }, info) => {
		return User.create({
			firstName: args.firstName,
			lastName: args.lastName,
			email: args.email,
			createdAt: new Date(),
			updatedAt: new Date(),
		}).then(user => {
			return User.findAll();
		});
	},
};
