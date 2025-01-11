"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar as ReactCalendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Room {
  name: string;
  type: string;
  id: string;
}
interface Reservation {
  id: string;
  guest_name: string;
  guest_email: string;
  check_in: string;
  check_out: string;
  total_price: number;
  status: string;
  room: Room;
  room_id: string;
  hotel_id: string;
}

interface RoomOccupancyCalendarProps {
    hotelId: string;
}

export function RoomOccupancyCalendar({ hotelId }: RoomOccupancyCalendarProps) {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);


  useEffect(() => {
      fetchReservations();
  }, [hotelId]);

    async function fetchReservations() {
         setLoading(true)
          try {
                if (!hotelId) return;

                const { data, error } = await supabase
                    .from('bookings')
                     .select(`
                       id,
                        guest_name,
                        guest_email,
                        check_in,
                        check_out,
                        total_price,
                        status,
                         room_id,
                        hotel_id,
                         rooms (
                           id,
                            name,
                             type
                        )
                    `)
                    .eq('hotel_id', hotelId)
                     .order('check_in', { ascending: true });

                if (error) {
                     console.error("Supabase fetch error:", error);
                    toast.error('Failed to load reservations');
                     setReservations([]);
                     return;
                }
                 if(data){
                    const mappedReservations: Reservation[] = data.map((reservation: any) => ({
                        id: reservation.id,
                         guest_name: reservation.guest_name,
                        guest_email: reservation.guest_email,
                        check_in: reservation.check_in,
                        check_out: reservation.check_out,
                        total_price: reservation.total_price,
                        status: reservation.status,
                         room_id: reservation.room_id,
                         hotel_id: reservation.hotel_id,
                          room: {
                            id: reservation.rooms.id,
                            name: reservation.rooms.name,
                            type: reservation.rooms.type
                         },
                     }));
                    setReservations(mappedReservations);
                }else{
                    setReservations([]);
               }

          } catch (error) {
           console.error('Error fetching reservations:', error);
             toast.error('Failed to load reservations');
             setReservations([]);
         } finally {
           setLoading(false);
         }
    }

   const tileClassName = ({ date, view }: any) => {
     if(view !== 'month') return;

     const isOccupied = reservations.some(reservation => {
          const checkIn = new Date(reservation.check_in);
          const checkOut = new Date(reservation.check_out);
          return date >= checkIn && date <= checkOut;
       });
        if (isOccupied) {
            return 'occupied-day';
        }
    };


   return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Room Occupancy Calendar</h2>
            {loading ? (
                <div className="animate-pulse bg-muted w-full h-64 rounded"></div>
            ) : (
                <ReactCalendar
                   tileClassName={tileClassName}
                />
           )}
        <style>
          {`
             .occupied-day {
                  background-color: #fee2e2;
                  color: #b91c1c;
                 font-weight: bold;
                }
             `}
      </style>
        </div>
    );
}