"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { HotelModal } from './hotel-modal';
import { Loading } from '@/components/loading';

interface Hotel {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    created_at: string;
    updated_at: string;
}

interface HotelListProps {
    hotelAdded: boolean;
}


export function HotelList({hotelAdded} : HotelListProps) {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
    const [loading, setLoading] = useState(true);
    const [hotelChanged, setHotelChanged] = useState(false)
     const [title, setTitle] = useState<string>("Lista de hoteles");


    const fetchHotels = async () => {
         const { data, error } = await supabase
                .from('hotels')
                .select('*');
            if(error) {
                console.error('Error fetching initial hotels', error)
            }else {
                setHotels(data as Hotel[] || []);
                setLoading(false);
                if(data?.length === 0){
                    setTitle("No hotels found")
                }else if(data?.length === 1){
                    setTitle("Hotel")
                } else {
                  setTitle("Lista de hoteles")
                }
            }
    }
      const handleHotelChanged = () => {
        setHotelChanged(!hotelChanged)
    }
    useEffect(() => {
        // Create a Supabase channel
        const hotelsChannel = supabase.channel('realtime hotels')


         fetchHotels() // Fetch initial hotels

          // Listen to changes on hotels table
        hotelsChannel
          .on('postgres_changes',
            { event: '*', schema: 'public', table: 'hotels' },
            (payload) => {
               console.log('Change received!', payload)
                fetchHotels()
             })
            .subscribe()


      return () => {
        supabase.removeChannel(hotelsChannel) // unsubscribe channel on unmount
      }
    }, [hotelAdded, hotelChanged]);


    const handleOpenModal = (hotel: Hotel) => {
        setSelectedHotel(hotel);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedHotel(null);
         setHotelChanged(!hotelChanged)

    };

    return (
      <div>
          <h2 className='text-2xl font-bold mb-4'>{title}</h2>
            {loading ? (
               <Loading />
           ) : hotels.length === 0 ? (
               <></>
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
                     onHotelChanged={handleHotelChanged}
                />
            )}
        </div>
    );
}