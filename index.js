const inquirer = require('inquirer');
const mysql = require('mysql2');
const { Console } = require('console');
const { Transform } = require('stream');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'employee_db'
    },
    console.log(`Server running...`)
  );

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

function init () {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: `
####### #     # ######  #       ####### #     # ####### #######    ####### ######     #     #####  #    # ####### ######  
#       ##   ## #     # #       #     #  #   #  #       #             #    #     #   # #   #     # #   #  #       #     # 
#       # # # # #     # #       #     #   # #   #       #             #    #     #  #   #  #       #  #   #       #     # 
#####   #  #  # ######  #       #     #    #    #####   #####         #    ######  #     # #       ###    #####   ######  
#       #     # #       #       #     #    #    #       #             #    #   #   ####### #       #  #   #       #   #   
#       #     # #       #       #     #    #    #       #             #    #    #  #     # #     # #   #  #       #    #  
####### #     # #       ####### #######    #    ####### #######       #    #     # #     #  #####  #    # ####### #     # 
(EMPLOYEE TRACKER V1.0.0)
            
What would you like to do?`,
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
        }
    ]).then((choice) => {
            switch(choice.choice) {
                case 'View all departments':
                    db.query(`SELECT * FROM department`, function (err, results) {
                        table(results);
                        return endOfQuestion();
                    });
                    break;                
                case 'View all roles':
                    db.query(`SELECT * FROM role`, function (err, results) {
                        table(results);
                        return endOfQuestion();
                    });
                    break;
                case 'View all employees':
                    db.query(`SELECT * FROM employee`, function (err, results) {
                        table(results);
                        return endOfQuestion();
                    });
                    break;
                case 'Add a department':
                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'departmentName',
                            message: `Whats the name of the department you'd like to add?`
                        }
                    ]).then((answer) => {
                        db.query(`INSERT INTO department (name) VALUES (?)`, answer.departmentName, function (err, results) {
                            console.log(`${answer.departmentName} has been added to the department list!`);
                            return endOfQuestion();
                        });
                    });
                    break;
                case 'Add a role':
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
                            console.log(answer)
                            db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answer.title, answer.salary, answer.department], function (err, results) {
                                console.log(`${answer.title} has been added as a role!`);
                                return endOfQuestion();
                            });
                        })
                    });
                    break;
                case 'Add an employee':
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
                                    return endOfQuestion();
                                    });
                            });
                        })
                    })
                    break;
                case 'Update an employee role':
            
        }
    })
}
function endOfQuestion() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'What would you like to do?',
                choices: ['Quit', 'Main Menu']
            }
        ])
        .then((choice) => {
            switch(choice.choice){
                case 'Quit':
                    console.log('Bye!');
                    return db.end();
                case 'Main Menu':
                    init();
            }
        });
};

init();