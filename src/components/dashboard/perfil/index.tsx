// perfil/index.tsx
"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { cn } from '@/lib/utils';


interface Profile {
    id?: string;
    hotel_name?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    firts_name?: string | null;
    Last_name?: string | null;
    gender?: string | null;
    date_of_birth?: Date | null;
    cedula?: string | null;
}

export function ProfilePage() {
    const [profile, setProfile] = useState<Profile>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [otherGender, setOtherGender] = useState<string>('');
    const [showSaveModal, setShowSaveModal] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .limit(1)
                .single();

            if (error) {
                console.error('Supabase fetch error:', error);
                setProfile({});
            } else {
                setProfile(data || {});
                setOtherGender(data?.gender === 'masculino' || data?.gender === 'femenino' || data?.gender === 'otro' ? '' : data?.gender || '')

                console.log("Supabase fetch data profile:", data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile');
        } finally {
            setIsLoading(false);
        }
    }

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setFormErrors({});
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({ ...prevProfile, [name]: value ? new Date(value) : null }));
    };

    const handleGenderChange = (value: string) => {
        setProfile(prevProfile => ({ ...prevProfile, gender: value }));
    };

    const handleOtherGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtherGender(e.target.value);
        setProfile(prevProfile => ({ ...prevProfile, gender: e.target.value }));
    };

    const handleSaveProfile = async () => {
        const errors: { [key: string]: string } = {};
         if (!profile.firts_name) {
            errors.firts_name = "First Name is required";
          }
         if (!profile.Last_name) {
            errors.last_name = "Last Name is required";
          }
          if (!profile.email) {
              errors.email = "Email is required";
         }

          if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
         }
        try {
            setIsLoading(true);
            if (profile.id) {
                const { data, error } = await supabase
                    .from('profiles')
                    .update({
                        hotel_name: profile.hotel_name,
                        phone: profile.phone,
                        address: profile.address,
                         firts_name: profile.firts_name,
                         Last_name: profile.Last_name,
                        gender: profile.gender,
                        date_of_birth: profile.date_of_birth,
                        cedula: profile.cedula,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', profile.id)
                    .select()
                if (error) {
                    console.error("Supabase update error:", error);
                    toast.error('Failed to update profile');
                } else {
                    console.log("Supabase update profile data:", data);
                    toast.success('Profile updated successfully');
                    setShowSaveModal(true)
                }

            } else {
                const { data, error } = await supabase
                    .from('profiles')
                    .insert({
                        hotel_name: profile.hotel_name,
                        email: profile.email,
                        phone: profile.phone,
                        address: profile.address,
                        firts_name: profile.firts_name,
                         Last_name: profile.Last_name,
                        gender: profile.gender,
                        date_of_birth: profile.date_of_birth,
                        cedula: profile.cedula,
                    })
                    .select()

                if (error) {
                    console.error("Supabase insert error:", error);
                    toast.error('Failed to create profile');
                } else {
                    console.log("Supabase insert profile data:", data);
                   toast.success('Profile created successfully');
                    setShowSaveModal(true)
                }
            }

        } catch (error) {
            console.error('Error saving profile:', error);
            toast.error('Failed to save profile');
        } finally {
            setIsLoading(false);
            setIsEditing(false);
            fetchProfile()
            setFormErrors({});

        }
    };

    const handleCloseSaveModal = () => {
        setShowSaveModal(false);
    };

     const isProfileComplete =
        !!profile.firts_name &&
        !!profile.Last_name &&
        !!profile.email;


    const getSubTitle = () => {
        if (!isProfileComplete) {
            return 'Complete all your information, it is crucial for our performance.';
        }
        return `Has completado tu perfil, ${profile.firts_name}!`;
    }


    const handleDateInput = (date: Date | null | undefined) => {
        if (date instanceof Date) {
            return date.toISOString().split('T')[0];
         } else {
             return '';
         }
     }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center">
                <h2 className="text-3xl font-semibold mb-8">Loading Profile...</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-6 animate-pulse">
                            <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-muted rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
         <div className="flex flex-col items-center justify-center p-6 w-full">
             <div className="flex items-center justify-between w-full max-w-2xl mb-8">
                <h2 className="text-3xl font-bold text-center md:text-4xl">User Profile</h2>
                <Button variant="outline" onClick={handleEditToggle} className="text-sm h-8 px-3 py-1">
                    {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </Button>
            </div>
              <p className="text-muted-foreground  text-center text-sm md:text-base mb-8">
                {getSubTitle()}
            </p>
             <div className="w-full max-w-2xl">
                {isEditing ? (
                    <div className="grid gap-6 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="firts_name" className="text-sm font-medium block">First Name</Label>
                            <Input
                                id="firts_name"
                                type="text"
                                value={profile.firts_name || ''}
                                onChange={handleInputChange}
                                name='firts_name'
                                className={cn("text-sm  focus:border-primary", { "border-red-500": formErrors.firts_name })}
                            />
                              {formErrors.firts_name && (
                                  <p className="text-red-500 text-xs">{formErrors.firts_name}</p>
                              )}
                       </div>
                        <div className="grid gap-2">
                           <Label htmlFor="last_name" className="text-sm font-medium block">Last Name</Label>
                             <Input
                                id="last_name"
                                type="text"
                                value={profile.Last_name || ''}
                                  onChange={handleInputChange}
                                  name='Last_name'
                                  className={cn("text-sm focus:border-primary", { "border-red-500": formErrors.last_name })}
                             />
                              {formErrors.last_name && (
                                   <p className="text-red-500 text-xs">{formErrors.last_name}</p>
                               )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-sm font-medium block">Email</Label>
                            <Input
                                  id="email"
                                  type="text"
                                   value={profile.email || ''}
                                  onChange={handleInputChange}
                                     name='email'
                                    disabled
                                 className={cn("text-sm focus:border-primary", { "border-red-500": formErrors.email })}
                            />
                            {formErrors.email && (
                                 <p className="text-red-500 text-xs">{formErrors.email}</p>
                           )}
                         </div>
                        <div className="grid gap-2">
                           <Label htmlFor="hotel_name" className="text-sm font-medium block">Hotel Name</Label>
                              <Input
                                   id="hotel_name"
                                    type="text"
                                     value={profile.hotel_name || ''}
                                     onChange={handleInputChange}
                                   name='hotel_name'
                                  className="text-sm focus:border-primary"
                             />
                        </div>
                         <div className="grid gap-2">
                           <Label htmlFor="phone" className="text-sm font-medium block">Phone</Label>
                               <Input
                                   id="phone"
                                   type="text"
                                     value={profile.phone || ''}
                                       onChange={handleInputChange}
                                   name='phone'
                                    className="text-sm focus:border-primary"
                                />
                        </div>
                         <div className="grid gap-2">
                           <Label htmlFor="address" className="text-sm font-medium block">Address</Label>
                             <Input
                                 id="address"
                                   type="text"
                                    value={profile.address || ''}
                                      onChange={handleInputChange}
                                   name='address'
                                     className="text-sm focus:border-primary"
                               />
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="gender" className="text-sm font-medium block">Gender</Label>
                            <Select value={profile.gender || ''} onValueChange={handleGenderChange} >
                                 <SelectTrigger className="text-sm  focus:border-primary">
                                        <SelectValue placeholder="Select gender"  />
                                    </SelectTrigger>
                                    <SelectContent>
                                       <SelectItem value="masculino" className="text-sm" >Masculino</SelectItem>
                                       <SelectItem value="femenino" className="text-sm" >Femenino</SelectItem>
                                       <SelectItem value="otro" className="text-sm">Otro</SelectItem>
                                   </SelectContent>
                            </Select>
                             {profile.gender === "otro" && (
                                <Input
                                      id="other_gender"
                                        type="text"
                                        value={otherGender}
                                         onChange={handleOtherGenderChange}
                                          placeholder='Write your gender'
                                        className="text-sm focus:border-primary"
                                  />
                                 )}
                       </div>
                         <div className="grid gap-2">
                            <Label htmlFor="date_of_birth" className="text-sm font-medium block">Date of Birth</Label>
                            <Input
                                   id="date_of_birth"
                                   type="date"
                                   value={handleDateInput(profile.date_of_birth)}
                                      onChange={handleDateChange}
                                   name='date_of_birth'
                                     className="text-sm focus:border-primary"
                             />
                         </div>
                          <div className="grid gap-2">
                               <Label htmlFor="cedula" className="text-sm font-medium block">Cedula</Label>
                                  <Input
                                       id="cedula"
                                      type="text"
                                      value={profile.cedula || ''}
                                      onChange={handleInputChange}
                                        name='cedula'
                                         className="text-sm focus:border-primary"
                                   />
                        </div>
                         <Button variant='default' onClick={handleSaveProfile} className="mt-6 text-sm  w-full">
                           Save Profile
                         </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                         <div className="flex justify-between items-center">
                              <Label className="font-semibold text-sm block">First Name</Label>
                             <span className="text-muted-foreground text-sm">{profile.firts_name || 'Not Set'}</span>
                         </div>
                         <div className="flex justify-between items-center">
                            <Label className="font-semibold text-sm block">Last Name</Label>
                             <span className="text-muted-foreground text-sm">{profile.Last_name || 'Not Set'}</span>
                        </div>
                       <div className="flex justify-between items-center">
                          <Label className="font-semibold text-sm block">Email</Label>
                            <span className="text-muted-foreground text-sm">{profile.email || 'Not Set'}</span>
                       </div>
                       <div className="flex justify-between items-center">
                           <Label className="font-semibold text-sm block">Hotel Name</Label>
                             <span className="text-muted-foreground text-sm">{profile.hotel_name || 'Not Set'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <Label className="font-semibold text-sm block">Phone</Label>
                           <span className="text-muted-foreground text-sm">{profile.phone || 'Not Set'}</span>
                       </div>
                        <div className="flex justify-between items-center">
                            <Label className="font-semibold text-sm block">Address</Label>
                            <span className="text-muted-foreground text-sm">{profile.address || 'Not Set'}</span>
                         </div>
                         <div className="flex justify-between items-center">
                             <Label className="font-semibold text-sm block">Gender</Label>
                           <span className="text-muted-foreground text-sm">{profile.gender || 'Not Set'}</span>
                         </div>
                       <div className="flex justify-between items-center">
                          <Label className="font-semibold text-sm block">Date of Birth</Label>
                             <span className="text-muted-foreground text-sm">
                                 {profile.date_of_birth instanceof Date ? profile.date_of_birth.toLocaleDateString() : 'Not Set'}
                              </span>
                         </div>
                         <div className="flex justify-between items-center">
                             <Label className="font-semibold text-sm block">Cedula</Label>
                            <span className="text-muted-foreground text-sm">{profile.cedula || 'Not Set'}</span>
                       </div>
                    </div>
                )}
            </div>
           <Dialog open={showSaveModal} onOpenChange={setShowSaveModal}>
                 <DialogContent>
                     <DialogHeader>
                       <DialogTitle>Profile Updated</DialogTitle>
                    </DialogHeader>
                    <p className="text-muted-foreground">
                          Your profile information has been saved successfully
                    </p>
                   <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="secondary" onClick={handleCloseSaveModal}>Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}