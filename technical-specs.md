This is an autotrade platform, where users can connect their exchange via api keys, 
create an entity called "autotraders" where each autotrader can have its own configuration (pair, trading plan, one autotrader only belongs to one exchange account, has one trading pair, margin/initial investment, and it's json message for tradingview alert), create user's own trading plan, or subscribe to other users' trading plans to copy trade using webhook alerts from their tradingview, do trades using API, and track it's position fills, order-position lifecycle, pnl, etc. Think about Etoro (https://www.etoro.com) or TradersFamily (https://tradersfamily.id).

There are 4 main menus:
1. Dashboard (screenshot: ./screenshots/dashboard.png)
    There are two columns in this page. The center column there's "Equity Summary", chart, "Accounts Summary", and "Top Autotraders".
    This part shows equity summary with badges which shows changes (red if negative change, green for positive change), has a line chart to show timescale of equity changes using ChartJs, can be show in 7D, 30D, 90D, and All.
    Below the chart there's "Account Summary" which is the list of connected exchange accounts and it's corresponding equity summary. Next to the list of accounts there's donut chart to show the distribution of equity among accounts. 
    Below account summary component there's "Top Autotraders" which is the list of autotraders with highest pnl in the last 30 days. Each autotrader has a badge which shows changes (red if negative change, green for positive change), number of trades, pair which the autotrader trades on, and small line chart showing the pnl and in the bottom there's a button "View Autotrader".
    The second column there are "Trade History", "Data Overview", and "Become Affiliate" section.
    The "Trade History" component shows the list of trades that we have, showing which exchange account it belongs to, what pair, what action (Sell/Buy/Close/Cancel), what's the profit in dollars and percent, time of trade (x days ago), and "Share" button.
    "Data overview" shows number of accounts connected, number of autotraders we have, number of trades we have, and the summary of total PNL which has green/red color, also ROI below that.
    "Become affiliate" shows interaction data like clicks, signups, and earnings under our account.
2. Accounts (screenshot: ./screenshots/accounts.png)
    This part shows the list of connected exchange accounts, showing account name, account type (spot/margin), and the equity summary. There's also donut chart to show the distribution of equity among accounts.
3. Autotraders (screenshot: ./screenshots/autotraders.png)
    This shows chart and table of autotraders. Each row has status, name of the trading, pair on which it trades on, exchange name (like Binance/Gate/Hyperliquid), capital, pnl ($), win rate, running, action ("start/stop" button), detail ("view" button).
    When view is clicked, there's detail of autotraders (screenshot: ./screenshots/autotrader-detail.png).
    Detail autotraders has 6 components:
    - identity
    autotrader info (id), status, created at, capita per trade. exchange ,pair, market type (futures/spot), leverage number and type (e.g. 50x isolated)
    - pnl snapshot
    total pnl, 7d, 30d, and 90D change respectively.
    - action button
    start/stop, cancel all pending orders, close all positions
    - recent trade executions
    Table of last 10 trades for that particular autotrader 
    - trade setup 
    total profit, total loss, total trades, win rate, running positions, pending orders, profit factor, risk:reward ratio, max capital used, max concurrent positions
    - json payload message
    the JSON generator for Tradingview alert message JSON. there are field showing JSON, and a "Copy" button to copy the JSON.
4. Trade History (screenshot: ./screenshots/trade-history.png)
    Here's the list of trades we do on this platform. It has filter component on top, and table of trades.
    The filter component has "Date Range", "Account", "Market" (spot/futures), "Pairs" (all/specific pair like BTC/USDT), "Side" (Buy/Sell/Close/Cancel), "Status" (Open/Closed/Canceled)
    The table has these columns:
    - time
    - exchange
    - market
    - pair 
    - action
    - price
    - quantity
    - value
    - fee
    - pnl
    - status
    - trading plan
    - account

Layout of this app:
- Navbar
- Collapsible sidebar
- Main content

Framework:
- React Vite
- React Router
- ChartJs
- Tailwind & Shadcn UI
- React Query
- Zustand for context (I prefer not use React Context)
- Lucide React Icons
- Firebase auth
