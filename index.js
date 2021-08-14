const mysql = require('mysql2');
const inquirer = require('inquirer');
const {employeeOperations} = require('./lib/employee')

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'Password01',
      database: 'films_db'
    },
    console.log(`Connected to the courses_db database.`)
  );


const operations = {
    ...employeeOperations,
    
    
    "Exit App": process.exit
}


function whatWouldLikeToDo(){
    inquirer
    .prompt({
      type: "list",
      name: "task",
      message: "Would you like to do?",
      choices: Object.keys(operations)
    })
    .then( ({ task })=> operations[task]() )
    .then(() => whatWouldLikeToDo());
}

function main() {

   whatWouldLikeToDo();
  }

  main()

