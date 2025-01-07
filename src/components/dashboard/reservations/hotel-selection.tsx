"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import {  Hotel } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Hotel {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    created_at: string;
    updated_at: string;
}
interface HotelSelectionProps {
     onHotelSelect: (hotelId: string) => void;
}
export function HotelSelection({ onHotelSelect }: HotelSelectionProps) {
     const [hotels, setHotels] = useState<Hotel[]>([]);
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

   const handleSelectHotel = (hotel: Hotel) => {
       setSelectedHotel(hotel);
        onHotelSelect(hotel.id);
    };
    return (
        <div className="mb-8">
             <h2 className="text-xl font-semibold mb-4 text-gray-800">Available Hotels</h2>
             <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                 {hotels.map((hotel) => (
                       <Card
                            key={hotel.id}
                            onClick={()=> handleSelectHotel(hotel)}
                           className={cn(
                              "cursor-pointer transition-all hover:shadow-lg border-2",
                               selectedHotel?.id === hotel.id
                                 ? "border-blue-500 bg-blue-50"
                                   : "border-transparent",
                         )}
                          >
                            <div className="p-6">
                               <div className="flex items-center space-x-4">
                                  <div className="bg-blue-100 p-3 rounded-lg">
                                     <Hotel className="w-6 h-6 text-blue-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-medium text-lg text-gray-900">{hotel.name}</h3>
                                     <div className="flex flex-col gap-1 mt-2">
                                        {hotel.address && (
                                          <p className="text-gray-500 text-sm">📍 {hotel.address}</p>
                                        )}
                                        {hotel.phone && (
                                           <p className="text-gray-500 text-sm">📞 {hotel.phone}</p>
                                         )}
                                     </div>
                                   </div>
                                </div>
                           </div>
                        </Card>
                ))}
             </div>
        </div>
    );
}