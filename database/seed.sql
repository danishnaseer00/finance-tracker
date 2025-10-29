-- Sample transactions for testing

-- Income transactions
INSERT INTO transactions (account_id, category_id, transaction_type, amount, description, transaction_date) VALUES
(1, 1, 'income', 3000.00, 'Monthly Salary', '2025-10-01'),
(1, 2, 'income', 500.00, 'Website Development', '2025-10-05'),
(1, 3, 'income', 150.00, 'Stock Dividends', '2025-10-10');

-- Expense transactions
INSERT INTO transactions (account_id, category_id, transaction_type, amount, description, transaction_date) VALUES
(1, 4, 'expense', 50.00, 'Grocery Shopping', '2025-10-02'),
(2, 4, 'expense', 25.00, 'Restaurant Dinner', '2025-10-03'),
(1, 5, 'expense', 30.00, 'Uber Ride', '2025-10-04'),
(1, 6, 'expense', 120.00, 'Clothing Purchase', '2025-10-06'),
(2, 7, 'expense', 15.00, 'Movie Tickets', '2025-10-07'),
(1, 8, 'expense', 200.00, 'Electricity Bill', '2025-10-08'),
(1, 4, 'expense', 45.00, 'Coffee Shop', '2025-10-12'),
(2, 5, 'expense', 20.00, 'Gas Station', '2025-10-14');

-- Sample budgets
INSERT INTO budgets (category_id, budget_amount, month, year) VALUES
(4, 500.00, 10, 2025),  -- Food budget
(5, 200.00, 10, 2025),  -- Transportation budget
(6, 300.00, 10, 2025),  -- Shopping budget
(7, 150.00, 10, 2025),  -- Entertainment budget
(8, 400.00, 10, 2025);  -- Bills budget