
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';

const features = [
  'Share your study notes with your campus community.',
  'Sell your premium notes and earn money.',
  'Discover, search, and purchase notes from others.',
  'Secure, fast, and easy to use.',
  'Join the Campus Bazaar revolution!'
];

export default function Home() {
  const [displayed, setDisplayed] = useState('');
  const [featureIdx, setFeatureIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const typingSpeed = 90;
  const pause = 5000;
  const intervalRef = useRef();

  useEffect(() => {
    let timeout;
    if (!deleting && charIdx < features[featureIdx].length) {
      timeout = setTimeout(() => {
        setDisplayed(features[featureIdx].slice(0, charIdx + 1));
        setCharIdx(charIdx + 1);
      }, typingSpeed);
    } else if (!deleting && charIdx === features[featureIdx].length) {
      timeout = setTimeout(() => {
        setDeleting(true);
      }, pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => {
        setDisplayed(features[featureIdx].slice(0, charIdx - 1));
        setCharIdx(charIdx - 1);
      }, 18);
    } else if (deleting && charIdx === 0) {
      timeout = setTimeout(() => {
        setDeleting(false);
        setFeatureIdx((featureIdx + 1) % features.length);
      }, 300);
    }
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, featureIdx]);

  useEffect(() => {
    setCharIdx(0);
    setDisplayed('');
  }, [featureIdx]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] w-full bg-gradient-to-br from-blue-50/80 via-white/80 to-blue-100/80 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors duration-500">
        <div className="max-w-2xl w-full mx-auto text-center py-20 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 dark:text-blue-300 mb-6 drop-shadow-lg">Welcome to Campus Bazaar</h1>
          <div className="h-12 flex items-center justify-center mb-10">
            <span className="text-xl md:text-2xl font-mono text-gray-700 dark:text-gray-200 min-h-[3rem]">
              {displayed}
              <span className="animate-pulse">_</span>
            </span>
          </div>
          <div className="flex flex-col md:flex-row gap-6 items-center justify-center mt-8">
            <button
              className="px-8 py-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-lg shadow-lg transition-all focus:ring-2 focus:ring-green-300"
              onClick={() => navigate('/notes?mode=sharing')}
            >
              Share Notes
            </button>
            <button
              className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg transition-all focus:ring-2 focus:ring-blue-300"
              onClick={() => navigate('/notes?mode=selling')}
            >
              Sell Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
