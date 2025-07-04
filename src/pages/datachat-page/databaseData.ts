// Car Dealership Database Schema and Sample Data

export const DATABASE_SCHEMA = `
  CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, role TEXT);
  CREATE TABLE cars (id INTEGER PRIMARY KEY, make TEXT, model TEXT, year INTEGER, price INTEGER);
  CREATE TABLE sales (id INTEGER PRIMARY KEY, car_id INTEGER, employee_id INTEGER, customer_name TEXT, sale_date TEXT, price INTEGER);
`;

export const SAMPLE_EMPLOYEES = `
  INSERT INTO employees (name, role) VALUES
    ('Alice Johnson', 'Sales'),
    ('Bob Smith', 'Manager'),
    ('Carol Lee', 'Sales');
`;

export const SAMPLE_CARS = `
  INSERT INTO cars (make, model, year, price) VALUES
    ('Toyota', 'Camry', 2020, 22000),
    ('Honda', 'Civic', 2019, 18000),
    ('Ford', 'F-150', 2021, 35000),
    ('Tesla', 'Model 3', 2022, 42000);
`;

export const SAMPLE_SALES = `
  INSERT INTO sales (car_id, employee_id, customer_name, sale_date, price) VALUES
    (1, 1, 'John Doe', '2023-01-15', 21000),
    (2, 3, 'Jane Roe', '2023-02-10', 17500),
    (3, 1, 'Mike Brown', '2023-03-05', 34000),
    (4, 2, 'Sara White', '2023-03-20', 41000);
`;

// Function to initialize the database with all data
export function initializeDatabase(db: any) {
  // Create tables
  db.run(DATABASE_SCHEMA);
  
  // Insert sample data
  db.run(SAMPLE_EMPLOYEES);
  db.run(SAMPLE_CARS);
  db.run(SAMPLE_SALES);
} 