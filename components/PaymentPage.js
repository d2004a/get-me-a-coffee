"use client"
import React, { useEffect, useState, useCallback } from 'react'
import Razorpay from 'razorpay'
import { useSession } from 'next-auth/react'
import { fetchpayments, fetchuser, initiate } from '@/actions/useractions'
import { useSearchParams } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Coffee, Heart, MessageCircle, DollarSign, User, ShieldCheck, Sparkles, Trophy, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const PaymentPage = ({ username }) => {
  const { data: session } = useSession()
  const [paymentform, setPaymentform] = useState({ name: "", message: "", amount: "" })
  const [currentUser, setcurrentUser] = useState({})
  const [payments, setPayments] = useState([])
  const searchParams = useSearchParams()
  const router = useRouter()

  const getData = useCallback(async () => {
    try {
        let u = await fetchuser(username);
        setcurrentUser(u || {});
        let dbpayments = await fetchpayments(username);
        setPayments(dbpayments || []);
    } catch (error) {
        console.error("Failed to load payment page data:", error)
    }
  }, [username]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    if (searchParams.get("paymentdone") === "true") {
      toast.success('Thanks for your support! ❤️', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "dark",
        transition: Bounce,
      });
      router.push(`/${username}`)
    }
  }, [searchParams, username, router]);

  const handleChange = (e) => {
    setPaymentform({ ...paymentform, [e.target.name]: e.target.value })
  }

  const pay = async (amount) => {
    if (!amount && !paymentform.amount) {
        toast.warn("Please enter or select an amount");
        return;
    }
    const finalAmount = amount ? amount * 100 : paymentform.amount * 100;

    try {
        let a = await initiate(finalAmount, username, paymentform)
        let orderId = a.id
        var options = {
            "key": currentUser.razorpayid,
            "amount": finalAmount,
            "currency": "INR",
            "name": "ChaiFund",
            "description": `Support ${username}`,
            "image": currentUser.profilepic || "/logo.png",
            "order_id": orderId,
            "callback_url": `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
            "prefill": {
                "name": session?.user?.name || "",
                "email": session?.user?.email || "",
            },
            "theme": { "color": "#4f46e5" }
        }
        var rzp1 = new window.Razorpay(options);
        rzp1.open();
    } catch (error) {
        toast.error("Payment initiation failed. Please try again.");
        console.error(error);
    }
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen relative overflow-hidden">
        {/* Immersive Cover Image */}
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            className="w-full h-full"
          >
            <Image 
              unoptimized 
              src={currentUser.coverpic || "/cover.jpg"} 
              alt="cover" 
              fill
              className="object-cover opacity-60"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          {/* Animated Particles Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
             <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-ping" />
             <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse" />
             <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 -mt-32 relative z-10 pb-20">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Column: Profile Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 space-y-6"
            >
              <div className="glass-card rounded-[2.5rem] p-8 border border-white/10 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                   <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                   </div>
                </div>
                
                <div className="relative inline-block mb-6">
                    <div className="w-32 h-32 rounded-3xl border-4 border-slate-950 overflow-hidden shadow-2xl mx-auto bg-slate-900 group relative">
                      <Image unoptimized src={currentUser.profilepic || "/avatar.gif"} alt="profile" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                   <motion.div 
                     animate={{ rotate: 360 }}
                     transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                     className="absolute -inset-2 border border-dashed border-indigo-500/30 rounded-full -z-10" 
                   />
                </div>

                <h1 className="text-3xl font-black text-white mb-1">{currentUser.name}</h1>
                <p className="text-indigo-400 font-bold mb-6">@{currentUser.username}</p>
                
                <div className="flex justify-center gap-6 py-4 border-y border-white/5 mb-6">
                  <div className="text-center">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Supporters</p>
                    <p className="text-xl font-black text-white">{payments.length}</p>
                  </div>
                  <div className="w-px h-8 bg-white/5 self-center" />
                  <div className="text-center">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Joined</p>
                    <p className="text-xl font-black text-white">
                      {new Date(currentUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                    </p>
                  </div>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed text-left italic">
                  &quot;{currentUser.description || `Hi! I'm creating amazing content and would love your support to keep going. Every coffee counts! ☕`}&quot;
                </p>
              </div>

              {/* Stats/Badges Card */}
              <div className="glass-card rounded-[2rem] p-6 border border-white/10 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-indigo-400" />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-white">Top 5% Creator</p>
                    <p className="text-xs text-slate-500">Rising fast in the community</p>
                 </div>
              </div>
            </motion.div>

            {/* Middle Column: Payment & Feed */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Payment Form Card */}
              <div className="glass-card rounded-[2.5rem] p-8 border border-white/10 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Coffee className="w-5 h-5 text-amber-500" />
                  </div>
                  <h2 className="text-2xl font-black text-white">Buy a Coffee</h2>
                </div>

                <div className="grid gap-6 mb-8">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 uppercase ml-2">Supporter Name</label>
                       <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input onChange={handleChange} value={paymentform.name} name='name' type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" placeholder="Your Name" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 uppercase ml-2">Amount (₹)</label>
                       <div className="relative">
                          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input onChange={handleChange} value={paymentform.amount} name='amount' type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" placeholder="Enter Amount" />
                       </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-2">Message (Optional)</label>
                    <div className="relative">
                       <MessageCircle className="absolute left-4 top-4 w-4 h-4 text-slate-500" />
                       <textarea onChange={handleChange} value={paymentform.message} name='message' className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all min-h-[100px] resize-none" placeholder="Say something nice..." />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-8">
                   {[10, 20, 50, 100].map((amt) => (
                      <button 
                        key={amt}
                        onClick={() => pay(amt)}
                        className="px-6 py-3 rounded-xl bg-white/5 hover:bg-indigo-600 border border-white/5 hover:border-indigo-400 text-sm font-bold text-white transition-all hover:-translate-y-1"
                      >
                        ₹{amt}
                      </button>
                   ))}
                </div>

                <button 
                  onClick={() => pay()}
                  className="w-full py-5 rounded-[1.5rem] bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg transition-all shadow-2xl shadow-indigo-500/40 flex items-center justify-center gap-3 active:scale-95"
                >
                  <Sparkles className="w-5 h-5" />
                  Support Now
                </button>
              </div>

              {/* Supporter Feed */}
              <div className="space-y-6">
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-rose-500" />
                    <h2 className="text-xl font-bold text-white">Supporters List</h2>
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{payments.length} TOTAL</span>
                </div>

                <div className="grid gap-4">
                  <AnimatePresence>
                    {payments.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass-card p-12 rounded-[2rem] border border-dashed border-white/10 text-center"
                      >
                        <Coffee className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">Be the first to support {username}!</p>
                      </motion.div>
                    ) : (
                      payments.map((p, i) => (
                        <motion.div 
                          key={p._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="glass-card p-6 rounded-[1.5rem] border border-white/5 flex items-start gap-4 hover:border-white/10 transition-colors"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 text-indigo-400 font-bold text-xl">
                            {p.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                               <h3 className="font-bold text-white">{p.name}</h3>
                               <div className="px-2 py-1 rounded-lg bg-emerald-500/10 text-[10px] font-black text-emerald-400">
                                 ₹{p.amount}
                               </div>
                            </div>
                            <p className="text-slate-400 text-sm italic">&quot;{p.message}&quot;</p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </>
  )
}

export default PaymentPage
