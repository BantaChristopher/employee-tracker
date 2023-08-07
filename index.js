const inquirer = require('inquirer');
const db = require('./db/connection');
const {viewDepartments, viewRoles, viewEmployees, addDepartment, addRole, addEmployee, updateEmployee} = require('./db/index')

function init () {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: `
___________              .__                               ___________                     __                 
/_   _____/ _____ ______ |  |   ____ ___.__. ____   ____   |__    ___/___________    ____ |  | __ ___________ 
 |    __)_ /     ||____ ||  |  /  _ <   |  |/ __ |_/ __ |    |    |  |_  __ |__  | _/ ___||  |/ // __ |_  __ |
 |        |  Y Y  |  |_> |  |_(  <_> )___  |  ___/|  ___/    |    |   |  | |// __ ||  |___|    <|  ___/|  | |/
/_________/__|_|__|   __/|____/|____//_____||____>|____>     |____|   |__|  (______/|_____>__|__||____>|__|   
                  |__|               
(EMPLOYEE TRACKER V1.0.0)
            
What would you like to do?`,
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role', 'Exit']
        }
    ]).then((choice) => {
            switch(choice.choice) {
                case 'View All Departments':
                    viewDepartments();
                    break;                
                case 'View All Roles':
                    viewRoles();
                    break;
                case 'View All Employees':
                    viewEmployees();
                    break;
                case 'Add A Department':
                    addDepartment();
                    break;
                case 'Add A Role':
                    addRole();
                    break;
                case 'Add An Employee':
                    addEmployee();
                    break;
                case 'Update An Employee Role':
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