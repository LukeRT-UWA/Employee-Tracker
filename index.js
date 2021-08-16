const mysql = require('mysql2');
const inquirer = require('inquirer');

// Connect to database
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

  db.connect(err => {
    if (err) throw err;
    afterConnection();
  });
  
  // function after connection is established and welcome image shows 
  afterConnection = () => {
    console.log("!_______!EMPLOYEE MANAGER!_______!")
 
    mainSelection();
  };

const operations = {
  "View Employees": viewEmployees,
  "View Departments": viewDepartments, 
  "Exit App": process.exit
}


function mainSelection(){
    inquirer
    .prompt({
      type: "list",
      name: "task",
      message: "Would you like to do?",
      choices: Object.keys(operations)
    })
    .then( ({ task })=> operations[task]() )
    .then(() => mainSelection());
}

function viewDepartments() {
  let query = `SELECT * FROM department`
  db.query(query, function (err, res) {
    if (err) throw err;
    console.log("\n Departments")
    console.table(res);
    console.log("Departments viewed!\n");
  }
  )};

  function viewEmployees() {
    console.log("You did it!")
    // db.query("SELECT * FROM employee")
  }