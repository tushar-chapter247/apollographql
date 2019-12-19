'use strict';

module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define(
		'User',
		{
			firstName: DataTypes.STRING,
			lastName: DataTypes.STRING,
			email: {
				type: DataTypes.STRING,
				unique: true,
			},
			password: DataTypes.STRING,
			isActive: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
			},
			last_login: DataTypes.DATE,
		},
		{}
	);
	User.associate = function(models) {
		// associations can be defined here
	};
	return User;
};
