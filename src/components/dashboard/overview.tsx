"use client";


import { Card } from '@/components/ui/card';
import {
  BedDouble,
  CalendarCheck,
  DollarSign,
  Users,
} from 'lucide-react';

import { useHotelStats } from '@/hooks/use-hotel-stats';

export function Overview() {
  const { stats, isLoading } = useHotelStats();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <BedDouble className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Rooms</p>
              <p className="text-2xl font-bold">{isLoading ? '...' : stats.totalRooms}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <CalendarCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Reservations</p>
              <p className="text-2xl font-bold">{isLoading ? '...' : stats.activeReservations}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Guests</p>
              <p className="text-2xl font-bold">{isLoading ? '...' : stats.currentGuests}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              <p className="text-2xl font-bold">
                ${isLoading ? '...' : stats.monthlyRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Add more dashboard widgets here */}
    </div>
  );
}