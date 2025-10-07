"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MadeWithApplaa } from "@/components/made-with-applaa";

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  opacity: number;
}

const BUBBLE_COLORS = [
  'bg-blue-400',
  'bg-purple-400',
  'bg-pink-400',
  'bg-green-400',
  'bg-yellow-400',
  'bg-red-400',
  'bg-indigo-400',
  'bg-cyan-400',
];

export default function BubblePopGame() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [highScore, setHighScore] = useState(0);

  // Generate random bubble
  const createBubble = useCallback(() => {
    const newBubble: Bubble = {
      id: Date.now() + Math.random(),
      x: Math.random() * (window.innerWidth - 100),
      y: window.innerHeight + 50,
      size: Math.random() * 40 + 30,
      color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
      speed: Math.random() * 2 + 1,
      opacity: 1,
    };
    return newBubble;
  }, []);

  // Start game
  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(60);
    setBubbles([]);
  };

  // End game
  const endGame = () => {
    setGameActive(false);
    setBubbles([]);
    if (score > highScore) {
      setHighScore(score);
    }
  };

  // Pop bubble
  const popBubble = (id: number) => {
    setBubbles(prev => prev.filter(bubble => bubble.id !== id));
    setScore(prev => prev + 10);
  };

  // Game timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameActive) {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [gameActive, timeLeft]);

  // Bubble generation
  useEffect(() => {
    let bubbleGenerator: NodeJS.Timeout;
    if (gameActive) {
      bubbleGenerator = setInterval(() => {
        setBubbles(prev => [...prev, createBubble()]);
      }, 800);
    }
    return () => clearInterval(bubbleGenerator);
  }, [gameActive, createBubble]);

  // Bubble movement and cleanup
  useEffect(() => {
    let animationFrame: number;
    if (gameActive) {
      const animate = () => {
        setBubbles(prev => 
          prev
            .map(bubble => ({
              ...bubble,
              y: bubble.y - bubble.speed,
              opacity: bubble.y < 100 ? bubble.opacity - 0.02 : bubble.opacity,
            }))
            .filter(bubble => bubble.y > -100 && bubble.opacity > 0)
        );
        animationFrame = requestAnimationFrame(animate);
      };
      animationFrame = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [gameActive]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="flex justify-between items-center">
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-2">Bubble Pop</h1>
            <div className="flex gap-6">
              <div className="text-lg">
                <span className="font-semibold">Score: </span>
                <span className="text-yellow-300">{score}</span>
              </div>
              <div className="text-lg">
                <span className="font-semibold">Time: </span>
                <span className="text-red-300">{timeLeft}s</span>
              </div>
              <div className="text-lg">
                <span className="font-semibold">High Score: </span>
                <span className="text-green-300">{highScore}</span>
              </div>
            </div>
          </div>
          <button
            onClick={startGame}
            disabled={gameActive}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
          >
            {gameActive ? 'Playing...' : 'Start Game'}
          </button>
        </div>
      </div>

      {/* Game Area */}
      <div className="absolute inset-0 pt-32">
        {/* Bubbles */}
        {bubbles.map(bubble => (
          <div
            key={bubble.id}
            className={`absolute rounded-full cursor-pointer transform transition-all duration-200 hover:scale-110 ${bubble.color} shadow-lg`}
            style={{
              left: `${bubble.x}px`,
              top: `${bubble.y}px`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              opacity: bubble.opacity,
              background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), transparent 50%)`,
            }}
            onClick={() => popBubble(bubble.id)}
          >
            <div 
              className="w-full h-full rounded-full"
              style={{
                background: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.6), transparent 40%)`,
              }}
            />
          </div>
        ))}

        {/* Game Over Screen */}
        {!gameActive && timeLeft === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
            <div className="bg-white rounded-xl p-8 text-center shadow-2xl">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Game Over!</h2>
              <p className="text-xl mb-2 text-gray-600">Final Score: <span className="font-bold text-blue-600">{score}</span></p>
              {score === highScore && score > 0 && (
                <p className="text-lg mb-4 text-green-600 font-semibold">🎉 New High Score! 🎉</p>
              )}
              <button
                onClick={startGame}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {/* Welcome Screen */}
        {!gameActive && timeLeft === 60 && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="text-center text-white">
              <h2 className="text-5xl font-bold mb-6">Tap the Bubbles!</h2>
              <p className="text-xl mb-8 opacity-90">Pop as many bubbles as you can in 60 seconds</p>
              <button
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xl rounded-lg shadow-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                Start Playing
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-6 left-6 right-6 text-center text-white opacity-75">
        <p className="text-sm">Tap or click the floating bubbles to pop them and earn points!</p>
      </div>

      <MadeWithApplaa />
    </div>
  );
}