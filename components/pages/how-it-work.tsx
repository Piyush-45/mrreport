"use client";

import { motion } from "framer-motion";
import { CheckCircle, Upload, Brain } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Upload Your Report",
    desc: "Simply upload any medical report – blood tests, imaging results, or lab work.",
    icon: <Upload className="w-6 h-6 text-white" />,
    color: "from-blue-500 to-blue-400",
  },
  {
    id: 2,
    title: "AI Analyzes & Explains",
    desc: "Our advanced AI translates complex medical terminology into simple language.",
    icon: <Brain className="w-6 h-6 text-white" />,
    color: "from-teal-500 to-green-400",
  },
  {
    id: 3,
    title: "Get Clear Answers",
    desc: "Receive immediate, easy-to-understand insights about your results and next steps.",
    icon: <CheckCircle className="w-6 h-6 text-white" />,
    color: "from-purple-500 to-indigo-400",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative bg-white py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            MedReport AI simplifies complex reports in just three easy steps.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative mt-16 flex flex-col lg:flex-row items-center justify-between gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="relative z-10 flex-1 bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center"
            >
              <div
                className={`w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r ${step.color} shadow-md`}
              >
                {step.icon}
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-3 text-gray-600 text-sm">{step.desc}</p>
            </motion.div>
          ))}

          {/* Animated line for desktop */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-teal-400 to-purple-400 -z-0"
          />
        </div>
      </div>
    </section>
  );
}
