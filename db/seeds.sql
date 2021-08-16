INSERT INTO department (name)
VALUES  ("Accounting"),
        ("Sales"),
        ("Human Resources");
       
INSERT INTO role (title, salary, department_id)
VALUES  ("Accountant", 100000, "1"),
        ("Sales Person", 50000, "2"),
        ("Administrator", 70000, "3");

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Bob", "Jones", "1", "1"),
        ("Sarah", "Smith", "2", "2"),
        ("Joe", "Bloggs", "3", "3");