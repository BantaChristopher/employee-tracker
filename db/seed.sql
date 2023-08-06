-- Insert data into department
INSERT INTO department (name)
VALUES ('Sales'),
       ('Marketing'),
       ('Engineering'),
       ('Finance'),
       ('Human Resources'),
       ('Operations');

-- Insert data into role
INSERT INTO role (title, salary, department_id)
VALUES ('Manager', 75000, 3),
       ('Engineer', 60000, 3),
       ('Sales Representative', 50000, 1),
       ('Marketing Specialist', 55000, 2),
       ('Finance Analyst', 65000, 4),
       ('HR Coordinator', 45000, 5),
       ('Data Analyst', 58000, 4),
       ('Product Manager', 70000, 3),
       ('Customer Support', 48000, 6),
       ('Quality Assurance', 56000, 3);

-- Insert data into employee with predefined names and roles
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Smith', 1, NULL), -- Manager
       ('Robert', 'Johnson', 2, 1), -- Engineer, managed by John Smith
       ('Michael', 'Williams', 3, 1), -- Sales Representative, managed by John Smith
       ('William', 'Jones', 4, NULL), -- Marketing Specialist
       ('David', 'Brown', 5, NULL), -- Finance Analyst
       ('Linda', 'Davis', 6, NULL), -- HR Coordinator
       ('Sarah', 'Miller', 1, NULL), -- Manager
       ('Karen', 'Wilson', 2, 7), -- Engineer, managed by Sarah Miller
       ('Emily', 'Taylor', 3, 7), -- Sales Representative, managed by Sarah Miller
       ('Michael', 'Anderson', 4, NULL), -- Marketing Specialist
       ('Daniel', 'Thompson', 5, NULL), -- Finance Analyst
       ('Sophia', 'Lee', 7, NULL), -- Data Analyst
       ('Jessica', 'Hall', 8, NULL), -- Product Manager
       ('Matthew', 'Young', 3, 1), -- Sales Representative, managed by John Smith
       ('Olivia', 'Clark', 9, NULL); -- Customer Support