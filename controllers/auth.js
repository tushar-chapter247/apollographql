const bcrypt = require('bcrypt');
const { User } = require('../models');

// USER SIGNUP API
const userSignup = async (req, res) => {
	try {
		const data = req.body;
		const userRec = await User.findOne({
			where: {
				email: data.email,
			},
		});

		if (userRec) {
			return res.status(401).json({
				responseCode: 401,
				message: 'Email already exist',
				success: false,
			});
		} else {
			const salt = bcrypt.genSaltSync(5);
			const hashPassword = await bcrypt.hashSync(data.password, salt);
			await User.build({
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				password: hashPassword,
			})
				.save()
				.then(userRes => {
					console.log(userRes, 'userRes');

					if (userRes.dataValues && userRes.dataValues.id) {
						return res.status(200).json({
							responseCode: 200,
							message: 'User signup successfully',
							success: true,
						});
					}
				})
				.catch(err => console.log('Error in creating user: ', err));
		}
	} catch (error) {
		return res.status(400).json({
			responseCode: 400,
			message: 'Error while signup user!',
			error: error,
			success: false,
		});
	}
};

module.exports = {
	userSignup,
};
