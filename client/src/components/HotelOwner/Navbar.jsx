import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { UserButton } from '@clerk/clerk-react'

const Navbar = () => {
  return (
    <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all">
      <Link to="/" className="flex items-center gap-3">
  <img
    src={assets.logo}
    alt="StayTonight"
    className="h-10 w-auto"
  />

  <h1 className="text-3xl font-extrabold text-gray-900">
    Stay<span className="text-yellow-500">Tonight</span>
  </h1>
</Link>
      <UserButton />
    </div>
  )
}

export default Navbar
