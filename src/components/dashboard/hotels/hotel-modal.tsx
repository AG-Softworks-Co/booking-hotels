// src/components/dashboard/hotels/hotel-modal.tsx
"use client";
import {
   Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
 } from '@/components/ui/dialog';

import { HotelFormModal } from './hotel-form-modal';

interface HotelModalProps {
  hotel: any; // Aqui indicamos que el hotel tiene el mismo tipo que el Hotel de la lista de hoteles.
  open: boolean;
  onClose: () => void;
}

export function HotelModal({ open, onClose, hotel }: HotelModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hotel Details</DialogTitle>
       </DialogHeader>
        <HotelFormModal hotel={hotel} onClose={onClose} />
     </DialogContent>
    </Dialog>
  );
}