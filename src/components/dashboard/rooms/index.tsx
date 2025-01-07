"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RoomList } from './room-list';
import { RoomForm } from './room-form';
import { Plus, Hotel, Building2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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

const hotelSchema = z.object({
 hotelId: z.string().optional(),
});

type HotelForm = z.infer<typeof hotelSchema>;

export function RoomManagement() {
   const [isAddingRoom, setIsAddingRoom] = useState(false);
    const [hotels, setHotels] = useState<Hotel[]>([]);
     const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  const form = useForm<HotelForm>({
        resolver: zodResolver(hotelSchema),
    });

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

 const handleOpenForm = () => {
      if (!selectedHotel) {
          alert("Please select a hotel");
         return;
      }
       setIsAddingRoom(true);
 };
 const handleSelectHotel = (hotelId: string) => {
   const hotel = hotels.find((hotel) => hotel.id === hotelId) || null;
     setSelectedHotel(hotel);
  };

  const selectedHotelData = hotels.find(hotel => hotel.id === selectedHotel?.id);
  
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
        <div className="flex justify-between items-center border-b pb-6">
             <div>
              <h1 className="text-3xl font-bold text-gray-900">Room Management</h1>
                <p className="text-muted-foreground mt-2">
                    {selectedHotel
                     ? `Managing rooms for ${selectedHotelData?.name}`
                        : "Select a hotel to manage rooms"}
               </p>
            </div>
        </div>

       {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-6">
              {/* Hotels Grid */}
               <div className="md:col-span-2">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Available Hotels</h2>
                     <div className="grid sm:grid-cols-2 gap-4">
                         <FormProvider {...form}>
                           {hotels.map((hotel) => (
                               <Card
                                  key={hotel.id}
                                   className={cn(
                                      "cursor-pointer transition-all hover:shadow-lg border-2",
                                     selectedHotel?.id === hotel.id
                                        ? "border-blue-500 bg-blue-50"
                                      : "border-transparent",
                                )}
                                onClick={() => handleSelectHotel(hotel.id)}
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
                         </FormProvider>
                     </div>
                </div>

                  {/* Add Room Section */}
               <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Room</h2>
                     <Card className="p-6">
                        {!selectedHotel ? (
                         <div className="text-center text-gray-500 py-8">
                              <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                 <p className="text-gray-600 font-medium">Please select a hotel first</p>
                                 <p className="text-sm text-gray-500 mt-2">Choose a hotel from the list to add rooms</p>
                            </div>
                           ) : (
                            <div className="space-y-4">
                                 <p className="text-sm text-gray-600">Selected hotel: {selectedHotelData?.name}</p>
                                  <Button
                                   onClick={handleOpenForm}
                                   className="w-full h-auto py-3 flex items-center justify-center gap-2"
                                >
                                     <Plus className="h-5 w-5" />
                                      Add New Room
                                </Button>
                            </div>
                         )}
                    </Card>
               </div>
           </div>
            {/* Room List Section */}
        <div className="mt-8">
             <RoomList hotels={hotels} />
       </div>
    
        {/* Room Form Modal */}
          {selectedHotel && (
             <RoomForm
                open={isAddingRoom}
              onClose={() => setIsAddingRoom(false)}
             hotelId={selectedHotel.id}
              />
          )}
       </div>
  );
}