"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BedDouble, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RoomForm } from './room-form';
import { cn } from '@/lib/utils';


interface Room {
    id: string;
    name: string;
    type: string;
    capacity: number;
    price: string;
    status: string;
    description: string;
    hotel_id: string;
    updated_at: string
}

interface Hotel {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    created_at: string;
    updated_at: string;
}

interface RoomListProps {
    hotels: Hotel[];
}

export function RoomList({ hotels }: RoomListProps) {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [editStatus, setEditStatus] = useState<'available' | 'unavailable'>('available');
    // State para los campos a editar
    const [editName, setEditName] = useState('');
    const [editType, setEditType] = useState('');
    const [editCapacity, setEditCapacity] = useState<number | null>(null);
    const [editPrice, setEditPrice] = useState('');
     const [editDescription, setEditDescription] = useState('');
    const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
     const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
      const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});



    useEffect(() => {
        fetchRooms();
         if (hotels.length > 0){
          setSelectedHotel(hotels[0])
        }
    }, [hotels]);

    useEffect(() => {
        fetchRooms();
    }, [selectedHotel]);

    async function fetchRooms() {
        try {
            if (!selectedHotel) return
            const { data, error } = await supabase
                .from('rooms')
                .select('*')
                .eq('hotel_id', selectedHotel.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Supabase fetch error:", error);
                toast.error('Failed to load rooms');
                return;
            }
            setRooms(data || []);
            console.log("Supabase fetch data:", data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
            toast.error('Failed to load rooms');
        } finally {
            setIsLoading(false);
        }
    }

    async function deleteRoom(id: string) {
        try {
            console.log("Attempting to delete room with ID:", id);

            const { data, error } = await supabase
                .from('rooms')
                .delete()
                .eq('id', id)
                .select()

            if (error) {
                console.error("Supabase delete error:", error);
                toast.error('Failed to delete room');
                return
            }
            console.log("Supabase delete data:", data);
            toast.success('Room deleted successfully');

        } catch (error) {
            console.error('Error deleting room:', error);
            toast.error('Failed to delete room');
        } finally {
            fetchRooms();
            setOpenDeleteModal(false);
            setRoomToDelete(null);
        }
    }


    async function handleSaveEdit() {
        if (!selectedRoom) return;
        // Validaciones
        const errors: { [key: string]: string } = {};
         if (!editName) {
             errors.name = "Name is required";
         }
        if (!editType) {
            errors.type = "Type is required";
        }
          if (!editCapacity) {
            errors.capacity = "Capacity is required";
        } else if (isNaN(editCapacity)) {
             errors.capacity = "Capacity must be a number";
         }

         if (!editPrice) {
            errors.price = "Price is required";
         } else if (isNaN(Number(editPrice))) {
            errors.price = "Price must be a valid number";
        }
         if (!editDescription) {
             errors.description = "Description is required";
         }

        if (Object.keys(errors).length > 0) {
             setFormErrors(errors);
             return;
         }
        try {
            console.log("Attempting to update room with ID:", selectedRoom.id, "with values:", {
                status: editStatus,
                 name: editName,
                type: editType,
                capacity: editCapacity,
               price: editPrice,
               description: editDescription,
               updated_at: new Date().toISOString(), // Se actualiza el updated_at

            });


             const { data, error } = await supabase
                .from('rooms')
                 .update({
                     status: editStatus,
                     name: editName,
                     type: editType,
                     capacity: editCapacity,
                    price: editPrice,
                     description: editDescription,
                     updated_at: new Date().toISOString(), // Se actualiza el updated_at
                 })
                .eq('id', selectedRoom.id)
                .select()


            if (error) {
                console.error("Supabase update error:", error);
                toast.error('Failed to update room');
                return;
            }

            console.log("Supabase update data:", data);
            toast.success('Room updated successfully');

        }
        catch (error) {
            console.error('Error updating room:', error);
            toast.error('Failed to update room');
        }
        finally {
            fetchRooms();
            setOpenEditModal(false);
            setSelectedRoom(null);
              setFormErrors({});
        }
    }



    const getHotelName = (hotelId: string) => {
        const hotel = hotels.find((hotel) => hotel.id === hotelId);
        return hotel ? hotel.name : 'Unknown Hotel';
    }

    const handleEdit = (room: Room) => {
        setSelectedRoom(room);
        setEditStatus(room.status as 'available' | 'unavailable');
        setEditName(room.name);
        setEditType(room.type);
         setEditCapacity(room.capacity);
        setEditPrice(room.price);
        setEditDescription(room.description)
        setOpenEditModal(true);
    };

    const handleDelete = (room: Room) => {
        setRoomToDelete(room);
        setOpenDeleteModal(true);
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center">
                <h2 className="text-3xl font-semibold mb-8">Loading Rooms...</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="p-6 animate-pulse">
                            <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-muted rounded w-1/2"></div>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-4xl font-bold mt-8 mb-4 text-center">Available Rooms</h2>
             <div className='flex gap-4 w-full max-w-5xl mb-8 justify-center'>
              {hotels.map((hotel) => (
                    <Button key={hotel.id} variant={selectedHotel?.id === hotel.id ? "default" : "outline"} onClick={() => setSelectedHotel(hotel)}>{hotel.name}</Button>
                ))}
                <Button onClick={()=> setOpenAddModal(true)}>Add New Room</Button>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl">
                {rooms.map((room) => (
                    <Card key={room.id} className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <BedDouble className="h-8 w-8 text-primary" />
                                <div>
                                    <h3 className="font-semibold">Room {room.name}</h3>
                                    <p className="text-sm text-muted-foreground">{room.type}</p>
                                     <p className="text-sm text-muted-foreground">Hotel: {getHotelName(room.hotel_id)} </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(room)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(room)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Capacity</span>
                                <span>{room.capacity} persons</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Price per night</span>
                                <span>${Number(room.price).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Status</span>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    room.status === 'available'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                                    }`}>
                                    {room.status}
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                    </DialogHeader>
                    {roomToDelete && (
                        <p className="text-muted-foreground">Are you sure you want to delete this room {roomToDelete.name}?</p>
                    )}
                    <DialogFooter>
                        <Button variant="destructive" onClick={() => roomToDelete && deleteRoom(roomToDelete.id)}>Delete</Button>
                        <DialogClose asChild>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Room Details</DialogTitle>
                    </DialogHeader>
                    {selectedRoom && (
                        <div className="grid gap-4 py-4">
                           <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                 <Input
                                    id="name"
                                    type="text"
                                     value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className={cn({ "border-red-500": formErrors.name })}
                                />
                                 {formErrors.name && (
                                    <p className="text-red-500 text-sm">{formErrors.name}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="type">Type</Label>
                                 <Input
                                    id="type"
                                    type="text"
                                      value={editType}
                                     onChange={(e) => setEditType(e.target.value)}
                                     className={cn({ "border-red-500": formErrors.type })}
                                 />
                                 {formErrors.type && (
                                    <p className="text-red-500 text-sm">{formErrors.type}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="capacity">Capacity</Label>
                                <Input
                                     id="capacity"
                                     type="number"
                                     value={editCapacity !== null ? editCapacity.toString() : ''}
                                     onChange={(e) => setEditCapacity(parseInt(e.target.value, 10))}
                                    className={cn({ "border-red-500": formErrors.capacity })}
                                />
                                {formErrors.capacity && (
                                    <p className="text-red-500 text-sm">{formErrors.capacity}</p>
                                )}
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="price">Price</Label>
                                 <Input
                                    id="price"
                                    type="text"
                                    value={editPrice}
                                    onChange={(e) => setEditPrice(e.target.value)}
                                    className={cn({ "border-red-500": formErrors.price })}

                                />
                                 {formErrors.price && (
                                    <p className="text-red-500 text-sm">{formErrors.price}</p>
                                )}
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                 <Input
                                    id="description"
                                    type="text"
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    className={cn({ "border-red-500": formErrors.description })}

                                />
                                 {formErrors.description && (
                                    <p className="text-red-500 text-sm">{formErrors.description}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={editStatus} onValueChange={value => setEditStatus(value as 'available' | 'unavailable')}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="available">Available</SelectItem>
                                        <SelectItem value="unavailable">Unavailable</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="default" onClick={handleSaveEdit}>Save</Button>
                        <DialogClose asChild>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {selectedHotel && (
                <RoomForm
                open={openAddModal}
                onClose={()=> setOpenAddModal(false)}
                hotelId={selectedHotel.id}
                />
           )}
        </div>
    );
}