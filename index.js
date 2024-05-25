const { sequelize } = require("./src/config/dbConfig");
const express = require("express");

const bodyParser = require("body-parser");

const routes = require("./src/route/contact.route"); // Import your API routes

const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());

// Middleware
app.use(bodyParser.json());

// API routes
app.use("/identify", routes);

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: "Something went wrong" });
});

// Start the server
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

module.exports = app;
// const express = require("express");
// const { Sequelize, DataTypes, Op } = require("sequelize");
// const Contact = require("./src/model/contact.model");
// // Set up Sequelize
// const sequelize = new Sequelize(
// 	process.env.DB_NAME,
// 	process.env.DB_USER,
// 	process.env.DB_PASSWORD,
// 	{
// 		host: process.env.DB_HOST,
// 		dialect: "mysql",
// 		pool: {
// 			max: 5,
// 			min: 0,
// 			acquire: 30000,
// 			idle: 10000,
// 		},
// 	}
// );

// sequelize
// 	.authenticate()
// 	.then(() => {
// 		console.log("Connection has been established successfully.");
// 	})
// 	.catch((error) => {
// 		console.error("Unable to connect to the database: ", error);
// 	});

// // Define the Contact model

// const app = express();
// app.use(express.json());

// app.post("/identify", async (req, res) => {
// 	const { email, phoneNumber } = req.body;

// 	// Find the primary contact
// 	const primaryContact = await Contact.findOne({
// 		where: {
// 			[Op.or]: [
// 				{ email },
// 				{ phoneNumber },
// 				{ linkedId: null, linkPrecedence: "primary" },
// 			],
// 		},
// 		order: [["createdAt", "ASC"]],
// 	});

// 	if (!primaryContact) {
// 		// Create a new primary contact
// 		const newPrimaryContact = await Contact.create({
// 			email,
// 			phoneNumber,
// 			linkPrecedence: "primary",
// 		});

// 		res.json({
// 			contact: {
// 				primaryContactId: newPrimaryContact.id,
// 				emails: [newPrimaryContact.email],
// 				phoneNumbers: [newPrimaryContact.phoneNumber],
// 				secondaryContactIds: [],
// 			},
// 		});
// 	} else {
// 		// Find all linked contacts
// 		const linkedContacts = await Contact.findAll({
// 			where: {
// 				[Op.or]: [
// 					{ email: primaryContact.email },
// 					{ phoneNumber: primaryContact.phoneNumber },
// 					{ linkedId: primaryContact.id },
// 				],
// 			},
// 		});

// 		// Check if the incoming request should result in a new primary contact
// 		const shouldCreateNewPrimary = linkedContacts.every((contact) => {
// 			return (
// 				(!email || contact.email !== email) &&
// 				(!phoneNumber || contact.phoneNumber !== phoneNumber)
// 			);
// 		});

// 		if (shouldCreateNewPrimary) {
// 			// Create a new primary contact and update existing primary to secondary
// 			const newPrimaryContact = await Contact.create({
// 				email: email || null,
// 				phoneNumber: phoneNumber || null,
// 				linkPrecedence: "primary",
// 			});

// 			// Update the existing primary contact to become secondary
// 			await primaryContact.update({
// 				linkedId: newPrimaryContact.id,
// 				linkPrecedence: "secondary",
// 			});

// 			const emails = linkedContacts
// 				.map((contact) => contact.email)
// 				.filter(Boolean);
// 			const phoneNumbers = linkedContacts
// 				.map((contact) => contact.phoneNumber)
// 				.filter(Boolean);
// 			const secondaryContactIds = linkedContacts
// 				.filter((contact) => contact.linkPrecedence === "secondary")
// 				.map((contact) => contact.id);

// 			emails.push(newPrimaryContact.email);
// 			phoneNumbers.push(newPrimaryContact.phoneNumber);

// 			res.json({
// 				contact: {
// 					primaryContactId: newPrimaryContact.id,
// 					emails,
// 					phoneNumbers,
// 					secondaryContactIds,
// 				},
// 			});
// 		} else {
// 			const emails = linkedContacts
// 				.map((contact) => contact.email)
// 				.filter(Boolean);
// 			const phoneNumbers = linkedContacts
// 				.map((contact) => contact.phoneNumber)
// 				.filter(Boolean);
// 			const secondaryContactIds = linkedContacts
// 				.filter((contact) => contact.linkPrecedence === "secondary")
// 				.map((contact) => contact.id);

// 			// Check if a new secondary contact needs to be created
// 			if (
// 				(email && !emails.includes(email)) ||
// 				(phoneNumber && !phoneNumbers.includes(phoneNumber))
// 			) {
// 				const newSecondaryContact = await Contact.create({
// 					email: email || null,
// 					phoneNumber: phoneNumber || null,
// 					linkedId: primaryContact.id,
// 					linkPrecedence: "secondary",
// 				});

// 				secondaryContactIds.push(newSecondaryContact.id);
// 				if (email) emails.push(email);
// 				if (phoneNumber) phoneNumbers.push(phoneNumber);
// 			}

// 			res.json({
// 				contact: {
// 					primaryContactId: primaryContact.id,
// 					emails,
// 					phoneNumbers,
// 					secondaryContactIds,
// 				},
// 			});
// 		}
// 	}
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
// 	console.log(`Server is running on port ${PORT}`);
// 	sequelize.sync(); // Sync the database before starting the server
// });
