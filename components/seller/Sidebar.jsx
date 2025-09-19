'use client'
import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

// shadcn/ui components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Icons
import {
  Plus,
  Package,
  ShoppingBag,
  Images,
  UserPlus,
  Ticket,
  Settings,
  BarChart3,
  Home,
  Store,
  Menu,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const SideBar = () => {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { 
      name: 'Overview', 
      path: '/admin/dashboard', 
      icon: Home,
      badge: null
    },
    { 
      name: 'Analytics', 
      path: '/admin/analytics', 
      icon: BarChart3,
      badge: "New"
    },
    { 
      name: 'Add Product', 
      path: '/admin', 
      icon: Plus,
      badge: null
    },
    { 
      name: 'Product List', 
      path: '/admin/product-list', 
      icon: Package,
      badge: null
    },
    { 
      name: 'Gallery', 
      path: '/admin/gallery', 
      icon: Images,
      badge: null
    },
    { 
      name: 'Orders', 
      path: '/admin/orders', 
      icon: ShoppingBag,
      badge: null
    },
    { 
      name: 'Vouchers', 
      path: '/admin/vouchers', 
      icon: Ticket,
      badge: null
    },
    { 
      name: 'Users', 
      path: '/admin/users', 
      icon: UserPlus,
      badge: null
    },

  ];

  const handleToggleCollapse = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCollapsed(prev => !prev);
  }, []);

  const handleMobileMenuClick = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const SidebarItem = ({ item, collapsed = false, mobile = false }) => {
    const isActive = pathname === item.path;
    const IconComponent = item.icon;

    const content = (
      <Link 
        href={item.path}
        onClick={mobile ? handleMobileMenuClick : undefined}
        className="block w-full"
      >
        <motion.div
          whileHover={{ scale: collapsed ? 1.05 : 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
            ${isActive 
              ? 'bg-primary text-primary-foreground shadow-sm' 
              : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground hover:text-foreground'
            }
            ${collapsed ? 'justify-center px-2' : ''}
          `}
        >
          <IconComponent className={`${collapsed ? 'w-5 h-5' : 'w-4 h-4'} flex-shrink-0`} />
          
          {!collapsed && (
            <>
              <span className="flex-1 font-medium text-sm">{item.name}</span>
              {item.badge && (
                <Badge 
                  variant={isActive ? "secondary" : "outline"} 
                  className="text-xs h-5 min-w-5"
                >
                  {item.badge}
                </Badge>
              )}
            </>
          )}
        </motion.div>
      </Link>
    );

    if (collapsed && !mobile) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full">
                {content}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-2">
              {item.name}
              {item.badge && (
                <Badge variant="outline" className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return content;
  };

  const SidebarContent = ({ collapsed = false, mobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`p-4 border-b ${collapsed ? 'px-3' : ''}`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
            <Store className="w-4 h-4 text-primary-foreground" />
          </div>
          
          {!collapsed && (
            <div>
              <h2 className="font-semibold text-base">Admin Panel</h2>
              <p className="text-xs text-muted-foreground">Manage your store</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <SidebarItem 
              key={item.path} 
              item={item} 
              collapsed={collapsed} 
              mobile={mobile}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className={`p-3 border-t ${collapsed ? 'px-2' : ''}`}>
        {!collapsed ? (
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <motion.div 
                className="w-2 h-2 bg-green-500 rounded-full"
                animate={{ 
                  opacity: [0.4, 1, 0.4]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <span className="text-xs font-medium">Online</span>
            </div>
            <p className="text-xs text-muted-foreground">System operational</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div 
                    className="w-3 h-3 bg-green-500 rounded-full"
                    animate={{ 
                      opacity: [0.4, 1, 0.4]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent side="right">
                  System Online
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="fixed top-4 left-4 z-50 shadow-lg"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SidebarContent mobile={true} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block relative">
        <motion.div
          animate={{ width: isCollapsed ? '64px' : '288px' }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="border-r bg-card shadow-sm h-full relative"
        >
          <SidebarContent collapsed={isCollapsed} />
          
          {/* Collapse Toggle Button */}
          <button
            type="button"
            onClick={handleToggleCollapse}
            className="absolute -right-3 top-20 w-6 h-6 bg-background border border-border rounded-full shadow-md hover:bg-accent transition-colors duration-200 flex items-center justify-center z-10"
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 0 : 180 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft className="w-3 h-3" />
            </motion.div>
          </button>
        </motion.div>
      </div>
    </>
  );
};

export default SideBar;
