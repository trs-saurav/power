'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

// shadcn/ui components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

// Icons
import { 
  Package, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Truck, 
  CheckCircle, 
  Clock, 
  Search,
  Filter,
  RefreshCw,
  ShoppingBag,
  Eye,
  ExternalLink,
  Receipt,
  Gift,
  Phone,
  XCircle,
  AlertCircle,
  PackageCheck,
  ArrowRight,
  Copy
} from "lucide-react";

const MyOrders = () => {
    const { currency, getToken, user } = useAppContext();
    
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = getToken();

            if (!token) {
                toast.error("Please login to view orders");
                setLoading(false);
                return;
            }

            const { data } = await axios.get('/api/order/my-orders', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (data?.success) {
                const ordersArray = Array.isArray(data.orders) ? data.orders : [];
                setOrders(ordersArray.reverse());
            } else {
                toast.error(data?.message || "Failed to fetch orders");
                setOrders([]);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error(error?.response?.data?.message || error?.message || "Failed to fetch orders");
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [user]);

    // Enhanced filter and sort orders
    const filteredOrders = orders.filter(order => {
        const matchesSearch = !searchTerm || 
            order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.items?.some(item => 
                (item.productId?.name || item.name || '').toLowerCase().includes(searchTerm.toLowerCase())
            ) ||
            order.courier?.trackingId?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === "all" || 
            order.status?.toLowerCase().replace(/\s+/g, '').includes(statusFilter.replace(/\s+/g, ''));
        
        return matchesSearch && matchesStatus;
    }).sort((a, b) => {
        switch (sortBy) {
            case "oldest":
                return new Date(a.date) - new Date(b.date);
            case "amount-high":
                return (b.amount || 0) - (a.amount || 0);
            case "amount-low":
                return (a.amount || 0) - (b.amount || 0);
            default: // newest
                return new Date(b.date) - new Date(a.date);
        }
    });

    const getStatusIcon = (status) => {
        const statusLower = status?.toLowerCase() || '';
        switch (true) {
            case statusLower.includes('delivered'):
                return <CheckCircle className="w-4 h-4" />;
            case statusLower.includes('shipped') || statusLower.includes('out for delivery'):
                return <Truck className="w-4 h-4" />;
            case statusLower.includes('packed'):
                return <PackageCheck className="w-4 h-4" />;
            case statusLower.includes('processing'):
                return <Clock className="w-4 h-4" />;
            case statusLower.includes('cancelled'):
                return <XCircle className="w-4 h-4" />;
            default:
                return <Package className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status) => {
        const statusLower = status?.toLowerCase() || '';
        switch (true) {
            case statusLower.includes('delivered'):
                return "bg-green-100 text-green-800 border-green-200";
            case statusLower.includes('shipped') || statusLower.includes('out for delivery'):
                return "bg-blue-100 text-blue-800 border-blue-200";
            case statusLower.includes('packed'):
                return "bg-purple-100 text-purple-800 border-purple-200";
            case statusLower.includes('processing'):
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case statusLower.includes('cancelled'):
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getOrderProgress = (status) => {
        const statusLower = status?.toLowerCase() || '';
        switch (true) {
            case statusLower.includes('delivered'):
                return 100;
            case statusLower.includes('out for delivery'):
                return 80;
            case statusLower.includes('shipped'):
                return 60;
            case statusLower.includes('packed'):
                return 40;
            case statusLower.includes('processing'):
                return 20;
            case statusLower.includes('cancelled'):
                return 0;
            default:
                return 10;
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    // Show login message if user is not authenticated
    if (!user && !loading) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col justify-center items-center px-6 md:px-16 lg:px-32 py-20 min-h-screen"
            >
                <Card className="max-w-md w-full text-center">
                    <CardHeader>
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag className="w-8 h-8 text-primary" />
                        </div>
                        <CardTitle>Please Login</CardTitle>
                        <CardDescription>
                            You need to login to view your orders
                        </CardDescription>
                    </CardHeader>
                </Card>
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex mt-16 flex-col px-6 md:px-16 lg:px-32 py-6 min-h-screen bg-background"
        >
            <div className="max-w-7xl mx-auto w-full space-y-6">
                
                {/* Header */}
                <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
                        <p className="text-muted-foreground">
                            Track and manage your orders
                        </p>
                    </div>
                    
                    <Button 
                        variant="outline" 
                        onClick={fetchOrders}
                        disabled={loading}
                        className="w-fit"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                
                                {/* Search */}
                                <div className="relative flex-1 max-w-sm">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search orders, products, or tracking ID..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>

                                {/* Status Filter */}
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="orderplaced">Order Placed</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="packed">Packed</SelectItem>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="outfordelivery">Out for Delivery</SelectItem>
                                        <SelectItem value="delivered">Delivered</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Sort */}
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-[160px]">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">Newest First</SelectItem>
                                        <SelectItem value="oldest">Oldest First</SelectItem>
                                        <SelectItem value="amount-high">Amount: High to Low</SelectItem>
                                        <SelectItem value="amount-low">Amount: Low to High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Orders List */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            {[...Array(3)].map((_, i) => (
                                <Card key={i}>
                                    <CardContent className="p-6">
                                        <div className="flex gap-4">
                                            <Skeleton className="w-16 h-16 rounded-lg" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton className="h-4 w-3/4" />
                                                <Skeleton className="h-4 w-1/2" />
                                                <Skeleton className="h-4 w-1/4" />
                                            </div>
                                            <Skeleton className="w-20 h-8" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </motion.div>
                    ) : filteredOrders.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="text-center py-16"
                        >
                            <Card className="max-w-md mx-auto">
                                <CardContent className="p-8 text-center">
                                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Package className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">
                                        {orders.length === 0 ? "No Orders Found" : "No Matching Orders"}
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {orders.length === 0 
                                            ? "You haven't placed any orders yet" 
                                            : "Try adjusting your search or filters"
                                        }
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="orders"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-4"
                        >
                            {filteredOrders.map((order, index) => (
                                <motion.div
                                    key={order._id || index}
                                    variants={itemVariants}
                                    whileHover={{ 
                                        scale: 1.01,
                                        transition: { type: "spring", stiffness: 400, damping: 25 }
                                    }}
                                    layout
                                >
                                    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col lg:flex-row gap-6">
                                                
                                                {/* Order Items & Progress */}
                                                <div className="flex gap-4 flex-1">
                                                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <Package className="w-8 h-8 text-muted-foreground" />
                                                    </div>
                                                    
                                                    <div className="flex-1 min-w-0 space-y-3">
                                                        <div>
                                                            <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                                                                {order.items?.map((item, idx) => {
                                                                    const productName = item.productId?.name || item.name || "Unknown Product";
                                                                    return `${productName} × ${item.quantity || 1}`;
                                                                }).join(", ") || "No items"}
                                                            </h3>
                                                            
                                                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                                <div className="flex items-center gap-1">
                                                                    <Package className="w-4 h-4" />
                                                                    <span>{order.items?.length || 0} items</span>
                                                                </div>
                                                                
                                                                <div className="flex items-center gap-1">
                                                                    <Calendar className="w-4 h-4" />
                                                                    <span>
                                                                        {order.date ? new Date(order.date).toLocaleDateString('en-US', { 
                                                                            year: 'numeric', 
                                                                            month: 'short', 
                                                                            day: 'numeric' 
                                                                        }) : 'N/A'}
                                                                    </span>
                                                                </div>
                                                                
                                                                <Badge 
                                                                    variant="outline" 
                                                                    className="text-xs cursor-pointer hover:bg-gray-100"
                                                                    onClick={() => copyToClipboard(order._id)}
                                                                >
                                                                    <Copy className="w-3 h-3 mr-1" />
                                                                    ID: {order._id?.slice(-8) || 'N/A'}
                                                                </Badge>
                                                            </div>
                                                        </div>

                                                        {/* Order Progress Bar */}
                                                        <div className="space-y-2">
                                                            <div className="flex items-center justify-between text-sm">
                                                                <span className="font-medium">Order Progress</span>
                                                                <span className="text-muted-foreground">{order.status || 'Order Placed'}</span>
                                                            </div>
                                                            <Progress value={getOrderProgress(order.status)} className="h-2" />
                                                        </div>

                                                        {/* Voucher Info */}
                                                        {order.appliedVoucher && (
                                                            <div className="bg-green-50 border border-green-200 rounded-md p-2">
                                                                <div className="flex items-center gap-2">
                                                                    <Gift className="w-4 h-4 text-green-600" />
                                                                    <span className="text-sm text-green-800 font-medium">
                                                                        {order.appliedVoucher.code} - Saved {currency}{order.appliedVoucher.appliedDiscount}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Tracking Info */}
                                                        {order.courier?.trackingId && (
                                                            <div className="bg-blue-50 border border-blue-200 rounded-md p-2">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        <Truck className="w-4 h-4 text-blue-600" />
                                                                        <div>
                                                                            <p className="text-sm text-blue-800 font-medium">{order.courier.name}</p>
                                                                            <p className="text-xs text-blue-600 font-mono">{order.courier.trackingId}</p>
                                                                        </div>
                                                                    </div>
                                                                    {order.courier.trackingUrl && (
                                                                        <Button 
                                                                            size="sm" 
                                                                            variant="outline"
                                                                            asChild
                                                                        >
                                                                            <a href={order.courier.trackingUrl} target="_blank" rel="noopener noreferrer">
                                                                                <ExternalLink className="w-3 h-3 mr-1" />
                                                                                Track
                                                                            </a>
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <Separator orientation="vertical" className="hidden lg:block" />

                                                {/* Shipping Address */}
                                                <div className="lg:w-64">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                                        <h4 className="font-medium text-sm">Shipping Address</h4>
                                                    </div>
                                                    
                                                    <div className="text-sm space-y-1">
                                                        <p className="font-medium">{order.address?.fullName || 'N/A'}</p>
                                                        <p className="text-muted-foreground">
                                                            {order.address?.area || 'N/A'}
                                                        </p>
                                                        <p className="text-muted-foreground">
                                                            {order.address?.city ? `${order.address.city}, ` : ''}
                                                            {order.address?.state || 'N/A'}
                                                        </p>
                                                        {order.address?.pincode && (
                                                            <p className="text-muted-foreground">{order.address.pincode}</p>
                                                        )}
                                                        <div className="flex items-center gap-1 text-muted-foreground">
                                                            <Phone className="w-3 h-3" />
                                                            <span>{order.address?.phoneNumber || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <Separator orientation="vertical" className="hidden lg:block" />

                                                {/* Order Status & Actions */}
                                                <div className="lg:w-56 space-y-4">
                                                    
                                                    {/* Amount Breakdown */}
                                                    <div className="text-center lg:text-right space-y-1">
                                                        <p className="text-2xl font-bold text-primary">
                                                            {currency}{order.amount?.toLocaleString() || '0'}
                                                        </p>
                                                        {order.subtotal && order.subtotal !== order.amount && (
                                                            <div className="text-xs space-y-1 text-muted-foreground">
                                                                <div className="flex justify-between">
                                                                    <span>Subtotal:</span>
                                                                    <span>{currency}{order.subtotal}</span>
                                                                </div>
                                                                {order.deliveryFee > 0 && (
                                                                    <div className="flex justify-between">
                                                                        <span>Delivery:</span>
                                                                        <span>{currency}{order.deliveryFee}</span>
                                                                    </div>
                                                                )}
                                                                {order.discount > 0 && (
                                                                    <div className="flex justify-between text-green-600">
                                                                        <span>Discount:</span>
                                                                        <span>-{currency}{order.discount}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                        <p className="text-xs text-muted-foreground">Total Amount</p>
                                                    </div>
                                                    
                                                    {/* Status Badges */}
                                                    <div className="space-y-2">
                                                        <Badge 
                                                            variant="outline" 
                                                            className={`w-full justify-center gap-2 ${getStatusColor(order.status)}`}
                                                        >
                                                            {getStatusIcon(order.status)}
                                                            <span className="capitalize">{order.status || 'Order Placed'}</span>
                                                        </Badge>
                                                        
                                                        <Badge 
                                                            variant="outline" 
                                                            className={`w-full justify-center gap-2 ${
                                                                order.payment 
                                                                    ? 'bg-green-100 text-green-800 border-green-200' 
                                                                    : 'bg-red-100 text-red-800 border-red-200'
                                                            }`}
                                                        >
                                                            <CreditCard className="w-4 h-4" />
                                                            <span className="capitalize">{order.payment ? 'Paid' : 'Pending'}</span>
                                                        </Badge>
                                                        
                                                        <div className="text-xs text-center text-muted-foreground">
                                                            {order.paymentMethod || 'COD'}
                                                        </div>
                                                    </div>

                                                    {/* View Details Button */}
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button 
                                                                variant="outline" 
                                                                className="w-full"
                                                                onClick={() => setSelectedOrder(order)}
                                                            >
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                View Details
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                                            <OrderDetailsDialog order={selectedOrder} currency={currency} />
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results Summary */}
                {!loading && filteredOrders.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-center text-sm text-muted-foreground"
                    >
                        Showing {filteredOrders.length} of {orders.length} orders
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

// Enhanced Order Details Dialog Component
const OrderDetailsDialog = ({ order, currency }) => {
    if (!order) return null;

    return (
        <>
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Order Details #{order._id?.slice(-8).toUpperCase()}
                </DialogTitle>
                <DialogDescription>
                    Complete information about your order
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
                {/* Order Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-4 text-center">
                            <Receipt className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                            <p className="text-2xl font-bold">{currency}{order.amount}</p>
                            <p className="text-sm text-muted-foreground">Total Amount</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <Calendar className="w-8 h-8 mx-auto mb-2 text-green-600" />
                            <p className="font-semibold">{new Date(order.date).toLocaleDateString()}</p>
                            <p className="text-sm text-muted-foreground">Order Date</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <Package className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                            <p className="font-semibold">{order.items?.length || 0} Items</p>
                            <p className="text-sm text-muted-foreground">Products</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Order Items */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Order Items</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {order.items?.map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <h4 className="font-medium">{item.name || item.productId?.name || 'Unknown Product'}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Quantity: {item.quantity} × {currency}{item.price}
                                    </p>
                                </div>
                                <p className="font-semibold">{currency}{(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Price Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Price Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>{currency}{order.subtotal || order.amount}</span>
                        </div>
                        {order.deliveryFee && (
                            <div className="flex justify-between">
                                <span>Delivery Fee:</span>
                                <span>{currency}{order.deliveryFee}</span>
                            </div>
                        )}
                        {order.discount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Discount:</span>
                                <span>-{currency}{order.discount}</span>
                            </div>
                        )}
                        <Separator />
                        <div className="flex justify-between font-semibold text-lg">
                            <span>Total:</span>
                            <span>{currency}{order.amount}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Applied Voucher */}
                {order.appliedVoucher && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Gift className="w-5 h-5" />
                                Applied Voucher
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h4 className="font-medium text-green-800">{order.appliedVoucher.title}</h4>
                                <p className="text-green-700">Code: {order.appliedVoucher.code}</p>
                                <p className="text-green-600">You saved: {currency}{order.appliedVoucher.appliedDiscount}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Shipping Information */}
                {order.courier?.trackingId && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Truck className="w-5 h-5" />
                                Shipping Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium">Courier Partner</Label>
                                    <p>{order.courier.name}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Tracking ID</Label>
                                    <p className="font-mono text-sm">{order.courier.trackingId}</p>
                                </div>
                            </div>
                            {order.courier.trackingUrl && (
                                <Button asChild>
                                    <a href={order.courier.trackingUrl} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Track Your Package
                                    </a>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Delivery Address */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            Delivery Address
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p className="font-medium">{order.address?.fullName}</p>
                            <p className="text-muted-foreground">{order.address?.area}</p>
                            <p className="text-muted-foreground">
                                {order.address?.city}, {order.address?.state} - {order.address?.pincode}
                            </p>
                            <p className="text-muted-foreground flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {order.address?.phoneNumber}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default MyOrders;
