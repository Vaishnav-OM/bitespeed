const Contact = require("../model/contact.model");
const { Sequelize, Op } = require("sequelize");

const getDataService = async ({ email, phoneNumber }) => {
	let primaryContact = await Contact.findOne({
		where: {
			[Op.or]: [{ email }, { phoneNumber }],
		},
		order: [["createdAt", "ASC"]],
	});

	if (primaryContact && primaryContact.dataValues.linkedId) {
		primaryContact = await Contact.findOne({
			where: {
				id: primaryContact.dataValues.linkedId,
			},
		});
	}

	if (!primaryContact) {
		// Create a new primary contact
		const newPrimaryContact = await Contact.create({
			email,
			phoneNumber,
			linkPrecedence: "primary",
		});

		const resp = {
			contact: {
				primaryContactId: newPrimaryContact.id,
				emails: newPrimaryContact.email,
				phoneNumbers: newPrimaryContact.phoneNumber,
				secondaryContactIds: [],
			},
		};
		console.log(resp);

		return JSON.stringify(resp);
	} else {
		// Find all linked contacts
		const linkedContacts = await Contact.findAll({
			where: {
				[Sequelize.Op.or]: [
					{ email: email },
					{ phoneNumber: phoneNumber },
					{ linkedId: primaryContact.id },
					{ id: primaryContact.id },
				],
			},
		});

		const emails = linkedContacts
			.map((contact) => contact.email)
			.filter(Boolean);
		const phoneNumbers = linkedContacts
			.map((contact) => contact.phoneNumber)
			.filter(Boolean);
		const secondaryContactIds = linkedContacts
			.filter((contact) => contact.linkPrecedence === "secondary")
			.map((contact) => contact.id);

		// Check if a new secondary contact needs to be created

		const phoneNumberString = phoneNumber?.toString();

		if (
			(email && !emails.includes(email)) ||
			(phoneNumber && !phoneNumbers.includes(phoneNumberString))
		) {
			const newSecondaryContact = await Contact.create({
				email: email || null,
				phoneNumber: phoneNumber || null,
				linkedId: primaryContact.id,
				linkPrecedence: "secondary",
			});

			secondaryContactIds.push(newSecondaryContact.id);
			if (email) emails.push(email);
			if (phoneNumber) phoneNumbers.push(phoneNumber);
		}

		const primaryContactsList = linkedContacts.filter(
			(contact) => contact.dataValues.linkPrecedence === "primary"
		);
		if (primaryContactsList.length > 1) {
			// Sort primary contacts by createdAt to find the oldest one
			primaryContactsList.sort(
				(a, b) => new Date(a.createdAt) - new Date(b.createdAt)
			);

			// The oldest primary contact
			const oldestPrimaryContact = primaryContactsList[0];

			// Remaining primary contacts
			const otherPrimaryContacts = primaryContactsList.slice(1);

			// Update the other primary contacts to secondary
			await Promise.all(
				otherPrimaryContacts.map(async (contact) => {
					contact.linkPrecedence = "secondary";
					contact.linkedId = oldestPrimaryContact.id;
					await contact.save(); // Save the updated contact
				})
			);

			console.log("Updated primary and secondary contacts");
		} else {
			console.log("Error");
		}
		const resp = {
			contact: {
				primaryContactId: primaryContact.id,
				emails: [...new Set(emails)],
				phoneNumbers: [...new Set(phoneNumbers)],
				secondaryContactIds,
			},
		};
		return JSON.stringify(resp);
	}
};

module.exports = {
	getDataService,
};
