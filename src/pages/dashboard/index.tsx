"use client";

import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/layout';
import { Overview } from '@/components/dashboard/overview';
import { RoomManagement } from '@/components/dashboard/rooms';
import { ReservationManagement } from '@/components/dashboard/reservations';
import { HotelManagement } from '@/components/dashboard/hotels'; // Import the HotelManagement component
import { ServiceManagement } from '@/components/dashboard/services';
import { Settings } from '@/components/dashboard/settings';

export function DashboardPage() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/hotels" element={<HotelManagement />} /> {/* Add this line for the HotelManagement component*/}
        <Route path="/rooms" element={<RoomManagement />} />
        <Route path="/reservations" element={<ReservationManagement />} />
        <Route path="/services" element={<ServiceManagement />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </DashboardLayout>
  );
}