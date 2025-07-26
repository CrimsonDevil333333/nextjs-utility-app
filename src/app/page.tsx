// app/page.tsx - Update this file
import Link from 'next/link';

// Expanded data structure for our utility pages
const utilities = [
  { name: 'Metric Converter', href: '/metric-converter', description: 'Convert length, weight, and volume.', emoji: '📏' },
  { name: 'JWT Decoder', href: '/jwt-decoder', description: 'Decode and inspect JWT tokens.', emoji: '🔐' },
  { name: 'Currency Converter', href: '/currency-converter', description: 'Real-time exchange rates.', emoji: '💸' },
  { name: 'Base64 Converter', href: '/base64-converter', description: 'Encode and decode Base64 text.', emoji: '📰' },
  { name: 'Hash Generator', href: '/hash-generator', description: 'Generate SHA-256/512 hashes.', emoji: '🛡️' },
  { name: 'Color Converter', href: '/color-converter', description: 'Convert HEX, RGB, and HSL colors.', emoji: '🎨' },
  { name: 'URL Encoder', href: '/url-encoder', description: 'Encode & decode URL components.', emoji: '🔗' },
  { name: 'JSON Formatter', href: '/json-formatter', description: 'Beautify and validate JSON data.', emoji: '📑' },
  { name: 'UUID Generator', href: '/uuid-generator', description: 'Generate universally unique IDs.', emoji: '🆔' },
  { name: 'Lorem Ipsum', href: '/lorem-ipsum', description: 'Generate placeholder text.', emoji: '✍️' },
  { name: 'Text Case Converter', href: '/text-case-converter', description: 'Convert text between various casing conventions.', emoji: '🔡' },
  { name: 'Epoch Converter', href: '/epoch-converter', description: 'Convert Unix timestamps to human-readable dates.', emoji: '⏰' },
  { name: 'CSV & JSON Converter', href: '/csv-json-converter', description: 'Transform data between CSV and JSON formats.', emoji: '🔄' },
  // Add the new utilities here:
  { name: 'Word Counter', href: '/word-counter', description: 'Count words, characters, and lines in text.', emoji: '📊' },
  { name: 'Percentage Calculator', href: '/percentage-calculator', description: 'Calculate various percentages.', emoji: '🔢' },
  { name: 'Date Calculator', href: '/date-difference', description: 'Calculate date differences or add/subtract from dates.', emoji: '🗓️' },
  { name: 'Random Generator', href: '/random-generator', description: 'Generate random numbers or secure passwords.', emoji: '🎲' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-2 text-gray-900 dark:text-gray-100">Utility Belt</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12">A collection of handy tools for everyday tasks.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {utilities.map((util) => (
            <Link href={util.href} key={util.name} className="group block">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-200 dark:border-gray-700 h-full flex flex-col">
                <span className="text-3xl mb-3">{util.emoji}</span>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 flex-grow">{util.name}</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{util.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}