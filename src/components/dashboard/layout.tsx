"use client";

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Hotel,
  LayoutDashboard,
  BedDouble,
  CalendarDays,
  Coffee,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

const menuItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
  { icon: Hotel, label: 'Hotels', path: '/dashboard/hotels' }, // Added Hotel Option
  { icon: BedDouble, label: 'Rooms', path: '/dashboard/rooms' },
  { icon: CalendarDays, label: 'Reservations', path: '/dashboard/reservations' },
  { icon: Coffee, label: 'Services', path: '/dashboard/services' },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -200 }}
        animate={{ x: isSidebarOpen ? 0 : -200 }}
        className="fixed top-0 left-0 z-40 h-screen w-64 bg-card border-r"
      >
        <div className="flex items-center gap-2 p-4 border-b">
          <Hotel className="h-6 w-6" />
          <span className="font-bold text-lg">HotelHub</span>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-muted'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}

          <Button
            variant="ghost"
            className="w-full justify-start gap-2 mt-4 text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </nav>
      </motion.aside>

      {/* Main content */}
      <div className={`${isSidebarOpen ? 'ml-64' : 'ml-0'} min-h-screen transition-all`}>
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}