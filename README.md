# Next.js Utility App

## Description
This is a Next.js application providing a collection of various utility tools for everyday tasks. It aims to be a one-stop solution for common conversions, generators, and formatters.

## Features
- **About Page**: General information about the application.
- **Base64 Converter**: Encode and decode Base64 strings.
- **Color Converter**: Convert between different color formats.
- **Cron Generator**: Generate cron expressions.
- **CSV to JSON Converter**: Convert CSV data to JSON format.
- **Currency Converter**: Convert between different currencies.
- **Date Difference Calculator**: Calculate the difference between two dates.
- **Epoch Converter**: Convert between human-readable dates and Unix epoch timestamps.
- **Find and Replace**: Perform find and replace operations on text.
- **Hash Generator**: Generate various types of cryptographic hashes.
- **HTML Entities Converter**: Encode and decode HTML entities.
- **JSON Formatter**: Format and beautify JSON data.
- **JWT Decoder**: Decode JSON Web Tokens.
- **Lorem Ipsum Generator**: Generate placeholder Lorem Ipsum text.
- **Markdown Previewer**: Preview Markdown text.
- **Metric Converter**: Convert between different metric units.
- **Percentage Calculator**: Calculate percentages.
- **Random Generator**: Generate random numbers, strings, etc.
- **Text Case Converter**: Convert text between different cases (e.g., uppercase, lowercase, title case).
- **Text Diff**: Compare two texts and highlight differences.
- **URL Encoder/Decoder**: Encode and decode URLs.
- **URL Parser**: Parse URLs into their components.
- **UUID Generator**: Generate Universally Unique Identifiers.
- **Word Counter**: Count words, characters, and lines in a text.
- **XML Formatter**: Format and beautify XML data.

## Technologies Used
- Next.js
- React
- TypeScript
- Tailwind CSS
- cron-parser
- date-fns
- diff-match-patch
- jose
- jwt-decode
- lucide-react
- qrcode.react
- react-markdown
- react-syntax-highlighter
- remark-gfm

## Setup and Installation
To set up the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd nextjs-utility-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## How to Run
To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building for Production
To build the application for production:

```bash
npm run build
```

## Live Demo
This application is hosted on Cloudflare Pages and can be accessed at: [https://utility.crimsondevil.qzz.io/](https://utility.crimsondevil.qzz.io/)

## Deployment
This project can be deployed to Cloudflare Pages using the following commands:

1. **Build for Cloudflare Pages**:
   ```bash
   npm run pages:build
   ```

2. **Preview locally with Wrangler**:
   ```bash
   npm run preview
   ```

3. **Deploy to Cloudflare Pages**:
   ```bash
   npm run deploy
   ```

## Contributing
Contributions are welcome! If you have any ideas for new utilities, improvements, or bug fixes, please feel free to open an issue or submit a pull request.
