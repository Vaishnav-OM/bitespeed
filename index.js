const mysql = require("mysql2");
const pool = require("./src/config/dbConfig");

async function fetchNotes() {
	try {
		const [result] = await pool.query("select * from Contact");
		console.log(result);
	} catch (err) {
		console.error("Error executing query", err);
	}
}

// Call the async function
fetchNotes();
