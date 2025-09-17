import React from 'react'
import Link from 'next/link'
import Map from './extra/Map';
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from "lucide-react";
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className='bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-t border-slate-200 dark:border-slate-700'>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Company Info Section */}
          <div className="lg:col-span-2 space-y-6 text-center md:text-left">
            <Link href="/" className="flex items-center justify-center md:justify-start group">
              <div className="transform transition-transform duration-200 hover:scale-105">
                <Image
                  src="/favicon.png"
                  className="mr-4 h-12 w-12 sm:h-14 sm:w-14 rounded-lg"
                  alt="Power Electronics Logo"
                  width={56}
                  height={56}
                />
              </div>
              <div>
                <h3 className='text-lg sm:text-xl font-bold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors'>
                  POWER ELECTRONICS
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Your Trusted Power Solutions Partner
                </p>
              </div>
            </Link>
            
            <div className="space-y-3">
              <div className="flex items-start justify-center md:justify-start space-x-3">
                <MapPin className="text-blue-600 mt-1 flex-shrink-0 w-4 h-4" />
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Opp. Gulzarbagh Railway Station,<br />
                  Gulzarbagh, Patna, Bihar 800007
                </p>
              </div>
              
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <Mail className="text-blue-600 flex-shrink-0 w-4 h-4" />
                <Link 
                  href="mailto:powerele9@gmail.com" 
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors text-sm break-all"
                >
                  powerele9@gmail.com
                </Link>
              </div>
              
              <div className="flex items-start justify-center md:justify-start space-x-3">
                <Phone className="text-blue-600 flex-shrink-0 w-4 h-4 mt-0.5" />
                <div className="flex flex-col space-y-1 text-sm">
                  <Link 
                    href="tel:+919334150024" 
                    className="text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    +91 9334150024
                  </Link>
                  <Link 
                    href="tel:+917488022802" 
                    className="text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    +91 7488022802
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 text-center md:text-left">
            <h4 className="text-base font-semibold text-slate-800 dark:text-white">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { name: 'Home', href: '/' },
                { name: 'About', href: '/about' },
                { name: 'Gallery', href: '/gallery' },
                { name: 'Services', href: '/services' },
                { name: 'Contact', href: '/contact-us' }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-all duration-200 text-sm font-medium hover:translate-x-1 transform inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SHOP */}
          <div className="space-y-4 text-center md:text-left">
            <h4 className="text-base font-semibold text-slate-800 dark:text-white">
              Shop
            </h4>
            <ul className="space-y-2">
              {[
                { name: 'Shop', href: '/all-products' },
                { name: 'My Orders', href: '/my-orders' },
                { name: 'Cart', href: '/cart' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-all duration-200 text-sm font-medium hover:translate-x-1 transform inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          </div>

        {/* Legal & Find Us Section */}
        <div className="mt-8 lg:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Legal Section */}
          <div className="text-center lg:text-left">
            <h4 className="text-base font-semibold text-slate-800 dark:text-white mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="#" 
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors text-sm"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Find Us Section */}
          <div className="text-center flex flex-wrap flex-col justify-centery- lg:text-left">
            <h4 className="text-base self-center font-semibold text-slate-800 dark:text-white mb-4">
              Find Us
            </h4>
            <div className="rounded-xl overflow-hidden self-center transition-shadow duration-300 h-64">
              <Map embedUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3598.1959340485805!2d85.20266207485055!3d25.598404715334496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed5f43643c1c93%3A0xf0a1e7dd438d8146!2sPower%20Electronics!5e0!3m2!1sen!2sin!4v1748755482698!5m2!1sen!2sin" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className='border-t border-slate-200 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-800/50'>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            
            {/* Copyright */}
            <div className="text-center sm:text-left order-2 sm:order-1">
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                &copy; {new Date().getFullYear()} Power Electronics. All rights reserved.
              </p>
              <p className="text-slate-500 dark:text-slate-500 text-xs mt-1 flex items-center justify-center sm:justify-start gap-2">
                Designed & Developed by 
                <Link 
                  href="https://instagram.com/trs_saurav"
                  className="inline-flex items-center gap-1 hover:text-blue-600 transition-colors"
                >
                  <Instagram className="w-3 h-3" />
                  @trs_saurav
                </Link>
              </p>
            </div>

            {/* Social Links - Added padding for smaller screens */}
            <div className="flex flex-col items-center space-y-2 order-1 sm:order-2 sm:pb-5 px-4">
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-medium">
                Follow Us
              </p>
              <div className="flex space-x-3">
                {[
                  { icon: Instagram, href: "https://instagram.com/trs_saurav", color: "hover:text-pink-600" },
                  { icon: Twitter, href: "https://twitter.com", color: "hover:text-blue-400" },
                  { icon: Facebook, href: "https://facebook.com", color: "hover:text-blue-600" }
                ].map((social, index) => (
                  <Link 
                    key={index}
                    href={social.href}
                    className={`text-slate-500 dark:text-slate-400 ${social.color} transition-all duration-200`}
                  >
                    <div className="p-2 rounded-full bg-white dark:bg-slate-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110">
                      <social.icon className="w-4 h-4" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
