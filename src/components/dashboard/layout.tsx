"use client";

import { useState, useEffect, useCallback, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Hotel,
  LayoutDashboard,
  BedDouble,
  CalendarDays,
  Coffee,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MenuItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

interface NavigationLinkProps {
  item: MenuItem;
  isActive: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  onLogout: () => void;
  currentPath: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
  { icon: Hotel, label: 'Hotels', path: '/dashboard/hotels' },
  { icon: BedDouble, label: 'Rooms', path: '/dashboard/rooms' },
  { icon: CalendarDays, label: 'Reservations', path: '/dashboard/reservations' },
  { icon: Coffee, label: 'Services', path: '/dashboard/services' },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

const NavigationLink = memo(({ item, isActive }: NavigationLinkProps) => (
  <Link
    to={item.path}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
      "hover:bg-accent hover:text-accent-foreground",
      isActive 
        ? "bg-primary/10 text-primary font-medium" 
        : "text-muted-foreground"
    )}
  >
    <item.icon className="h-5 w-5" />
    <span>{item.label}</span>
  </Link>
));

NavigationLink.displayName = 'NavigationLink';

const Sidebar = memo(({ isOpen, onLogout, currentPath }: SidebarProps) => (
  <div className="flex flex-col h-full">
    <div className="flex items-center gap-3 p-6 border-b h-16">
      <Hotel className="h-6 w-6 text-primary" />
      <span className="font-semibold text-xl">HotelHub</span>
    </div>

    <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
      {menuItems.map((item) => (
        <NavigationLink
          key={item.path}
          item={item}
          isActive={currentPath === item.path}
        />
      ))}
    </nav>

    <div className="p-4 border-t">
      <Button
        variant="ghost"
        className="w-full justify-start gap-3 px-4 py-3 text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={onLogout}
      >
        <LogOut className="h-5 w-5" />
        Logout
      </Button>
    </div>
  </div>
));

Sidebar.displayName = 'Sidebar';

const sidebarVariants = {
  open: { 
    x: 0,
    transition: { 
      type: "spring",
      stiffness: 400,
      damping: 40
    }
  },
  closed: { 
    x: -320,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40
    }
  }
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;
    
    const checkMobile = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const isMobileView = window.innerWidth < 1024;
        setIsMobile(isMobileView);
        setIsSidebarOpen(!isMobileView);
      }, 100);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(resizeTimer);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (!isMobile) return;
    
    const sidebar = document.getElementById('sidebar');
    const menuButton = document.getElementById('menu-button');
    
    if (isSidebarOpen && 
        sidebar && 
        !sidebar.contains(event.target as Node) && 
        menuButton && 
        !menuButton.contains(event.target as Node)) {
      setIsSidebarOpen(false);
    }
  }, [isSidebarOpen, isMobile]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black lg:hidden z-30"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <motion.aside
        id="sidebar"
        initial={false}
        animate={isSidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className={cn(
          "fixed lg:relative z-40 h-screen",
          "w-[280px] lg:w-[300px]",
          "bg-card border-r shadow-sm",
          "will-change-transform",
          isMobile ? "transform" : "transform-none"
        )}
      >
        <Sidebar 
          isOpen={isSidebarOpen}
          onLogout={handleLogout}
          currentPath={location.pathname}
        />
      </motion.aside>

      <div className="flex-1 flex flex-col min-h-screen w-full">
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-3">
              {isMobile && (
                <Button
                  id="menu-button"
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  {isSidebarOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              )}
              <div className="flex items-center gap-3 lg:hidden">
                <Hotel className="h-5 w-5 text-primary" />
                <span className="font-semibold">HotelHub</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Header content */}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}