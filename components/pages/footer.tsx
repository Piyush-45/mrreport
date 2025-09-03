"use client";

import React from "react";
import { HeartPulse, Mail, Github, Twitter, Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-blue-50 via-indigo-50 to-teal-50 border-t border-gray-200 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">MedReport AI</span>
          </div>
          <p className="text-gray-600 text-sm">
            Helping patients understand their medical reports with clarity, care,
            and AI-powered insights.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:text-blue-600">How It Works</a></li>
            <li><a href="#" className="hover:text-blue-600">Why Trust Us</a></li>
            <li><a href="#" className="hover:text-blue-600">FAQ</a></li>
            <li><a href="#" className="hover:text-blue-600">Contact</a></li>
          </ul>
        </div>

        {/* Trust & Compliance */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Compliance</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-600" /> HIPAA Compliant
            </li>
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" /> SOC 2 Certified
            </li>
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-600" /> Privacy First
            </li>
          </ul>
        </div>

        {/* Contact / Social */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Stay Connected</h4>
          <div className="flex items-center gap-3 text-gray-600">
            <a href="#" className="hover:text-blue-600"><Mail className="h-5 w-5" /></a>
            <a href="#" className="hover:text-blue-600"><Github className="h-5 w-5" /></a>
            <a href="#" className="hover:text-blue-600"><Twitter className="h-5 w-5" /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} MedReport AI. For educational use only. Not a substitute for medical advice.
      </div>
    </footer>
  );
};

export default Footer;