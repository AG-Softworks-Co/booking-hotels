"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface HotelStats {
  totalRooms: number;
  activeReservations: number;
  currentGuests: number;
  monthlyRevenue: number;
}

export function useHotelStats() {
  const [stats, setStats] = useState<HotelStats>({
    totalRooms: 0,
    activeReservations: 0,
    currentGuests: 0,
    monthlyRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch total rooms
        const { count: roomsCount } = await supabase
          .from('rooms')
          .select('*', { count: 'exact' })
          .eq('hotel_id', user.id);

        // Fetch active reservations
        const { count: reservationsCount } = await supabase
          .from('reservations')
          .select('*', { count: 'exact' })
          .eq('hotel_id', user.id)
          .eq('status', 'active');

        // Calculate monthly revenue
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        const { data: payments } = await supabase
          .from('payments')
          .select('amount')
          .gte('created_at', startOfMonth.toISOString())
          .eq('status', 'completed');

        const monthlyRevenue = payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;

        setStats({
          totalRooms: roomsCount || 0,
          activeReservations: reservationsCount || 0,
          currentGuests: reservationsCount || 0, // Simplified, could be calculated differently
          monthlyRevenue,
        });
      } catch (error) {
        console.error('Error fetching hotel stats:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, isLoading };
}