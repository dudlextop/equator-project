# Equator DEX - Decentralized Exchange Prototype

A showcase-ready prototype of a CLOB-style decentralized exchange built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Phantom Wallet Integration**: Connect with Solana's most popular wallet
- **Dark Theme UI**: Professional dark theme with neon accents inspired by Raydium/Jupiter
- **Order Book**: Real-time order book with bids (green) and asks (red) visualization
- **Trading Panel**: BUY/SELL order placement with wallet validation
- **My Orders**: Order management with cancel functionality
- **Recent Trades**: Live trade stream with mock data
- **Markets**: Market overview with price changes and volume
- **Responsive Design**: Desktop-first responsive layout
- **Mock API**: Complete mock data layer for realistic demo experience

## 🎨 Design

- **Color Scheme**: Deep navy background (#0a0a0f) with violet/emerald accents
- **Typography**: JetBrains Mono for professional trading terminal feel
- **Animations**: Smooth transitions, hover effects, and subtle animations
- **UI Components**: Clean, modern components with consistent spacing

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **Create React App** for build tooling

## 🚀 Getting Started

1. **Install Phantom Wallet**:
   - Download from [phantom.app](https://phantom.app/)
   - Install the browser extension
   - Create or import a wallet

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm start
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 📱 Usage

1. **Connect Wallet**: Click "Connect Wallet" to connect your Phantom wallet
2. **Trade Tab**: Place BUY/SELL orders with price and quantity inputs (requires wallet connection)
3. **Order Book Tab**: View real-time order book depth
4. **My Orders Tab**: Manage your active orders with cancel functionality (requires wallet connection)
5. **Markets Tab**: Browse available trading pairs and market data

## 🔧 Mock Data

The application uses a comprehensive mock API that simulates:
- Real-time order book updates
- Random trade generation
- Market price fluctuations
- Order placement and cancellation
- Network delays for realistic feel

## 🎯 Demo Features

- **Phantom Wallet Integration**: Real wallet connection with address display and balance
- **Interactive Order Placement**: Fill out the form and place orders (requires wallet)
- **Order Management**: Cancel orders from the My Orders tab (requires wallet)
- **Live Data Updates**: All data refreshes automatically
- **Responsive Design**: Works on desktop and mobile devices
- **Professional UI**: Looks like a real trading terminal

## 📦 Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # App header with wallet connect
│   ├── Navigation.tsx  # Tab navigation
│   ├── OrderBook.tsx   # Order book display
│   ├── TradePanel.tsx  # Order placement form
│   ├── MyOrders.tsx    # Order management
│   ├── RecentTrades.tsx # Trade stream
│   └── Markets.tsx     # Market overview
├── contexts/           # React contexts
│   └── WalletContext.tsx # Phantom wallet integration
├── services/           # Mock API layer
│   └── mockApi.ts     # Mock data and API calls
├── types/             # TypeScript type definitions
│   └── index.ts       # Shared types
└── App.tsx            # Main application component
```

## 🎨 Customization

The design system is built with Tailwind CSS and can be easily customized:

- **Colors**: Update `tailwind.config.js` for different color schemes
- **Animations**: Modify animation classes for different effects
- **Layout**: Adjust grid layouts and spacing as needed
- **Components**: Extend or modify components for additional features

## 🚀 Deployment

The application builds to static files and can be deployed to any static hosting service:

```bash
npm run build
# Deploy the 'build' folder to your hosting service
```

## 📄 License

This is a hackathon prototype project. Feel free to use and modify as needed.

---

**Built with ❤️ for the hackathon showcase**