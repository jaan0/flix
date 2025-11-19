"use client";

import { motion } from "framer-motion";
import { FiZap, FiShield, FiHeadphones, FiAward } from "react-icons/fi";

export default function Features() {
  const features = [
    {
      icon: FiZap,
      title: "Ultra Fast Streaming",
      description:
        "Optimized servers for seamless 4K streaming with zero buffering",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: FiShield,
      title: "Secure & Private",
      description: "Military grade encryption protecting your viewing privacy",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: FiHeadphones,
      title: "24/7 Support",
      description: "Dedicated support team ready to help anytime",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: FiAward,
      title: "Money Back Guarantee",
      description: "100% satisfaction guaranteed or your money back",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <section id="features" className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Why Choose Playrix?
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            We deliver premium streaming experience with unmatched reliability
            and customer service
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300"
            >
              {/* Icon */}
              <div
                className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} p-0.5 mb-6`}
              >
                <div className="w-full h-full bg-gray-900 rounded-xl flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>

              {/* Hover Glow Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
