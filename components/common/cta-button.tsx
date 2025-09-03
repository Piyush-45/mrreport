"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTA({ children }: { children: React.ReactNode }) {
    return (
        <Link href="#pricing">
            <button className="relative inline-flex items-center gap-2 rounded-full px-8 py-4 font-semibold text-white text-lg shadow-lg overflow-hidden transition-all group">
                {/* Glow background */}
                <span className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-600 group-hover:scale-110 transition-transform" />

                {/* Glass overlay */}
                <span className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

                {/* Button content */}
                <span className="relative flex items-center gap-2">
                    {children}
                    <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
            </button>
        </Link>
    );
}
