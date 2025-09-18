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
  Loader2
} from "lucide-react";

const OrderSummary = () => {
  const { currency, router, getCartCount, getCartAmount, getToken, user, cartItems, setCartItems } = useAppContext();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [userAddresses, setUserAddresses] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);

  const fetchUserAddresses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/user/get-address', {
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
      toast.error(error.message);
    }
  };

  const handleAddressSelect = (addressId) => {
    const address = userAddresses.find(addr => addr._id === addressId);
    setSelectedAddress(address);
  };

  const applyPromoCode = () => {
    // Mock promo code logic - replace with your actual implementation
    if (promoCode.toLowerCase() === "save10") {
      setPromoDiscount(getCartAmount() * 0.1);
      toast.success("Promo code applied! 10% discount added.");
    } else if (promoCode.toLowerCase() === "free50") {
      setPromoDiscount(50);
      toast.success("Promo code applied! ₹50 discount added.");
    } else if (promoCode) {
      toast.error("Invalid promo code");
    }
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
        promoCode: promoCode || null,
        discount: promoDiscount
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { data } = response;

      if (data.success) {
        toast.success(data.message);
        setCartItems({});
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

  const subtotal = getCartAmount();
  const tax = Math.floor(subtotal * 0.02);
  const total = subtotal + tax - promoDiscount;

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

          {/* Promo Code */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Tag className="w-4 h-4" />
              Promo Code
            </Label>
            
            <div className="flex gap-2">
              <Input
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                onClick={applyPromoCode}
                disabled={!promoCode.trim()}
              >
                Apply
              </Button>
            </div>
            
            {promoDiscount > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-green-700 bg-green-100">
                  <Tag className="w-3 h-3 mr-1" />
                  {currency}{promoDiscount} discount applied
                </Badge>
              </div>
            )}
          </div>

          <Separator />

          {/* Order Details */}
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
                  Shipping
                </span>
                <Badge variant="secondary" className="text-green-700 bg-green-100">
                  Free
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Tax (2%)
                </span>
                <span className="font-medium">
                  {currency}{tax.toLocaleString()}
                </span>
              </div>
              
              {promoDiscount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-600">
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
                  Place Order
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
