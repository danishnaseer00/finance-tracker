-- Finance Tracker Database Schema

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS budgets CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    category_name VARCHAR(100) NOT NULL,
    category_type VARCHAR(20) NOT NULL CHECK (category_type IN ('income', 'expense')),
    icon VARCHAR(50),
    color VARCHAR(20),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Accounts Table
CREATE TABLE accounts (
    account_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    account_name VARCHAR(100) NOT NULL,
    account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('bank', 'cash', 'credit_card')),
    balance NUMERIC(10, 2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'USD',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    account_id INTEGER NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(category_id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('income', 'expense')),
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    description VARCHAR(255) NOT NULL,
    transaction_date DATE NOT NULL,
    payment_method VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Budgets Table
CREATE TABLE budgets (
    budget_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(category_id) ON DELETE CASCADE,
    budget_amount NUMERIC(10, 2) NOT NULL CHECK (budget_amount > 0),
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL CHECK (year >= 2020),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, category_id, month, year)
);

-- Indexes for better query performance
CREATE INDEX idx_transactions_date ON transactions(transaction_date DESC);
CREATE INDEX idx_transactions_account ON transactions(account_id);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_budgets_period ON budgets(year, month);

-- Insert default categories
INSERT INTO categories (category_name, category_type, icon, color, is_default) VALUES
('Salary', 'income', '💼', '#10b981', TRUE),
('Freelance', 'income', '💻', '#3b82f6', TRUE),
('Investment', 'income', '📈', '#8b5cf6', TRUE),
('Food & Dining', 'expense', '🍔', '#ef4444', TRUE),
('Transportation', 'expense', '🚗', '#f59e0b', TRUE),
('Shopping', 'expense', '🛍️', '#ec4899', TRUE),
('Entertainment', 'expense', '🎬', '#6366f1', TRUE),
('Bills & Utilities', 'expense', '💡', '#14b8a6', TRUE),
('Healthcare', 'expense', '🏥', '#f43f5e', TRUE),
('Education', 'expense', '📚', '#8b5cf6', TRUE);

-- Insert sample account
INSERT INTO accounts (account_name, account_type, balance) VALUES
('Main Bank Account', 'bank', 5000.00),
('Cash Wallet', 'cash', 500.00);