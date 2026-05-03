"use client"
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useSession, signOut } from "next-auth/react"
import Link from 'next/link'
import { User, LogOut, LayoutDashboard, Coffee, Menu, X, ChevronDown, Search } from 'lucide-react'
import { searchCreators } from '@/actions/useractions'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const { data: session } = useSession()
  const [showDropdown, setShowDropdown] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        try {
          setIsSearching(true)
          const results = await searchCreators(searchQuery)
          setSearchResults(results)
        } catch (error) {
          console.error("Search failed:", error)
          setSearchResults([])
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchQuery('')
        setSearchResults([])
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="p-2 bg-indigo-500/10 rounded-xl group-hover:bg-indigo-500/20 transition-colors">
              <Coffee className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Get Me A Coffee
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-8 relative" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search creators..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>

            <AnimatePresence>
              {searchResults.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 glass-card border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50"
                >
                  {searchResults.map((creator) => (
                    <Link 
                      key={creator._id}
                      href={`/${creator.username}`}
                      onClick={() => {
                        setSearchQuery('')
                        setSearchResults([])
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800">
                        <Image unoptimized src={creator.profilepic || "/avatar.gif"} alt="" width={32} height={32} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{creator.name}</p>
                        <p className="text-xs text-slate-500">@{creator.username}</p>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            {!session ? (
              <div className="flex items-center gap-4">
                <Link href="/login">
                  <button className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all shadow-lg shadow-indigo-500/25">
                    Start Page
                  </button>
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl glass border-white/10 hover:bg-white/5 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 overflow-hidden">
                    {session.user.image ? (
                        <Image unoptimized src={session.user.image} alt="" width={32} height={32} className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-4 h-4 text-indigo-300" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-slate-200 hidden sm:block">{session.user.name}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showDropdown && (
                  <>
                    <div className="fixed inset-0 z-0" onClick={() => setShowDropdown(false)} />
                    <div className="absolute right-0 mt-2 w-56 glass-card rounded-2xl border border-white/10 overflow-hidden z-10">
                      <div className="p-2">
                        <Link
                          href="/dashboard"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-sm text-slate-300 hover:text-white"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <Link
                          href={`/${session.user.name}`}
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-sm text-slate-300 hover:text-white"
                        >
                          <User className="w-4 h-4" />
                          Public Page
                        </Link>
                        <div className="my-1 border-t border-white/5" />
                        <button
                          onClick={() => {
                            setShowDropdown(false)
                            signOut({ callbackUrl: "/" })
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors text-sm text-red-400 hover:text-red-300"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/10 px-4 pt-2 pb-6 overflow-hidden"
          >
            {/* Mobile Search */}
            <div className="py-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search creators..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white"
                />
                
                {searchResults.length > 0 && (
                    <div className="mt-2 glass-card border border-white/10 rounded-xl overflow-hidden">
                        {searchResults.map((creator) => (
                            <Link 
                                key={creator._id}
                                href={`/${creator.username}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                            >
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800">
                                    <Image unoptimized src={creator.profilepic || "/avatar.gif"} alt="" width={32} height={32} className="w-full h-full object-cover" />
                                </div>
                                <p className="text-sm font-bold text-white">{creator.name}</p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {!session ? (
              <Link
                href="/login"
                className="block px-3 py-3 rounded-xl text-base font-bold bg-indigo-600 text-center text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            ) : (
              <div className="space-y-1">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-slate-300 hover:bg-white/5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Dashboard
                </Link>
                <Link
                  href={`/${session.user.name}`}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-slate-300 hover:bg-white/5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  Public Page
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    signOut({ callbackUrl: "/" })
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-red-400 hover:bg-red-500/10 mt-4"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
