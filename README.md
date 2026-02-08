# React Router App - Data Monitoring Dashboard

A modern, full-stack React application for monitoring and displaying real-time data feeds including Bitcoin prices, ETF dividends, Thai gold prices, and user directory.

**Tech Stack:**
- React Router v7 with Server-Side Rendering
- Tailwind CSS v4 with Shadcn/ui Components
- TanStack Query for server state management
- better-result for type-safe error handling
- TypeScript for full type safety

## Features

- 🪙 **Bitcoin Price Feed** - Real-time Bitcoin prices in USD, EUR, THB
- 📈 **ETF Dividend Tracker** - Top dividend-paying ETFs with yield information
- 🥇 **Thai Gold Prices** - Gold bar and ornament prices with buy/sell spreads
- 👥 **User Directory** - JSONPlaceholder user listing with contact information
- 🎨 **Shadcn/ui Components** - Beautiful, accessible UI components
- 🔒 **Type-Safe Errors** - Better-result for error handling without try/catch
- ⚡ **Smart Caching** - TanStack Query with optimized stale times and refetch intervals
- 🌓 **Dark Mode Support** - Built-in theme switching with CSS variables

## Project Structure

```
app/
├── components/          # React components
│   ├── ui/             # Shadcn/ui components
│   ├── bitcoin-feed.tsx
│   ├── etf-feed.tsx
│   ├── gold-feed.tsx
│   └── user-feed.tsx
├── hooks/              # Custom hooks
│   ├── useBitcoinPrice.ts
│   ├── useETFData.ts
│   ├── useGoldPrice.ts
│   └── useUsers.ts
├── services/           # API service layer
│   ├── bitcoin.service.ts
│   ├── etf.service.ts
│   ├── gold.service.ts
│   └── user.service.ts
├── lib/               # Utilities
│   ├── api.ts        # Safe fetch wrappers with better-result
│   ├── errors.ts     # Custom error types
│   └── utils.ts
├── routes/           # Route components
└── types/            # TypeScript types
```

## Agent Skills

This project leverages AI coding agent skills for best practices and architecture patterns. Available skills in `.agents/skills/`:

- **tailwind-v4-shadcn** - Tailwind CSS v4 with Shadcn/ui component patterns
- **tailwind-best-practices** - Tailwind CSS styling guidelines and design system consistency
- **tanstack-query-best-practices** - TanStack Query data fetching and server state management
- **tanstack-router-best-practices** - React Router type-safe routing and data loading
- **tanstack-start-best-practices** - Full-stack React application patterns and SSR
- **better-result-adopt** - Type-safe error handling without try/catch blocks
- **vercel-react-best-practices** - React performance optimization and bundle efficiency

These skills guide implementation decisions and code quality standards throughout the project.

## Getting Started

### Installation

```bash
# Using pnpm (recommended)
pnpm install

# Or npm
npm install
```

### Development

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`.

### Type Checking

```bash
pnpm typecheck
```

## Building for Production

Create a production build:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

## Data Sources

### Bitcoin Feed
- **API:** blockchain.info ticker
- **Update:** 30 seconds
- **Currencies:** USD, EUR, THB

### ETF Data
- **Data:** Simulated with static ETF database
- **Update:** 60 seconds with random price fluctuations
- **Includes:** Dividend yields, expense ratios, AUM

### Gold Prices
- **API:** chnwt.dev Thai Gold API
- **Update:** 60 seconds
- **Products:** Gold bars and ornaments with buy/sell prices

### User Directory
- **API:** JSONPlaceholder
- **Update:** On-demand refresh
- **Features:** User info, contact details, company association

## Architecture

### Service Layer (Type-Safe Error Handling)

All services use `better-result` for type-safe error handling:

```typescript
// Example: fetchBitcoinPrice()
export async function fetchBitcoinPrice(): Promise<
  Result<BitcoinData, FetchError>
> {
  const result = await safeFetch<BitcoinRawResponse>(BITCOIN_API);
  if (result.isErr()) {
    return result;
  }
  // Transform and return
  return Result.ok(transformedData);
}
```

### Custom Hooks (TanStack Query)

Hooks manage caching and refetching with proper error handling:

```typescript
export function useBitcoinPrice() {
  return useQuery({
    queryKey: ["bitcoin-price"],
    queryFn: async () => {
      const result = await fetchBitcoinPrice();
      if (result.isErr()) throw new Error(result.error.message);
      return result.value;
    },
    staleTime: 5 * 60 * 1000,      // 5 minutes
    refetchInterval: 30 * 1000,    // 30 seconds
    retry: 3,
  });
}
```

### Components (Shadcn/ui)

Components use shadcn/ui for consistent, accessible UI:
- `Card` - Data containers
- `Badge` - Status indicators
- `Button` - Actions
- `Skeleton` - Loading states

## Styling

- **Tailwind v4** - Utility-first CSS
- **Shadcn/ui** - Pre-built, accessible components
- **CSS Variables** - Theme customization (`--primary`, `--background`, etc.)
- **Dark Mode** - Automatic via `.dark` class

## Docker Deployment

```bash
docker build -t my-react-router-app .
docker run -p 3000:3000 my-react-router-app
```

Can be deployed to:
- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Railway
- Fly.io

## Scripts

```bash
pnpm dev         # Start development server
pnpm build       # Build for production
pnpm start       # Start production server
pnpm typecheck   # Run TypeScript type checking
pnpm clean       # Remove node_modules and lock file
```

## Best Practices

### Error Handling
- Uses `better-result` to avoid try/catch blocks
- All API calls return `Result<T, FetchError>`
- Services never throw errors to consumers

### Data Fetching
- All fetching happens in service layer
- Hooks use TanStack Query for caching
- Optimized stale times per data type

### Type Safety
- Full TypeScript across all files
- Strict type definitions for API responses
- Exported types from services and hooks

### UI/UX
- Skeleton loading states during fetch
- Error boundaries with retry functionality
- Responsive design with Tailwind
- Accessible components from shadcn/ui

---

Built with ❤️ using React Router, TanStack Query, and Shadcn/ui.
