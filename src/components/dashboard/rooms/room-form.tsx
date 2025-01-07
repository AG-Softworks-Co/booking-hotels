"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const roomSchema = z.object({
    name: z.string().min(1, 'Room name is required'),
    type: z.string().min(1, 'Room type is required'),
    capacity: z.string().min(1, 'Capacity is required').transform(Number),
    price: z.string().min(1, 'Price per night is required').transform(Number),
   description: z.string().optional(),
});

type RoomForm = z.infer<typeof roomSchema>;

interface RoomFormProps {
  open: boolean;
  onClose: () => void;
  hotelId: string;
}

const roomTypes = [
  'Single',
  'Double',
  'Suite',
  'Deluxe',
  'Presidential Suite'
];

export function RoomForm({ open, onClose, hotelId }: RoomFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const form = useForm<RoomForm>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: '',
      type: '',
      capacity: 2,
      price: 100,
      description: '',
    },
  });

    const onSubmit = async (data: RoomForm) => {
        setIsSubmitting(true);
        console.log('Datos a enviar:', data);
        try {
            const { error } = await supabase.from('rooms').insert({
                hotel_id: hotelId,
                name: data.name,
                type: data.type,
                capacity: data.capacity,
                price: data.price,
                 description: data.description,
            });
            if (error) {
                 console.error("Supabase error:", error);
                throw error;
            }
            toast.success('Room added successfully');
            onClose();
            form.reset();
        } catch (error) {
            toast.error('Error adding room');
            console.error('Error:', error);
            if (error instanceof Error) {
                console.error("Error especifico:", error.message);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Room</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Room Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roomTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="1" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per Night ({formatCurrency(0).substring(0,1)})</FormLabel>
                        <FormControl>
                            <Input {...field} type="number" min="0" step="0.01" />
                         </FormControl>
                        <FormMessage />
                      </FormItem>
                )}
            />
             <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Room'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}