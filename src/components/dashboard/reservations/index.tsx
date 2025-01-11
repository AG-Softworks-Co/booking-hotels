"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ReservationList } from './reservation-list';
import { ReservationForm } from './reservation-form';
import { Plus } from 'lucide-react';
import { HotelSelection } from './hotel-selection';
import { RoomOccupancyCalendar } from './room-occupancy-calendar';

export function ReservationManagement() {
    const [isAddingReservation, setIsAddingReservation] = useState(false);
     const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);

    const handleHotelSelect = (hotelId: string) => {
         setSelectedHotelId(hotelId);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Reservations</h1>
                 <Button
                    onClick={() => setIsAddingReservation(true)}
                    className="flex items-center gap-2"
                     disabled={!selectedHotelId}
                >
                  <Plus className="h-4 w-4" />
                  New Reservation
                </Button>
            </div>

            <HotelSelection onHotelSelect={handleHotelSelect} />

            {selectedHotelId && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ReservationList hotelId={selectedHotelId} />
                  <RoomOccupancyCalendar hotelId={selectedHotelId} />
                </div>
            )}

            {selectedHotelId && (
              <ReservationForm
                 open={isAddingReservation}
                onClose={() => setIsAddingReservation(false)}
                hotelId={selectedHotelId}
            />
           )}
        </div>
    );
}