// app/data/utilities.ts

export type Utility = {
  name: string;
  href: string;
  description: string;
  emoji: string;
  category: string;
};

export const utilities: Utility[] = [
  { name: 'Metric Converter', href: '/metric-converter', description: 'Convert length, weight, and volume.', emoji: '📏', category: 'Converters' },
  { name: 'JWT Decoder', href: '/jwt-decoder', description: 'Decode and inspect JWT tokens.', emoji: '🔐', category: 'Developers' },
  { name: 'Currency Converter', href: '/currency-converter', description: 'Real-time exchange rates.', emoji: '💸', category: 'Finance' },
  { name: 'Base64 Converter', href: '/base64-converter', description: 'Encode and decode Base64 text.', emoji: '📰', category: 'Converters' },
  { name: 'Hash Generator', href: '/hash-generator', description: 'Generate SHA-256/512 hashes.', emoji: '🛡️', category: 'Security' },
  { name: 'Color Converter', href: '/color-converter', description: 'Convert HEX, RGB, and HSL colors.', emoji: '🎨', category: 'Design' },
  { name: 'URL Encoder', href: '/url-encoder', description: 'Encode & decode URL components.', emoji: '🔗', category: 'Developers' },
  { name: 'JSON Formatter', href: '/json-formatter', description: 'Beautify and validate JSON data.', emoji: '📑', category: 'Developers' },
  { name: 'UUID Generator', href: '/uuid-generator', description: 'Generate universally unique IDs.', emoji: '🆔', category: 'Developers' },
  { name: 'Lorem Ipsum', href: '/lorem-ipsum', description: 'Generate placeholder text.', emoji: '✍️', category: 'Text' },
  { name: 'Text Case Converter', href: '/text-case-converter', description: 'Convert text between various casing conventions.', emoji: '🔡', category: 'Text' },
  { name: 'Epoch Converter', href: '/epoch-converter', description: 'Convert Unix timestamps to human-readable dates.', emoji: '⏰', category: 'Time & Date' },
  { name: 'CSV & JSON Converter', href: '/csv-json-converter', description: 'Transform data between CSV and JSON formats.', emoji: '🔄', category: 'Converters' },
  { name: 'Word Counter', href: '/word-counter', description: 'Count words, characters, and lines in text.', emoji: '📊', category: 'Text' },
  { name: 'Percentage Calculator', href: '/percentage-calculator', description: 'Calculate various percentages.', emoji: '🔢', category: 'Math' },
  { name: 'Date Calculator', href: '/date-difference', description: 'Calculate date differences or add/subtract from dates.', emoji: '🗓️', category: 'Time & Date' },
  { name: 'Random Generator', href: '/random-generator', description: 'Generate random numbers or secure passwords.', emoji: '🎲', category: 'Tools' },
  { name: 'XML Formatter', href: '/xml-formatter', description: 'Beautify and view XML data.', emoji: '📁', category: 'Developers' },
  { name: 'URL Parser/Builder', href: '/url-parser', description: 'Deconstruct or construct URLs.', emoji: '🌐', category: 'Developers' },
  { name: 'CRON Generator/Parser', href: '/cron-generator', description: 'Create and understand CRON job expressions.', emoji: '🕰️', category: 'Developers' },
  { name: 'HTML Entities', href: '/html-entities', description: 'Encode/decode HTML special characters.', emoji: '↔️', category: 'Text' },
  { name: 'Find & Replace', href: '/find-replace', description: 'Search and replace text with options.', emoji: '🔍', category: 'Text' },
  { name: 'Text Diff Checker', href: '/text-diff', description: 'Compare two texts and highlight differences.', emoji: '🔀', category: 'Text' },
  { name: 'Tic Tac Toe', href: '/tic-tac-toe', description: 'Play a classic game of Tic Tac Toe.', emoji: '⭕', category: 'Games' },
  { name: 'Coin Toss', href: '/coin-toss', description: 'Flip a coin to make a decision.', emoji: '🪙', category: 'Games' },
  { name: 'Dice Roll', href: '/dice-roll', description: 'Roll a dice for random numbers.', emoji: '🎲', category: 'Games' },
  { name: 'Sudoku', href: '/sudoku', description: 'A classic number puzzle game.', emoji: '🔢', category: 'Games' },
  { name: 'Image Compressor', href: '/image-compressor', description: 'Compress and resize images in your browser.', emoji: '🖼️', category: 'Tools' },
  { name: 'Minesweeper', href: '/minesweeper', description: 'Play the classic game of Minesweeper.', emoji: '💣', category: 'Games' },
  { name: 'QR Code Generator', href: '/qr-code-generator', description: 'Create and customize QR codes for any text or URL.', emoji: '📲', category: 'Tools' },
];