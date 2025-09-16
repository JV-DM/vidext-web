# Vidext Drawing Editor

Simple drawing editor with auto-save functionality built with Next.js, tRPC, and Tldraw.

## Live Demo

🌐 **Try it live:** [https://vidext-web-s9ep.vercel.app](https://vidext-web-s9ep.vercel.app)


## Setup Instructions

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## How to Run the App

### Development Mode

```bash
npm run dev
```

Open http://localhost:3000 in your browser and start drawing! (Port may vary if 3000 is in use)

### Production Mode

```bash
npm run build
npm start
```

### Code Quality

```bash
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
```

## Testing

### Run All Tests

```bash
npm run test
```

## API Endpoints

The app uses tRPC for type-safe API communication:

### Get Store Data

```typescript
// Retrieves current drawing data
const data = await trpc.editor.getStoreData.useQuery();
```

### Save Store Data

```typescript
// Saves drawing data with debounced auto-save
const saveStoreData = trpc.editor.saveStoreData.useMutation();
saveStoreData.mutate({ data: snapshot });
```

### Testing API Calls

You can test the API endpoints directly:

```bash
# Example: Test saving data (adjust port as needed)
curl -X POST http://localhost:3000/api/trpc/editor.saveStoreData \
  -H "Content-Type: application/json" \
  -d '{"data": {"test": "drawing data"}}'

# Example: Test getting data
curl http://localhost:3000/api/trpc/editor.getStoreData
```

## Features

- Drawing canvas powered by tldraw
- Auto-saves your work every 500ms using debounced persistence
- Persists across browser refreshes
- Type-safe API with tRPC
- Comprehensive test coverage
- ESLint and Prettier for code quality
