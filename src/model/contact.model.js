// models/contact.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const Contact = sequelize.define(
	"Contact",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		phoneNumber: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				isEmail: true,
			},
		},
		linkedId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: "Contacts",
				key: "id",
			},
		},
		linkPrecedence: {
			type: DataTypes.ENUM("primary", "secondary"),
			allowNull: false,
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		deletedAt: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{
		tableName: "contact",
		timestamps: true,
		paranoid: true,
	}
);
sequelize
	.sync()
	.then(() => {
		console.log("Book table created successfully!");
	})
	.catch((error) => {
		console.error("Unable to create table : ", error);
	});

module.exports = Contact;
