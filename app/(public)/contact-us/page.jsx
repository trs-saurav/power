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
  Sparkles,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import emailjs from '@emailjs/browser';
import { motion } from "framer-motion";
import toast from 'react-hot-toast';

const contactCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const headerVariants = {
  hidden: { opacity: 0, y: 30 },
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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
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
      icon: <MailIcon className="w-5 h-5 md:w-6 md:h-6" />,
      title: "Email Us",
      desc: "Get in touch via email for detailed inquiries",
      info: "powerele9@gmail.com",
      link: "mailto:powerele9@gmail.com",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />,
      title: "WhatsApp Chat",
      desc: "Quick support and instant responses",
      info: "Start conversation",
      link: "https://wa.me/7004135756",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <MapPinIcon className="w-5 h-5 md:w-6 md:h-6" />,
      title: "Visit Our Office",
      desc: "Come see us for in-person consultation",
      info: "Gulzarbagh, Patna, Bihar",
      link: "https://maps.app.goo.gl/y5EKbUTbM1kuyw867",
      color: "from-purple-500 to-violet-500",
    },
    {
      icon: <PhoneIcon className="w-5 h-5 md:w-6 md:h-6" />,
      title: "Call Us",
      desc: "Speak directly with our experts",
      info: "+91 9334150024",
      link: "tel:9334150024",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="w-full mt-10 md:mt-15 min-h-screen bg-gradient-to-br from-background via-muted/20 to-background overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-64 md:h-64 bg-gradient-to-r from-primary/10 to-violet/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-gradient-to-r from-emerald/10 to-cyan/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full py-8 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          
          {/* Header Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={headerVariants}
            className="text-center mb-12 md:mb-16 w-full"
          >
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 px-2">
              <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                Let's Start a
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">
                Conversation
              </span>
            </h1>
            
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
              Have questions about our electrical solutions? Need a custom quote? 
              Our team of experts is here to help you power your projects with confidence.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-8 md:mt-12 px-4">
              <div className="text-center">
                <div className="text-lg md:text-2xl font-bold text-primary">7 Days</div>
                <div className="text-xs md:text-sm text-muted-foreground">Support Available</div>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-2xl font-bold text-primary">20K+</div>
                <div className="text-xs md:text-sm text-muted-foreground">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-2xl font-bold text-primary">20+</div>
                <div className="text-xs md:text-sm text-muted-foreground">Years Experience</div>
              </div>
            </div>
          </motion.div>

          <div className="w-full grid lg:grid-cols-2 gap-6 lg:gap-12 items-start">
            
            {/* Contact Methods */}
            <div className="w-full space-y-6 md:space-y-8">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-lg md:text-2xl font-bold mb-6 px-2"
              >
                Multiple Ways to Reach Us
              </motion.h2>

              <div className="w-full grid gap-4">
                {contactMethods.map((method, i) => (
                  <motion.div
                    key={method.title}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={contactCardVariants}
                    className="w-full group"
                  >
                    <Card className="w-full overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-card/80 backdrop-blur-sm">
                      <CardContent className="p-4 md:p-5 w-full">
                        <div className="flex items-start gap-3 md:gap-4 w-full">
                          <div className={`
                            flex-shrink-0 p-2.5 md:p-3 rounded-xl bg-gradient-to-r ${method.color} text-white shadow-lg
                            group-hover:scale-105 transition-transform duration-300
                          `}>
                            {method.icon}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base md:text-lg text-foreground mb-1">
                              {method.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-2 md:mb-3">
                              {method.desc}
                            </p>
                            <Link 
                              href={method.link}
                              target={method.link.startsWith('http') ? '_blank' : undefined}
                              className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all duration-200 text-sm md:text-base"
                            >
                              <span className="truncate">{method.info}</span>
                              <ArrowRight className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={formVariants}
              className="w-full"
            >
              <Card className="w-full overflow-hidden border-0 shadow-lg bg-card/80">
                <CardContent className="p-4 md:p-6 w-full">
                  <div className="mb-6 md:mb-8">
                    <h2 className="text-lg md:text-xl font-bold mb-2">Send us a Message</h2>
                    <p className="text-muted-foreground text-sm md:text-base">
                      Fill out the form below and we'll get back to you within 24 hours.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="w-full space-y-4">
                    <div className="w-full grid md:grid-cols-2 gap-4">
                      <div className="w-full">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Full Name *
                        </Label>
                        <Input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your full name"
                          id="name"
                          className="mt-2 h-10 md:h-12 w-full bg-background border-border/50 focus:border-primary transition-colors text-base"
                          style={{ fontSize: '16px' }}
                          required
                        />
                      </div>
                      
                      <div className="w-full">
                        <Label htmlFor="phone" className="text-sm font-medium">
                          Phone Number
                        </Label>
                        <Input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Your phone number"
                          id="phone"
                          className="mt-2 h-10 md:h-12 w-full bg-background border-border/50 focus:border-primary transition-colors text-base"
                          style={{ fontSize: '16px' }}
                        />
                      </div>
                    </div>
                    
                    <div className="w-full">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address *
                      </Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        id="email"
                        className="mt-2 h-10 md:h-12 w-full bg-background border-border/50 focus:border-primary transition-colors text-base"
                        style={{ fontSize: '16px' }}
                        required
                      />
                    </div>
                    
                    <div className="w-full">
                      <Label htmlFor="message" className="text-sm font-medium">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us about your project or inquiry..."
                        className="mt-2 min-h-24 md:min-h-32 w-full bg-background border-border/50 focus:border-primary transition-colors resize-none text-base"
                        style={{ fontSize: '16px' }}
                        required
                      />
                    </div>
                    
                    <div className="flex items-start gap-3 w-full">
                      <Checkbox id="terms" required className="mt-1 flex-shrink-0" />
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
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-10 md:h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-200" 
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
