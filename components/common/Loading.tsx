"use client";

import { HeartPulse } from "lucide-react";

export default function LoadingScreen() {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
            {/* Pulsing circle */}
            <div className="relative flex items-center justify-center">
                <div className="absolute w-24 h-24 rounded-full bg-emerald-400/30 animate-ping" />
                <div className="absolute w-36 h-36 rounded-full bg-blue-400/20 animate-pulse" />
                <HeartPulse className="w-14 h-14 text-emerald-600 animate-bounce" />
            </div>

            {/* Loading text */}
            <div className="text-center">
                <p className="text-xl font-semibold text-gray-800">
                    Analyzing Your Report...
                </p>
                <p className="text-gray-500 mt-2 text-sm">
                    Turning complex medical terms into simple health insights ✨
                </p>
            </div>

            {/* Progress shimmer bar */}
            <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-gradient-to-r from-emerald-400 via-blue-500 to-teal-500 animate-[shimmer_2s_infinite]" />
            </div>

            <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
        </div>
    );
}