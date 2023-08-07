const db = require('./connection');
const inquirer = require('inquirer');
const { Console } = require('console');
const { Transform } = require('stream');

function table(input) {
    // @see https://stackoverflow.com/a/67859384
    const ts = new Transform({ transform(chunk, enc, cb) { cb(null, chunk) } })
    const logger = new Console({ stdout: ts })
    logger.table(input)
    const table = (ts.read() || '').toString()
    let result = '';
    for (let row of table.split(/[\r\n]+/)) {
        let r = row.replace(/[^┬]*┬/, '┌');
        r = r.replace(/^├─*┼/, '├');
        r = r.replace(/│[^│]*/, '');
        r = r.replace(/^└─*┴/, '└');
        r = r.replace(/'/g, ' ');
        result += `${r}\n`;
    }
    console.log(result);
}

function viewDepartments() {
    db.query(`SELECT * FROM department`, function (err, results) {
        table(results);
        const { endOfQuestion }  = require('../index');
        return endOfQuestion();
    });
}

function viewRoles() {
    db.query(`SELECT * FROM role`, function (err, results) {
        table(results);
        const { endOfQuestion }  = require('../index');
        return endOfQuestion();
    });
}

function viewEmployees() {
    db.query(`SELECT employee.id AS ID, employee.first_name AS FirstName, employee.last_name AS LastName, role.title AS Role, role.salary AS Salary, department.name AS Department, employee.manager_id AS ManagerID FROM employee JOIN role on employee.role_id = role.id JOIN department on role.department_id = department.id ORDER BY ID`, function (err, results) {
        table(results);
        const { endOfQuestion }  = require('../index');
        return endOfQuestion();
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: `Whats the name of the department you'd like to add?`
        }
    ]).then((answer) => {
        db.query(`INSERT INTO department (name) VALUES (?)`, answer.departmentName, function (err, results) {
            console.log(`${answer.departmentName} has been added to the department list!`);
            const { endOfQuestion }  = require('../index');
            return endOfQuestion();
        });
    });    
}

function addRole() {
    db.query(`SELECT * FROM department`, function (err, results) {
        const departments = results.map(({ name, id }) => ({ 'name': name, 'value': id }))
        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: `Whats the name of the role you'd like to add?`
            },
            {
                type: 'input',
                name: 'salary',
                message: `Whats the salary of the role?`
            },
            {
                type: 'list',
                name: 'department',
                message: `Whats the department associated with the role?`,
                choices: departments
            }
        ]).then((answer) => {
            db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answer.title, answer.salary, answer.department], function (err, results) {
                console.log(`${answer.title} has been added as a role!`);
                const { endOfQuestion }  = require('../index');
                return endOfQuestion();
            });
        })
    });    
}

function addEmployee() {
    db.query('SELECT * FROM role', function (err, results) {
        const roles = results.map(({ title, id }) => ({ 'name': title, 'value': id }))
        
        db.query('SELECT * FROM employee', function (err, results) {
            const managers = results.map(({ first_name, last_name, id }) => ({ 'name': first_name + " " + last_name, 'value': id }))
            managers.push({ 'name': 'None', 'value': null})
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: `Whats the first name of the employee you'd like to add?`
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: `Whats the last name of the employee you'd like to add?`
                },
                {
                    type: 'list',
                    name: 'role',
                    message: `Whats the role of the employee you'd like to add`,
                    choices: roles
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: `Who is the manager for this employee?`,
                    choices: managers
                }
            ]).then((answer) => {
                db.query(`INSERT INTO employee (first_name, last_name, role_id,  manager_id) VALUES (?, ?, ?, ?)`, [answer.firstName, answer.lastName, answer.role, answer.manager], function (err, results) {
                    console.log(`${answer.firstName} ${answer.lastName} has been added as an employee!`);
                    const { endOfQuestion }  = require('../index');
                    return endOfQuestion();
                    });
            });
        })
    })
}

function updateEmployee() {
    db.query('SELECT * FROM role', function (err, results) {
        const roles = results.map(({ title, id }) => ({ 'name': title, 'value': id }))

        db.query('SELECT * FROM employee', function (err, results) {
          const employees = results.map(({ first_name, last_name, id }) => ({ 'name': first_name + " " + last_name, 'value': id }))
          const managers = results.map(({ first_name, last_name, id }) => ({ 'name': first_name + " " + last_name, 'value': id }))
          managers.push({'name': 'None', 'value': null})
          inquirer.prompt([
            {
              type: 'list',
              name: 'employee',
              message: `Select the employee you would like to edit:`,
              choices: employees,
            },
            {
              type: 'list',
              name: 'role',
              message: `Select this employee's new role:`,
              choices: roles
            },
            {
              type: 'list',
              name: 'change',
              message: `Do you want to change this employee's manager?`,
              choices: ['Yes', 'No']
            },
            {
              type: 'list',
              name: 'manager',
              message: `Select a new manager for this employee:`,
              choices: managers,
              when: (answers) => answers.change === 'Yes'
            },
          ]).then(function (answers) {
              if (answers.change === 'No') {
                db.query('UPDATE employee SET role_id = ? WHERE id = ?', [answers.role, answers.employee], (err, results) => {
                  console.log(`Employee ID #${answers.employee} has been updated.`);
                  const { endOfQuestion }  = require('../index');
                  return endOfQuestion();
                });
              }

              if (answers.change === 'Yes') {
                db.query('UPDATE employee SET role_id = ?, manager_id = ? WHERE id = ?', [answers.role, answers.manager, answers.employee], (err, results) => {
                  if (err) throw err;
                  console.log(`Employee ID #${answers.employee} has been updated.`);
                  const { endOfQuestion }  = require('../index');
                  return endOfQuestion();
                });
              }
            })
        });
      });    
}

module.exports = {table, viewDepartments, viewRoles, viewEmployees, addDepartment, addRole, addEmployee, updateEmployee};