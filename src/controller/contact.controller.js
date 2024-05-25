const httpStatus = require("http-status");
const { getDataService } = require("../services/contact.services");

const getData = async (req, res) => {
	try {
		const requestJSON = req.body;
		const { email, phoneNumber } = requestJSON;
		const resp = await getDataService({
			email: email,
			phoneNumber: phoneNumber,
		});
		console.log(resp);
		return res.status(200).send(resp);
	} catch (error) {
		console.log(`[getData] An error occurred. ${error}`);
		return res.status(400).send(JSON.stringify(error));
	}
};

module.exports = {
	getData,
};
