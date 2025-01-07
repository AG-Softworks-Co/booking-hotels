export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          hotel_name: string
          email: string
          phone: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          hotel_name: string
          email: string
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          hotel_name?: string
          email?: string
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      rooms: {
        Row: {
          id: string
          profile_id: string
          number: string
          type: string
          capacity: number
          price_per_night: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          number: string
          type: string
          capacity: number
          price_per_night: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          number?: string
          type?: string
          capacity?: number
          price_per_night?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          profile_id: string
          room_id: string
          guest_name: string
          guest_email: string
          check_in: string
          check_out: string
          status: string
          total_price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          room_id: string
          guest_name: string
          guest_email: string
          check_in: string
          check_out: string
          status?: string
          total_price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          room_id?: string
          guest_name?: string
          guest_email?: string
          check_in?: string
          check_out?: string
          status?: string
          total_price?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}