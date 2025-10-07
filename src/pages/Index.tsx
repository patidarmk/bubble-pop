"use client";

import { useState, useEffect, useCallback } from "react";
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

const colors = [
  "bg-pink-400",
  "bg-blue-400",
  "bg-purple-400",
  "bg-green-400",
  "bg-yellow-400",
  "bg-red-400",
  "bg-indigo-400",
  "bg-cyan-400",
];

export default function BubblePopGame() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [nextId, setNextId] = useState(1);

  const createBubble = useCallback(() => {
    const newBubble: Bubble = {
      id: nextId,
      x: Math.random() * (window.innerWidth - 100),
      y: window.innerHeight + 50,
      size: Math.random() * 40 + 30,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 2 + 1,
      opacity: 1,
    };
    setNextId(prev => prev + 1);
    return newBubble;
  }, [nextId]);

  const popBubble = (id: number) => {
    setBubbles(prev => prev.filter(bubble => bubble.id !== id));
    setScore(prev => prev + 10);
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setBubbles([]);
    setNextId(1);
  };

  const resetGame = () => {
    setGameStarted(false);
    setScore(0);
    setBubbles([]);
    setNextId(1);
  };

  useEffect(() => {
    if (!gameStarted) return;

    const gameInterval = setInterval(() => {
      setBubbles(prev => {
        const newBubbles = [...prev];
        
        // Add new bubble occasionally
        if (Math.random() < 0.3 && newBubbles.length < 8) {
          newBubbles.push(createBubble());
        }

        // Move bubbles up and fade them out
        return newBubbles
          .map(bubble => ({
            ...bubble,
            y: bubble.y - bubble.speed,
            opacity: bubble.y < 100 ? bubble.opacity - 0.02 : bubble.opacity,
          }))
          .filter(bubble => bubble.y > -100 && bubble.opacity > 0);
      });
    }, 50);

    return () => clearInterval(gameInterval);
  }, [gameStarted, createBubble]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 to-blue-400 overflow-hidden relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-sm shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Bubble Pop!
          </h1>
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-gray-700">
              Score: {score}
            </div>
            {gameStarted ? (
              <button
                onClick={resetGame}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                Reset
              </button>
            ) : (
              <button
                onClick={startGame}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                Start Game
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="pt-20 h-screen relative">
        {!gameStarted ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-4">
                Welcome to Bubble Pop!
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Tap the floating bubbles to pop them and earn points!
              </p>
              <div className="space-y-4 text-white/80">
                <p>🫧 Different colored bubbles give different points</p>
                <p>⚡ Bubbles float up at different speeds</p>
                <p>🏆 Try to get the highest score!</p>
              </div>
            </div>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xl font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Start Playing!
            </button>
          </div>
        ) : (
          <>
            {/* Bubbles */}
            {bubbles.map(bubble => (
              <button
                key={bubble.id}
                onClick={() => popBubble(bubble.id)}
                className={`absolute rounded-full ${bubble.color} shadow-lg transform hover:scale-110 transition-transform duration-150 cursor-pointer animate-pulse`}
                style={{
                  left: `${bubble.x}px`,
                  top: `${bubble.y}px`,
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                  opacity: bubble.opacity,
                  boxShadow: `0 0 20px rgba(255, 255, 255, 0.5), inset -5px -5px 10px rgba(255, 255, 255, 0.3), inset 5px 5px 10px rgba(0, 0, 0, 0.1)`,
                }}
              >
                <div className="w-full h-full rounded-full bg-gradient-to-br from-white/40 to-transparent" />
              </button>
            ))}

            {/* Floating particles effect */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0">
        <MadeWithApplaa />
      </div>
    </div>
  );
}