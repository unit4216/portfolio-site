/**
 * Car Dealership Database Schema and Sample Data
 * 
 * This file contains the SQL schema and sample data for a car dealership database.
 * The database includes tables for employees, cars, sales, customers, and service records.
 */

/**
 * SQL schema for creating the car dealership database tables
 */
export const DATABASE_SCHEMA = `
  CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, role TEXT, hire_date TEXT, salary INTEGER);
  CREATE TABLE cars (id INTEGER PRIMARY KEY, make TEXT, model TEXT, year INTEGER, price INTEGER, color TEXT, mileage INTEGER);
  CREATE TABLE sales (id INTEGER PRIMARY KEY, car_id INTEGER, employee_id INTEGER, customer_name TEXT, sale_date TEXT, price INTEGER, commission INTEGER);
  CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, email TEXT, phone TEXT, address TEXT);
  CREATE TABLE service_records (id INTEGER PRIMARY KEY, car_id INTEGER, service_date TEXT, service_type TEXT, cost INTEGER, description TEXT);
`;

/**
 * Sample employee data for the dealership
 */
export const SAMPLE_EMPLOYEES = `
  INSERT INTO employees (name, role, hire_date, salary) VALUES
    ('Alice Johnson', 'Sales Manager', '2020-03-15', 65000),
    ('Bob Smith', 'Sales Representative', '2021-01-10', 45000),
    ('Carol Lee', 'Sales Representative', '2021-06-20', 42000),
    ('David Chen', 'Finance Manager', '2019-11-05', 70000),
    ('Emma Wilson', 'Sales Representative', '2022-02-14', 40000),
    ('Frank Rodriguez', 'Service Manager', '2018-08-22', 55000),
    ('Grace Kim', 'Sales Representative', '2022-09-01', 38000),
    ('Henry Thompson', 'Sales Representative', '2021-12-03', 43000),
    ('Iris Martinez', 'Finance Specialist', '2020-07-18', 48000),
    ('Jack Anderson', 'Sales Representative', '2022-04-12', 41000);
`;

/**
 * Sample car inventory data
 */
export const SAMPLE_CARS = `
  INSERT INTO cars (make, model, year, price, color, mileage) VALUES
    ('Toyota', 'Camry', 2020, 22000, 'Silver', 45000),
    ('Honda', 'Civic', 2019, 18000, 'Blue', 52000),
    ('Ford', 'F-150', 2021, 35000, 'Black', 38000),
    ('Tesla', 'Model 3', 2022, 42000, 'White', 25000),
    ('BMW', 'X3', 2021, 38000, 'Gray', 32000),
    ('Mercedes', 'C-Class', 2020, 35000, 'Silver', 41000),
    ('Audi', 'A4', 2021, 32000, 'Black', 29000),
    ('Lexus', 'RX', 2022, 45000, 'White', 18000),
    ('Volkswagen', 'Golf', 2019, 16000, 'Red', 58000),
    ('Subaru', 'Outback', 2021, 28000, 'Green', 35000),
    ('Chevrolet', 'Silverado', 2020, 32000, 'Blue', 42000),
    ('Dodge', 'Challenger', 2021, 29000, 'Orange', 31000),
    ('Nissan', 'Altima', 2020, 19000, 'Silver', 47000),
    ('Hyundai', 'Tucson', 2022, 25000, 'White', 22000),
    ('Kia', 'Sportage', 2021, 23000, 'Red', 33000),
    ('Mazda', 'CX-5', 2020, 24000, 'Blue', 39000),
    ('Jeep', 'Wrangler', 2021, 36000, 'Yellow', 28000),
    ('Porsche', 'Cayenne', 2022, 65000, 'Black', 15000),
    ('Land Rover', 'Range Rover', 2021, 75000, 'White', 25000),
    ('Volvo', 'XC60', 2020, 34000, 'Gray', 36000);
`;

/**
 * Sample customer data
 */
export const SAMPLE_CUSTOMERS = `
  INSERT INTO customers (name, email, phone, address) VALUES
    ('John Doe', 'john.doe@email.com', '555-0101', '123 Main St, Anytown, USA'),
    ('Jane Smith', 'jane.smith@email.com', '555-0102', '456 Oak Ave, Somewhere, USA'),
    ('Mike Johnson', 'mike.johnson@email.com', '555-0103', '789 Pine Rd, Elsewhere, USA'),
    ('Sarah Wilson', 'sarah.wilson@email.com', '555-0104', '321 Elm St, Nowhere, USA'),
    ('Robert Brown', 'robert.brown@email.com', '555-0105', '654 Maple Dr, Anywhere, USA'),
    ('Lisa Davis', 'lisa.davis@email.com', '555-0106', '987 Cedar Ln, Someplace, USA'),
    ('James Miller', 'james.miller@email.com', '555-0107', '147 Birch Way, Everywhere, USA'),
    ('Emily Garcia', 'emily.garcia@email.com', '555-0108', '258 Spruce Ct, Anywhere, USA'),
    ('David Rodriguez', 'david.rodriguez@email.com', '555-0109', '369 Willow Pl, Somewhere, USA'),
    ('Amanda Martinez', 'amanda.martinez@email.com', '555-0110', '741 Aspen Blvd, Elsewhere, USA'),
    ('Christopher Lee', 'chris.lee@email.com', '555-0111', '852 Poplar St, Nowhere, USA'),
    ('Jessica Taylor', 'jessica.taylor@email.com', '555-0112', '963 Sycamore Ave, Anywhere, USA'),
    ('Daniel Anderson', 'daniel.anderson@email.com', '555-0113', '159 Chestnut Rd, Someplace, USA'),
    ('Ashley Thomas', 'ashley.thomas@email.com', '555-0114', '357 Walnut Dr, Everywhere, USA'),
    ('Matthew Jackson', 'matthew.jackson@email.com', '555-0115', '468 Hickory Ln, Anywhere, USA');
`;

