"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./extra/ModeToggle";
import { 
  Menu, X, User, Home, Store, Info, Phone, 
  Camera, Settings, Package, ShoppingBag, Zap
} from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/aboutus", label: "About", icon: Info },
  { href: "/all-products", label: "Shop", icon: Store },
  { href: "/gallery", label: "Gallery", icon: Camera },
  { href: "/contact-us", label: "Contact", icon: Phone },
];

export default function Navbar() {
  const { router, user } = useAppContext();
  const { openSignIn } = useClerk();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "py-2" : "py-4"
      }`}
    >
      {/* ── Desktop Navbar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={`flex items-center justify-between px-5 py-3 rounded-2xl transition-all duration-500 border ${
            isScrolled
              ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg border-slate-200/50 dark:border-slate-800/50"
              : "bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm border-transparent"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <Image src="/favicon.png" alt="Logo" width={32} height={32} className="object-contain" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                Power Electronics
              </h1>
            </div>
          </Link>

          {/* Desktop Links (React Bits style active states) */}
          <div className="hidden lg:flex items-center gap-1 p-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-full border border-slate-200/50 dark:border-slate-700/50">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive ? "text-amber-700 dark:text-amber-400" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-amber-100 dark:bg-amber-900/30 rounded-full border border-amber-200 dark:border-amber-800/50"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <item.icon className="w-4 h-4 opacity-70" />
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <ModeToggle />
            
            <div className="hidden sm:block">
              {user ? (
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9 rounded-full ring-2 ring-amber-100 dark:ring-slate-800 transition-all hover:scale-105",
                      userButtonPopoverCard: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl",
                    }
                  }}
                >
                  <UserButton.MenuItems>
                    <UserButton.Action label="Products" labelIcon={<Package className="w-4 h-4"/>} onClick={() => router.push('/all-products')} />
                    <UserButton.Action label="Cart" labelIcon={<ShoppingBag className="w-4 h-4"/>} onClick={() => router.push('/cart')} />
                    <UserButton.Action label="Orders" labelIcon={<Store className="w-4 h-4"/>} onClick={() => router.push('/my-orders')} />
                  </UserButton.MenuItems>
                </UserButton>
              ) : (
                <button
                  onClick={openSignIn}
                  className="px-5 py-2 rounded-full text-sm font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-all hover:shadow-lg flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </motion.nav>
      </div>

      {/* ── Mobile Menu Overlay ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white dark:bg-slate-900 shadow-2xl z-50 lg:hidden flex flex-col border-l border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  Menu
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-colors ${
                        isActive
                          ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${isActive ? "text-amber-500" : "opacity-60"}`} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                {user ? (
                  <div className="flex flex-col gap-3">
                    <UserButton />
                    <p className="text-sm font-medium text-slate-500 text-center">Logged In</p>
                  </div>
                ) : (
                  <button
                    onClick={() => { setMobileMenuOpen(false); openSignIn(); }}
                    className="w-full py-3.5 rounded-xl font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <User className="w-5 h-5" />
                    Sign In
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
