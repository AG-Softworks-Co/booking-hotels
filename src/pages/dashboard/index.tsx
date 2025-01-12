// dashboard-page.tsx
"use client";

import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/layout';
import { Overview } from '@/components/dashboard/overview';
import { RoomManagement } from '@/components/dashboard/rooms';
import { ReservationManagement } from '@/components/dashboard/reservations';
import { HotelManagement } from '@/components/dashboard/hotels';
import { ServiceManagement } from '@/components/dashboard/services';
import { Settings } from '@/components/dashboard/settings';
import { ProfilePage } from '@/components/dashboard/perfil';


export function DashboardPage() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/hotels" element={<HotelManagement />} />
        <Route path="/rooms" element={<RoomManagement />} />
        <Route path="/reservations" element={<ReservationManagement />} />
        <Route path="/services" element={<ServiceManagement />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<ProfilePage />} /> {/* Esta es la línea nueva */}
      </Routes>
    </DashboardLayout>
  );
}