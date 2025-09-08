# URL Shortener Frontend

A modern, responsive URL shortener application built with Next.js, TypeScript, and Material-UI.

## Features

- **URL Shortening**: Create short, memorable URLs from long links
- **Custom Validity**: Set expiration time for shortened URLs (1 minute to 24 hours)
- **Analytics Dashboard**: Track clicks, locations, and performance metrics
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Validation**: Client-side URL validation with helpful error messages
- **Copy to Clipboard**: Easy sharing with one-click copy functionality

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Material-UI (MUI)** - Modern React component library
- **React Hook Form** - Efficient form handling
- **Yup** - Schema validation
- **Axios** - HTTP client for API calls

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on port 3001

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Create environment file:
```bash
# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Shortening URLs

1. Navigate to the home page
2. Enter a valid URL (must start with http:// or https://)
3. Optionally set a custom validity period (default: 30 minutes)
4. Click "Shorten URL" to generate a short link
5. Copy the generated short URL to share

### Viewing Analytics

1. Click "View Stats" in the navigation
2. Enter the short code of your shortened URL
3. View detailed analytics including:
   - Total click count
   - Creation and expiration dates
   - Click history with timestamps
   - IP addresses and locations
   - User agents

## API Integration

The frontend communicates with the backend API through the following endpoints:

- `POST /shorturls` - Create a new short URL
- `GET /shorturls/:shortCode` - Get URL statistics

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with navigation
│   ├── page.tsx            # Home page with URL shortener
│   └── stats/
│       └── page.tsx        # Analytics page
├── components/
│   ├── Navigation.tsx      # Top navigation bar
│   ├── UrlShortener.tsx    # URL shortening form
│   └── UrlStats.tsx        # Analytics dashboard
├── types/
│   └── index.ts            # TypeScript type definitions
├── utils/
│   ├── api.ts              # API service functions
│   └── validation.ts       # Form validation schemas
└── theme.ts                # Material-UI theme configuration
```

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API base URL (default: http://localhost:3001)

## Building for Production

```bash
npm run build
npm start
```

## Known Limitations

- URLs must be valid and start with http:// or https://
- Validity period is limited to 1-1440 minutes (24 hours max)
- Analytics require the backend to track click data
- Short codes are 6-8 alphanumeric characters

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of a coding assignment and is for educational purposes.