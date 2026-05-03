"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Coffee, Rocket, Users, Globe, ArrowRight, Heart, Sparkles, TrendingUp, Search as SearchIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchFeaturedCreators } from "@/actions/useractions";

export default function Home() {
  const [featuredCreators, setFeaturedCreators] = useState([]);

  useEffect(() => {
    const getCreators = async () => {
      try {
        const creators = await fetchFeaturedCreators();
        setFeaturedCreators(creators);
      } catch (error) {
        console.error("Failed to fetch featured creators:", error);
      }
    };
    getCreators();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-48">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>The #1 platform for creators</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-8xl font-extrabold tracking-tight mb-6 leading-tight"
          >
            Fund Your Creative <br />
            <span className="text-gradient">Empire with Coffee</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed"
          >
            A premium space where your fans can buy you a coffee (or a chai!) 
            to support your creative journey. Simple, fast, and beautiful.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/login">
              <button className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-xl shadow-indigo-500/25 flex items-center gap-2 group">
                Start My Page
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <div className="relative group">
               <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
               <button className="relative px-8 py-4 rounded-2xl glass border-white/10 hover:bg-white/5 text-white font-bold transition-all flex items-center gap-2">
                 <SearchIcon className="w-5 h-5 text-indigo-400" />
                 Explore Creators
               </button>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl -z-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-indigo-600/30 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-[128px]" />
        </div>
      </section>

      {/* Featured Creators Section */}
      {featuredCreators.length > 0 && (
        <section className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Featured Creators</h2>
                <p className="text-slate-400">Join the community of talented people</p>
              </div>
              <div className="flex items-center gap-2 text-indigo-400 font-medium cursor-pointer hover:text-indigo-300 transition-colors">
                <TrendingUp className="w-5 h-5" />
                <span>Trending Today</span>
              </div>
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {featuredCreators.map((creator, i) => (
                <motion.div 
                  key={i}
                  variants={itemVariants}
                  className="group relative"
                >
                  <Link href={`/${creator.username}`}>
                    <div className="glass-card rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all overflow-hidden h-full flex flex-col">
                      <div className="h-32 relative">
                         <img src={creator.coverpic || "/cover.jpg"} alt="" className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500" />
                         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                      </div>
                      <div className="px-8 pb-8 flex-1 flex flex-col items-center -mt-12 relative z-10">
                        <div className="w-24 h-24 rounded-3xl border-4 border-slate-950 overflow-hidden bg-slate-900 mb-4 shadow-2xl">
                          <img src={creator.profilepic || "/avatar.gif"} alt="" className="w-full h-full object-cover" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{creator.name}</h3>
                        <p className="text-indigo-400 text-sm font-medium mb-4">@{creator.username}</p>
                        <button className="w-full py-3 rounded-2xl bg-white/5 group-hover:bg-indigo-600 transition-all font-bold text-sm">
                          View Profile
                        </button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* How it Works Section */}
      <section className="py-24 bg-slate-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Start your journey</h2>
            <p className="text-slate-400">Launch your page in less than a minute</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connection lines (desktop only) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-y-1/2 -z-10" />
            
            {[
              {
                icon: <Sparkles className="w-8 h-8 text-indigo-400" />,
                title: "Create your account",
                desc: "Sign up in seconds and customize your profile to reflect your personality."
              },
              {
                icon: <Coffee className="w-8 h-8 text-amber-400" />,
                title: "Share your page",
                desc: "Tell your audience about your new space and how they can support you."
              },
              {
                icon: <Rocket className="w-8 h-8 text-emerald-400" />,
                title: "Receive support",
                desc: "Get instant notifications when someone buys you a chai and grow your empire."
              }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-600/10 transition-all shadow-2xl">
                  {step.icon}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-950 border border-white/10 flex items-center justify-center text-xs font-bold text-white">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed px-4">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-950/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Empowering Creators</h2>
            <p className="text-slate-400">Everything you need to succeed in one simple platform.</p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Heart className="w-8 h-8 text-rose-400" />,
                title: "Fans want to help",
                desc: "Your audience loves what you do and is eager to support your creative journey."
              },
              {
                icon: <Coffee className="w-8 h-8 text-amber-400" />,
                title: "One-time support",
                desc: "No subscriptions required. Fans can buy you a coffee whenever they feel inspired."
              },
              {
                icon: <Users className="w-8 h-8 text-indigo-400" />,
                title: "Direct Connection",
                desc: "Engage with your supporters directly and build a loyal community around your work."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                className="glass-card p-8 rounded-[2rem] border border-white/5 hover:border-white/10 transition-colors group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-12">Trusted by Creators</h2>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
             <div className="flex items-center gap-2"><Globe className="w-6 h-6" /><span className="font-bold">GLOBAL</span></div>
             <div className="flex items-center gap-2"><Rocket className="w-6 h-6" /><span className="font-bold">TECH</span></div>
             <div className="flex items-center gap-2"><Users className="w-6 h-6" /><span className="font-bold">COMMUNITY</span></div>
          </div>
        </div>
      </section>
    </div>
  );
}