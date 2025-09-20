'use client';
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

// shadcn/ui components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Icons
import { 
  BarChart3, 
  TrendingUp,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  Download,
  RefreshCw,
  ArrowUpRight,
  Eye,
  Star,
  Truck,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  Gift
} from "lucide-react";

const Analytics = () => {
    const { currency, getToken, user } = useAppContext();
    
    const [analytics, setAnalytics] = useState({
        overview: {
            totalRevenue: 0,
            totalOrders: 0,
            averageOrderValue: 0,
            conversionRate: 0,
            totalCustomers: 0
        },
        monthlyData: [],
        topProducts: [],
        ordersByStatus: [],
        paymentMethods: [],
        couponUsage: []
    });
    
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30');

    // Fetch analytics data
    const fetchAnalytics = async () => {
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

            const orders = ordersResponse.data?.orders || [];
            const products = productsResponse.data?.products || [];

            // Process analytics data
            const processedAnalytics = processAnalyticsData(orders, products, parseInt(timeRange));
            setAnalytics(processedAnalytics);

        } catch (error) {
            console.error('Analytics fetch error:', error);
            toast.error("Failed to load analytics data");
        } finally {
            setLoading(false);
        }
    };

    // Process raw data into analytics
    const processAnalyticsData = (orders, products, days) => {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        // Filter orders by time range
        const filteredOrders = orders.filter(order => new Date(order.date) >= cutoffDate);
        
        // Overview calculations
        const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
        const totalOrders = filteredOrders.length;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const uniqueCustomers = new Set(filteredOrders.map(order => order.userId)).size;

        // Monthly data for charts
        const monthlyData = generateMonthlyData(filteredOrders, days);
        
        // Top products by order frequency
        const productCounts = {};
        filteredOrders.forEach(order => {
            order.items?.forEach(item => {
                const productId = item.productId;
                const productName = item.name || 'Unknown Product';
                if (!productCounts[productId]) {
                    productCounts[productId] = { name: productName, count: 0, revenue: 0 };
                }
                productCounts[productId].count += item.quantity || 1;
                productCounts[productId].revenue += (item.price * item.quantity) || 0;
            });
        });
        
        const topProducts = Object.entries(productCounts)
            .map(([id, data]) => ({ id, ...data }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Orders by status
        const statusCounts = {};
        filteredOrders.forEach(order => {
            const status = order.status || 'Unknown';
            statusCounts[status] = (statusCounts[status] || 0) + 1;
        });
        
        const ordersByStatus = Object.entries(statusCounts).map(([status, count]) => ({
            status,
            count,
            percentage: totalOrders > 0 ? ((count / totalOrders) * 100).toFixed(1) : 0
        }));

        // Payment methods
        const paymentCounts = {};
        filteredOrders.forEach(order => {
            const method = order.paymentMethod || 'COD';
            paymentCounts[method] = (paymentCounts[method] || 0) + 1;
        });
        
        const paymentMethods = Object.entries(paymentCounts).map(([method, count]) => ({
            method,
            count,
            percentage: totalOrders > 0 ? ((count / totalOrders) * 100).toFixed(1) : 0
        }));

        // Coupon usage
        const couponUsage = filteredOrders
            .filter(order => order.appliedVoucher)
            .reduce((acc, order) => {
                const code = order.appliedVoucher.code;
                if (!acc[code]) {
                    acc[code] = { 
                        code, 
                        count: 0, 
                        totalSavings: 0,
                        title: order.appliedVoucher.title 
                    };
                }
                acc[code].count++;
                acc[code].totalSavings += order.appliedVoucher.appliedDiscount || 0;
                return acc;
            }, {});

        return {
            overview: {
                totalRevenue,
                totalOrders,
                averageOrderValue,
                conversionRate: 12.5,
                totalCustomers: uniqueCustomers
            },
            monthlyData,
            topProducts,
            ordersByStatus,
            paymentMethods,
            couponUsage: Object.values(couponUsage).slice(0, 5)
        };
    };

    // Generate monthly data for charts
    const generateMonthlyData = (orders, days) => {
        const data = [];
        const now = new Date();
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            
            const dayOrders = orders.filter(order => {
                const orderDate = new Date(order.date);
                return orderDate.toDateString() === date.toDateString();
            });
            
            const revenue = dayOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
            
            data.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                orders: dayOrders.length,
                revenue
            });
        }
        
        return data;
    };

    useEffect(() => {
        if (user) {
            fetchAnalytics();
        }
    }, [user, timeRange]);

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4 bg-background">
                <Alert className="max-w-sm w-full">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Access Required</AlertTitle>
                    <AlertDescription>
                        Please login to view analytics
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
                            <h1 className="text-2xl md:text-3xl font-bold">Analytics</h1>
                            <p className="text-muted-foreground mt-1">Track your business performance and insights</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Select value={timeRange} onValueChange={setTimeRange}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="7">Last 7 days</SelectItem>
                                    <SelectItem value="30">Last 30 days</SelectItem>
                                    <SelectItem value="90">Last 90 days</SelectItem>
                                    <SelectItem value="365">Last year</SelectItem>
                                </SelectContent>
                            </Select>
                            
                            <Button variant="outline" size="sm" onClick={fetchAnalytics} disabled={loading}>
                                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                            
                            <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </Button>
                        </div>
                    </motion.div>

                    {/* Overview Stats Cards */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
                    >
                        {[
                            {
                                title: "Total Revenue",
                                value: `${currency}${analytics.overview.totalRevenue.toLocaleString()}`,
                                icon: DollarSign,
                               
                            },
                            {
                                title: "Total Orders",
                                value: analytics.overview.totalOrders.toString(),
                                icon: ShoppingCart,
                                
                            },
                            {
                                title: "Avg Order Value",
                                value: `${currency}${Math.round(analytics.overview.averageOrderValue)}`,
                                icon: TrendingUp,
                               
                            },
                            {
                                title: "Customers",
                                value: analytics.overview.totalCustomers.toString(),
                                icon: Users,
                                
                            },
                            {
                                title: "Conversion Rate",
                                value: `${analytics.overview.conversionRate}%`,
                                icon: Eye,
                                
                            }
                        ].map((stat, index) => (
                            <Card key={stat.title} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                                        
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-1">{stat.title}</div>
                                        <div className="text-lg font-bold">
                                            {loading ? <Skeleton className="h-5 w-16" /> : stat.value}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </motion.div>

                    {/* Tabs for different analytics views */}
                    <Tabs defaultValue="overview" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="products">Products</TabsTrigger>
                            <TabsTrigger value="orders">Orders</TabsTrigger>
                            <TabsTrigger value="marketing">Marketing</TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                
                                {/* Revenue Chart */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <BarChart3 className="w-5 h-5" />
                                            Daily Revenue
                                        </CardTitle>
                                        <CardDescription>Revenue trend over the selected period</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {loading ? (
                                            <Skeleton className="h-64 w-full" />
                                        ) : (
                                            <div className="h-64 flex items-end justify-between space-x-2">
                                                {analytics.monthlyData.slice(-7).map((day, index) => {
                                                    const maxRevenue = Math.max(...analytics.monthlyData.map(d => d.revenue));
                                                    const height = maxRevenue > 0 ? Math.max((day.revenue / maxRevenue) * 200, 4) : 4;
                                                    
                                                    return (
                                                        <div key={index} className="flex-1 flex flex-col items-center">
                                                            <div 
                                                                className="w-full bg-primary rounded-t mb-2"
                                                                style={{ height: `${height}px` }}
                                                            />
                                                            <span className="text-xs text-muted-foreground text-center">
                                                                {day.date}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Order Status Distribution */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Order Status Distribution</CardTitle>
                                        <CardDescription>Current status of all orders</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {loading ? (
                                                [...Array(4)].map((_, i) => (
                                                    <div key={i} className="space-y-2">
                                                        <div className="flex justify-between">
                                                            <Skeleton className="h-4 w-24" />
                                                            <Skeleton className="h-4 w-16" />
                                                        </div>
                                                        <Skeleton className="h-2 w-full" />
                                                    </div>
                                                ))
                                            ) : (
                                                analytics.ordersByStatus.map((status, index) => (
                                                    <div key={status.status} className="space-y-2">
                                                        <div className="flex justify-between items-center">
                                                            <span className="font-medium text-sm">{status.status}</span>
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-sm text-muted-foreground">{status.percentage}%</span>
                                                                <Badge variant="secondary">{status.count}</Badge>
                                                            </div>
                                                        </div>
                                                        <Progress value={parseFloat(status.percentage)} className="h-2" />
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Products Tab */}
                        <TabsContent value="products" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Top Selling Products</CardTitle>
                                    <CardDescription>Best performing products by order count</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Product</TableHead>
                                                <TableHead>Orders</TableHead>
                                                <TableHead className="text-right">Revenue</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loading ? (
                                                [...Array(5)].map((_, i) => (
                                                    <TableRow key={i}>
                                                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                                    </TableRow>
                                                ))
                                            ) : analytics.topProducts.length > 0 ? (
                                                analytics.topProducts.map((product, index) => (
                                                    <TableRow key={product.id}>
                                                        <TableCell className="font-medium">{product.name}</TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline">{product.count}</Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right font-semibold">
                                                            {currency}{product.revenue.toLocaleString()}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                                                        <Package className="w-8 h-8 mx-auto mb-2" />
                                                        No product data available
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Orders Tab */}
                        <TabsContent value="orders" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Payment Methods */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <CreditCard className="w-5 h-5" />
                                            Payment Methods
                                        </CardTitle>
                                        <CardDescription>Distribution of payment methods used</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {loading ? (
                                                [...Array(3)].map((_, i) => (
                                                    <div key={i} className="space-y-2">
                                                        <div className="flex justify-between">
                                                            <Skeleton className="h-4 w-20" />
                                                            <Skeleton className="h-4 w-16" />
                                                        </div>
                                                        <Skeleton className="h-2 w-full" />
                                                    </div>
                                                ))
                                            ) : (
                                                analytics.paymentMethods.map((method, index) => (
                                                    <div key={method.method} className="space-y-2">
                                                        <div className="flex justify-between items-center">
                                                            <span className="font-medium text-sm">{method.method}</span>
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-sm text-muted-foreground">{method.percentage}%</span>
                                                                <Badge variant="outline">{method.count}</Badge>
                                                            </div>
                                                        </div>
                                                        <Progress value={parseFloat(method.percentage)} className="h-2" />
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Recent Activity */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Recent Activity</CardTitle>
                                        <CardDescription>Latest order activities</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {[
                                                { action: "New order placed", time: "2 minutes ago", icon: ShoppingCart },
                                                { action: "Order shipped", time: "1 hour ago", icon: Truck },
                                                { action: "Order delivered", time: "3 hours ago", icon: CheckCircle },
                                                { action: "Payment received", time: "5 hours ago", icon: DollarSign }
                                            ].map((activity, index) => (
                                                <div key={index} className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                                        <activity.icon className="w-4 h-4 text-muted-foreground" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-sm font-medium">{activity.action}</div>
                                                        <div className="text-xs text-muted-foreground">{activity.time}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Marketing Tab */}
                        <TabsContent value="marketing" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Gift className="w-5 h-5" />
                                        Coupon Usage
                                    </CardTitle>
                                    <CardDescription>Most used discount coupons</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {loading ? (
                                        <div className="space-y-4">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                                                    <div>
                                                        <Skeleton className="h-4 w-24 mb-2" />
                                                        <Skeleton className="h-3 w-32" />
                                                    </div>
                                                    <div className="text-right">
                                                        <Skeleton className="h-4 w-16 mb-2" />
                                                        <Skeleton className="h-3 w-20" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : analytics.couponUsage.length > 0 ? (
                                        <div className="space-y-4">
                                            {analytics.couponUsage.map((coupon, index) => (
                                                <div key={coupon.code} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50">
                                                    <div>
                                                        <div className="font-medium">{coupon.code}</div>
                                                        <div className="text-sm text-muted-foreground">{coupon.title}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-semibold">{coupon.count} uses</div>
                                                        <div className="text-sm text-green-600">{currency}{coupon.totalSavings.toLocaleString()} saved</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Star className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                            <div className="text-muted-foreground">No coupon usage data available</div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
