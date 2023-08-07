const inquirer = require('inquirer');
const db = require('./db/connection');
const {viewDepartments, viewRoles, viewEmployees, addDepartment, addRole, addEmployee, updateEmployee} = require('./db/index')

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
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit']
        }
    ]).then((choice) => {
            switch(choice.choice) {
                case 'View all departments':
                    viewDepartments();
                    break;                
                case 'View all roles':
                    viewRoles();
                    break;
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    updateEmployee();
                      break;
                case `Exit`:
                    db.end();
                    console.log('Goodbye!')
        };
    });
};

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
                    console.clear();
                    init();
            }
        });
};

module.exports = {endOfQuestion};

init();