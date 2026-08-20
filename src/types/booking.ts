/**
 * Booking Request DTO
 * Sent to Future ASP.NET Core Booking Engine API
 */
export interface CreateBookingRequest {
  tourPackageId: string;
  startDate: string; // ISO format: YYYY-MM-DD
  numberOfParticipants: number;
  contactDetails: {
    fullName: string;
    email: string;
    phone: string;
    passportNumber?: string;
    nationality: string;
  };
  specialRequirements?: string;
  preferredLanguage: 'en' | 'tr';
}

/**
 * Booking Status Enum
 */
export type BookingStatus = 'Pending' | 'Confirmed' | 'PaymentRequired' | 'Cancelled' | 'Completed';

/**
 * Booking Response DTO
 */
export interface BookingConfirmation {
  bookingId: string;
  referenceNumber: string;
  tourPackageId: string;
  status: BookingStatus;
  totalPriceAmount: number;
  currency: string;
  createdAt: string;
  paymentUrl?: string; // Redirect URL for gateway when active
}
