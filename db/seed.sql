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
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, 'John', 'Smith', 1, NULL), -- Manager
       (2, 'Robert', 'Johnson', 2, 1), -- Engineer, managed by John Smith
       (3, 'Michael', 'Williams', 3, 1), -- Sales Representative, managed by John Smith
       (4, 'William', 'Jones', 4, NULL), -- Marketing Specialist
       (5, 'David', 'Brown', 5, NULL), -- Finance Analyst
       (6, 'Linda', 'Davis', 6, NULL), -- HR Coordinator
       (7, 'Sarah', 'Miller', 1, NULL), -- Manager
       (8, 'Karen', 'Wilson', 2, 7), -- Engineer, managed by Sarah Miller
       (9, 'Emily', 'Taylor', 3, 7), -- Sales Representative, managed by Sarah Miller
       (10, 'Michael', 'Anderson', 4, NULL), -- Marketing Specialist
       (11, 'Daniel', 'Thompson', 5, NULL), -- Finance Analyst
       (12, 'Sophia', 'Lee', 7, NULL), -- Data Analyst
       (13, 'Jessica', 'Hall', 8, NULL), -- Product Manager
       (14, 'Matthew', 'Young', 3, 1), -- Sales Representative, managed by John Smith
       (15, 'Olivia', 'Clark', 9, NULL); -- Customer Support