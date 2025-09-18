import React from 'react';
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
  ChevronRight,
  Settings,
  BarChart3,
  Home,
  Store
} from 'lucide-react';

const SideBar = () => {
  const pathname = usePathname();
  
  const menuSections = [
    {
      title: "Dashboard",
      items: [
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
        }
      ]
    },
    {
      title: "Products",
      items: [
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
        }
      ]
    },
    {
      title: "Orders & Sales",
      items: [
        { 
          name: 'Orders', 
          path: '/admin/orders', 
          icon: ShoppingBag,
          badge: "12"
        },
        { 
          name: 'Vouchers', 
          path: '/admin/vouchers', 
          icon: Ticket,
          badge: null
        }
      ]
    },
    {
      title: "Management",
      items: [
        { 
          name: 'Users', 
          path: '/admin/users', 
          icon: UserPlus,
          badge: null
        },
        { 
          name: 'Settings', 
          path: '/admin/settings', 
          icon: Settings,
          badge: null
        }
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  const SidebarItem = ({ item, isCollapsed = false }) => {
    const isActive = pathname === item.path;
    const IconComponent = item.icon;

    const buttonContent = (
      <Button
        variant={isActive ? "default" : "ghost"}
        className={`
          w-full justify-start gap-3 h-11 px-3 group transition-all duration-200
          ${isActive 
            ? 'bg-primary text-primary-foreground shadow-sm' 
            : 'hover:bg-accent hover:text-accent-foreground'
          }
        `}
        asChild
      >
        <Link href={item.path}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 w-full"
          >
            <IconComponent className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left font-medium">{item.name}</span>
                {item.badge && (
                  <Badge 
                    variant={isActive ? "secondary" : "outline"} 
                    className="ml-auto text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="w-1 h-6 bg-primary-foreground rounded-full ml-auto"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </>
            )}
          </motion.div>
        </Link>
      </Button>
    );

    if (isCollapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {buttonContent}
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

    return buttonContent;
  };

  // Check if sidebar should be collapsed (you can add state management here)
  const isCollapsed = false; // You can make this dynamic with useState

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`
        ${isCollapsed ? 'w-16' : 'w-72'} 
        border-r bg-card transition-all duration-300 flex flex-col shadow-sm
      `}
    >
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
            <Store className="w-4 h-4 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-semibold text-sm">Admin Panel</h2>
              <p className="text-xs text-muted-foreground">Manage your store</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <motion.div className="space-y-6" variants={containerVariants}>
          {menuSections.map((section, sectionIndex) => (
            <motion.div key={section.title} variants={itemVariants}>
              {!isCollapsed && (
                <div className="px-3 mb-3">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {section.title}
                  </h3>
                </div>
              )}
              
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <motion.div 
                    key={item.name} 
                    variants={itemVariants}
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <SidebarItem item={item} isCollapsed={isCollapsed} />
                  </motion.div>
                ))}
              </div>
              
              {sectionIndex < menuSections.length - 1 && !isCollapsed && (
                <Separator className="my-4" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </ScrollArea>

      {/* Bottom Section */}
      <div className="p-3 border-t mt-auto">
        {!isCollapsed ? (
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium">System Status</span>
            </div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SideBar;
