/*
  # Add Withdrawal Requests Table

  1. New Tables
    - `withdrawal_requests`
      - `id` (uuid, primary key) - Unique identifier for withdrawal request
      - `user_id` (uuid, foreign key) - References auth.users
      - `email` (text) - User email for verification
      - `amount` (numeric) - Withdrawal amount in USD
      - `currency` (text) - Cryptocurrency type (BTC, ETH, USDT, etc.)
      - `wallet_address` (text) - Destination wallet address
      - `network` (text) - Network type (Bitcoin Network, ERC-20, TRC-20, etc.)
      - `status` (text) - Status of withdrawal (pending, processing, completed, rejected)
      - `request_date` (timestamptz) - When withdrawal was requested
      - `processed_date` (timestamptz, nullable) - When withdrawal was processed
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on `withdrawal_requests` table
    - Add policy for users to read their own withdrawal requests
    - Add policy for users to create their own withdrawal requests
    - Add policy for admins to read all withdrawal requests
    - Add policy for admins to update withdrawal status
*/

-- Create withdrawal_requests table
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email text NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  currency text NOT NULL,
  wallet_address text NOT NULL,
  network text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  request_date timestamptz NOT NULL DEFAULT now(),
  processed_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own withdrawal requests
CREATE POLICY "Users can view own withdrawal requests"
  ON withdrawal_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can create their own withdrawal requests
CREATE POLICY "Users can create own withdrawal requests"
  ON withdrawal_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own pending withdrawal requests
CREATE POLICY "Users can update own pending withdrawals"
  ON withdrawal_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_user_id ON withdrawal_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_status ON withdrawal_requests(status);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_request_date ON withdrawal_requests(request_date DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_withdrawal_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_withdrawal_requests_updated_at_trigger
  BEFORE UPDATE ON withdrawal_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_withdrawal_requests_updated_at();
