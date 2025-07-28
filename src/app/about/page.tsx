// app/about/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About - Dev Toolkit',
  description: 'Learn more about the Dev Toolkit project, its mission, and its creator, Satyaa G.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-10 text-gray-900 dark:text-gray-100">
          About The Dev Toolkit
        </h1>

        {/* Section: What is this project? */}
        <section className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            The Dev Toolkit is a passion project aimed at providing a comprehensive, easy-to-use, and highly accessible collection of over <strong>45+ online utilities</strong>. Our goal is to streamline workflows and make complex operations simple for everyone.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Whether you're a developer needing to format JSON, a designer creating a favicon, or just looking to play a quick game of Minesweeper, this toolkit is built for you. We are constantly working to expand our offerings and ensure a smooth, intuitive user experience.
          </p>
        </section>

        {/* Section: Technologies Used */}
        <section className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Built With
          </h2>
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200 text-sm font-medium">Next.js</span>
            <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full dark:bg-purple-900 dark:text-purple-200 text-sm font-medium">React</span>
            <span className="px-4 py-2 bg-teal-100 text-teal-800 rounded-full dark:bg-teal-900 dark:text-teal-200 text-sm font-medium">Tailwind CSS</span>
            <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full dark:bg-yellow-900 dark:text-yellow-200 text-sm font-medium">TypeScript</span>
            <span className="px-4 py-2 bg-pink-100 text-pink-800 rounded-full dark:bg-pink-900 dark:text-pink-200 text-sm font-medium">Lucide React</span>
            <span className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full dark:bg-indigo-900 dark:text-indigo-200 text-sm font-medium">React Markdown</span>
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full dark:bg-green-900 dark:text-green-200 text-sm font-medium">Random Words</span>
            <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full dark:bg-red-900 dark:text-red-200 text-sm font-medium">SQL Formatter</span>
            <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full dark:bg-orange-900 dark:text-orange-200 text-sm font-medium">Date FNS</span>
            <span className="px-4 py-2 bg-cyan-100 text-cyan-800 rounded-full dark:bg-cyan-900 dark:text-cyan-200 text-sm font-medium">Image Compression</span>
          </div>
        </section>

        {/* Section: About Me / The Creator */}
        <section className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            About the Creator
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Hello! I'm Satyaa G, the developer behind The Dev Toolkit. This project started as a way for me to hone my skills in modern web development, particularly with Next.js, React, and Tailwind CSS, while also building practical tools that I found myself frequently needing.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            I'm passionate about creating efficient and user-friendly applications. You can connect with me and see more of my work on my professional profiles:
          </p>
          <div className="flex gap-4 justify-center sm:justify-start">
            <Link href="https://github.com/CrimsonDevil333333" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg shadow hover:bg-gray-700 transition-colors dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017 2 16.223 4.673 19.72 8.241 20.94c.408.076.559-.176.559-.387 0-.191-.007-.696-.011-1.365-2.227.485-2.695-.91-2.695-.91-.364-.924-.888-1.171-1.171-1.171-.722-.49-.054-.48.04-.473.67.047 1.022.69 1.022.69.596 1.029 1.562.73 1.942.559.06-.436.234-.73.427-.897-1.48-.168-3.04-.739-3.04-3.27 0-.726.257-1.32.68-1.782-.068-.168-.295-.845.065-1.76 0 0 .554-.179 1.815.688.525-.145 1.085-.218 1.643-.221.558.003 1.118.076 1.643.221 1.26-.867 1.815-.688 1.815-.688.36 1.065.132 1.592.065 1.76.425.462.682 1.056.682 1.782 0 2.537-1.563 3.097-3.048 3.264.238.204.453.606.453 1.222 0 .883-.007 1.597-.011 1.815 0 .213.144.467.564.386C19.327 19.715 22 16.218 22 12.017 22 6.484 17.523 2 12 2Z" clipRule="evenodd" /></svg>
              GitHub
            </Link>
            <Link href="https://www.linkedin.com/in/satyaa-g-b4b399111/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-600 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.563c0-1.332-.023-3.054-1.852-3.054-1.853 0-2.136 1.445-2.136 2.964v5.653H9.103V9.216h3.411v1.564h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.287zM5.77 7.929c-1.168 0-2.112-.943-2.112-2.111 0-1.168.944-2.112 2.112-2.112 1.168 0 2.111.944 2.111 2.112 0 1.168-.943 2.111-2.111 2.111zm1.782 12.523H3.988V9.216h3.564v11.236zM22.227 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.456c.979 0 1.772-.773 1.772-1.729V1.729C24 .774 23.207 0 22.227 0z"></path></svg>
              LinkedIn
            </Link>
          </div>
        </section>

        {/* Section: Feedback & Contact */}
        <section className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Feedback & Support
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Your feedback is invaluable! If you have suggestions for new tools, ideas for improvements, or encounter any issues, please don't hesitate to reach out.
          </p>
          <div className="text-center">
             <Link
                href="https://github.com/CrimsonDevil333333/nextjs-utility-app/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.105A9.702 9.702 0 0112 4c4.97 0 9 3.582 9 8z"></path></svg>
                Report an Issue / Suggest Feature
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}