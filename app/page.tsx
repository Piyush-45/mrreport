// import BgGradient from '@/components/common/bg-gradient'
// import Header from '@/components/common/Header'
// import Test from '@/components/common/test'
// import DemoSection from '@/components/home/demo-section'
// import HeroSection from '@/components/home/hero-section'
// import HowItWorksSection from '@/components/home/how-it-works'
// import PricingSection from '@/components/home/pricing'


// const page = () => {


//   return (
//     <div className="relative w-full ">
//       <BgGradient />
//       <div className="flex flex-col">
//         <HeroSection />
//         {/* <DemoSection /> */}
//         <HowItWorksSection />
//         <PricingSection />
//       </div>
//     </div>
//   )
// }



"use client";

import Footer from "@/components/pages/footer";
import HowItWorks from "@/components/pages/how-it-work";
import WhyTrustUs from "@/components/pages/why-trust-us";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

;
import { useEffect, useState } from "react";

export default function Hero() {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const router = useRouter()
  useEffect(() => {
    const timer = setTimeout(() => setShowAnalysis(true), 2000); // show analysis after 2s
    return () => clearTimeout(timer);
  }, []);

  return (
    <>

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-teal-50 mx-auto ">
        {/* Floating gradient blobs */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-120px] left-[-100px] w-[500px] h-[500px] rounded-full bg-blue-200/30 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-150px] right-[-120px] w-[600px] h-[600px] rounded-full bg-teal-200/30 blur-3xl"
        />

        <div className="relative max-w-6xl mx-auto px-6 lg:px-12 py-28 flex flex-col lg:flex-row items-center gap-12">
          {/* Left side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-4">
              Your AI Health Assistant
            </span>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
              <span className="text-gray-800 font-medium">AI That Makes</span>{" "}
              <span className="bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
                Medical Reports
              </span>{" "}
              Easy to Understand
            </h1>

            <p className="mt-6 text-lg text-gray-600 max-w-xl">
              Upload your report and get clear, simple answers in seconds — no
              medical jargon, just insights you can trust.
            </p>

            {/* CTA buttons */}
            <div className="mt-8 flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 text-white font-medium shadow-md hover:shadow-lg transition-all"
                onClick={() => router.push('/upload ')}
              >
                Try Free Demo
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 rounded-full border border-blue-300 text-blue-600 font-medium bg-transparent  hover:bg-blue-50 transition-all "
              >
                See How It Works
              </motion.button>
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Privacy First
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Instant Results
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                AI Powered
              </span>
            </div>
          </motion.div>

          {/* Right side: Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex justify-center"
          >
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Blood Test Results
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  Cholesterol:{" "}
                  <span className="font-medium text-red-500">220 mg/dL</span>
                </p>
                <p>
                  HDL: <span className="font-medium text-green-600">45 mg/dL</span>
                </p>
                <p>
                  LDL:{" "}
                  <span className="font-medium text-red-500">150 mg/dL</span>
                </p>
              </div>

              {/* AI chat bubble */}
              {!showAnalysis ? (
                <div className="mt-4 p-4 rounded-2xl bg-gray-100 text-gray-500 text-sm flex items-center gap-2">
                  <span className="flex space-x-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                  </span>
                  AI is analyzing...
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500 text-white text-sm shadow-lg"
                >
                  <p className="font-medium">
                    Your cholesterol is slightly above normal.
                  </p>
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    <li>Total cholesterol should be &lt; 200 mg/dL</li>
                    <li>Consider dietary changes</li>
                    <li>Discuss with your doctor</li>
                  </ul>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* how it works */}
      <HowItWorks />
      {/* why trust us */}
      <WhyTrustUs />
    </>
  );
}
