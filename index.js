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
  ************************
  *** EMPLOYEE MANAGER ***
  ************************\n`)

  mainSelection();
};

const operations = {
  "View Employees": viewEmployees,
  "View Roles": viewRoles,
  "View Departments": viewDepartments,
  "Add a Department": addDepartment,
  "Add a Role": addRole,
  "Add an Employee": addEmployee,
  "Update Employee Role": alterEmployeeRole,
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
//views-----------------------------------------------------
function viewDepartments() {
  let query = `SELECT * FROM department`
  db.query(query, function (err, res) {
    if (err) throw err;
    console.log("\n Departments")
    console.table(res);
    console.log("Departments viewed\n");
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
    console.log("Employees viewed\n");
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
    console.log("Roles viewed\n");
    mainSelection()
  }
  )
}
//adds-----------------------------------------------------
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
 
  let query = `SELECT * FROM department`
  db.query(query, function (err, res) {
    if (err) throw err;
    let departmentOptions = res.map(department => ({
      value: department.id, name: department.name
    }))
  
    console.log(departmentOptions)
    addRolePrompt(departmentOptions) 
    
  })
  
  
 
}

function addRolePrompt(departmentOptions) {
inquirer
    .prompt([
      {
        type: "input",
        message: 'What is the title of the role you wish to add?',
        name: 'roleTitle',
      },
      {
        type: "input",
        message: 'What is the Salary of this role?',
        name: 'roleSalary',
      },
      {
        type: "list",
        message: 'What is the Department name of this role?',
        name: 'roleDeptID',
        choices: departmentOptions
      },
    ])
    .then(function (answer) {
      let query = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`
      console.log(answer.roleDeptID)
      db.query(query, [answer.roleTitle, answer.roleSalary, answer.roleDeptID], function (err, res) {
        if (err) throw err;
        console.log(`\n${answer.roleTitle} added to roles\n`)
        mainSelection()
      })
    })
  }
function addEmployee() {

  let query = `SELECT * FROM role`
  db.query(query, function (err, res) {
    if (err) throw err;
    let roleOptions = res.map(role => ({
      value: role.id, name: role.title
    }))
  
    console.log(roleOptions)
    addEmployeePrompt(roleOptions) 
    
  })

}

function addEmployeePrompt(roleOptions) {
inquirer
.prompt([
  {
    type: "input",
    message: `What is this employee's first name?`,
    name: 'employeeFirstName',
  },
  {
    type: "input",
    message: `What is this employee's last name?`,
    name: 'employeeLastName',
  },
  {
    type: "list",
    message: `What is this employee's role?`,
    name: 'roleDeptId',
    choices: roleOptions, 
  },

])
.then(function (answer) {
  let query = `INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)`

  db.query(query, [answer.employeeFirstName, answer.employeeLastName, answer.roleDeptId], function (err, res) {
    if (err) throw err;
    console.log(`\n${answer.employeeFirstName} ${answer.employeeLastName} added to employees\n`)
    mainSelection()
  })
})
}

//alters-----------------------------------------------------
function alterEmployeeRole(){

  let query = `SELECT * FROM employee`
  db.query(query, function (err, res) {
    if (err) throw err;
    let employeeOptions = res.map(employee => ({
      value: employee.id, name:  `${employee.first_name} ${employee.last_name}`
    }))   
  
  let query = `SELECT * FROM role`
  db.query(query, function (err, res) {
    if (err) throw err;
    let roleOptions = res.map(role => ({
      value: role.id, name: role.title
    }))
  
    console.log(employeeOptions)
    console.log(roleOptions)
    alterEmployeePrompt(employeeOptions, roleOptions) 
    
  })
})
  
}

function alterEmployeePrompt(employeeOptions, roleOptions) {

  inquirer
.prompt([
  {
    type: "list",
    message: `Which employee do you want to update?`,
    name: 'employeeFullName',
    choices: employeeOptions,
  },
  {
    type: "list",
    message: `What role do you want to assign this employee to?`,
    name: 'roleSelection',
    choices: roleOptions,
  },
])
.then(function (answer) {
  console.log(answer.employeeFullName)
  console.log(answer.roleSelection)
  let query = `UPDATE employee SET role_id = ? WHERE id = ?`

  db.query(query, [answer.roleSelection, answer.employeeFullName], function (err, res) {
    if (err) throw err;
    console.log(`\nRole updated for selected employee\n`)
    mainSelection()
  })
})
}
//deletes-----------------------------------------------------