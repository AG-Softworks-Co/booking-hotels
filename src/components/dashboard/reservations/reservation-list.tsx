"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, Mail, BedDouble, Trash2 } from 'lucide-react';
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

interface ReservationListProps {
    hotelId: string;
}

export function ReservationList({ hotelId }: ReservationListProps) {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchReservations();
    }, [hotelId]);

    async function fetchReservations() {
        setIsLoading(true);
        try {
            if (!hotelId) return;

            const { data, error } = await supabase
                .from('bookings')
                .select(
                    `
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
              `
                )
                .eq('hotel_id', hotelId)
                .order('check_in', { ascending: true });

            if (error) {
                console.error("Supabase fetch error:", error);
                toast.error('Failed to load reservations');
                setReservations([]);
                return;
            }

            if (data) {
                // Map the results to match the Reservation type
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
                        type: reservation.rooms.type,
                    },
                }));
                setReservations(mappedReservations);
            } else {
                setReservations([]);
            }
        } catch (error) {
            console.error('Error fetching reservations:', error);
            toast.error('Failed to load reservations');
            setReservations([]);
        } finally {
            setIsLoading(false);
        }
    }

    async function deleteReservation(id: string, roomId: string) {
        try {
            const { error } = await supabase.from('bookings').delete().eq('id', id);

            if (error) {
                console.error("Supabase delete error:", error);
                toast.error('Failed to cancel reservation');
                return;
            }
            const { error: updateError } = await supabase
                .from('rooms')
                .update({ status: 'available' })
                .eq('id', roomId);
            if (updateError) {
                console.error("Supabase update error:", updateError);
                toast.error('Failed to update room status');
                return;
            }
            setReservations(reservations.filter(res => res.id !== id));
            toast.success('Reservation cancelled successfully');
        } catch (error) {
            console.error('Error cancelling reservation:', error);
            toast.error('Failed to cancel reservation');
        }
    }


    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-6 animate-pulse">
                        <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reservations &&
                reservations.map((reservation) => (
                    <Card key={reservation.id} className="p-6">
                        <div className="flex flex-col sm:flex-row  items-start justify-between gap-6">
                            <div className="space-y-4 flex-1">
                                <div className="flex items-center gap-4">
                                    <BedDouble className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="font-medium">Room {reservation.room.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {reservation.room.type}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <User className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="font-medium">{reservation.guest_name}</p>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Mail className="h-4 w-4" />
                                            {reservation.guest_email}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm text-muted-foreground">Check-in:</p>
                                            <p className="font-medium">
                                                {format(new Date(reservation.check_in), 'PPP')}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm text-muted-foreground">Check-out:</p>
                                            <p className="font-medium">
                                                {format(new Date(reservation.check_out), 'PPP')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => deleteReservation(reservation.id, reservation.room.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <p className="text-lg font-semibold">${reservation.total_price}</p>
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${reservation.status === 'confirmed'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                                        }`}
                                >
                                    {reservation.status}
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}

            {reservations.length === 0 && (
                <Card className="p-6 text-center text-muted-foreground">
                    No reservations found
                </Card>
            )}
        </div>
    );
}