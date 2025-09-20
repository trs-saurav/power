"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { 
  Zap, 
  Shield, 
  Sun, 
  Camera, 
  Target, 
  Rocket, 
  Heart,
  Users,
  Calendar,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  TrendingUp
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function AboutPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const stats = [
    { 
      icon: Calendar, 
      value: "2008", 
      label: "Established", 
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/30"
    },
    { 
      icon: Users, 
      value: "10K+", 
      label: "Happy Customers", 
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30"
    },
    { 
      icon: Award, 
      value: "30+", 
      label: "Overall Years Experience", 
      color: "from-violet-500 to-purple-500",
      bgColor: "bg-violet-50 dark:bg-violet-950/30"
    }
  ];



  const achievements = [
    { label: "Project Success Rate", value: "99.8%" },
    { label: "Customer Retention", value: "95%" },
    { label: "Green Energy Impact", value: "1 MW+" }
  ];

  return (
    
    <div className="relative min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-violet-50/20 dark:from-slate-950 dark:via-blue-950/20 dark:to-violet-950/10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-violet-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center"
          >


            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-black mb-6"
            >
              <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-violet-800 dark:from-white dark:via-blue-200 dark:to-violet-200 bg-clip-text text-transparent">
                ABOUT
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                Power Electronics
              </span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed font-light"
            >
              Pioneering the future of power and security solutions with 
              <span className="font-semibold text-blue-600"> cutting-edge technology</span> and 
              <span className="font-semibold text-violet-600"> unmatched expertise</span>
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-4 mt-8"
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-lg"
                >
                  <div className="text-2xl font-bold text-slate-800 dark:text-white">
                    {achievement.value}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {achievement.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Bento Grid Layout */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-20"
          >
            {/* Story Card - Large */}
            <motion.div
              variants={fadeInUp}
              className="lg:col-span-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/50 rounded-3xl p-8 md:p-12 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Our Journey</h2>
              </div>

              <div className="space-y-6 text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                <p>
                  <span className="font-semibold text-blue-600">Power Electronics</span> has been at the 
                  forefront of technological innovation for over <span className="font-semibold text-violet-600">three decades</span>, 
                  transforming how businesses and homes experience power and security solutions.
                </p>
                <p>
                  Our commitment to excellence has earned us the trust of 
                  <span className="font-semibold text-emerald-600"> 100,000+ customers</span> worldwide, 
                  establishing us as industry leaders in sustainable energy and intelligent security systems.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-8">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950/20 dark:to-violet-950/20 rounded-2xl">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Innovation-Driven Solutions</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-2xl">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium">Sustainable Technology</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              variants={fadeInUp}
              className="lg:col-span-4 space-y-6"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className={`${stat.bgColor} backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-xl`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-slate-800 dark:text-white">
                        {stat.value}
                      </div>
                      <div className="text-slate-600 dark:text-slate-400 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Vision & Mission - Modern Cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8 mb-20"
          >
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-violet-600 rounded-3xl p-8 shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-violet-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-8 h-8 text-white" />
                  <h3 className="text-2xl font-bold text-white">Our Vision</h3>
                </div>
                <p className="text-blue-100 leading-relaxed text-lg">
                  To revolutionize global energy infrastructure through AI-powered solutions, 
                  sustainable technologies, and intelligent automation that creates a carbon-neutral, 
                  secure, and connected world.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <Rocket className="w-8 h-8 text-white" />
                  <h3 className="text-2xl font-bold text-white">Our Mission</h3>
                </div>
                <p className="text-emerald-100 leading-relaxed text-lg">
                  Delivering next-generation power and security ecosystems through cutting-edge research, 
                  sustainable practices, and customer-centric innovation that transforms industries 
                  and communities worldwide.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Services Grid - Enhanced */}
          

          {/* Core Values - Modern Pill Design */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.div variants={fadeInUp} className="mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Heart className="w-8 h-8 text-red-500" />
                <h2 className="text-4xl font-bold text-slate-800 dark:text-white">Core Values</h2>
              </div>
              <p className="text-xl text-slate-600 dark:text-slate-300">
                The principles that drive our innovation and excellence
              </p>
            </motion.div>

            <motion.div variants={staggerContainer} className="flex flex-wrap justify-center gap-4">
              {["Innovation Excellence", "Sustainable Future", "Customer Obsession", "Integrity First", "Global Impact"].map((value, index) => (
                <motion.div
                  key={value}
                  variants={scaleIn}
                  whileHover={{ 
                    scale: 1.1, 
                    backgroundColor: "rgb(59, 130, 246)",
                    color: "white"
                  }}
                  className="px-8 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer text-lg"
                >
                  {value}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
