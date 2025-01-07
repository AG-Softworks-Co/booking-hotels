"use client";

import { useState, useEffect } from 'react';
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from "../../ui/calendar";


const reservationSchema = z.object({
    roomId: z.string().min(1, 'Room selection is required'),
    guestName: z.string().min(1, 'Guest name is required'),
    guestEmail: z.string().email('Invalid email address'),
    checkIn: z.date(),
    checkOut: z.date(),
});

type ReservationFormType = z.infer<typeof reservationSchema>;

interface Room {
    id: string;
    name: string;
    type: string;
    price: number;
}

interface ReservationFormProps {
    open: boolean;
    onClose: () => void;
    hotelId: string;
}

export function ReservationForm({ open, onClose, hotelId }: ReservationFormProps) {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [totalPrice, setTotalPrice] = useState<number | null>(null);

    const form = useForm<ReservationFormType>({
        resolver: zodResolver(reservationSchema),
        defaultValues: {
            roomId: '',
            guestName: '',
            guestEmail: '',
            checkIn: new Date(),
            checkOut: new Date(),
        },
    });


    useEffect(() => {
        async function fetchRooms() {
            const { data, error } = await supabase
                .from('rooms')
                .select('id, name, type, price')
                .eq('hotel_id', hotelId)
                .eq('status', 'available');

            if (error) {
                console.error('Error fetching rooms:', error);
                toast.error('Failed to load rooms');
                return;
            }
            setRooms(data || []);
        }
        if (hotelId) {
            fetchRooms();
        }
    }, [hotelId]);


    useEffect(() => {
        const calculatePrice = () => {
           const selectedRoomId = form.getValues('roomId');
            const selectedRoom = rooms.find(room => room.id === selectedRoomId);
            const checkInDate = form.getValues('checkIn');
            const checkOutDate = form.getValues('checkOut');

             console.log("selectedRoom:", selectedRoom);
             console.log("checkInDate:", checkInDate);
             console.log("checkOutDate:", checkOutDate);

             if (selectedRoom && checkInDate && checkOutDate) {
            const nights = Math.ceil(
                    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
                );
                const calculatedPrice = selectedRoom.price * nights;
               console.log("calculatedPrice:", calculatedPrice);
               setTotalPrice(calculatedPrice);
           } else {
             setTotalPrice(null);
            }
        };
      calculatePrice();
  }, [form.watch('roomId'), form.watch('checkIn'), form.watch('checkOut'), rooms]);



    const onSubmit = async (data: ReservationFormType) => {
        setIsSubmitting(true);
        try {
            const selectedRoom = rooms.find(room => room.id === data.roomId);
           if (!selectedRoom) throw new Error('Room not found');

            if(totalPrice === null) throw new Error('Total price could not be calculated');
            const { error } = await supabase.from('bookings').insert({
                hotel_id: hotelId,
                room_id: data.roomId,
                guest_name: data.guestName,
                guest_email: data.guestEmail,
                check_in: data.checkIn.toISOString(),
                check_out: data.checkOut.toISOString(),
                total_price: totalPrice,
               status: 'confirmed',
            });

            if (error) {
                if (typeof error === 'object' && error !== null && 'message' in error) {
                    throw new Error(`Error creating reservation: ${error.message}`);
                } else {
                    throw new Error('Error creating reservation');
                }
            }

            toast.success('Reservation created successfully');
            onClose();
            form.reset();
           setTotalPrice(null);

        } catch (error) {
            let errorMessage = 'An unexpected error occurred';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
            console.error('Error:', error);

        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>New Reservation</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="roomId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Room</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a room" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {rooms.map((room) => (
                                                <SelectItem key={room.id} value={room.id}>
                                                    Room {room.name} - {room.type}
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
                            name="guestName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Guest Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="guestEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Guest Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="email" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="checkIn"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Check-in Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full pl-3 text-left font-normal"
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                     initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="checkOut"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Check-out Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full pl-3 text-left font-normal"
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                      {totalPrice !== null && (
                            <div className="text-right">
                                <p>
                                    Total Price: <span className="font-semibold">${totalPrice}</span>
                                </p>
                            </div>
                        )}

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
                                disabled={isSubmitting || totalPrice === null}
                            >
                                {isSubmitting ? 'Creating...' : 'Create Reservation'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}