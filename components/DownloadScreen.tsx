'use client';

import { useState } from 'react';
import { BookFormData, GeneratedBook } from '@/lib/types';
import BookPageCard from './BookPageCard';

interface DownloadScreenProps {
  book: GeneratedBook;
  formData: BookFormData;
  onStartOver: () => void;
}

export default function DownloadScreen({ book, formData, onStartOver }: DownloadScreenProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  async function handleDownloadPDF() {
    setDownloading(true);
    setDownloadError(null);
    try {
      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ book }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to generate PDF.');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formData.childName}s-story.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to download PDF.';
      setDownloadError(message);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="min-h-screen bg-book-cream px-4 py-12">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h1 className="font-heading text-4xl text-gray-800">{book.title}</h1>
          <p className="font-body text-gray-500 text-sm mt-2 italic">{book.dedication}</p>
          <div className="mt-6">
            {book.pages.map((page, i) => (
              <BookPageCard key={page.pageNumber} page={page} index={i} />
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-8 self-start">
          <div className="bg-white rounded-4xl shadow-card p-8">
            <h2 className="font-heading text-2xl text-book-coral">Your book is ready!</h2>
            <ul className="mt-4 space-y-2 font-body text-gray-700 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-book-green">✓</span> 12 personalized pages
              </li>
              <li className="flex items-center gap-2">
                <span className="text-book-green">✓</span> Print-ready PDF (8.5×8.5in)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-book-green">✓</span> Illustrated with AI art
              </li>
            </ul>

            {downloadError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 font-body text-sm mt-4">
                {downloadError}
              </div>
            )}

            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="w-full mt-6 bg-book-coral text-white font-heading text-xl px-8 py-4 rounded-full shadow-button hover:scale-105 transition-transform disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {downloading ? 'Generating PDF...' : 'Download PDF 📥'}
            </button>

            <button
              onClick={onStartOver}
              className="w-full mt-3 border-2 border-book-coral text-book-coral bg-transparent rounded-full px-8 py-3 font-heading text-lg hover:bg-book-coral hover:text-white transition-colors cursor-pointer"
            >
              Make Another Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
