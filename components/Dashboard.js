"use client"
import React, { useEffect, useState, useCallback } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { fetchuser, updateProfile } from '@/actions/useractions'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import { Save, User as UserIcon, Mail, AtSign, Image as ImageIcon, CreditCard, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { data: session, update } = useSession()
    const router = useRouter()
    const [form, setform] = useState({})
    const [loading, setLoading] = useState(false)

    const getData = useCallback(async () => {
        try {
            let u = await fetchuser(session.user.name)
            setform(u || {})
        } catch (error) {
            console.error("Failed to load user data:", error)
        }
    }, [session?.user?.name])

    useEffect(() => {
        if (!session) {
            router.push('/login')
        } else {
            getData()
        }
    }, [session, router, getData])

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        setLoading(true)
        let a = await updateProfile(e, session.user.name)
        if (a?.error) {
            toast.error(a.error)
        } else {
            toast.success('Profile Updated Successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
                transition: Bounce,
            });
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <ToastContainer />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-white mb-2">Creator Dashboard</h1>
                    <p className="text-slate-400">Manage your profile and payment settings</p>
                </div>

                <form action={handleSubmit} className="space-y-8">
                    {/* Profile Section */}
                    <div className="glass-card rounded-3xl p-8 border border-white/10">
                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                            <UserIcon className="w-5 h-5 text-indigo-400" />
                            <h2 className="text-xl font-bold text-white">Profile Information</h2>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400 ml-1">Full Name</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input value={form.name || ""} onChange={handleChange} type="text" name='name' className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" placeholder="Enter your name" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input value={form.email || ""} onChange={handleChange} type="email" name='email' className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" placeholder="your@email.com" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400 ml-1">Username</label>
                                <div className="relative">
                                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input value={form.username || ""} onChange={handleChange} type="text" name='username' className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" placeholder="username" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400 ml-1">Profile Picture URL</label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input value={form.profilepic || ""} onChange={handleChange} type="text" name='profilepic' className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" placeholder="https://..." />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-2">
                            <label className="text-sm font-medium text-slate-400 ml-1">Cover Image URL</label>
                            <div className="relative">
                                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input value={form.coverpic || ""} onChange={handleChange} type="text" name='coverpic' className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" placeholder="https://..." />
                            </div>
                        </div>

                        <div className="mt-6 space-y-2">
                            <label className="text-sm font-medium text-slate-400 ml-1">Bio / Description</label>
                            <div className="relative">
                                <textarea 
                                    value={form.description || ""} 
                                    onChange={handleChange} 
                                    name='description' 
                                    rows="3"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none" 
                                    placeholder="Tell your supporters about yourself..." 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Section */}
                    <div className="glass-card rounded-3xl p-8 border border-white/10">
                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                            <CreditCard className="w-5 h-5 text-emerald-400" />
                            <h2 className="text-xl font-bold text-white">Payment Settings</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400 ml-1">Razorpay Key ID</label>
                                <div className="relative">
                                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input value={form.razorpayid || ""} onChange={handleChange} type="text" name='razorpayid' className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" placeholder="rzp_test_..." />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400 ml-1">Razorpay Secret</label>
                                <div className="relative">
                                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input value={form.razorpaysecret || ""} onChange={handleChange} type="password" name='razorpaysecret' className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" placeholder="••••••••••••" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-500/25"
                        >
                            {loading ? "Saving Changes..." : "Save Profile Settings"}
                            <Save className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

export default Dashboard