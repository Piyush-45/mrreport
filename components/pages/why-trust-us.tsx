"use client";

import { motion } from "framer-motion";
import { Shield, Cpu, MessageCircle, HeartPulse, Lock } from "lucide-react";

const trustPoints = [
  {
    id: 1,
    title: "Privacy First",
    desc: "Your reports are secured with industry-leading encryption and never shared.",
    icon: <Shield className="w-7 h-7 text-white" />,
    color: "from-blue-500 to-blue-400",
  },
  {
    id: 2,
    title: "AI Accuracy",
    desc: "Powered by advanced AI tuned on medical knowledge for clear, reliable insights.",
    icon: <Cpu className="w-7 h-7 text-white" />,
    color: "from-teal-500 to-green-400",
  },
  {
    id: 3,
    title: "Simple Language",
    desc: "We translate complex jargon into words anyone can understand, without confusion.",
    icon: <MessageCircle className="w-7 h-7 text-white" />,
    color: "from-purple-500 to-indigo-400",
  },
  {
    id: 4,
    title: "Designed for Patients",
    desc: "Built with care to empower patients, not overwhelm them with data.",
    icon: <HeartPulse className="w-7 h-7 text-white" />,
    color: "from-pink-500 to-red-400",
  },
];

export default function WhyTrustUs() {
  return (
    <section className="relative bg-gradient-to-br from-white via-blue-50 to-teal-50 py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Why Trust Us
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Your health information deserves the highest level of security,
            accuracy, and care.
          </p>
        </motion.div>

        {/* Trust Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustPoints.map((point, i) => (
            <motion.div
              key={point.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition"
            >
              <div
                className={`w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-gradient-to-r ${point.color} shadow-md`}
              >
                {point.icon}
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                {point.title}
              </h3>
              <p className="mt-3 text-gray-600 text-sm">{point.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Compliance badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-500" /> HIPAA Compliant
          </span>
          <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium flex items-center gap-2">
            <Lock className="w-4 h-4 text-green-500" /> SOC 2 Certified
          </span>
          <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-500" /> End-to-End Encryption
          </span>
        </motion.div>
      </div>
    </section>
  );
}
