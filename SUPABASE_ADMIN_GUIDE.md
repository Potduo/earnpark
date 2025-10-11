# Supabase Admin Guide

This guide explains how to manage user dashboard data directly from Supabase.

## Database Structure

All user data is now stored in Supabase with the following tables:

- `user_dashboard_data` - Main dashboard metrics (portfolio value, profit percentage, etc.)
- `investments` - Individual investment records
- `transactions` - All financial transactions
- `ai_bot_trades` - AI bot trading history
- `performance_data` - Daily performance metrics
- `chat_messages` - Chatbot conversation history
- `withdrawal_requests` - Withdrawal requests

## Managing User Data

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to the "Table Editor"
3. Select the table you want to modify
4. Edit values directly in the UI

### Option 2: Using SQL Editor

Navigate to the SQL Editor in your Supabase dashboard and run queries:

#### Activate a User's Portfolio

```sql
-- Update dashboard data
UPDATE user_dashboard_data
SET
  total_invested = 5000,
  current_portfolio_value = 5750,
  daily_profit_percentage = 2.5,
  portfolio_active = true,
  activation_date = now()
WHERE user_id = 'USER_ID_HERE';

-- Add initial investment
INSERT INTO investments (user_id, currency, amount, profit, status, date)
VALUES ('USER_ID_HERE', 'BTC', 5000, 750, 'active', now());

-- Add initial transaction
INSERT INTO transactions (user_id, type, amount, currency, status, description, date)
VALUES ('USER_ID_HERE', 'deposit', 5000, 'USD', 'completed', 'Initial deposit', now());
```

#### Update Portfolio Values

```sql
UPDATE user_dashboard_data
SET
  total_invested = 10000,
  current_portfolio_value = 11500,
  daily_profit_percentage = 3.2,
  last_update = now()
WHERE user_id = 'USER_ID_HERE';
```

#### Make User an Admin

```sql
UPDATE user_dashboard_data
SET is_admin = true
WHERE user_id = 'USER_ID_HERE';
```

#### Remove Admin Status

```sql
UPDATE user_dashboard_data
SET is_admin = false
WHERE user_id = 'USER_ID_HERE';
```

#### View All Users

```sql
SELECT
  user_id,
  total_invested,
  current_portfolio_value,
  daily_profit_percentage,
  portfolio_active,
  is_admin,
  activation_date
FROM user_dashboard_data;
```

#### Add Bot Trades

```sql
INSERT INTO ai_bot_trades (user_id, crypto_pair, entry_price, exit_price, profit_percentage, is_profit, trade_date)
VALUES
  ('USER_ID_HERE', 'BTC/USD', 45000, 46500, 3.33, true, now()),
  ('USER_ID_HERE', 'ETH/USD', 2800, 2900, 3.57, true, now()),
  ('USER_ID_HERE', 'SOL/USD', 95, 97, 2.11, true, now());
```

#### Add Performance Data

```sql
INSERT INTO performance_data (user_id, date, profit, portfolio_value)
VALUES
  ('USER_ID_HERE', 'Dec 1', 2.5, 5125),
  ('USER_ID_HERE', 'Dec 2', 3.1, 5284),
  ('USER_ID_HERE', 'Dec 3', 2.8, 5432),
  ('USER_ID_HERE', 'Dec 4', 3.5, 5622);
```

## Getting User IDs

User IDs are automatically generated when users sign up. To find a user's ID:

### Method 1: In Supabase Dashboard
1. Go to Authentication > Users
2. Find the user by email
3. Copy their UUID

### Method 2: Using SQL
```sql
SELECT id, email, raw_user_meta_data->>'full_name' as full_name
FROM auth.users
ORDER BY created_at DESC;
```

## Important Notes

1. **Data Safety**: All changes are permanent. Always double-check before running UPDATE or DELETE queries.

2. **Row Level Security**: RLS policies ensure users can only access their own data through the app.

3. **Numeric Fields**: Use numeric values without quotes for amounts:
   - Correct: `total_invested = 5000`
   - Incorrect: `total_invested = '5000'`

4. **Timestamps**: Use `now()` for current timestamp or ISO 8601 format strings.

5. **Portfolio Active**: Must be set to `true` for users to see their data and make withdrawals.

## Common Tasks

### Bulk Update All Active Portfolios

```sql
-- Increase all portfolio values by 5%
UPDATE user_dashboard_data
SET
  current_portfolio_value = current_portfolio_value * 1.05,
  last_update = now()
WHERE portfolio_active = true;
```

### Delete All User Data

```sql
-- This will cascade and delete all related data
DELETE FROM user_dashboard_data WHERE user_id = 'USER_ID_HERE';
```

### Reset User to Default

```sql
UPDATE user_dashboard_data
SET
  total_invested = 0,
  current_portfolio_value = 0,
  daily_profit_percentage = 0,
  portfolio_active = false,
  is_admin = false,
  activation_date = NULL
WHERE user_id = 'USER_ID_HERE';

-- Then delete related data
DELETE FROM investments WHERE user_id = 'USER_ID_HERE';
DELETE FROM transactions WHERE user_id = 'USER_ID_HERE';
DELETE FROM ai_bot_trades WHERE user_id = 'USER_ID_HERE';
DELETE FROM performance_data WHERE user_id = 'USER_ID_HERE';
```

## Programmatic Access (Optional)

You can also use the helper function available in the codebase:

```javascript
import { activatePortfolio, updateDashboardData } from './lib/supabaseData';

// Activate a portfolio programmatically
await activatePortfolio('user-id', 5000);

// Update dashboard data
await updateDashboardData('user-id', {
  totalInvested: 10000,
  currentPortfolioValue: 11500,
  dailyProfitPercentage: 3.2
});
```
