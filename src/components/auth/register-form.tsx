"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';

const registerSchema = z.object({
  hotelName: z.string().min(2, 'Hotel name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { isLoading, signUp } = useAuth();
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterForm) => {
    signUp(data.email, data.password, data.hotelName);
  };

  return (
    <Card className="p-6 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Register Your Hotel</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            {...register('hotelName')}
            placeholder="Hotel Name"
            className="w-full"
            disabled={isLoading}
          />
          {errors.hotelName && (
            <p className="text-sm text-destructive mt-1">{errors.hotelName.message}</p>
          )}
        </div>

        <div>
          <Input
            {...register('email')}
            type="email"
            placeholder="Email"
            className="w-full"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Input
            {...register('password')}
            type="password"
            placeholder="Password"
            className="w-full"
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
    </Card>
  );
}