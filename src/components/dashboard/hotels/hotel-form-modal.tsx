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
}


export function HotelFormModal({ hotel, onClose }: HotelFormModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        console.log("Datos a enviar:", data);
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

            if (error) {
                console.error("Supabase error:", error);
                throw error;
             }
           toast.success("Hotel updated successfully");
            onClose();
            form.reset();
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
                 {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
         </form>
     </FormProvider>
   );
}