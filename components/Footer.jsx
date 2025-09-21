import React from 'react'
import Link from 'next/link'
import Map from './extra/Map';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Phone, 
  Mail, 
  MapPin,
  Zap,
  ArrowRight,
  Heart,
  ExternalLink,
  Shield,
  Award,
  Users
} from "lucide-react";
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className='relative bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-t border-border/50'>
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-r from-primary/5 to-violet-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Company Info Section */}
            <div className="lg:col-span-2 space-y-6">
              <Link href="/" className="flex items-center group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-violet-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary/10 to-violet-500/10 rounded-xl p-2 border border-primary/20 group-hover:border-primary/40 transition-colors">
                    <Image
                      src="/favicon.png"
                      className="w-full h-full object-contain"
                      alt="Power Electronics Logo"
                      width={56}
                      height={56}
                    />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className='text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/80 transition-all duration-300'>
                    POWER ELECTRONICS
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium">
                    Powering Tomorrow, Today
                  </p>
                </div>
              </Link>

              <p className="text-muted-foreground leading-relaxed max-w-md">
                Leading provider of premium electrical solutions with over 25 years of experience. 
                Trusted by 10,000+ customers for reliable power and security systems.
              </p>

              {/* Trust Indicators */}
             
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Quick Links
              </h4>
              <ul className="space-y-3">
                {[
                  { name: 'Home', href: '/' },
                  { name: 'About Us', href: '/about' },
                  { name: 'Our Gallery', href: '/gallery' },
                  { name: 'Services', href: '/services' },
                  { name: 'Contact Us', href: '/contact-us' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-200 text-sm font-medium"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Shop & Services */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground">
                Shop & Account
              </h4>
              <ul className="space-y-3">
                {[
                  { name: 'Browse Products', href: '/all-products' },
                  { name: 'My Orders', href: '/my-orders' },
                  { name: 'Shopping Cart', href: '/cart' },
                  { name: 'Customer Support', href: '/contact-us' },
                ].map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-200 text-sm font-medium"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact & Location Section */}
          <div className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Contact Information */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-foreground">Get In Touch</h4>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 hover:border-primary/30 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h5 className="font-medium text-foreground mb-1">Visit Our Office</h5>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Opp. Gulzarbagh Railway Station<br />
                      Gulzarbagh, Patna, Bihar 800007
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 hover:border-primary/30 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h5 className="font-medium text-foreground mb-1">Email Us</h5>
                    <Link 
                      href="mailto:powerele9@gmail.com" 
                      className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                    >
                      powerele9@gmail.com
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 hover:border-primary/30 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h5 className="font-medium text-foreground mb-1">Call Us</h5>
                    <div className="space-y-1">
                      <Link 
                        href="tel:+919334150024" 
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        +91 9334150024
                      </Link>
                      <Link 
                        href="tel:+917488022802" 
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        +91 7488022802
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legal Links */}
              <div className="pt-4 border-t border-border/50">
                <div className="flex flex-wrap gap-6">
                  <Link 
                    href="#" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link 
                    href="#" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Terms & Conditions
                  </Link>
                  <Link 
                    href="#" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Return Policy
                  </Link>
                </div>
              </div>
            </div>

            {/* Map Section - Fixed */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground mb-4">Find Our Location</h4>
              <div className="w-full max-w-md mx-auto lg:max-w-none">
                <div className="rounded-2xl overflow-hidden border border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card/50 backdrop-blur-sm">
                  <div className="w-full h-64 lg:h-72">
                    <Map embedUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3598.1959340485805!2d85.20266207485055!3d25.598404715334496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed5f43643c1c93%3A0xf0a1e7dd438d8146!2sPower%20Electronics!5e0!3m2!1sen!2sin!4v1748755482698!5m2!1sen!2sin" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='border-t border-border/50 bg-muted/30 backdrop-blur-sm'>
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              
              {/* Copyright */}
              <div className="text-center sm:text-left">
                <p className="text-muted-foreground text-sm">
                  &copy; {new Date().getFullYear()} Power Electronics. All rights reserved.
                </p>
                <p className="text-muted-foreground/80 text-xs mt-1 flex items-center justify-center sm:justify-start gap-2">
                  Developed by 
                  <Link 
                    href="https://instagram.com/trs_saurav"
                    target="_blank"
                    className="inline-flex items-center gap-1 hover:text-primary transition-colors font-medium"
                  >
                    <Instagram className="w-3 h-3" />
                    @trs_saurav
                  </Link>
                </p>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Follow Us</span>
                <div className="flex gap-2">
                  {[
                    { 
                      icon: Instagram, 
                      href: "https://instagram.com/powerele9", 
                      color: "hover:bg-pink-500",
                      name: "Instagram"
                    },
                    { 
                      icon: Twitter, 
                      href: "https://twitter.com", 
                      color: "hover:bg-blue-400",
                      name: "Twitter"
                    },
                    { 
                      icon: Facebook, 
                      href: "https://facebook.com", 
                      color: "hover:bg-blue-600",
                      name: "Facebook"
                    }
                  ].map((social) => (
                    <Link 
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      className={`
                        p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl 
                        text-muted-foreground hover:text-white ${social.color} 
                        transition-all duration-200 hover:scale-110 hover:shadow-lg
                      `}
                      aria-label={social.name}
                    >
                      <social.icon className="w-4 h-4" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
