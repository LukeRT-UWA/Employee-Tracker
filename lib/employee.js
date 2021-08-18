
  function viewEmployees() {
    console.log("You did it!")
    // db.query("SELECT * FROM employee")
  }

  const employeeOperations = {
      "View Employees": viewEmployees,
      "Create Employee": () => {console.log('creating')},
  }

  module.exports = {
      employeeOperations
  }
