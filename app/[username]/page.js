// app/[username]/page.js
import React from 'react'
import PaymentPage from '@/components/PaymentPage'
import { notFound } from 'next/navigation'
import User from '@/models/User'
import connectDb from '@/db/connectDb'

export async function generateMetadata({ params }) {
  const { username } = await params
  return {
    title: `Support ${username} - Get Me A Chai`,
  }
}

export default async function UsernamePage({ params }) {
  const { username } = await params

  await connectDb()
  const user = await User.findOne({ username })

  if (!user) {
    notFound()
  }

  return <PaymentPage username={username} />
}
