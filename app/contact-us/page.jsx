"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MailIcon, MapPinIcon, MessageCircle, PhoneIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import emailjs from '@emailjs/browser';
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

const contactCardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      type: "spring",
      stiffness: 80,
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
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      type: "spring",
      stiffness: 80,
      delay: 0.2
    }
  }
};

const Contact = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert("All fields are required!");
      return;
    }
    setDisabled(true);

    const data = {
      form_name: name,
      form_number: phone,
      form_email: email,
      form_message: message,
    };

    emailjs.send("service_i4bh7ri", "template_peffz3o", data, "RGLfHvoDvDi5xc9lh")
      .then(() => {
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
        setDisabled(false);
      })
      .catch((error) => {
        console.error("Email sending failed:", error);
        alert("Email sending failed! Please try again.");
        setDisabled(false);
      });
  };

  const contactMethods = [
    {
      icon: <MailIcon />,
      title: "Email",
      desc: "Our friendly team is here to help.",
      link: (
        <Link className="font-medium text-primary" href="mailto:powerele9@gmail.com">
          powerele9@gmail.com
        </Link>
      ),
    },
    {
      icon: <MessageCircle />,
      title: "Live chat",
      desc: "Our friendly team is here to help.",
      link: (
        <Link className="font-medium text-primary" href="https://wa.me/7004135756" target="_blank" rel="noopener noreferrer">
          Open Whatsapp Chat
        </Link>
      ),
    },
    {
      icon: <MapPinIcon />,
      title: "Office",
      desc: "Come say hello at our office.",
      link: (
        <Link className="font-medium text-primary" href="https://maps.app.goo.gl/y5EKbUTbM1kuyw867" target="_blank">
          Opp. Gulzarbagh Railway Station,<br /> Gulzarabagh- Patna city,<br /> Bihar 800007
        </Link>
      ),
    },
    {
      icon: <PhoneIcon />,
      title: "Phone",
      desc: "Everyday from 9am to 9pm.",
      link: (
        <Link className="font-medium text-primary" href="tel:9334150024">
          +91 9334150024, +91 7488022802
        </Link>
      ),
    },
  ];

  return (
<>
    <Navbar  />
    <div className="min-h-screen flex items-center justify-center py-16 pt-[100px]">
      <div className="w-full max-w-screen-xl mx-auto px-6 xl:px-0">
        {/* Header Section - Animates when in view */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={headerVariants}
        >
          <b className="text-muted-foreground">Contact Us</b>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
            Chat to our friendly team
          </h2>
          <p className="mt-3 text-base sm:text-lg">
            We&apos;d love to hear from you. Please fill out this form or shoot us
            an email.
          </p>
        </motion.div>

        <div className="mt-24 grid lg:grid-cols-2 gap-16 md:gap-10">
          {/* Contact Methods - Each animates when in view */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
            {contactMethods.map((method, i) => (
              <motion.div
                key={method.title}
                className="flex flex-col"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={contactCardVariants}
              >
                <div className="h-12 w-12 flex items-center justify-center bg-primary/10 text-primary rounded-full">
                  {method.icon}
                </div>
                <h3 className="mt-6 font-semibold text-xl">{method.title}</h3>
                <p className="my-2.5 text-muted-foreground">{method.desc}</p>
                {method.link}
              </motion.div>
            ))}
          </div>

          {/* Form Section - Animates when in view */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={formVariants}
          >
            <Card className="bg-accent shadow-none">
              <CardContent className="p-6 md:p-10">
                <form onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-x-8 gap-y-5">
                    <motion.div 
                      className="col-span-2 sm:col-span-1"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                    >
                      <Label htmlFor="firstName">Name</Label>
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        id="firstName"
                        className="mt-1.5 bg-white h-11 shadow-none"
                        required
                      />
                    </motion.div>
                    
                    <motion.div 
                      className="col-span-2 sm:col-span-1"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <Label htmlFor="number">Phone Number</Label>
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone Number"
                        id="number"
                        className="mt-1.5 bg-white h-11 shadow-none"
                        required
                      />
                    </motion.div>
                    
                    <motion.div 
                      className="col-span-2"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <Label htmlFor="email">Email</Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        id="email"
                        className="mt-1.5 bg-white h-11 shadow-none"
                        required
                      />
                    </motion.div>
                    
                    <motion.div 
                      className="col-span-2"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Message"
                        className="mt-1.5 bg-white shadow-none"
                        rows={6}
                        required
                      />
                    </motion.div>
                    
                    <motion.div 
                      className="col-span-2 flex items-center gap-2"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <Checkbox id="acceptTerms" required />
                      <Label htmlFor="acceptTerms">
                        You agree to our{" "}
                        <Link href="#" className="underline">
                          terms and conditions
                        </Link>
                        .
                      </Label>
                    </motion.div>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button type="submit" className="mt-6 w-full" size="lg" disabled={disabled}>
                      {disabled ? "Submitting..." : "Submit"}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
    </>
  );
  
};

export default Contact;
