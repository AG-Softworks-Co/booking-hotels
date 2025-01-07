 // src/components/dashboard/hotels/index.tsx
 "use client";
 import { useState } from 'react';
 import { Button } from '@/components/ui/button';
 import { HotelList } from './hotel-list.tsx';
 import { HotelForm } from './hotel-form.tsx';
 import { Plus } from 'lucide-react';

 export function HotelManagement() {
   const [isAddingHotel, setIsAddingHotel] = useState(false);

   return (
     <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h1 className="text-3xl font-bold">Hotel Management</h1>
         <Button
           onClick={() => setIsAddingHotel(true)}
           className="flex items-center gap-2"
         >
           <Plus className="h-4 w-4" />
           Add Hotel
         </Button>
       </div>
   
       <HotelList />

       <HotelForm 
         open={isAddingHotel}
         onClose={() => setIsAddingHotel(false)}
       />
     </div>
   );
 }