import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface Stats {
    totalRooms: number;
    activeReservations: number;
    currentGuests: number;
    monthlyRevenue: number;
    totalHotels: number;
}

interface Booking {
    status: string;
    check_in: string;
    total_price: number;
}

interface Room {
    id: string;
}

interface Hotel {
    id: string;
    owner_id: string;
}

export function useHotelStats() {
    const [stats, setStats] = useState<Stats>({
        totalRooms: 0,
        activeReservations: 0,
        currentGuests: 0,
        monthlyRevenue: 0,
        totalHotels: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    // Efecto para manejar la autenticación
    useEffect(() => {
        const getCurrentUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        getCurrentUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Efecto para obtener las estadísticas
    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);

            if (!user?.id) {
                setIsLoading(false);
                return;
            }

            try {
                // Obtener hoteles del usuario
                const { data: hotels, error: hotelsError } = await supabase
                    .from('hotels')
                    .select('id, owner_id')
                    .eq('owner_id', user.id);

                if (hotelsError || !hotels) {
                    console.error('Error fetching hotels:', hotelsError);
                    setIsLoading(false);
                    return;
                }

                const totalHotels = hotels.length;
                const hotelIds = hotels.map((hotel: Hotel) => hotel.id);

                // Si no hay hoteles, no necesitamos hacer más consultas
                if (hotelIds.length === 0) {
                    setStats({
                        totalRooms: 0,
                        activeReservations: 0,
                        currentGuests: 0,
                        monthlyRevenue: 0,
                        totalHotels: 0,
                    });
                    setIsLoading(false);
                    return;
                }

                // Obtener habitaciones
                const { data: rooms, error: roomsError } = await supabase
                    .from('rooms')
                    .select('id')
                    .in('hotel_id', hotelIds);

                if (roomsError || !rooms) {
                    console.error('Error fetching rooms:', roomsError);
                    setIsLoading(false);
                    return;
                }

                const roomIds = rooms.map((room: Room) => room.id);

                // Si no hay habitaciones, no necesitamos obtener reservas
                if (roomIds.length === 0) {
                    setStats({
                        totalRooms: 0,
                        activeReservations: 0,
                        currentGuests: 0,
                        monthlyRevenue: 0,
                        totalHotels,
                    });
                    setIsLoading(false);
                    return;
                }

                // Obtener reservas
                const { data: bookings, error: bookingsError } = await supabase
                    .from('bookings')
                    .select('*')
                    .in('room_id', roomIds);

                if (bookingsError || !bookings) {
                    console.error('Error fetching bookings:', bookingsError);
                    setIsLoading(false);
                    return;
                }

                // Calcular estadísticas
                const activeReservations = bookings.filter(
                    (booking: Booking) => booking.status === 'confirmed'
                ).length;

                const currentGuests = bookings.reduce((acc: number, booking: Booking) => {
                    if (booking.status === 'confirmed') {
                        return acc + 1;
                    }
                    return acc;
                }, 0);

                const monthlyRevenue = bookings.reduce((acc: number, booking: Booking) => {
                    const checkInDate = new Date(booking.check_in);
                    const currentMonth = new Date().getMonth();

                    if (checkInDate.getMonth() === currentMonth) {
                        return acc + booking.total_price;
                    }
                    return acc;
                }, 0);

                setStats({
                    totalRooms: rooms.length,
                    activeReservations,
                    currentGuests,
                    monthlyRevenue,
                    totalHotels,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [user?.id]);

    return { stats, isLoading };
}