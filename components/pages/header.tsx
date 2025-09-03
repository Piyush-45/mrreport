"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Why Trust Us", href: "#why-trust-us" },
  { name: "Demo", href: "#demo" },
  { name: "FAQ", href: "#faq" },
  { name: "Contact", href: "#contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <HeartPulse className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">MrReport</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative text-gray-700 hover:text-blue-600 font-medium transition group"
            >
              {link.name}
              <span className="absolute left-0 bottom-[-6px] w-0 h-[2px] bg-gradient-to-r from-blue-500 to-teal-500 transition-all group-hover:w-full"></span>
            </Link>
          ))}
          <Button className="bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-full px-5 shadow-md hover:shadow-lg">
            Try Free Demo
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700 hover:text-blue-600"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
          <div className="flex flex-col items-center gap-6 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                {link.name}
              </Link>
            ))}
            <Button className="bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-full px-5 shadow-md hover:shadow-lg">
              Try Free Demo
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}