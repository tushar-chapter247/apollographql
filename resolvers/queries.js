module.exports = {
	users: (parent, args, { User }, info) => {
		return User.findAll();
	},
};
