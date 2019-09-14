const User = require('../../../models/user');

/* 
	* Create a user account
	
	POST /api/auth/register
	{
		userid,
		password,
		password2
	}
*/
exports.register = async (req, res) => {
	const { userid, password, password2 } = req.body;
	
	try {
		if (!userid || !password || !password2) {
			res.status(409).json({
				message: 'Please enter all fields.'
			});
		}
		else if ( password != password2 ) {
			res.status(409).json({
				message: 'Passwords don\'t match.'
			});
		}
		else if ( password.length < 6 ) {
			res.status(409).json({
				message: 'Password must be at least 6 characters.'
			});
		}
		else if ( await User.findOneByUserid(userid) ) {
			res.status(409).json({
				message: 'Userid already exists.'
			});
		}
		else {
			await User.create(userid, password);
			res.json({
				message: 'Registered successfully.'
			});
		}
	}
	catch (e) {
		console.log(e);
		res.status(500).json({
			message: 'Internal error occurs.'
		})
	}
}

