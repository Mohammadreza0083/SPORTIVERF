import type { BookingConfirmation, CreateBookingRequest } from '@/types/booking';
import { apiClient } from '@/services/api/ApiClient';

/**
 * Booking Engine Service Interface
 */
export interface IBookingService {
  submitBooking(request: CreateBookingRequest): Promise<BookingConfirmation>;
  getBookingStatus(bookingId: string): Promise<BookingConfirmation | null>;
}

/**
 * Production Booking Engine Service
 * Connects directly to ASP.NET Core API or microservice booking gateway.
 */
export class BookingService implements IBookingService {
  public async submitBooking(request: CreateBookingRequest): Promise<BookingConfirmation> {
    // If backend is active, dispatch to endpoint:
    if (import.meta.env.PUBLIC_API_BASE_URL) {
      const response = await apiClient.post<BookingConfirmation, CreateBookingRequest>(
        '/bookings',
        request
      );
      return response.data;
    }

    // Mock response fallback for offline/static build preview
    return {
      bookingId: `bk-${Date.now()}`,
      referenceNumber: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      tourPackageId: request.tourPackageId,
      status: 'Pending',
      totalPriceAmount: 1200,
      currency: 'USD',
      createdAt: new Date().toISOString()
    };
  }

  public async getBookingStatus(bookingId: string): Promise<BookingConfirmation | null> {
    if (import.meta.env.PUBLIC_API_BASE_URL) {
      const response = await apiClient.get<BookingConfirmation>(`/bookings/${bookingId}`);
      return response.data;
    }
    return null;
  }
}

export const bookingService: IBookingService = new BookingService();
