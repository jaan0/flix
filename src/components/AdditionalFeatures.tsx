"use client";

import { motion } from "framer-motion";
import { FiGlobe, FiTrendingUp, FiDollarSign, FiLock } from "react-icons/fi";

export default function AdditionalFeatures() {
  const features = [
    {
      icon: FiGlobe,
      title: "Worldwide Service",
      description:
        "Access from anywhere in the world with our global server network",
    },
    {
      icon: FiTrendingUp,
      title: "Best Quality",
      description:
        "Experience HD and 4K streaming with crystal clear picture quality",
    },
    {
      icon: FiDollarSign,
      title: "Best Offers",
      description:
        "Unbeatable prices and frequent promotions for our loyal users",
    },
    {
      icon: FiLock,
      title: "Secure Payments",
      description:
        "Protected transactions with multiple payment methods available",
    },
  ];

  return (
    <section className="py-24 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
