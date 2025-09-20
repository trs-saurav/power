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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { 
      name: 'Overview', 
      path: '/admin/', 
      icon: Home,
      badge: null
    },
    { 
      name: 'Analytics', 
      path: '/admin/analytics', 
      icon: BarChart3,
      badge: ""
    },
    { 
      name: 'Add Product', 
      path: '/admin/add-product', 
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

  const SidebarItem = ({ item, isMobile = false }) => {
    const isActive = pathname === item.path;
    const IconComponent = item.icon;
    const collapsed = isMobile || isCollapsed;

    const content = (
      <Link href={item.path} className="block w-full">
        <motion.div
          whileHover={{ scale: collapsed ? 1.05 : 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative
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

          {/* Badge indicator for mobile when collapsed */}
          {collapsed && item.badge && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
          )}
        </motion.div>
      </Link>
    );

    if (collapsed) {
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

  const SidebarContent = ({ isMobile = false }) => {
    const collapsed = isMobile || isCollapsed;
    
    return (
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
                isMobile={isMobile}
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
  };

  return (
    <>
      {/* Mobile Sidebar - Takes part of screen, not overlay */}
      <div className="lg:hidden w-16 bg-card border-r shadow-sm h-screen flex-shrink-0">
        <SidebarContent isMobile={true} />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block relative flex-shrink-0">
        <motion.div
          animate={{ width: isCollapsed ? '64px' : '288px' }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="border-r bg-card shadow-sm h-screen relative"
        >
          <SidebarContent />
          
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
