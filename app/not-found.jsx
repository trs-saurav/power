// app/not-found.tsx
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Home, 
  ArrowLeft, 
  Search, 
  Zap,
  AlertTriangle,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  RefreshCw,
  ShoppingBagIcon
} from "lucide-react";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const floatingVariants = {
  animate: {
    y: [-5, 5, -5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search logic or redirect to search page
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const quickLinks = [
    { name: "Home", href: "/", icon: Home, description: "Return to homepage" },
    { name: "Products", href: "/all-products", icon: Zap, description: "Browse our products" },
    { name: "Services", href: "/services", icon: HelpCircle, description: "View our services" },
    { name: "About Us", href: "/about", icon: ExternalLink, description: "Learn about us" }
  ];

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-small-black/[0.2] bg-grid-pattern opacity-30" />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-4xl mx-auto"
        >
          {/* Main Error Display */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="inline-block mb-8"
            >
              <div className="relative">
                <h1 className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-black text-muted/20 leading-none select-none">
                  404
                </h1>
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-destructive/10 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-12 h-12 md:w-16 md:h-16 text-destructive" />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <div className="space-y-4 mb-8">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Page Not Found
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The page you're looking for doesn't exist or may have been moved.
              </p>
            </div>

            <Badge variant="outline" className="mb-8">
              Error Code: 404
            </Badge>
          </motion.div>


          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild className="group">
              <Link href="/" className="flex items-center gap-2">
                <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Back to Home
              </Link>
            </Button>

            <Button variant="outline" size="lg" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>

            <Button size="lg" asChild className="group">
              <Link href="/all-products" className="flex items-center gap-2">
                <ShoppingBagIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Products
              </Link>
            </Button>

            
          </motion.div>


        </motion.div>
      </div>
    </div>
  );
}
