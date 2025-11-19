"use client";

import { motion } from "framer-motion";
import { FiCheck, FiStar } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

export default function Pricing() {
  const plans = [
    {
      name: "Optus IPTV",
      channels: "5000+ Channels",
      price: "$4",
      period: "Monthly",
      features: ["Premium Quality", "Multi Device", "VOD Library", "Live EPG"],
      popular: false,
    },
    {
      name: "Starplus IPTV",
      channels: "8000+ Channels",
      price: "$5",
      period: "Monthly",
      features: ["Premium Quality", "Multi Device", "VOD Library", "Live EPG"],
      popular: true,
    },
    {
      name: "By My Store",
      channels: "12000+ Channels",
      price: "$9",
      period: "Quarterly",
      features: ["Premium Quality", "Multi Device", "VOD Library", "Live EPG"],
      popular: false,
    },
  ];

  const servers = [
    {
      name: "Forever Server",
      price: "$42",
      period: "Lifetime",
      features: ["4K Support", "10+ Devices", "VOD Library"],
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Apollo IPTV",
      price: "$18",
      period: "6 Months",
      features: ["4K Support", "5+ Devices"],
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Funcam Server",
      price: "$32",
      period: "1 Year",
      features: ["4K Support", "8+ Devices"],
      color: "from-green-500 to-emerald-500",
    },
    {
      name: "Gihare Server",
      price: "$40",
      period: "Lifetime",
      features: ["4K Support", "12+ Devices"],
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <section id="plans" className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* IPTV Subscriptions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              IPTV Subscription Plans
            </span>
          </h2>
          <p className="text-xl text-gray-400">
            Flexible monthly plans tailored to your needs
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-32">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`relative bg-gradient-to-br from-white/10 to-white/[0.02] backdrop-blur-sm border ${
                plan.popular
                  ? "border-purple-500/50 shadow-xl shadow-purple-500/20"
                  : "border-white/10"
              } rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-sm font-semibold">
                    <FiStar className="w-4 h-4" />
                    <span>Recommended</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-purple-400 font-semibold mb-4">
                  {plan.channels}
                </p>
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-5xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-400 ml-2">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-300">
                    <FiCheck className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="https://wa.me/923033996000"
                className={`block w-full py-4 text-center font-semibold rounded-xl transition-all duration-300 ${
                  plan.popular
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70"
                    : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                }`}
              >
                Buy Now
              </a>
            </motion.div>
          ))}
        </div>

        {/* Premium Servers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Premium Server Plans
            </span>
          </h2>
          <p className="text-xl text-gray-400">Choose your perfect plan</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servers.map((server, index) => (
            <motion.div
              key={server.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative bg-gradient-to-br from-white/10 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${server.color} p-0.5 mb-4`}>
                <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
                  <HiSparkles className="w-6 h-6 text-white" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                {server.name}
              </h3>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold text-white">
                  {server.price}
                </span>
                <span className="text-gray-400 text-sm ml-2">
                  {server.period}
                </span>
              </div>

              <ul className="space-y-2 mb-6">
                {server.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center text-sm text-gray-300"
                  >
                    <FiCheck className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="https://wa.me/923033996000"
                className="block w-full py-3 text-center font-semibold rounded-lg bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                Get Plan
              </a>

              <div
                className={`absolute inset-0 bg-gradient-to-br ${server.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300 pointer-events-none`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
