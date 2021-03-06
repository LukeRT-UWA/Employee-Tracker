const mysql = require('mysql2');
const inquirer = require('inquirer');
//Connect to db
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Password01',
    database: 'company_db'
  },
  console.log(`Connected to the company_db database.`)
);
//Run function on connection to database
db.connect(err => {
  if (err) throw err;
  afterConnection();
});
//print ascii title after connection
afterConnection = () => {
  console.log(`
  ************************
  *** EMPLOYEE TRACKER ***
  ************************\n`)

  mainSelection();
};
//Parent list for selecting functions
function mainSelection() {
  inquirer
    .prompt({
      type: "list",
      name: "task",
      message: "What would you like to do?",
      choices: Object.keys(operations)
    })
    .then(({ task }) => operations[task]())
}
//Switch statement options and associated functions
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



//views-----------------------------------------------------
function viewDepartments() {
  let query = `SELECT id AS "Department ID", name AS "Department Name" FROM department`
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
  let query = `SELECT e.id, e.first_name AS "First Name", e.last_name AS "Last Name", role.title AS "Role Title", role.salary AS Salary, department.name AS "Department Name", CONCAT (em.first_name,' ',em.last_name) AS Manager
  FROM employee e
  LEFT OUTER JOIN employee em ON e.manager_id = em.id
  JOIN role ON e.role_id = role.id
  JOIN department ON role.department_id = department.id`
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
  let query = `SELECT role.title AS "Job Title", role.id AS "Role ID", role.salary AS "Role Salary", department.name AS "Department Name"
  FROM role
  JOIN department ON role.department_id = department.id`
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
      {
        type: "confirm",
        message: `Is this employee a manager?`,
        name: 'isManager',

      },
      {
        type: "list",
        message: `Who is your manager?`,
        name: 'managerID',
        when: function (answer) {
          return !answer.isManager;
        },
        choices: function (answers) {
          let query = `SELECT employee.first_name, employee.last_name, employee.id, employee.manager_id from employee where manager_id IS null`;


          return new Promise((resolve, reject) => {

            db.query(query, function (err, res) {
              if (err) {
                return reject(err);
              };
              console.log(res)

              resolve(res.map(employee => {
                return {
                  name: employee.first_name + ' ' + employee.last_name,
                  value: employee.id
                }
              }))
            })
          })
        }

      },

    ])
    .then(function (answer) {
      if (answer.managerID !== null) {

        let query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`

        db.query(query, [answer.employeeFirstName, answer.employeeLastName, answer.roleDeptId, answer.managerID], function (err, res) {
          if (err) throw err;
          console.log(`\n${answer.employeeFirstName} ${answer.employeeLastName} added to employees\n`)
          mainSelection()
        })

      }

      else {

        let query = `INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)`

        db.query(query, [answer.employeeFirstName, answer.employeeLastName, answer.roleDeptId], function (err, res) {
          if (err) throw err;
          console.log(`\n${answer.employeeFirstName} ${answer.employeeLastName} added to employees\n`)
          mainSelection()
        })
      }
    })
}

//alters-----------------------------------------------------
function alterEmployeeRole() {

  let query = `SELECT * FROM employee`
  db.query(query, function (err, res) {
    if (err) throw err;
    let employeeOptions = res.map(employee => ({
      value: employee.id, name: `${employee.first_name} ${employee.last_name}`
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
      console.log(answer.roleSelection)
      console.log(answer.employeeFullName)
      let query = `UPDATE employee SET role_id = ? WHERE id = ?`

      db.query(query, [answer.roleSelection, answer.employeeFullName], function (err, res) {
        if (err) throw err;
        console.log(`\nRole updated for selected employee\n`)
        mainSelection()
      })
    })
}
//deletes-----------------------------------------------------