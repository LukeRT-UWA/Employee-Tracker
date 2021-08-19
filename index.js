const mysql = require('mysql2');
const inquirer = require('inquirer');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Password01',
    database: 'company_db'
  },
  console.log(`Connected to the company_db database.`)
);

db.connect(err => {
  if (err) throw err;
  afterConnection();
});

afterConnection = () => {
  console.log(`
    ╔═══╗─────╔╗──────────────╔═╗╔═╗
    ║╔══╝─────║║──────────────║║╚╝║║
    ║╚══╦╗╔╦══╣║╔══╦╗─╔╦══╦══╗║╔╗╔╗╠══╦═╗╔══╦══╦══╦═╗
    ║╔══╣╚╝║╔╗║║║╔╗║║─║║║═╣║═╣║║║║║║╔╗║╔╗╣╔╗║╔╗║║═╣╔╝
    ║╚══╣║║║╚╝║╚╣╚╝║╚═╝║║═╣║═╣║║║║║║╔╗║║║║╔╗║╚╝║║═╣║
    ╚═══╩╩╩╣╔═╩═╩══╩═╗╔╩══╩══╝╚╝╚╝╚╩╝╚╩╝╚╩╝╚╩═╗╠══╩╝
    ───────║║──────╔═╝║─────────────────────╔═╝║
    ───────╚╝──────╚══╝─────────────────────╚══╝`)

  mainSelection();
};

const operations = {
  "View Employees": viewEmployees,
  "View Departments": viewDepartments,
  "View Roles": viewRoles,
  "Add a Department": addDepartment,
  "Add a Role": addRole,
  "Add an Employee": addEmployee,
  "Exit App": process.exit
}


function mainSelection() {
  inquirer
    .prompt({
      type: "list",
      name: "task",
      message: "Would you like to do?",
      choices: Object.keys(operations)
    })
    .then(({ task }) => operations[task]())
}

function viewDepartments() {
  let query = `SELECT * FROM department`
  db.query(query, function (err, res) {
    if (err) throw err;
    console.log("\n Departments")
    console.table(res);
    console.log("Departments viewed!\n");
    mainSelection()
  }
  )
};

function viewEmployees() {
  let query = `SELECT * FROM employee`
  db.query(query, function (err, res) {
    if (err) throw err;
    console.log("\n Employees")
    console.table(res);
    console.log("Employees viewed!\n");
    mainSelection()
  }
  )
}

function viewRoles() {
  let query = `SELECT * FROM role`
  db.query(query, function (err, res) {
    if (err) throw err;
    console.log("\n Roles")
    console.table(res);
    console.log("Roles viewed!\n");
    mainSelection()
  }
  )
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'Input',
        message: 'What department do you want to add?',
        name: 'department',
      },
    ])
    .then(function (answer) {
      let query = `INSERT INTO department (name) VALUES (?)`

      db.query(query, answer.department, function (err, res) {
        if (err) throw err;
        console.log(`\n${answer.department} added to Departments\n`)
        mainSelection()
      })
    })
}

function addRole() {
  inquirer
    .prompt([
      {
        type: 'Input',
        message: 'What is the title of the role you wish to add?',
        name: 'roleTitle',
      },
      {
        type: 'Input',
        message: 'What is the Salary of this role?',
        name: 'roleSalary',
      },
      {
        type: 'List',
        message: 'What is the Department name of this role?',
        name: 'roleDept',
        choices: db.query((`SELECT title FROM role`), function (err, res) {
          if (err) throw err;
          return JSON.stringify(res);
      })},
    ])
    .then(function (answer) {
      let query = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`

      db.query(query, [answer.roleTitle, answer.roleSalary, answer.roleDeptId], function (err, res) {
        if (err) throw err;
        console.log(`\n${answer.roleTitle} added to roles\n`)
        mainSelection()
      })
    })
}

function addEmployee() {

inquirer
.prompt([
  {
    type: 'Input',
    message: `What is this employee's first name?`,
    name: 'employeeFirstName',
  },
  {
    type: 'Input',
    message: `What is this employee's last name?`,
    name: 'employeeLastName',
  },
  {
    type: 'List',
    message: `What is this employee's role?`,
    name: 'roleDeptId', 
  },

])
.then(function (answer) {
  let query = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`

  db.query(query, [answer.roleTitle, answer.roleSalary, answer.roleDeptId], function (err, res) {
    if (err) throw err;
    console.log(`\n${answer.roleTitle} added to roles\n`)
    mainSelection()
  })
})
}

