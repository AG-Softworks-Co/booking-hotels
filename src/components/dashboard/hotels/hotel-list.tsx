"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { HotelModal } from './hotel-modal';


interface Hotel {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    created_at: string;
    updated_at: string;
}

export function HotelList() {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);


    useEffect(() => {
        async function fetchHotels() {
            const { data, error } = await supabase
                .from('hotels')
                .select('*');

            if (error) {
                console.error('Error fetching hotels:', error);
                return;
            }
            setHotels(data as Hotel[] || []);
        }
        fetchHotels();
    }, []);

    const handleOpenModal = (hotel: Hotel) => {
        setSelectedHotel(hotel);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedHotel(null);
    };

    return (
        <div>
            {hotels.length === 0 ? (
                <p>No hotels found.</p>
            ) : (
                <div className="space-y-2">
                    {hotels.map((hotel) => (
                        <div key={hotel.id} className="flex items-center justify-between border p-3 rounded-lg">
                            <p className="font-medium">{hotel.name}</p>
                            <Button onClick={() => handleOpenModal(hotel)}>View More</Button>
                        </div>
                    ))}
                </div>
            )}
            {selectedHotel && (
                <HotelModal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    hotel={selectedHotel}
                />
            )}
        </div>
    );
}