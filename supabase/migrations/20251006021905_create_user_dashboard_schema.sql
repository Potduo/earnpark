/*
  # User Dashboard Schema Migration

  ## Overview
  Creates all necessary tables for the EarnParkPro investment dashboard application, including user dashboard data, investments, transactions, AI bot trades, performance metrics, chat messages, and withdrawal requests.

  ## New Tables
  
  1. `user_dashboard_data`
     - Stores the main dashboard metrics for each user
     - `user_id` (uuid, references auth.users) - The authenticated user
     - `total_invested` (numeric) - Total amount the user has invested
     - `current_portfolio_value` (numeric) - Current value of the portfolio
     - `daily_profit_percentage` (numeric) - Daily profit percentage
     - `portfolio_active` (boolean) - Whether the portfolio is active
     - `is_admin` (boolean) - Admin status flag
     - `activation_date` (timestamptz) - When the portfolio was activated
     - `last_update` (timestamptz) - Last update timestamp
     - `created_at` (timestamptz) - Record creation timestamp
  
  2. `investments`
     - Stores individual investment records
     - `id` (uuid, primary key) - Unique investment ID
     - `user_id` (uuid, references auth.users) - Owner of the investment
     - `currency` (text) - Investment currency (e.g., BTC, ETH)
     - `amount` (numeric) - Investment amount
     - `profit` (numeric) - Current profit from this investment
     - `status` (text) - Investment status (active, pending, completed)
     - `date` (timestamptz) - Investment date
     - `created_at` (timestamptz) - Record creation timestamp
  
  3. `transactions`
     - Stores all financial transactions
     - `id` (uuid, primary key) - Unique transaction ID
     - `user_id` (uuid, references auth.users) - Transaction owner
     - `type` (text) - Transaction type (deposit, withdrawal, profit)
     - `amount` (numeric) - Transaction amount
     - `currency` (text) - Transaction currency
     - `status` (text) - Transaction status (pending, completed, failed)
     - `description` (text) - Transaction description
     - `wallet_address` (text) - Crypto wallet address
     - `network` (text) - Blockchain network used
     - `date` (timestamptz) - Transaction date
     - `created_at` (timestamptz) - Record creation timestamp
  
  4. `ai_bot_trades`
     - Stores AI bot trading history
     - `id` (uuid, primary key) - Unique trade ID
     - `user_id` (uuid, references auth.users) - Trade owner
     - `crypto_pair` (text) - Trading pair (e.g., BTC/USD)
     - `entry_price` (numeric) - Entry price for the trade
     - `exit_price` (numeric) - Exit price for the trade
     - `profit_percentage` (numeric) - Profit/loss percentage
     - `is_profit` (boolean) - Whether trade was profitable
     - `trade_date` (timestamptz) - When the trade occurred
     - `created_at` (timestamptz) - Record creation timestamp
  
  5. `performance_data`
     - Stores daily performance metrics
     - `id` (uuid, primary key) - Unique record ID
     - `user_id` (uuid, references auth.users) - Performance data owner
     - `date` (text) - Date label for display
     - `profit` (numeric) - Daily profit percentage
     - `portfolio_value` (numeric) - Portfolio value on that date
     - `created_at` (timestamptz) - Record creation timestamp
  
  6. `chat_messages`
     - Stores chatbot conversation history
     - `id` (uuid, primary key) - Unique message ID
     - `user_id` (uuid, references auth.users) - Message owner
     - `message` (text) - Message content
     - `is_user` (boolean) - Whether message is from user or bot
     - `status` (text) - Message status (sending, sent, failed)
     - `timestamp` (timestamptz) - Message timestamp
     - `created_at` (timestamptz) - Record creation timestamp
  
  7. `withdrawal_requests`
     - Stores withdrawal requests
     - `id` (uuid, primary key) - Unique request ID
     - `user_id` (uuid, references auth.users) - Requesting user
     - `email` (text) - User's email for the request
     - `amount` (numeric) - Withdrawal amount
     - `currency` (text) - Withdrawal currency
     - `wallet_address` (text) - Destination wallet
     - `network` (text) - Blockchain network
     - `status` (text) - Request status (pending, processing, completed, failed)
     - `request_date` (timestamptz) - When request was made
     - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Row Level Security (RLS) is enabled on ALL tables
  - Users can only access their own data
  - All policies check authentication status
  - Policies are restrictive by default
  
  ## Notes
  - All numeric fields use appropriate default values (0 or 0.0)
  - All timestamps use `now()` as default
  - All tables have proper indexes on user_id for performance
  - Foreign keys ensure referential integrity
*/

