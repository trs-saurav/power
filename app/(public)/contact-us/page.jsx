"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  MailIcon, 
  MapPinIcon, 
  MessageCircle, 
  PhoneIcon,
  Send,
  CheckCircle,
  Sparkles,
  Clock,
  Globe,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import emailjs from '@emailjs/browser';
import { motion } from "framer-motion";
import toast from 'react-hot-toast';

const contactCardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      type: "spring",
      stiffness: 100,
    },
  }),
};

const headerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const formVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      type: "spring",
      stiffness: 80,
      delay: 0.3
    }
  }
};

const Contact = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("All fields are required!");
      return;
    }
    
    setDisabled(true);
    toast.loading("Sending your message...", { id: 'sending' });

    const data = {
      form_name: name,
      form_number: phone,
      form_email: email,
      form_message: message,
    };

    try {
      await emailjs.send("service_i4bh7ri", "template_peffz3o", data, "RGLfHvoDvDi5xc9lh");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      toast.success("Message sent successfully! We'll get back to you soon.", { id: 'sending' });
    } catch (error) {
      console.error("Email sending failed:", error);
      toast.error("Failed to send message. Please try again.", { id: 'sending' });
    } finally {
      setDisabled(false);
    }
  };

  const contactMethods = [
    {
      icon: <MailIcon className="w-6 h-6" />,
      title: "Email Us",
      desc: "Get in touch via email for detailed inquiries",
      info: "powerele9@gmail.com",
      link: "mailto:powerele9@gmail.com",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "WhatsApp Chat",
      desc: "Quick support and instant responses",
      info: "Start conversation",
      link: "https://wa.me/7004135756",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-950/20"
    },
    {
      icon: <MapPinIcon className="w-6 h-6" />,
      title: "Visit Our Office",
      desc: "Come see us for in-person consultation",
      info: "Gulzarbagh, Patna, Bihar",
      link: "https://maps.app.goo.gl/y5EKbUTbM1kuyw867",
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20"
    },
    {
      icon: <PhoneIcon className="w-6 h-6" />,
      title: "Call Us",
      desc: "Speak directly with our experts",
      info: "+91 9334150024",
      link: "tel:9334150024",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/20"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-primary/10 to-violet/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald/10 to-cyan/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={headerVariants}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2">
                <Sparkles className="w-4 h-4 mr-1" />
                Get In Touch
              </Badge>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                Let's Start a
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">
                Conversation
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Have questions about our electrical solutions? Need a custom quote? 
              Our team of experts is here to help you power your projects with confidence.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Support Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">100K+</div>
                <div className="text-sm text-muted-foreground">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">30+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Contact Methods */}
            <div className="space-y-8">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold mb-8"
              >
                Multiple Ways to Reach Us
              </motion.h2>

              <div className="grid gap-6">
                {contactMethods.map((method, i) => (
                  <motion.div
                    key={method.title}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={contactCardVariants}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="group"
                  >
                    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-card/80 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`
                            p-3 rounded-xl bg-gradient-to-r ${method.color} text-white shadow-lg
                            group-hover:scale-110 transition-transform duration-300
                          `}>
                            {method.icon}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg text-foreground mb-1">
                              {method.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-3">
                              {method.desc}
                            </p>
                            <Link 
                              href={method.link}
                              target={method.link.startsWith('http') ? '_blank' : undefined}
                              className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all duration-200"
                            >
                              {method.info}
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Business Hours */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-gradient-to-r from-primary/5 to-violet/5 border border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Clock className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-foreground">Business Hours</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Monday - Friday</span>
                        <span className="font-medium">9:00 AM - 9:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Saturday</span>
                        <span className="font-medium">9:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sunday</span>
                        <span className="font-medium">10:00 AM - 4:00 PM</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={formVariants}
            >
              <Card className="overflow-hidden border-0 shadow-2xl bg-card/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-2">Send us a Message</h2>
                    <p className="text-muted-foreground">
                      Fill out the form below and we'll get back to you within 24 hours.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                      >
                        <Label htmlFor="name" className="text-sm font-medium">
                          Full Name *
                        </Label>
                        <Input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your full name"
                          id="name"
                          className="mt-2 h-12 bg-background border-border/50 focus:border-primary transition-colors"
                          required
                        />
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 }}
                      >
                        <Label htmlFor="phone" className="text-sm font-medium">
                          Phone Number
                        </Label>
                        <Input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Your phone number"
                          id="phone"
                          className="mt-2 h-12 bg-background border-border/50 focus:border-primary transition-colors"
                        />
                      </motion.div>
                    </div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                    >
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address *
                      </Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        id="email"
                        className="mt-2 h-12 bg-background border-border/50 focus:border-primary transition-colors"
                        required
                      />
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.25 }}
                    >
                      <Label htmlFor="message" className="text-sm font-medium">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us about your project or inquiry..."
                        className="mt-2 min-h-32 bg-background border-border/50 focus:border-primary transition-colors resize-none"
                        required
                      />
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                      className="flex items-start gap-3"
                    >
                      <Checkbox id="terms" required className="mt-1" />
                      <Label htmlFor="terms" className="text-sm leading-relaxed">
                        I agree to the{" "}
                        <Link href="/terms" className="text-primary hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.35 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-200" 
                        disabled={disabled}
                      >
                        {disabled ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Sending Message...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
