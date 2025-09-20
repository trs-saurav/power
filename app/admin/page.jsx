'use client';
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Link from "next/link";

// shadcn/ui components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Icons
import { 
  Package, 
  ShoppingCart, 
  DollarSign,
  Eye,
  Plus,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Truck
} from "lucide-react";

const Dashboard = () => {
    const { currency, getToken, user } = useAppContext();
    
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalProducts: 0,
        totalRevenue: 0,
        totalUsers: 0,
        pendingOrders: 0,
        recentOrders: [],
        topProducts: [],
        monthlyRevenue: 0
    });
    const [loading, setLoading] = useState(true);

    // Fetch dashboard data
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const token = await getToken();

            const [ordersResponse, productsResponse] = await Promise.all([
                axios.get('/api/order/seller-orders', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('/api/product/list', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            // Process orders data
            const orders = ordersResponse.data?.orders || [];
            const products = productsResponse.data?.products || [];

            const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
            const pendingOrders = orders.filter(order => 
                order.status === 'Order Placed' || order.status === 'Processing'
            ).length;

            // Get current month revenue
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            const monthlyRevenue = orders
                .filter(order => {
                    const orderDate = new Date(order.date);
                    return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
                })
                .reduce((sum, order) => sum + (order.amount || 0), 0);

            // Get recent orders (last 5)
            const recentOrders = orders.slice(0, 5);

            setStats({
                totalOrders: orders.length,
                totalProducts: products.length,
                totalRevenue,
                totalUsers: orders.length, // Simplified - you can implement proper user counting
                pendingOrders,
                recentOrders,
                monthlyRevenue
            });

        } catch (error) {
            console.error('Dashboard fetch error:', error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    // Animation variants
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.3 }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    // Quick stats data
    const quickStats = [
        {
            title: "Total Revenue",
            value: `${currency}${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            iconBg: "bg-green-100 dark:bg-green-900/20",
            iconColor: "text-green-600 dark:text-green-400"
        },
        {
            title: "Total Orders",
            value: stats.totalOrders.toString(),
            icon: Package,
            iconBg: "bg-blue-100 dark:bg-blue-900/20",
            iconColor: "text-blue-600 dark:text-blue-400"
        },
        {
            title: "Products",
            value: stats.totalProducts.toString(),
            icon: ShoppingCart,
            iconBg: "bg-purple-100 dark:bg-purple-900/20",
            iconColor: "text-purple-600 dark:text-purple-400"
        },
        {
            title: "Pending Orders",
            value: stats.pendingOrders.toString(),
            icon: Clock,
            iconBg: "bg-orange-100 dark:bg-orange-900/20",
            iconColor: "text-orange-600 dark:text-orange-400"
        }
    ];

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background p-4">
                <Alert className="max-w-sm w-full">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-center">
                        <div className="space-y-2">
                            <h3 className="font-semibold">Access Denied</h3>
                            <p className="text-muted-foreground">Please login to access the dashboard</p>
                        </div>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="p-4 md:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    
                    {/* Header */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                    >
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
                            <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your store.</p>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={fetchDashboardData}
                                disabled={loading}
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                            <Button size="sm" asChild>
                                <Link href="/admin/add-product">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Product
                                </Link>
                            </Button>
                        </div>
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                    >
                        {quickStats.map((stat, index) => (
                            <motion.div key={stat.title} variants={cardVariants}>
                                <Card className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                                <div className="text-2xl font-bold">
                                                    {loading ? <Skeleton className="h-8 w-20" /> : stat.value}
                                                </div>
                                            </div>
                                            <div className={`p-3 rounded-lg ${stat.iconBg}`}>
                                                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Recent Orders */}
                        <motion.div 
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-2"
                        >
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Recent Orders</CardTitle>
                                            <CardDescription>Latest orders from your customers</CardDescription>
                                        </div>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href="/admin/orders">
                                                <Eye className="w-4 h-4 mr-2" />
                                                View All
                                            </Link>
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {loading ? (
                                        [...Array(3)].map((_, i) => (
                                            <div key={i} className="flex items-center space-x-4 p-4 rounded-lg border">
                                                <Skeleton className="w-10 h-10 rounded-full" />
                                                <div className="flex-1 space-y-2">
                                                    <Skeleton className="h-4 w-3/4" />
                                                    <Skeleton className="h-3 w-1/2" />
                                                </div>
                                                <Skeleton className="h-4 w-16" />
                                            </div>
                                        ))
                                    ) : stats.recentOrders.length > 0 ? (
                                        stats.recentOrders.map((order, index) => (
                                            <div key={order._id || index} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                        <Package className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">
                                                            #{order._id?.slice(-8).toUpperCase() || 'N/A'}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {order.address?.fullName || 'N/A'} • {order.items?.length || 0} items
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-sm">{currency}{order.amount || 0}</p>
                                                    <Badge variant="outline" className="text-xs">
                                                        {order.status || 'Pending'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12">
                                            <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                            <p className="text-muted-foreground">No orders yet</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Quick Actions Sidebar */}
                        <motion.div 
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.3 }}
                            className="space-y-6"
                        >
                            {/* Monthly Revenue */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">This Month</CardTitle>
                                    <CardDescription>Revenue for {new Date().toLocaleDateString('en-US', { month: 'long' })}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center space-y-2">
                                        <div className="text-3xl font-bold text-primary">
                                            {loading ? <Skeleton className="h-8 w-24 mx-auto" /> : `${currency}${stats.monthlyRevenue.toLocaleString()}`}
                                        </div>
                                        <p className="text-sm text-muted-foreground">Monthly earnings</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                    <CardDescription>Common tasks</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Button variant="outline" className="w-full justify-start" asChild>
                                        <Link href="/admin/add-product">
                                            <Plus className="w-4 h-4 mr-3" />
                                            Add New Product
                                        </Link>
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start" asChild>
                                        <Link href="/admin/orders">
                                            <Package className="w-4 h-4 mr-3" />
                                            Manage Orders
                                        </Link>
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start" asChild>
                                        <Link href="/admin/products">
                                            <Eye className="w-4 h-4 mr-3" />
                                            View Products
                                        </Link>
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start" asChild>
                                        <Link href="/admin/analytics">
                                            <BarChart3 className="w-4 h-4 mr-3" />
                                            Analytics
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Order Status Summary */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Status</CardTitle>
                                    <CardDescription>Current order distribution</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                                            <span className="text-sm font-medium">Pending</span>
                                        </div>
                                        <Badge variant="secondary">{stats.pendingOrders}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                                            <span className="text-sm font-medium">Shipped</span>
                                        </div>
                                        <Badge variant="secondary">
                                            {stats.recentOrders.filter(o => o.status?.includes('Shipped')).length}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            <span className="text-sm font-medium">Delivered</span>
                                        </div>
                                        <Badge variant="secondary">
                                            {stats.recentOrders.filter(o => o.status?.includes('Delivered')).length}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
