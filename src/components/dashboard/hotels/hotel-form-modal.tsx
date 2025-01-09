"use client";

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';


import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

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
    name: z.string().min(1, "Hotel name is required"),
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
});

type HotelForm = z.infer<typeof hotelSchema>;

interface HotelFormModalProps {
    hotel: Hotel;
    onClose: () => void;
    onHotelChanged: () => void; // Nueva prop para actualizar la lista.
}


export function HotelFormModal({ hotel, onClose, onHotelChanged }: HotelFormModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false)

    const form = useForm<HotelForm>({
        resolver: zodResolver(hotelSchema),
        defaultValues: {
            name: hotel?.name || "",
            email: hotel?.email || "",
            phone: hotel?.phone || "",
            address: hotel?.address || "",
        },
    });

    const onSubmit = async (data: HotelForm) => {
        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from("hotels")
                .update({
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                })
                .eq("id", hotel.id)
                .select('*')
            if (error) {
                console.error("Supabase error:", error);
                throw error;
            }
           toast.success("Hotel updated successfully");
            onClose();
            onHotelChanged();

        } catch (error) {
            toast.error("Error updating hotel");
            console.error("Error:", error);
            if (error instanceof Error) {
                console.error("Error especifico:", error.message);
            }
        } finally {
          setIsSubmitting(false);
        }
    };

       const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const { error } = await supabase
                .from('hotels')
                .delete()
                .eq('id', hotel.id)

            if (error) {
              console.error('Error deleting hotel:', error);
                 throw error;
            }
              toast.success("Hotel deleted successfully");
             onClose();
             onHotelChanged();

        } catch (error) {
             toast.error("Error deleting hotel");
            console.error("Error:", error);
            if (error instanceof Error) {
                console.error("Error específico:", error.message);
            }
        } finally {
           setIsDeleting(false);
        }
    };

    return (
       <FormProvider {...form}>
       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
                control={form.control}
               name="name"
                render={({ field }) => (
                 <FormItem>
                      <FormLabel>Hotel Name</FormLabel>
                     <FormControl>
                         <Input {...field} placeholder="Hotel Name" />
                    </FormControl>
                      <FormMessage />
                </FormItem>
               )}
             />
             <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                   <FormItem>
                       <FormLabel>Email</FormLabel>
                      <FormControl>
                           <Input {...field} type="email" placeholder="Email" />
                        </FormControl>
                      <FormMessage />
                   </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                       <FormLabel>Phone</FormLabel>
                       <FormControl>
                          <Input {...field} placeholder="Phone" />
                        </FormControl>
                        <FormMessage />
                  </FormItem>
                )}
             />
             <FormField
                 control={form.control}
                 name="address"
               render={({ field }) => (
                    <FormItem>
                        <FormLabel>Address</FormLabel>
                       <FormControl>
                        <Input {...field} placeholder="Address" />
                       </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
             />
         <div className="flex justify-end gap-2">
           
               <Button
                 type="submit"
                  disabled={isSubmitting}
                >
                 {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button type="button" variant='destructive' disabled={isDeleting}>
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </AlertDialogTrigger>
               <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete {hotel.name} permanently?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        All data associated with this hotel will be deleted permanently.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                     <AlertDialogAction onClick={handleDelete}>
                            Continue
                     </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            </div>
         </form>
     </FormProvider>
   );
}