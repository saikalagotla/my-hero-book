'use client';

interface HomeScreenProps {
  onStart: () => void;
}

export default function HomeScreen({ onStart }: HomeScreenProps) {
  return (
    <div className="min-h-screen bg-book-cream flex flex-col items-center justify-center px-4 py-16">
      <div className="bg-book-coral rounded-full inline-block px-6 py-2">
        <span className="text-white font-heading text-lg">✨ AI-Powered Personalized Books ✨</span>
      </div>

      <h1 className="font-heading text-4xl md:text-6xl text-gray-800 text-center mt-6">
        Make Your Child the Hero!
      </h1>

      <p className="font-body text-xl text-gray-500 text-center mt-3 max-w-lg">
        A one-of-a-kind storybook starring your little one, created in seconds.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 max-w-2xl w-full">
        <div className="bg-white rounded-4xl shadow-card p-6 text-center">
          <div className="text-4xl mb-3">📝</div>
          <h3 className="font-heading text-gray-800 text-lg">You choose the details</h3>
          <p className="font-body text-gray-500 text-sm mt-1">Name, age, personality, theme</p>
        </div>
        <div className="bg-white rounded-4xl shadow-card p-6 text-center">
          <div className="text-4xl mb-3">🤖</div>
          <h3 className="font-heading text-gray-800 text-lg">AI writes the story</h3>
          <p className="font-body text-gray-500 text-sm mt-1">12 unique pages just for them</p>
        </div>
        <div className="bg-white rounded-4xl shadow-card p-6 text-center">
          <div className="text-4xl mb-3">🖨️</div>
          <h3 className="font-heading text-gray-800 text-lg">Print at home</h3>
          <p className="font-body text-gray-500 text-sm mt-1">Download a print-ready PDF</p>
        </div>
      </div>

      <button
        onClick={onStart}
        className="bg-book-coral text-white font-heading text-2xl px-12 py-5 rounded-full shadow-button hover:scale-105 transition-transform mt-12 cursor-pointer"
      >
        Create Your Book →
      </button>
      <p className="text-gray-400 text-sm mt-3 font-body">
        Takes about 60 seconds · No account needed
      </p>
    </div>
  );
}
