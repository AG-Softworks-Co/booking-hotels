"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { HotelFormModal } from './hotel-form-modal';


interface Hotel {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    created_at: string;
    updated_at: string;
}

interface HotelModalProps {
    open: boolean;
    onClose: () => void;
    hotel: Hotel;
    onHotelChanged: () => void;
}

export function HotelModal({ open, onClose, hotel, onHotelChanged }: HotelModalProps) {
  return (
        <Dialog open={open} onOpenChange={onClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                 {hotel.name}
              </DialogTitle>
            </DialogHeader>
                <HotelFormModal
                   hotel={hotel}
                   onClose={onClose}
                     onHotelChanged={onHotelChanged}
                />
            </DialogContent>
        </Dialog>
   );
}