// components/admin/VoucherManagement.jsx
"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar as CalendarIcon,
  Ticket,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  TrendingUp,
  Users,
  Clock,
  Loader2,
  MoreVertical,
  ChevronDown
} from 'lucide-react';
import { format } from 'date-fns';

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [statistics, setStatistics] = useState({
    activeCount: 0,
    expiredCount: 0,
    totalUsage: 0
  });

  // Form state for creating vouchers
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    maxDiscountAmount: '',
    usageLimit: '',
    userUsageLimit: 1,
    startDate: new Date(),
    endDate: new Date(),
    minOrderAmount: '',
    maxOrderAmount: '',
    applicableCategories: [],
    applicableBrands: [],
    isActive: true
  });

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter and search logic
  const filteredVouchers = useMemo(() => {
    let filtered = [...vouchers];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(voucher =>
        voucher.code.toLowerCase().includes(query) ||
        voucher.title.toLowerCase().includes(query) ||
        voucher.description.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(voucher => {
        const startDate = new Date(voucher.startDate);
        const endDate = new Date(voucher.endDate);

        switch (statusFilter) {
          case 'active':
            return voucher.isActive && now >= startDate && now <= endDate;
          case 'expired':
            return now > endDate;
          case 'inactive':
            return !voucher.isActive;
          case 'scheduled':
            return voucher.isActive && now < startDate;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [vouchers, searchQuery, statusFilter]);

  // Update statistics based on filtered results
  const filteredStatistics = useMemo(() => {
    const now = new Date();
    return {
      total: filteredVouchers.length,
      active: filteredVouchers.filter(v => {
        const startDate = new Date(v.startDate);
        const endDate = new Date(v.endDate);
        return v.isActive && now >= startDate && now <= endDate;
      }).length,
      expired: filteredVouchers.filter(v => new Date(v.endDate) < now).length,
      totalUsage: filteredVouchers.reduce((sum, v) => sum + v.usedCount, 0)
    };
  }, [filteredVouchers]);

  // Fetch vouchers
  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/vouchers`);
      const data = await response.json();

      if (data.success) {
        setVouchers(data.vouchers);
        setStatistics(data.statistics);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to fetch vouchers');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  // Create voucher
  const handleCreateVoucher = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/admin/vouchers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Voucher created successfully!');
        setShowCreateDialog(false);
        fetchVouchers();
        resetForm();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to create voucher');
      console.error('Create error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete voucher
  const handleDeleteVoucher = async (voucherId, voucherCode) => {
    try {
      const response = await fetch(`/api/admin/vouchers/delete?id=${voucherId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Voucher ${voucherCode} deleted successfully!`);
        fetchVouchers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete voucher');
    }
  };

  // Toggle voucher status (activate/deactivate)
  const handleToggleStatus = async (voucherId, currentStatus) => {
    try {
      const response = await fetch('/api/admin/vouchers/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voucherId,
          action: 'toggle_status',
          value: !currentStatus
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        fetchVouchers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      toast.error('Failed to update voucher status');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      maxDiscountAmount: '',
      usageLimit: '',
      userUsageLimit: 1,
      startDate: new Date(),
      endDate: new Date(),
      minOrderAmount: '',
      maxOrderAmount: '',
      applicableCategories: [],
      applicableBrands: [],
      isActive: true
    });
  };

  const getStatusBadge = (voucher) => {
    const now = new Date();
    const startDate = new Date(voucher.startDate);
    const endDate = new Date(voucher.endDate);

    if (!voucher.isActive) {
      return { variant: 'secondary', label: 'Inactive', color: 'bg-gray-100 text-gray-800' };
    }
    if (now < startDate) {
      return { variant: 'outline', label: 'Scheduled', color: 'bg-blue-100 text-blue-800' };
    }
    if (now > endDate) {
      return { variant: 'destructive', label: 'Expired', color: 'bg-red-100 text-red-800' };
    }
    return { variant: 'default', label: 'Active', color: 'bg-green-100 text-green-800' };
  };

  const copyVoucherCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Voucher code copied!');
  };

  // Mobile Card Component for Vouchers
  const VoucherCard = ({ voucher }) => {
    const status = getStatusBadge(voucher);
    const [showActions, setShowActions] = useState(false);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Card className="mb-4">
          <CardContent className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg truncate">{voucher.code}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyVoucherCode(voucher.code)}
                    className="h-6 w-6 p-0 flex-shrink-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {voucher.title}
                </p>
                <Badge variant={status.variant} className={`${status.color} text-xs`}>
                  {status.label}
                </Badge>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowActions(!showActions)}
                className="h-8 w-8 p-0 flex-shrink-0"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Discount</p>
                <p className="font-medium">
                  {voucher.discountType === 'percentage' 
                    ? `${voucher.discountValue}%` 
                    : `₹${voucher.discountValue}`}
                </p>
                {voucher.maxDiscountAmount && (
                  <p className="text-xs text-muted-foreground">
                    Max: ₹{voucher.maxDiscountAmount}
                  </p>
                )}
              </div>
              
              <div>
                <p className="text-muted-foreground">Usage</p>
                <p className="font-medium">
                  {voucher.usedCount}
                  {voucher.usageLimit && ` / ${voucher.usageLimit}`}
                </p>
                {voucher.usageLimit && (
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div 
                      className="bg-blue-600 h-1 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min((voucher.usedCount / voucher.usageLimit) * 100, 100)}%` }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Validity */}
            <div className="mt-3 pt-3 border-t">
              <p className="text-muted-foreground text-sm">Valid from</p>
              <p className="text-sm font-medium">
                {format(new Date(voucher.startDate), "MMM dd")} - {format(new Date(voucher.endDate), "MMM dd, yyyy")}
              </p>
            </div>

            {/* Actions (Collapsible) */}
            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-3 pt-3 border-t"
                >
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleToggleStatus(voucher._id, voucher.isActive)}
                    >
                      {voucher.isActive ? (
                        <>
                          <EyeOff className="w-3 h-3 mr-1" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3 mr-1" />
                          Activate
                        </>
                      )}
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="flex-1">
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="mx-4">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Voucher</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete voucher "{voucher.code}"?
                            {voucher.usedCount > 0 && (
                              <span className="text-orange-600 font-medium">
                                <br />Warning: This voucher has been used {voucher.usedCount} times.
                              </span>
                            )}
                            <br />This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteVoucher(voucher._id, voucher.code)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading vouchers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-3 md:p-6 bg-background">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header with Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card>
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center gap-2 md:gap-4">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Ticket className="w-4 h-4 md:w-6 md:h-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm text-muted-foreground">Total</p>
                  <p className="text-lg md:text-2xl font-bold">{filteredStatistics.total}</p>
                  {(searchQuery || statusFilter !== 'all') && (
                    <p className="text-xs text-muted-foreground">of {vouchers.length}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center gap-2 md:gap-4">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 md:w-6 md:h-6 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm text-muted-foreground">Active</p>
                  <p className="text-lg md:text-2xl font-bold text-green-600">{filteredStatistics.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center gap-2 md:gap-4">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 md:w-6 md:h-6 text-red-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm text-muted-foreground">Expired</p>
                  <p className="text-lg md:text-2xl font-bold text-red-600">{filteredStatistics.expired}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center gap-2 md:gap-4">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm text-muted-foreground">Usage</p>
                  <p className="text-lg md:text-2xl font-bold text-blue-600">{filteredStatistics.totalUsage}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="space-y-3 md:space-y-0 md:flex md:items-center md:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search vouchers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="flex-1 md:w-48">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>

                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 whitespace-nowrap">
                      <Plus className="w-4 h-4" />
                      {isMobile ? 'Add' : 'Create Voucher'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="mx-3 md:mx-0 max-w-2xl max-h-[90vh] overflow-hidden">
                    <DialogHeader>
                      <DialogTitle>Create New Voucher</DialogTitle>
                    </DialogHeader>
                    
                    <div className="overflow-y-auto max-h-[70vh] pr-2">
                      <form onSubmit={handleCreateVoucher} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="code">Voucher Code *</Label>
                            <Input
                              id="code"
                              value={formData.code}
                              onChange={(e) => setFormData(prev => ({
                                ...prev, 
                                code: e.target.value.toUpperCase()
                              }))}
                              placeholder="SAVE20"
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="title">Title *</Label>
                            <Input
                              id="title"
                              value={formData.title}
                              onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                              placeholder="Summer Sale"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="description">Description *</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                            placeholder="Get 20% off on all products"
                            required
                            rows={3}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>Discount Type *</Label>
                            <Select 
                              value={formData.discountType} 
                              onValueChange={(value) => setFormData(prev => ({...prev, discountType: value}))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="percentage">Percentage</SelectItem>
                                <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="discountValue">
                              Discount Value * {formData.discountType === 'percentage' ? '(%)' : '(₹)'}
                            </Label>
                            <Input
                              id="discountValue"
                              type="number"
                              value={formData.discountValue}
                              onChange={(e) => setFormData(prev => ({...prev, discountValue: e.target.value}))}
                              placeholder={formData.discountType === 'percentage' ? '20' : '500'}
                              required
                              min="0"
                              step={formData.discountType === 'percentage' ? '0.01' : '1'}
                              max={formData.discountType === 'percentage' ? '100' : undefined}
                            />
                          </div>
                          
                          {formData.discountType === 'percentage' && (
                            <div>
                              <Label htmlFor="maxDiscountAmount">Max Discount (₹)</Label>
                              <Input
                                id="maxDiscountAmount"
                                type="number"
                                value={formData.maxDiscountAmount}
                                onChange={(e) => setFormData(prev => ({...prev, maxDiscountAmount: e.target.value}))}
                                placeholder="1000"
                                min="0"
                              />
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="startDate">Start Date *</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={formData.startDate}
                                  onSelect={(date) => setFormData(prev => ({...prev, startDate: date}))}
                                  initialFocus
                                  disabled={(date) => date < new Date().setHours(0, 0, 0, 0)}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          
                          <div>
                            <Label htmlFor="endDate">End Date *</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {formData.endDate ? format(formData.endDate, "PPP") : "Pick a date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={formData.endDate}
                                  onSelect={(date) => setFormData(prev => ({...prev, endDate: date}))}
                                  initialFocus
                                  disabled={(date) => date < formData.startDate}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="minOrderAmount">Min Order Amount (₹)</Label>
                            <Input
                              id="minOrderAmount"
                              type="number"
                              value={formData.minOrderAmount}
                              onChange={(e) => setFormData(prev => ({...prev, minOrderAmount: e.target.value}))}
                              placeholder="500"
                              min="0"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="usageLimit">Usage Limit</Label>
                            <Input
                              id="usageLimit"
                              type="number"
                              value={formData.usageLimit}
                              onChange={(e) => setFormData(prev => ({...prev, usageLimit: e.target.value}))}
                              placeholder="Leave empty for unlimited"
                              min="1"
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="isActive"
                            checked={formData.isActive}
                            onCheckedChange={(checked) => setFormData(prev => ({...prev, isActive: checked}))}
                          />
                          <Label htmlFor="isActive">Active</Label>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                          <Button type="submit" className="flex-1" disabled={isSubmitting}>
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Creating...
                              </>
                            ) : (
                              'Create Voucher'
                            )}
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setShowCreateDialog(false)}
                            disabled={isSubmitting}
                            className="flex-1 sm:flex-none"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vouchers Display */}
        {filteredVouchers.length > 0 ? (
          <>
            {/* Mobile View - Cards */}
            {isMobile ? (
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredVouchers.map((voucher) => (
                    <VoucherCard key={voucher._id} voucher={voucher} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              /* Desktop View - Table */
              <Card>
                <CardContent className="p-0 overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[200px]">Voucher</TableHead>
                          <TableHead className="min-w-[120px]">Discount</TableHead>
                          <TableHead className="min-w-[100px]">Usage</TableHead>
                          <TableHead className="min-w-[180px]">Validity</TableHead>
                          <TableHead className="min-w-[100px]">Status</TableHead>
                          <TableHead className="text-right min-w-[120px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <AnimatePresence>
                          {filteredVouchers.map((voucher) => {
                            const status = getStatusBadge(voucher);
                            return (
                              <motion.tr
                                key={voucher._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="group"
                              >
                                <TableCell>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium">{voucher.code}</p>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyVoucherCode(voucher.code)}
                                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <Copy className="w-3 h-3" />
                                      </Button>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                      {voucher.title}
                                    </p>
                                  </div>
                                </TableCell>
                                
                                <TableCell>
                                  <p className="font-medium">
                                    {voucher.discountType === 'percentage' 
                                      ? `${voucher.discountValue}%` 
                                      : `₹${voucher.discountValue}`}
                                  </p>
                                  {voucher.maxDiscountAmount && (
                                    <p className="text-xs text-muted-foreground">
                                      Max: ₹{voucher.maxDiscountAmount}
                                    </p>
                                  )}
                                </TableCell>
                                
                                <TableCell>
                                  <p className="text-sm">
                                    {voucher.usedCount}
                                    {voucher.usageLimit && ` / ${voucher.usageLimit}`}
                                  </p>
                                  {voucher.usageLimit && (
                                    <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                      <div 
                                        className="bg-blue-600 h-1 rounded-full transition-all duration-500" 
                                        style={{ width: `${Math.min((voucher.usedCount / voucher.usageLimit) * 100, 100)}%` }}
                                      />
                                    </div>
                                  )}
                                </TableCell>
                                
                                <TableCell>
                                  <p className="text-sm">
                                    {format(new Date(voucher.startDate), "MMM dd")} - {format(new Date(voucher.endDate), "MMM dd, yyyy")}
                                  </p>
                                </TableCell>
                                
                                <TableCell>
                                  <Badge variant={status.variant} className={`${status.color}`}>
                                    {status.label}
                                  </Badge>
                                </TableCell>
                                
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-8 w-8 p-0"
                                      onClick={() => handleToggleStatus(voucher._id, voucher.isActive)}
                                      title={voucher.isActive ? "Deactivate" : "Activate"}
                                    >
                                      {voucher.isActive ? (
                                        <EyeOff className="w-4 h-4 text-orange-600" />
                                      ) : (
                                        <Eye className="w-4 h-4 text-green-600" />
                                      )}
                                    </Button>

                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                          title="Delete Voucher"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Delete Voucher</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to delete voucher "{voucher.code}"?
                                            {voucher.usedCount > 0 && (
                                              <span className="text-orange-600 font-medium">
                                                <br />Warning: This voucher has been used {voucher.usedCount} times.
                                              </span>
                                            )}
                                            <br />This action cannot be undone.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleDeleteVoucher(voucher._id, voucher.code)}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </TableCell>
                              </motion.tr>
                            );
                          })}
                        </AnimatePresence>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="p-8 md:p-12 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <Ticket className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground mx-auto" />
                <h3 className="text-lg md:text-xl font-medium">
                  {searchQuery || statusFilter !== 'all' ? 'No vouchers match your filters' : 'No vouchers found'}
                </h3>
                <p className="text-muted-foreground text-sm md:text-base">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Try adjusting your search criteria or filters.' 
                    : 'Create your first voucher to get started with discount management.'
                  }
                </p>
                <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Voucher
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VoucherManagement;
