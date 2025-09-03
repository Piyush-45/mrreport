import { Sparkles } from "lucide-react";
import CTA from "../common/cta-button";

export default function HeroSection() {
    return (
        <section className="relative mx-auto flex flex-col items-center justify-center text-center py-20 lg:py-32 px-6 max-w-7xl">
            {/* Background gradient */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-blue-50 to-white" />

            {/* Badge */}
            <div className="mb-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-6 py-2 text-blue-700 font-medium shadow-sm ring-1 ring-blue-200/40">
                    <Sparkles className="h-5 w-5 text-blue-500 animate-pulse" />
                    Powered by AI
                </span>
            </div>

            {/* Heading */}
            <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-tight tracking-tight text-gray-900">
                Turn Boring Medical Reports into <br />
                <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600">
                    Mazedar Health Summaries
                </span>
            </h1>

            {/* Subtext */}
            <p className="mt-6 max-w-2xl text-lg sm:text-xl text-gray-600">
                Get a beautiful summary reel of any medical report in seconds.
                Transform complex health checkups into fun, easy-to-digest insights —
                no medical degree required. 🧑‍⚕️✨
            </p>

            {/* CTA */}
            <div className="mt-10 flex gap-4">
                <CTA>Try LOL Labs Free</CTA>
                <a
                    href="#demo"
                    className="inline-flex items-center justify-center rounded-full border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                    See Demo
                </a>
            </div>

            {/* Mockup Placeholder */}
            <div className="mt-16 w-full max-w-4xl">
                <div className="rounded-2xl shadow-xl overflow-hidden border border-gray-100 bg-white">
                    {/* Replace this with product screenshot / animation */}
                    <img
                        src="/demo-mockup.png"
                        alt="App Mockup"
                        className="w-full h-auto"
                    />
                </div>
            </div>
        </section>
    );
}
