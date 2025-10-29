-- Finance Tracker Database Schema for SQLite

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS budgets;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- Users Table
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE categories (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category_name TEXT NOT NULL,
    category_type TEXT NOT NULL CHECK (category_type IN ('income', 'expense')),
    icon TEXT,
    color TEXT,
    is_default BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Accounts Table
CREATE TABLE accounts (
    account_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    account_name TEXT NOT NULL,
    account_type TEXT NOT NULL CHECK (account_type IN ('bank', 'cash', 'credit_card')),
    balance REAL DEFAULT 0.00,
    currency TEXT DEFAULT 'USD',
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Transactions Table
CREATE TABLE transactions (
    transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    account_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('income', 'expense')),
    amount REAL NOT NULL CHECK (amount > 0),
    description TEXT NOT NULL,
    transaction_date DATE NOT NULL,
    payment_method TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

-- Budgets Table
CREATE TABLE budgets (
    budget_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    budget_amount REAL NOT NULL CHECK (budget_amount > 0),
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL CHECK (year >= 2020),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, category_id, month, year),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX idx_transactions_date ON transactions(transaction_date DESC);
CREATE INDEX idx_transactions_account ON transactions(account_id);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_budgets_period ON budgets(year, month);

-- Insert default categories
INSERT INTO categories (category_name, category_type, icon, color, is_default) VALUES
('Salary', 'income', '💼', '#10b981', 1),
('Freelance', 'income', '💻', '#3b82f6', 1),
('Investment', 'income', '📈', '#8b5cf6', 1),
('Food & Dining', 'expense', '🍔', '#ef4444', 1),
('Transportation', 'expense', '🚗', '#f59e0b', 1),
('Shopping', 'expense', '🛍️', '#ec4899', 1),
('Entertainment', 'expense', '🎬', '#6366f1', 1),
('Bills & Utilities', 'expense', '💡', '#14b8a6', 1),
('Healthcare', 'expense', '🏥', '#f43f5e', 1),
('Education', 'expense', '📚', '#8b5cf6', 1);

-- Insert sample account
INSERT INTO accounts (account_name, account_type, balance) VALUES
('Main Bank Account', 'bank', 5000.00),
('Cash Wallet', 'cash', 500.00);