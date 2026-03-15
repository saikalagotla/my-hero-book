'use client';

import { BookPage } from '@/lib/types';

interface BookPageCardProps {
  page: BookPage;
  index: number;
}

export default function BookPageCard({ page, index }: BookPageCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-card overflow-hidden mb-4">
      {page.imageUrl ? (
        <img
          src={page.imageUrl}
          alt={`Illustration for page ${page.pageNumber}`}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="bg-gray-100 w-full h-48 animate-pulse rounded-t-3xl" />
      )}
      <div className="p-4">
        <span className="bg-book-yellow text-gray-800 font-heading text-xs px-3 py-1 rounded-full inline-block">
          Page {index + 1}
        </span>
        <p className="font-body text-gray-700 text-sm mt-2 leading-relaxed">
          {page.text}
        </p>
      </div>
    </div>
  );
}
