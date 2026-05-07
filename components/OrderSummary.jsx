import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

// shadcn/ui components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Icons
import { 
  MapPin, 
  Plus, 
  Tag, 
  ShoppingBag, 
  CreditCard,
  Truck,
  Receipt,
  Loader2,
  X,
  CheckCircle
} from "lucide-react";

const OrderSummary = () => {
  const { currency, router, getCartCount, getCartAmount, getToken, user, cartItems, setCartItems } = useAppContext();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [userAddresses, setUserAddresses] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState(null);

  const fetchUserAddresses = async () => {
    try {
      const token = getToken();
      const { data } = await axios.get('/api/user/addresses', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (data.success) {
        setUserAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Address fetch error:', error);
      toast.error(error?.response?.data?.message || error.message || "Failed to fetch addresses");
    }
  };

  const handleAddressSelect = (addressId) => {
    const address = userAddresses.find(addr => addr._id === addressId);
    setSelectedAddress(address);
  };

  // Enhanced voucher application function
  const applyPromoCode = async () => {
    if (!promoCode || !promoCode.trim()) {
      toast.error("Please enter a promo code");
      return;
    }

    if (promoDiscount > 0) {
      toast.error("A promo code is already applied. Remove it first to apply a new one.");
      return;
    }

    try {
      setIsApplyingPromo(true);
      
      const cartAmount = getCartAmount();
      
      if (cartAmount <= 0) {
        toast.error("Your cart is empty");
        return;
      }

      console.log('Validating voucher:', promoCode);

      // Call your voucher validation API
      const response = await fetch('/api/admin/vouchers/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: promoCode.toUpperCase(),
          orderAmount: cartAmount,
          cartItems: cartItems
        })
      });

      const data = await response.json();
      console.log('Voucher validation response:', data);

      if (data.success) {
        // Apply the discount
        setPromoDiscount(data.discountAmount);
        setAppliedVoucher({
          code: data.voucher.code,
          title: data.voucher.title,
          discountAmount: data.discountAmount,
          finalAmount: data.finalAmount
        });
        
        toast.success(`Promo code applied! You saved ${currency}${data.discountAmount.toLocaleString()}`);
      } else {
        // Handle specific error cases
        switch (data.message) {
          case "Invalid voucher code":
            toast.error("Invalid promo code. Please check and try again.");
            break;
          case "Voucher has expired or not yet active":
            toast.error("This promo code has expired or is not yet active.");
            break;
          case "Voucher usage limit exceeded":
            toast.error("This promo code has reached its usage limit.");
            break;
          case "You have already used this voucher":
            toast.error("You have already used this promo code.");
            break;
          case "Order amount is below minimum requirement":
            toast.error(`Minimum order amount of ${currency}${data.minAmount} required for this promo code.`);
            break;
          default:
            toast.error(data.message || "Failed to apply promo code");
        }
      }
    } catch (error) {
      console.error('Promo code error:', error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsApplyingPromo(false);
    }
  };

  // Function to remove applied promo code
  const removePromoCode = () => {
    setPromoCode("");
    setPromoDiscount(0);
    setAppliedVoucher(null);
    toast.success("Promo code removed");
  };

  const createOrder = async () => {
    try {
      setIsCreatingOrder(true);
      
      if (!selectedAddress) {
        toast.error("Please select an address");
        return;
      }

      let cartItemArray = Object.keys(cartItems).map((key) => ({
        productId: key,
        quantity: cartItems[key]
      }));

      cartItemArray = cartItemArray.filter(item => item.quantity > 0);

      if (cartItemArray.length === 0) {
        toast.error("Your cart is empty");
        return;
      }

      const response = await axios.post('/api/order/create', {
        items: cartItemArray,
        address: selectedAddress._id,
        promoCode: appliedVoucher?.code || null,
        discount: promoDiscount,
        subtotal: getCartAmount(),
        total: getCartAmount() + (getCartAmount() > 500 ? 0 : 50) - promoDiscount
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { data } = response;

      if (data.success) {
        toast.success(data.message);
        setCartItems({});
        
        // Clear applied voucher after successful order
        setAppliedVoucher(null);
        setPromoDiscount(0);
        setPromoCode("");
        
        router.push('/order-placed');
      } else {
        toast.error(data.message || "Failed to create order");
      }
    } catch (error) {
      console.error('Order creation error:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                            error.response.data?.error || 
                            `Server error: ${error.response.status}`;
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error(error.message || "An unexpected error occurred");
      }
    } finally {
      setIsCreatingOrder(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserAddresses();
    }
  }, [user]);

  // Calculate totals (removed tax)
  const subtotal = getCartAmount();
  const deliveryFee = subtotal > 500 ? 0 : 50; // Free delivery above ₹500
  const total = Math.max(0, subtotal + deliveryFee - promoDiscount);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full md:w-96"
    >
      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Order Summary
          </CardTitle>
          <CardDescription>
            Review your order and complete checkout
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          
          {/* Address Selection */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="w-4 h-4" />
              Delivery Address
            </Label>
            
            {userAddresses.length > 0 ? (
              <Select 
                value={selectedAddress?._id || ""} 
                onValueChange={handleAddressSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select delivery address" />
                </SelectTrigger>
                <SelectContent>
                  {userAddresses.map((address) => (
                    <SelectItem key={address._id} value={address._id}>
                      <div className="text-left">
                        <div className="font-medium">{address.fullName}</div>
                        <div className="text-xs text-muted-foreground">
                          {address.area}, {address.city}, {address.state}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No addresses found</p>
              </div>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push("/add-address")}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Address
            </Button>
          </div>

          <Separator />

          {/* Enhanced Promo Code Section */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Tag className="w-4 h-4" />
              Promo Code
            </Label>
            
            {!appliedVoucher ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="flex-1"
                  disabled={isApplyingPromo}
                />
                <Button 
                  variant="outline" 
                  onClick={applyPromoCode}
                  disabled={!promoCode.trim() || isApplyingPromo}
                >
                  {isApplyingPromo ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Apply'
                  )}
                </Button>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">{appliedVoucher.code}</p>
                      <p className="text-sm text-green-600">
                        {appliedVoucher.title} - You saved {currency}{appliedVoucher.discountAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removePromoCode}
                    className="text-green-600 hover:text-green-700 h-6 w-6 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Order Details (Tax Removed) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Receipt className="w-4 h-4" />
              <Label className="text-sm font-medium">Order Details</Label>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Items ({getCartCount()})
                </span>
                <span className="font-medium">
                  {currency}{subtotal.toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  Delivery
                </span>
                {deliveryFee === 0 ? (
                  <Badge variant="secondary" className="text-green-700 bg-green-100">
                    Free
                  </Badge>
                ) : (
                  <span className="font-medium">
                    {currency}{deliveryFee}
                  </span>
                )}
              </div>
              
              {promoDiscount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    Promo Discount
                  </span>
                  <span className="font-medium text-green-600">
                    -{currency}{promoDiscount.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <Separator />
            
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-xl font-bold text-primary">
                {currency}{total.toLocaleString()}
              </span>
            </div>
            
            {promoDiscount > 0 && (
              <div className="text-center">
                <Badge variant="secondary" className="text-green-700 bg-green-100">
                  You saved {currency}{promoDiscount.toLocaleString()} with {appliedVoucher?.code}!
                </Badge>
              </div>
            )}
          </div>

          <Separator />

          {/* Place Order Button */}
          <div className="space-y-4">
            <Button 
              onClick={createOrder} 
              disabled={isCreatingOrder || !selectedAddress || getCartCount() === 0}
              size="lg"
              className="w-full"
            >
              {isCreatingOrder ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Place Order ({currency}{total.toLocaleString()})
                </>
              )}
            </Button>
            
            {/* Security badges */}
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Secure checkout</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Free returns</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OrderSummary;
