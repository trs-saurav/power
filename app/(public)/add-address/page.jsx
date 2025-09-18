'use client'
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

// shadcn/ui components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

// Icons
import { 
  MapPin, 
  User, 
  Phone, 
  Hash, 
  Home, 
  Building, 
  Globe,
  ArrowLeft,
  Loader2,
  Save,
  Navigation
} from "lucide-react";

const AddAddress = () => {
    const { getToken } = useAppContext();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [address, setAddress] = useState({
        fullName: '',
        phoneNumber: '',
        pincode: '',
        area: '',
        city: '',
        state: '',
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        
        if (!address.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!address.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
        else if (!/^\d{10}$/.test(address.phoneNumber.replace(/\D/g, ''))) {
            newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
        }
        if (!address.pincode.trim()) newErrors.pincode = "Pin code is required";
        else if (!/^\d{6}$/.test(address.pincode)) {
            newErrors.pincode = "Pin code must be 6 digits";
        }
        if (!address.area.trim()) newErrors.area = "Address is required";
        if (!address.city.trim()) newErrors.city = "City is required";
        if (!address.state.trim()) newErrors.state = "State is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the errors in the form");
            return;
        }

        try {
            setLoading(true);
            const token = await getToken();

            const { data } = await axios.post('/api/user/add-address', { address }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (data?.success) {
                toast.success(data.message || "Address added successfully!");
                router.push('/cart');
            } else {
                toast.error(data?.message || "Failed to add address");
            }
        } catch (error) {
            const errorMsg = error?.response?.data?.message || error?.message || "Failed to add address";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setAddress({ ...address, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' });
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-background pt-20"
        >
            <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-32 py-8">
                
                {/* Header */}
                <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-center justify-between mb-8"
                >
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                            <MapPin className="w-8 h-8 text-primary" />
                            Add Shipping Address
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Enter your delivery details for a smooth checkout experience
                        </p>
                    </div>
                    
                    <Button 
                        variant="outline" 
                        onClick={() => router.back()}
                        className="w-fit"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    
                    {/* Form Section */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Navigation className="w-5 h-5" />
                                    Address Information
                                </CardTitle>
                                <CardDescription>
                                    Please provide accurate delivery information
                                </CardDescription>
                            </CardHeader>
                            
                            <CardContent>
                                <form onSubmit={onSubmitHandler} className="space-y-6">
                                    
                                    {/* Personal Information */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <User className="w-4 h-4 text-muted-foreground" />
                                            <Label className="text-sm font-medium">Personal Information</Label>
                                        </div>
                                        
                                        <motion.div variants={itemVariants} className="space-y-2">
                                            <Label htmlFor="fullName">Full Name *</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="fullName"
                                                    type="text"
                                                    placeholder="Enter your full name"
                                                    value={address.fullName}
                                                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                                                    className={`pl-10 ${errors.fullName ? 'border-destructive' : ''}`}
                                                />
                                            </div>
                                            {errors.fullName && (
                                                <p className="text-xs text-destructive">{errors.fullName}</p>
                                            )}
                                        </motion.div>

                                        <motion.div variants={itemVariants} className="space-y-2">
                                            <Label htmlFor="phoneNumber">Phone Number *</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="phoneNumber"
                                                    type="tel"
                                                    placeholder="Enter 10-digit phone number"
                                                    value={address.phoneNumber}
                                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                                    className={`pl-10 ${errors.phoneNumber ? 'border-destructive' : ''}`}
                                                />
                                            </div>
                                            {errors.phoneNumber && (
                                                <p className="text-xs text-destructive">{errors.phoneNumber}</p>
                                            )}
                                        </motion.div>
                                    </div>

                                    <Separator />

                                    {/* Address Information */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <MapPin className="w-4 h-4 text-muted-foreground" />
                                            <Label className="text-sm font-medium">Address Details</Label>
                                        </div>

                                        <motion.div variants={itemVariants} className="space-y-2">
                                            <Label htmlFor="pincode">Pin Code *</Label>
                                            <div className="relative">
                                                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="pincode"
                                                    type="text"
                                                    placeholder="6-digit pin code"
                                                    value={address.pincode}
                                                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                                                    className={`pl-10 ${errors.pincode ? 'border-destructive' : ''}`}
                                                    maxLength={6}
                                                />
                                            </div>
                                            {errors.pincode && (
                                                <p className="text-xs text-destructive">{errors.pincode}</p>
                                            )}
                                        </motion.div>

                                        <motion.div variants={itemVariants} className="space-y-2">
                                            <Label htmlFor="area">Address (Area and Street) *</Label>
                                            <div className="relative">
                                                <Home className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                                <Textarea
                                                    id="area"
                                                    placeholder="House number, building name, street name, locality"
                                                    value={address.area}
                                                    onChange={(e) => handleInputChange('area', e.target.value)}
                                                    className={`pl-10 resize-none ${errors.area ? 'border-destructive' : ''}`}
                                                    rows={3}
                                                />
                                            </div>
                                            {errors.area && (
                                                <p className="text-xs text-destructive">{errors.area}</p>
                                            )}
                                        </motion.div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <motion.div variants={itemVariants} className="space-y-2">
                                                <Label htmlFor="city">City/District/Town *</Label>
                                                <div className="relative">
                                                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <Input
                                                        id="city"
                                                        type="text"
                                                        placeholder="Enter city"
                                                        value={address.city}
                                                        onChange={(e) => handleInputChange('city', e.target.value)}
                                                        className={`pl-10 ${errors.city ? 'border-destructive' : ''}`}
                                                    />
                                                </div>
                                                {errors.city && (
                                                    <p className="text-xs text-destructive">{errors.city}</p>
                                                )}
                                            </motion.div>

                                            <motion.div variants={itemVariants} className="space-y-2">
                                                <Label htmlFor="state">State *</Label>
                                                <div className="relative">
                                                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <Input
                                                        id="state"
                                                        type="text"
                                                        placeholder="Enter state"
                                                        value={address.state}
                                                        onChange={(e) => handleInputChange('state', e.target.value)}
                                                        className={`pl-10 ${errors.state ? 'border-destructive' : ''}`}
                                                    />
                                                </div>
                                                {errors.state && (
                                                    <p className="text-xs text-destructive">{errors.state}</p>
                                                )}
                                            </motion.div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Submit Button */}
                                    <motion.div variants={itemVariants}>
                                        <Button 
                                            type="submit" 
                                            disabled={loading}
                                            size="lg"
                                            className="w-full"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Saving Address...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Save Address
                                                </>
                                            )}
                                        </Button>
                                    </motion.div>

                                    {/* Help Text */}
                                    <motion.div 
                                        variants={itemVariants}
                                        className="text-xs text-muted-foreground text-center space-y-1"
                                    >
                                        <p>* Required fields</p>
                                        <p>Your information is secure and will only be used for delivery purposes</p>
                                    </motion.div>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Image Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="hidden lg:block"
                    >
                        <Card className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="relative">
                                    <Image
                                        src={assets.my_location_image}
                                        alt="Location illustration"
                                        className="w-full h-auto object-cover"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                    <div className="absolute bottom-6 left-6 text-white">
                                        <h3 className="text-xl font-semibold mb-2">Quick & Easy Delivery</h3>
                                        <p className="text-sm opacity-90">
                                            Add your address once and enjoy hassle-free deliveries
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Benefits */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-6 space-y-4"
                        >
                            <h4 className="font-semibold text-lg">Why add your address?</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm text-muted-foreground">Faster checkout process</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-sm text-muted-foreground">Accurate delivery estimates</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    <span className="text-sm text-muted-foreground">Secure information storage</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    <span className="text-sm text-muted-foreground">Easy address management</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default AddAddress;
