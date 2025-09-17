import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Plus,
  Package,
  ShoppingBag,
  Images,
  UserPlus,
  Ticket,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const SideBar = () => {
  const pathname = usePathname();
  
  const menuItems = [
    { 
      name: 'Add Product', 
      path: '/admin', 
      icon: Plus,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      hoverColor: 'hover:bg-blue-100 dark:hover:bg-blue-950/40'
    },
    { 
      name: 'Product List', 
      path: '/admin/product-list', 
      icon: Package,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
      hoverColor: 'hover:bg-emerald-100 dark:hover:bg-emerald-950/40'
    },
    { 
      name: 'Orders', 
      path: '/admin/orders', 
      icon: ShoppingBag,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
      hoverColor: 'hover:bg-orange-100 dark:hover:bg-orange-950/40'
    },
    { 
      name: 'Gallery Upload', 
      path: '/admin/gallery', 
      icon: Images,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      hoverColor: 'hover:bg-purple-100 dark:hover:bg-purple-950/40'
    },
    { 
      name: 'Add User', 
      path: '/admin/users', 
      icon: UserPlus,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-950/20',
      hoverColor: 'hover:bg-pink-100 dark:hover:bg-pink-950/40'
    },
    { 
      name: 'Generate Voucher', 
      path: '/admin/vouchers', 
      icon: Ticket,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
      hoverColor: 'hover:bg-indigo-100 dark:hover:bg-indigo-950/40'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className='md:w-72 w-16 border-r border-border/50 min-h-screen bg-gradient-to-b from-background to-muted/20 backdrop-blur-sm flex flex-col shadow-lg'
    >
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <div className="md:block hidden">
            <h2 className="font-bold text-lg text-foreground">Admin Panel</h2>
            <p className="text-xs text-muted-foreground">Manage your store</p>
          </div>
        </div>
      </div>

      {/* Main Menu Items */}
      <div className="flex-1 py-4 space-y-2">
        <div className="px-4 md:px-6 mb-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide md:block hidden">
            Main Menu
          </h3>
        </div>
        
        {menuItems.map((item, index) => {
          const isActive = pathname === item.path;
          const IconComponent = item.icon;

          return (
            <motion.div key={item.name} variants={itemVariants}>
              <Link href={item.path} className="block px-4 md:px-6">
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 group
                    ${isActive
                      ? `${item.bgColor} ${item.color} shadow-lg border border-border/30`
                      : `text-muted-foreground ${item.hoverColor} hover:shadow-md`
                    }
                  `}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-primary/60 rounded-r-full"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}

                  {/* Icon */}
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300
                    ${isActive 
                      ? `${item.color} bg-background/50` 
                      : 'text-muted-foreground group-hover:text-foreground'
                    }
                  `}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Label */}
                  <span className={`
                    md:block hidden font-medium transition-colors duration-300
                    ${isActive ? item.color : 'text-muted-foreground group-hover:text-foreground'}
                  `}>
                    {item.name}
                  </span>

                  {/* Arrow */}
                  <ChevronRight className={`
                    w-4 h-4 md:block hidden ml-auto transition-all duration-300
                    ${isActive ? `${item.color}` : 'text-transparent group-hover:text-muted-foreground'}
                  `} />
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SideBar;
