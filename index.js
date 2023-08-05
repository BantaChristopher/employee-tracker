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
    inquirer
    .prompt([
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
    ])
    .then((choice) => {
        console.log(choice);
        switch(choice.choice) {
            case 'View all departments':
                db.query(`SELECT department.name FROM department`, function (err, results) {
                    table(results);
                });
            case 'View all roles':
            
            case 'View all employees':
            
            case 'Add a department':
            
            case 'Add a role':
            
            case 'Add an employee':
            
            case 'Update an employee role':
            
        }
    })
}

init()