/**
 * Sample sales transaction data
 */
export const SAMPLE_SALES = `
  INSERT INTO sales (car_id, employee_id, customer_name, sale_date, price, commission) VALUES
    (1, 1, 'John Doe', '2023-01-15', 21000, 2100),
    (2, 3, 'Jane Smith', '2023-02-10', 17500, 1750),
    (3, 1, 'Mike Johnson', '2023-03-05', 34000, 3400),
    (4, 2, 'Sarah Wilson', '2023-03-20', 41000, 4100),
    (5, 5, 'Robert Brown', '2023-04-12', 36500, 3650),
    (6, 8, 'Lisa Davis', '2023-05-08', 33000, 3300),
    (7, 3, 'James Miller', '2023-06-15', 30500, 3050),
    (8, 1, 'Emily Garcia', '2023-07-22', 43000, 4300),
    (9, 10, 'David Rodriguez', '2023-08-03', 15000, 1500),
    (10, 5, 'Amanda Martinez', '2023-09-18', 27000, 2700),
    (11, 8, 'Christopher Lee', '2023-10-05', 30000, 3000),
    (12, 2, 'Jessica Taylor', '2023-11-12', 27500, 2750),
    (13, 3, 'Daniel Anderson', '2023-12-01', 18000, 1800),
    (14, 1, 'Ashley Thomas', '2024-01-08', 24000, 2400),
    (15, 5, 'Matthew Jackson', '2024-02-14', 22000, 2200),
    (16, 8, 'John Doe', '2024-03-20', 23000, 2300),
    (17, 2, 'Jane Smith', '2024-04-15', 34000, 3400),
    (18, 10, 'Mike Johnson', '2024-05-10', 62000, 6200),
    (19, 1, 'Sarah Wilson', '2024-06-05', 70000, 7000),
    (20, 5, 'Robert Brown', '2024-07-12', 32000, 3200);
`;

/**
 * Sample service records data
 */
export const SAMPLE_SERVICE_RECORDS = `
  INSERT INTO service_records (car_id, service_date, service_type, cost, description) VALUES
    (1, '2023-06-15', 'Oil Change', 45, 'Standard oil change and filter replacement'),
    (2, '2023-07-20', 'Brake Service', 280, 'Front brake pad replacement and rotor resurfacing'),
    (3, '2023-08-10', 'Tire Rotation', 35, 'Four tire rotation and balance'),
    (4, '2023-09-05', 'Battery Replacement', 120, 'New battery installation'),
    (5, '2023-10-12', 'Transmission Service', 350, 'Transmission fluid change and filter'),
    (6, '2023-11-18', 'AC Repair', 420, 'AC compressor replacement'),
    (7, '2023-12-03', 'Oil Change', 50, 'Synthetic oil change'),
    (8, '2024-01-15', 'Brake Service', 320, 'Rear brake service'),
    (9, '2024-02-08', 'Tire Replacement', 480, 'Four new tires installed'),
    (10, '2024-03-22', 'Engine Tune-up', 180, 'Spark plugs and air filter replacement'),
    (11, '2024-04-10', 'Oil Change', 40, 'Standard oil change'),
    (12, '2024-05-05', 'Suspension Repair', 650, 'Shock absorber replacement'),
    (13, '2024-06-18', 'Electrical Repair', 280, 'Alternator replacement'),
    (14, '2024-07-12', 'Oil Change', 45, 'Standard oil change'),
    (15, '2024-08-25', 'Brake Service', 290, 'Front brake service'),
    (16, '2024-09-08', 'Tire Rotation', 35, 'Tire rotation and balance'),
    (17, '2024-10-15', 'Engine Repair', 1200, 'Cylinder head gasket replacement'),
    (18, '2024-11-20', 'Oil Change', 55, 'Synthetic oil change'),
    (19, '2024-12-05', 'Brake Service', 310, 'Rear brake pad replacement'),
    (20, '2025-01-12', 'Tire Replacement', 520, 'Two new tires installed');
`;

/**
 * Initialize the database with all schema and sample data
 * @param db - The SQL.js database instance to initialize
 */
export function initializeDatabase(db: any) {
  // Create tables
  db.run(DATABASE_SCHEMA);
  
  // Insert sample data
  db.run(SAMPLE_EMPLOYEES);
  db.run(SAMPLE_CARS);
  db.run(SAMPLE_CUSTOMERS);
  db.run(SAMPLE_SALES);
  db.run(SAMPLE_SERVICE_RECORDS);
} 