-- Create user_dashboard_data table
CREATE TABLE IF NOT EXISTS user_dashboard_data (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_invested numeric DEFAULT 0 NOT NULL,
  current_portfolio_value numeric DEFAULT 0 NOT NULL,
  daily_profit_percentage numeric DEFAULT 0 NOT NULL,
  portfolio_active boolean DEFAULT false NOT NULL,
  is_admin boolean DEFAULT false NOT NULL,
  activation_date timestamptz,
  last_update timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create investments table
CREATE TABLE IF NOT EXISTS investments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  currency text NOT NULL,
  amount numeric NOT NULL,
  profit numeric DEFAULT 0 NOT NULL,
  status text DEFAULT 'pending' NOT NULL CHECK (status IN ('active', 'pending', 'completed')),
  date timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'profit')),
  amount numeric NOT NULL,
  currency text NOT NULL,
  status text DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  description text DEFAULT '' NOT NULL,
  wallet_address text,
  network text,
  date timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create ai_bot_trades table
CREATE TABLE IF NOT EXISTS ai_bot_trades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  crypto_pair text NOT NULL,
  entry_price numeric NOT NULL,
  exit_price numeric NOT NULL,
  profit_percentage numeric NOT NULL,
  is_profit boolean NOT NULL,
  trade_date timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create performance_data table
CREATE TABLE IF NOT EXISTS performance_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date text NOT NULL,
  profit numeric NOT NULL,
  portfolio_value numeric NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  is_user boolean NOT NULL,
  status text DEFAULT 'sent' CHECK (status IN ('sending', 'sent', 'failed')),
  timestamp timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create withdrawal_requests table
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email text NOT NULL,
  amount numeric NOT NULL,
  currency text NOT NULL,
  wallet_address text NOT NULL,
  network text NOT NULL,
  status text DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  request_date timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_investments_user_id ON investments(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_bot_trades_user_id ON ai_bot_trades(user_id);
CREATE INDEX IF NOT EXISTS idx_performance_data_user_id ON performance_data(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_user_id ON withdrawal_requests(user_id);

-- Enable Row Level Security on all tables
ALTER TABLE user_dashboard_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_bot_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_dashboard_data
CREATE POLICY "Users can view own dashboard data"
  ON user_dashboard_data FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dashboard data"
  ON user_dashboard_data FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dashboard data"
  ON user_dashboard_data FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own dashboard data"
  ON user_dashboard_data FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for investments
CREATE POLICY "Users can view own investments"
  ON investments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own investments"
  ON investments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own investments"
  ON investments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own investments"
  ON investments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for transactions
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON transactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for ai_bot_trades
CREATE POLICY "Users can view own bot trades"
  ON ai_bot_trades FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bot trades"
  ON ai_bot_trades FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bot trades"
  ON ai_bot_trades FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bot trades"
  ON ai_bot_trades FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for performance_data
CREATE POLICY "Users can view own performance data"
  ON performance_data FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own performance data"
  ON performance_data FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own performance data"
  ON performance_data FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own performance data"
  ON performance_data FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for chat_messages
CREATE POLICY "Users can view own chat messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat messages"
  ON chat_messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat messages"
  ON chat_messages FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for withdrawal_requests
CREATE POLICY "Users can view own withdrawal requests"
  ON withdrawal_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own withdrawal requests"
  ON withdrawal_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own withdrawal requests"
  ON withdrawal_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own withdrawal requests"
  ON withdrawal_requests FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);