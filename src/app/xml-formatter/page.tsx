'use client';

import { useState, useCallback, useMemo } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';
import { Copy, Check, X, Palette, Code, Zap } from 'lucide-react';
import { HapticLinks } from '../about/components/HapticLinks';

// --- Reusable Components ---

function CopyButton({ valueToCopy, ariaLabel }: { valueToCopy: string; ariaLabel: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (valueToCopy) {
      try {
        await navigator.clipboard.writeText(valueToCopy);
        setCopied(true);
        triggerHapticFeedback();
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  }, [valueToCopy]);

  const isValueEmpty = !valueToCopy;

  return (
    <button
      onClick={handleCopy}
      disabled={isValueEmpty}
      className={`p-2 rounded-md transition-all duration-200 ease-in-out ${isValueEmpty ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
}

// --- XML Formatting Logic ---

const formatXml = (xml: string, indent: string) => {
  let formatted = '';
  const regex = /(>)(<)(\/?)/g;
  const xmlFormatted = xml.replace(regex, '$1\r\n$2$3');
  let pad = 0;
  const nodes = xmlFormatted.split('\r\n');

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    let indentChar = '';

    if (node.match(/<\/\w/) || node.match(/<.+\/>/)) {
      pad -= 1;
    }

    for (let j = 0; j < pad; j++) {
      indentChar += indent;
    }

    formatted += indentChar + node + '\r\n';

    if (node.match(/<\w[^>]*[^\/]>($|<\/\w)/) && !node.match(/<\/\w/)) {
      pad += 1;
    }
  }
  return formatted.trim();
};

const highlightXml = (xml: string) => {
  return xml
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/(".*?")/g, '<span class="text-green-500">$1</span>')
    .replace(/(&lt;\/?)(.*?)(&gt;)/g, '<span class="text-gray-500">$1</span><span class="text-red-500">$2</span><span class="text-gray-500">$3</span>');
};

export default function AboutPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-10 text-gray-900 dark:text-gray-100">
          About The Dev Toolkit
        </h1>

        <section className="mb-10 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Our Mission</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            The Dev Toolkit is a passion project aimed at providing a comprehensive, easy-to-use, and highly accessible collection of over <strong>45+ online utilities</strong>. Our goal is to streamline workflows and make complex operations simple for everyone.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Whether you're a developer needing to format JSON, a designer creating a favicon, or just looking to play a quick game of Minesweeper, this toolkit is built for you. We are constantly working to expand our offerings and ensure a smooth, intuitive user experience.
          </p>
        </section>

        <section className="mb-10 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Code className="mx-auto w-12 h-12 text-blue-500 mb-2" />
              <h3 className="font-bold">For Developers</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tools for formatting, converting, and generating code and data.</p>
            </div>
            <div className="text-center">
              <Palette className="mx-auto w-12 h-12 text-pink-500 mb-2" />
              <h3 className="font-bold">For Designers</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Utilities for color, typography, and image manipulation.</p>
            </div>
            <div className="text-center">
              <Zap className="mx-auto w-12 h-12 text-yellow-500 mb-2" />
              <h3 className="font-bold">For Everyone</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">A collection of fun and useful tools for everyday tasks.</p>
            </div>
          </div>
        </section>

        <section className="mb-10 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Built With</h2>
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900/50 dark:text-blue-200 text-sm font-medium">Next.js</span>
            <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full dark:bg-purple-900/50 dark:text-purple-200 text-sm font-medium">React</span>
            <span className="px-4 py-2 bg-teal-100 text-teal-800 rounded-full dark:bg-teal-900/50 dark:text-teal-200 text-sm font-medium">Tailwind CSS</span>
            <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full dark:bg-yellow-900/50 dark:text-yellow-200 text-sm font-medium">TypeScript</span>
            <span className="px-4 py-2 bg-pink-100 text-pink-800 rounded-full dark:bg-pink-900/50 dark:text-pink-200 text-sm font-medium">Lucide React</span>
            <span className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full dark:bg-indigo-900/50 dark:text-indigo-200 text-sm font-medium">React Markdown</span>
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full dark:bg-green-900/50 dark:text-green-200 text-sm font-medium">Random Words</span>
            <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full dark:bg-red-900/50 dark:text-red-200 text-sm font-medium">SQL Formatter</span>
            <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full dark:bg-orange-900/50 dark:text-orange-200 text-sm font-medium">Date FNS</span>
            <span className="px-4 py-2 bg-cyan-100 text-cyan-800 rounded-full dark:bg-cyan-900/50 dark:text-cyan-200 text-sm font-medium">Image Compression</span>
          </div>
        </section>

        <section className="mb-10 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">About the Creator</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Hello! I'm Satyaa G, the developer behind The Dev Toolkit. This project started as a way for me to hone my skills in modern web development, particularly with Next.js, React, and Tailwind CSS, while also building practical tools that I found myself frequently needing.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            I'm passionate about creating efficient and user-friendly applications. You can connect with me and see more of my work on my professional profiles:
          </p>
          <HapticLinks type="social" />
        </section>

        <section className="mb-10 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Feedback & Support</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Your feedback is invaluable! If you have suggestions for new tools, ideas for improvements, or encounter any issues, please don't hesitate to reach out.
          </p>
          <div className="text-center">
            <HapticLinks type="feedback" />
          </div>
        </section>

        <section className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Contribute</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            This project is open source and we welcome contributions from the community. Whether it's a bug fix, a new feature, or a suggestion, we'd love to hear from you.
          </p>
          <div className="text-center">
            <HapticLinks type="contribute" />
          </div>
        </section>
      </div>
    </main>
  );
}
