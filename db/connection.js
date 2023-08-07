const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'employee_db'
    },
    console.log(`Server running...`)
  );

  module.exports = db