import React from "react";
import Image from "next/image";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail, 
  Globe,
  Heart,
  Shield,
  Zap
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-background via-muted/20 to-background border-t border-border/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            
            {/* Left Section - Logo & Info */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h3 className="font-bold text-foreground">Power Electronics</h3>
                  <p className="text-xs text-muted-foreground">Admin Dashboard</p>
                </div>
              </div>
              
              <div className="hidden lg:block w-px h-8 bg-border"></div>
              
              <div className="text-center sm:text-left">
                <p className="text-sm text-muted-foreground">
                  Powering businesses with premium electrical solutions
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-4 mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    <span>Global</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-red-500" />
                    <span>Trusted</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground hidden sm:block">
                Follow Us
              </span>
              <div className="flex items-center gap-2">
                <a 
                  href="#" 
                  className="p-2 bg-muted/50 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-all duration-200 hover:scale-110 group"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                </a>
                <a 
                  href="#" 
                  className="p-2 bg-muted/50 hover:bg-sky-50 dark:hover:bg-sky-950/30 rounded-lg transition-all duration-200 hover:scale-110 group"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4 text-muted-foreground group-hover:text-sky-500 transition-colors" />
                </a>
                <a 
                  href="#" 
                  className="p-2 bg-muted/50 hover:bg-pink-50 dark:hover:bg-pink-950/30 rounded-lg transition-all duration-200 hover:scale-110 group"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4 text-muted-foreground group-hover:text-pink-600 transition-colors" />
                </a>
                <a 
                  href="#" 
                  className="p-2 bg-muted/50 hover:bg-green-50 dark:hover:bg-green-950/30 rounded-lg transition-all duration-200 hover:scale-110 group"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4 text-muted-foreground group-hover:text-green-600 transition-colors" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/50 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-4 text-muted-foreground">
              <span>&copy; {new Date().getFullYear()} Power Electronics. All rights reserved.</span>
            </div>
            
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Support
              </a>
              <div className="flex items-center gap-1">
                <span>v2.1.0</span>
                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
