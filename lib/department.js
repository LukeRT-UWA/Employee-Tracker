const mysql = require('mysql2');
const cTable = require("console.table");
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'Password01',
    database: 'company_db'
  },
  console.log(`Connected to the company_db database.`)
);

  function viewDepartments() {
    let query = `SELECT * FROM department`
    db.query(query, function (err, res) {
      if (err) throw err;
      
      console.table(res);
      console.log("Departments viewed!\n");
    }
    )};

  const departmentOperations = {
      "View Departments": viewDepartments,
  }

  module.exports = {
      departmentOperations
  }
