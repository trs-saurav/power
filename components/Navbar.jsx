"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./extra/ModeToggle";
import { NavLink } from "./extra/NavLink";
import { 
  Menu, 
  X, 
  User, 
  Home,
  Store,
  Info,
  Phone,
  Camera,
  Sparkles,
  Package,
  ShoppingBag,
  Settings,
  Sun,
  Moon
} from "lucide-react";

const Navbar = () => {
  const { router, user } = useAppContext();
  const { openSignIn } = useClerk();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/all-products", label: "Shop", icon: Store },
    { href: "/gallery", label: "Gallery", icon: Camera },
    { href: "/services", label: "Services", icon: Settings },
    { href: "/contact-us", label: "Contact", icon: Phone },
    { href: "/aboutus", label: "About", icon: Info },
  ];

  return (
    <>
      <nav className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled 
          ? 'bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg' 
          : 'bg-background/80 backdrop-blur-sm border-b border-border/30'
        }
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Logo Section */}
            <Link 
              href="/" 
              className="relative flex items-center group transition-all duration-300 hover:scale-105"
              aria-label="Power Electronics Home"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-md"></div>
                <div className="relative w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-950 dark:to-violet-950 rounded-xl p-1.5 border border-blue-200/50 dark:border-blue-800/50">
                  <Image 
                    src="/favicon.png" 
                    alt="Power Electronics Logo" 
                    width={48} 
                    height={48} 
                    className="rounded-lg object-contain"
                    priority
                  />
                </div>
              </div>
              
              <div className="ml-3 hidden sm:block">
                <div className="flex items-center gap-1">
                  <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-violet-700 transition-all duration-300">
                    Power Electronics
                  </h1>
                  <Sparkles className="w-4 h-4 text-violet-500 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  Powering Tomorrow, Today
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <NavLink 
                  key={item.href} 
                  href={item.href}
                  className="px-4 py-2 rounded-full text-sm font-medium hover:bg-accent/80 transition-all duration-200 flex items-center gap-2"
                  onClick={closeMobileMenu}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              
              {/* Mobile Quick Actions - Shop and Theme Toggle */}
              <div className="flex items-center gap-2 lg:hidden">
                {/* Shop Button - Mobile */}
                <Link
                  href="/all-products"
                  className="flex items-center justify-center w-10 h-10 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-all duration-200 hover:scale-105"
                  aria-label="Shop"
                >
                  <Store className="w-5 h-5" />
                </Link>

                {/* Theme Toggle - Mobile */}
                <div className="flex items-center justify-center">
                  <ModeToggle />
                </div>
              </div>

              {/* Theme Toggle - Desktop */}
              <div className="hidden lg:block">
                <ModeToggle />
              </div>

              {/* User Section - Desktop */}
              <div className="hidden md:block">
                {user ? (
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10 rounded-full border-2 border-border hover:border-primary transition-colors duration-200",
                        userButtonPopoverCard: "bg-background border border-border shadow-2xl",
                        userButtonPopoverActionButton: "hover:bg-accent transition-colors duration-200"
                      }
                    }}
                  >
                    <UserButton.MenuItems>
                      <UserButton.Action 
                        label="Products" 
                        labelIcon={<Package className="w-4 h-4" />} 
                        onClick={() => router.push('/all-products')} 
                      />
                      <UserButton.Action 
                        label="Cart" 
                        labelIcon={<ShoppingBag className="w-4 h-4" />} 
                        onClick={() => router.push('/cart')} 
                      />
                      <UserButton.Action 
                        label="Orders" 
                        labelIcon={<Store className="w-4 h-4" />} 
                        onClick={() => router.push('/my-orders')} 
                      />
                    </UserButton.MenuItems>
                  </UserButton>
                ) : (
                  <button 
                    onClick={openSignIn} 
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <User className="w-4 h-4" />
                    Sign In
                  </button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden flex items-center justify-center w-10 h-10 bg-accent/50 hover:bg-accent rounded-full transition-all duration-200"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-foreground" />
                ) : (
                  <Menu className="w-5 h-5 text-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`
          lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-2xl
          transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}>
          <div className="max-w-7xl mx-auto px-4 py-6">
            
            {/* Mobile Navigation Links */}
            <div className="space-y-2 mb-6">
              {navItems.map((item) => (
                <NavLink 
                  key={item.href} 
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-accent/80 transition-all duration-200 text-foreground"
                  onClick={closeMobileMenu}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
            </div>

            {/* Mobile Actions Footer */}
            <div className="flex flex-col gap-3 pt-4 border-t border-border/50">
              


              {/* User Section - Mobile */}
              {user ? (
                <div className="flex items-center gap-3 px-4 py-3 bg-accent/30 rounded-xl">
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10 rounded-full border-2 border-border",
                        userButtonPopoverCard: "bg-background border border-border shadow-2xl"
                      }
                    }}
                  >
                    <UserButton.MenuItems>
                      <UserButton.Action 
                        label="Products" 
                        labelIcon={<Package className="w-4 h-4" />} 
                        onClick={() => {
                          router.push('/all-products');
                          closeMobileMenu();
                        }} 
                      />
                      <UserButton.Action 
                        label="Cart" 
                        labelIcon={<ShoppingBag className="w-4 h-4" />} 
                        onClick={() => {
                          router.push('/cart');
                          closeMobileMenu();
                        }} 
                      />
                      <UserButton.Action 
                        label="Orders" 
                        labelIcon={<Store className="w-4 h-4" />} 
                        onClick={() => {
                          router.push('/my-orders');
                          closeMobileMenu();
                        }} 
                      />
                    </UserButton.MenuItems>
                  </UserButton>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">My Account</span>
                    <span className="text-xs text-muted-foreground">Manage your profile</span>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    openSignIn();
                    closeMobileMenu();
                  }} 
                  className="flex items-center justify-center gap-3 px-4 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all duration-200"
                >
                  <User className="w-5 h-5" />
                  Sign In to Continue
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

    
    </>
  );
};

export default Navbar;
