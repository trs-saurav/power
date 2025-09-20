'use client';
import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import axios from "axios";

// shadcn/ui components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

// Icons
import { 
    Package, 
    Truck, 
    MapPin, 
    Phone, 
    Calendar, 
    CreditCard,
    Edit3,
    Trash2,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    ExternalLink,
    Search,
    Filter,
    X,
    SortAsc,
    SortDesc,
    Download,
    BoxIcon
} from "lucide-react";

const Orders = () => {
    const { currency, getToken, user } = useAppContext();
    
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    
    // Search and Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPayment, setFilterPayment] = useState('all');
    const [filterCourier, setFilterCourier] = useState('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');

    // Order status options
    const statusOptions = [
        "Order Placed",
        "Processing", 
        "Packed",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled"
    ];

    // Courier options
    const courierOptions = [
        "Blue Dart",
        "DTDC", 
        "FedEx",
        "Delhivery",
        "Ekart",
        "Amazon Logistics",
        "India Post",
        "Professional Couriers",
        "Gati",
        "Other"
    ];

    const fetchSellerOrders = async () => {
        try {
            setLoading(true);
            
            const token = await getToken();
            const { data } = await axios.get('/api/order/seller-orders', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (data.success) {
                setOrders(data.orders);
            } else {
                toast.error(data.message || "Failed to fetch orders");
            }
            
        } catch (error) {
            console.error('Fetch seller orders error:', error);
            
            if (error.response) {
                toast.error(error.response.data?.message || `Error: ${error.response.status}`);
            } else if (error.request) {
                toast.error("Network error. Please check your connection.");
            } else {
                toast.error(error.message || "An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    const updateOrder = async (orderId, updateData) => {
        try {
            setUpdateLoading(true);
            
            const token = await getToken();
            const response = await axios.put('/api/order/update', {
                orderId,
                ...updateData
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                toast.success("Order updated successfully");
                fetchSellerOrders(); // Refresh orders
                setSelectedOrder(null); // Close dialog
            } else {
                toast.error(response.data.message || "Failed to update order");
            }

        } catch (error) {
            console.error('Update order error:', error);
            toast.error(error.response?.data?.message || "Failed to update order");
        } finally {
            setUpdateLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            "Order Placed": "bg-blue-100 text-blue-800",
            "Processing": "bg-yellow-100 text-yellow-800", 
            "Packed": "bg-purple-100 text-purple-800",
            "Shipped": "bg-indigo-100 text-indigo-800",
            "Out for Delivery": "bg-orange-100 text-orange-800",
            "Delivered": "bg-green-100 text-green-800",
            "Cancelled": "bg-red-100 text-red-800"
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    const getStatusIcon = (status) => {
        const icons = {
            "Order Placed": <Clock className="w-4 h-4" />,
            "Processing": <Package className="w-4 h-4" />,
            "Packed": <Package className="w-4 h-4" />,
            "Shipped": <Truck className="w-4 h-4" />,
            "Out for Delivery": <Truck className="w-4 h-4" />,
            "Delivered": <CheckCircle className="w-4 h-4" />,
            "Cancelled": <XCircle className="w-4 h-4" />
        };
        return icons[status] || <AlertCircle className="w-4 h-4" />;
    };

    // Advanced filtering and searching logic
    // Advanced filtering and searching logic - FIXED VERSION
const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders.filter(order => {
        // Search filter - with proper type checking
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = !searchTerm || 
            order._id?.toString().toLowerCase().includes(searchLower) ||
            order.address?.fullName?.toLowerCase().includes(searchLower) ||
            order.address?.phoneNumber?.toString().includes(searchTerm) ||
            order.courier?.trackingId?.toString().toLowerCase().includes(searchLower) ||
            order.items?.some(item => 
                (item.name && item.name.toString().toLowerCase().includes(searchLower)) ||
                (item.productId && item.productId.toString().toLowerCase().includes(searchLower))
            );

        // Status filter
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;

        // Payment filter
        const matchesPayment = filterPayment === 'all' || 
            (filterPayment === 'paid' && order.payment) ||
            (filterPayment === 'pending' && !order.payment);

        // Courier filter
        const matchesCourier = filterCourier === 'all' || 
            order.courier?.name === filterCourier ||
            (filterCourier === 'no_courier' && !order.courier?.name);

        // Date range filter - with proper date handling
        let matchesDateFrom = true;
        let matchesDateTo = true;
        
        if (dateFrom || dateTo) {
            const orderDate = new Date(order.date);
            
            if (dateFrom) {
                const fromDate = new Date(dateFrom);
                matchesDateFrom = orderDate >= fromDate;
            }
            
            if (dateTo) {
                const toDate = new Date(dateTo + 'T23:59:59');
                matchesDateTo = orderDate <= toDate;
            }
        }

        return matchesSearch && matchesStatus && matchesPayment && matchesCourier && matchesDateFrom && matchesDateTo;
    });

    // Sorting - with proper type checking
    filtered.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortBy) {
            case 'date':
                aValue = new Date(a.date || 0);
                bValue = new Date(b.date || 0);
                break;
            case 'amount':
                aValue = Number(a.amount) || 0;
                bValue = Number(b.amount) || 0;
                break;
            case 'status':
                aValue = (a.status || '').toString();
                bValue = (b.status || '').toString();
                break;
            case 'customer':
                aValue = (a.address?.fullName || '').toString();
                bValue = (b.address?.fullName || '').toString();
                break;
            default:
                return 0;
        }

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    return filtered;
}, [orders, searchTerm, filterStatus, filterPayment, filterCourier, dateFrom, dateTo, sortBy, sortOrder]);


    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setFilterStatus('all');
        setFilterPayment('all');
        setFilterCourier('all');
        setDateFrom('');
        setDateTo('');
        setSortBy('date');
        setSortOrder('desc');
    };

    // Get unique couriers from orders for filter options
    const availableCouriers = useMemo(() => {
        const couriers = orders
            .filter(order => order.courier?.name)
            .map(order => order.courier.name);
        return [...new Set(couriers)];
    }, [orders]);

    useEffect(() => {
        if (user) {
            fetchSellerOrders();
        }
    }, [user]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between">
            <div className="md:p-10 p-4 space-y-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold">Order Management</h2>
                        <p className="text-muted-foreground">Manage and track all orders</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge variant="secondary">
                            {filteredAndSortedOrders.length} of {orders.length} Orders
                        </Badge>
                        <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Filter className="w-5 h-5" />
                                Search & Filters
                            </CardTitle>
                            {(searchTerm || filterStatus !== 'all' || filterPayment !== 'all' || 
                              filterCourier !== 'all' || dateFrom || dateTo || sortBy !== 'date' || sortOrder !== 'desc') && (
                                <Button variant="ghost" size="sm" onClick={clearFilters}>
                                    <X className="w-4 h-4 mr-2" />
                                    Clear All
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Search by Order ID, Customer Name, Phone, or Tracking ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Filters Row 1 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm">Status</Label>
                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        {statusOptions.map(status => (
                                            <SelectItem key={status} value={status}>{status}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm">Payment</Label>
                                <Select value={filterPayment} onValueChange={setFilterPayment}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Payments</SelectItem>
                                        <SelectItem value="paid">Paid</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm">Courier</Label>
                                <Select value={filterCourier} onValueChange={setFilterCourier}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Couriers</SelectItem>
                                        <SelectItem value="no_courier">No Courier</SelectItem>
                                        {availableCouriers.map(courier => (
                                            <SelectItem key={courier} value={courier}>{courier}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm">Sort By</Label>
                                <div className="flex gap-2">
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger className="flex-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="date">Date</SelectItem>
                                            <SelectItem value="amount">Amount</SelectItem>
                                            <SelectItem value="status">Status</SelectItem>
                                            <SelectItem value="customer">Customer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    >
                                        {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Date Range Filter */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm">From Date</Label>
                                <Input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm">To Date</Label>
                                <Input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Active Filters Display */}
                        {(searchTerm || filterStatus !== 'all' || filterPayment !== 'all' || 
                          filterCourier !== 'all' || dateFrom || dateTo) && (
                            <div className="flex flex-wrap gap-2 pt-2 border-t">
                                {searchTerm && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        Search: "{searchTerm}"
                                        <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchTerm('')} />
                                    </Badge>
                                )}
                                {filterStatus !== 'all' && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        Status: {filterStatus}
                                        <X className="w-3 h-3 cursor-pointer" onClick={() => setFilterStatus('all')} />
                                    </Badge>
                                )}
                                {filterPayment !== 'all' && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        Payment: {filterPayment}
                                        <X className="w-3 h-3 cursor-pointer" onClick={() => setFilterPayment('all')} />
                                    </Badge>
                                )}
                                {filterCourier !== 'all' && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        Courier: {filterCourier === 'no_courier' ? 'No Courier' : filterCourier}
                                        <X className="w-3 h-3 cursor-pointer" onClick={() => setFilterCourier('all')} />
                                    </Badge>
                                )}
                                {dateFrom && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        From: {dateFrom}
                                        <X className="w-3 h-3 cursor-pointer" onClick={() => setDateFrom('')} />
                                    </Badge>
                                )}
                                {dateTo && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        To: {dateTo}
                                        <X className="w-3 h-3 cursor-pointer" onClick={() => setDateTo('')} />
                                    </Badge>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Orders List */}
                <div className="space-y-4">
                    {filteredAndSortedOrders.map((order, index) => (
                        <Card key={order._id || index} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Order Items */}
                                    <div className="flex-1 flex gap-4">
                                        <div className="flex-shrink-0">
                                           
                                                
                                                <BoxIcon className="w-16 h-16 object-cover rounded-lg border"/>
                                             
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold mb-2">
                                                Order #{order._id?.slice(-8).toUpperCase() || index}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {order.items?.map((item, idx) => 
                                                    `${item.name || item.productId} x${item.quantity}`
                                                ).join(", ") || "No items"}
                                            </p>
                                            <div className="flex items-center gap-4 text-sm">
                                                <span>Items: {order.items?.length || 0}</span>
                                                <Badge className={getStatusColor(order.status)}>
                                                    {getStatusIcon(order.status)}
                                                    <span className="ml-1">{order.status}</span>
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="lg:w-64">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
                                            <div className="text-sm">
                                                <p className="font-medium">{order.address?.fullName}</p>
                                                <p className="text-muted-foreground">
                                                    {order.address?.area}<br />
                                                    {order.address?.city}, {order.address?.state}
                                                </p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Phone className="w-3 h-3" />
                                                    <span>{order.address?.phoneNumber}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Details - Enhanced with better courier display */}
                                    <div className="lg:w-64">
                                        <div className="space-y-3 text-sm">
                                            {/* Amount */}
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-semibold">{currency}{order.amount}</span>
                                            </div>

                                            {/* Payment Status */}
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-xs">{order.paymentMethod}</span>
                                                <Badge variant={order.payment ? "default" : "destructive"} className="text-xs">
                                                    {order.payment ? "Paid" : "Pending"}
                                                </Badge>
                                            </div>

                                            {/* Date */}
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-xs">{new Date(order.date).toLocaleDateString()}</span>
                                            </div>

                                            {/* Courier Information - Enhanced Display */}
                                            {(order.courier?.name || order.courier?.trackingId) && (
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Truck className="w-4 h-4 text-blue-600" />
                                                        <span className="font-medium text-blue-800 text-xs">
                                                            Shipping Info
                                                        </span>
                                                    </div>
                                                    
                                                    {order.courier?.name && (
                                                        <div className="text-xs text-blue-700 mb-1">
                                                            <strong>Courier:</strong> {order.courier.name}
                                                        </div>
                                                    )}
                                                    
                                                    {order.courier?.trackingId && (
                                                        <div className="text-xs">
                                                            <strong className="text-blue-700">Tracking ID:</strong>
                                                            <div className="font-mono text-xs bg-blue-100 px-2 py-1 rounded mt-1 break-all">
                                                                {order.courier.trackingId}
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    {order.courier?.trackingUrl && (
                                                        <div className="mt-1">
                                                            <a 
                                                                href={order.courier.trackingUrl} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                                                            >
                                                                Track Package
                                                                <ExternalLink className="w-3 h-3" />
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* No shipping info placeholder */}
                                            {!order.courier?.name && !order.courier?.trackingId && (
                                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                                    <div className="flex items-center gap-2">
                                                        <Truck className="w-4 h-4 text-gray-400" />
                                                        <span className="text-xs text-gray-500">
                                                            No shipping info
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="lg:w-32 flex lg:flex-col gap-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                    Update
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                                <OrderUpdateDialog 
                                                    order={selectedOrder}
                                                    onUpdate={updateOrder}
                                                    loading={updateLoading}
                                                    statusOptions={statusOptions}
                                                    courierOptions={courierOptions}
                                                />
                                            </DialogContent>
                                        </Dialog>

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    View
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-3xl">
                                                <OrderViewDialog order={selectedOrder} />
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredAndSortedOrders.length === 0 && (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
                            <p className="text-muted-foreground">
                                {orders.length === 0 
                                    ? "No orders have been placed yet."
                                    : "No orders match your current filters. Try adjusting your search criteria."
                                }
                            </p>
                            {orders.length > 0 && (
                                <Button variant="outline" onClick={clearFilters} className="mt-4">
                                    Clear All Filters
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

// Rest of your components (OrderUpdateDialog and OrderViewDialog) remain the same...
const OrderUpdateDialog = ({ order, onUpdate, loading, statusOptions, courierOptions }) => {
    const [status, setStatus] = useState(order?.status || statusOptions[0]);
    const [payment, setPayment] = useState(order?.payment || false);
    const [courier, setCourier] = useState(order?.courier?.name || "none");
    const [trackingId, setTrackingId] = useState(order?.courier?.trackingId || "");
    const [trackingUrl, setTrackingUrl] = useState(order?.courier?.trackingUrl || "");
    const [adminNotes, setAdminNotes] = useState(order?.adminNotes || "");
    const [cancellationReason, setCancellationReason] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const updateData = {
            status,
            payment,
            courier: courier === "none" ? null : courier,
            trackingId: trackingId || null,
            trackingUrl: trackingUrl || null,
            adminNotes,
            ...(status === 'Cancelled' && cancellationReason && { cancellationReason })
        };

        onUpdate(order._id, updateData);
    };

    if (!order) return null;

    return (
        <>
            <DialogHeader>
                <DialogTitle>Update Order #{order._id?.slice(-8).toUpperCase()}</DialogTitle>
                <DialogDescription>
                    Update order status, payment, and tracking information
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Status Update */}
                <div className="space-y-2">
                    <Label htmlFor="status">Order Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            {statusOptions.map(statusOption => (
                                <SelectItem key={statusOption} value={statusOption}>
                                    {statusOption}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Payment Status */}
                <div className="space-y-2">
                    <Label htmlFor="payment">Payment Status</Label>
                    <Select value={payment.toString()} onValueChange={(value) => setPayment(value === 'true')}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select payment status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="false">Pending</SelectItem>
                            <SelectItem value="true">Paid</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Separator />

                {/* Courier Information */}
                <div className="space-y-4">
                    <h4 className="font-medium">Shipping Information</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="courier">Courier Partner</Label>
                            <Select value={courier} onValueChange={setCourier}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select courier" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No Courier Selected</SelectItem>
                                    {courierOptions.map(courierOption => (
                                        <SelectItem key={courierOption} value={courierOption}>
                                            {courierOption}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="trackingId">Tracking ID</Label>
                            <Input
                                id="trackingId"
                                value={trackingId}
                                onChange={(e) => setTrackingId(e.target.value)}
                                placeholder="Enter tracking ID"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="trackingUrl">Tracking URL (Optional)</Label>
                        <Input
                            id="trackingUrl"
                            value={trackingUrl}
                            onChange={(e) => setTrackingUrl(e.target.value)}
                            placeholder="Enter tracking URL"
                            type="url"
                        />
                    </div>
                </div>

                {/* Cancellation Reason */}
                {status === 'Cancelled' && (
                    <div className="space-y-2">
                        <Label htmlFor="cancellationReason">Cancellation Reason</Label>
                        <Textarea
                            id="cancellationReason"
                            value={cancellationReason}
                            onChange={(e) => setCancellationReason(e.target.value)}
                            placeholder="Enter reason for cancellation"
                            required
                        />
                    </div>
                )}

                {/* Admin Notes */}
                <div className="space-y-2">
                    <Label htmlFor="adminNotes">Admin Notes</Label>
                    <Textarea
                        id="adminNotes"
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Add any internal notes"
                        rows={3}
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-2">
                    <Button type="submit" disabled={loading}>
                        {loading ? "Updating..." : "Update Order"}
                    </Button>
                </div>
            </form>
        </>
    );
};

const OrderViewDialog = ({ order }) => {
    if (!order) return null;

    return (
        <>
            <DialogHeader>
                <DialogTitle>Order Details #{order._id?.slice(-8).toUpperCase()}</DialogTitle>
                <DialogDescription>
                    Complete order information and status history
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
                {/* Order Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium">Subtotal</Label>
                                <p>₹{order.subtotal}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">Delivery Fee</Label>
                                <p>₹{order.deliveryFee}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">Discount</Label>
                                <p>₹{order.discount}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">Total</Label>
                                <p className="font-semibold">₹{order.amount}</p>
                            </div>
                        </div>
                        
                        {order.appliedVoucher && (
                            <div className="bg-green-50 p-3 rounded-lg">
                                <Label className="text-sm font-medium">Applied Voucher</Label>
                                <p>{order.appliedVoucher.title} ({order.appliedVoucher.code})</p>
                                <p className="text-sm text-green-600">
                                    Discount: ₹{order.appliedVoucher.appliedDiscount}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Items */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Order Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {order.items?.map((item, index) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium">{item.name || item.productId}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Quantity: {item.quantity} × ₹{item.price}
                                        </p>
                                    </div>
                                    <p className="font-semibold">₹{item.total}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Shipping Information */}
                {(order.courier?.name || order.courier?.trackingId) && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Shipping Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {order.courier?.name && (
                                <div>
                                    <Label className="text-sm font-medium">Courier</Label>
                                    <p>{order.courier.name}</p>
                                </div>
                            )}
                            {order.courier?.trackingId && (
                                <div>
                                    <Label className="text-sm font-medium">Tracking ID</Label>
                                    <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                        {order.courier.trackingId}
                                    </p>
                                </div>
                            )}
                            {order.courier?.trackingUrl && (
                                <div>
                                    <Label className="text-sm font-medium">Track Order</Label>
                                    <a 
                                        href={order.courier.trackingUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline text-sm"
                                    >
                                        Click to track
                                    </a>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Status History */}
                {order.statusHistory?.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Status History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {order.statusHistory.map((history, index) => (
                                    <div key={index} className="flex justify-between items-start p-3 border-l-2 border-blue-500 bg-blue-50">
                                        <div>
                                            <p className="font-medium">{history.status}</p>
                                            {history.note && (
                                                <p className="text-sm text-muted-foreground">{history.note}</p>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(history.updatedAt).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Admin Notes */}
                {order.adminNotes && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Admin Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">{order.adminNotes}</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
};

export default Orders;
