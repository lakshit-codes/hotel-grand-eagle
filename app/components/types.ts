export interface RoomItem {
    id: string;
    roomNumber: string;
    roomTypeId: string;
    roomTypeName: string;
    floor: number;
    status: "available" | "occupied" | "cleaning" | "maintenance" | "out-of-order" | "blocked";
    isActive: boolean;
    features: string[];
    notes: string;
    lastCleaned: string;
    createdAt: string;
}

export interface Room {
    id: string;
    roomName: string;
    slug: string;
    roomCategory: string;
    bedType: string;
    maxOccupancy: number;
    roomSize: number;
    view: string;
    smokingPolicy: string;
    balconyAvailable: boolean;
    roomTheme: string;
    soundproofingLevel: string;
    inRoomWorkspace: boolean;
    entertainmentOptions: string;
    bathroomType: string;
    floorPreference: string;
    basePrice: number;
    extraBedPrice: number;
    refundable: boolean;
    currency: string;
    amenityIds: string[];
    images: string[];
    roomNumbers?: string[];
}

export interface Availability {
    roomId: string;
    totalRooms: number;
    availableRooms: number;
    minimumStay: number;
    maximumStay: number;
    blackoutDates: string[];
}

export interface SeasonalPrice {
    id: string;
    seasonName: string;
    startDate: string;
    endDate: string;
    price: number;
}

export interface Pricing {
    roomId: string;
    currency: string;
    weekendPricingEnabled: boolean;
    weekendPrice: number;
    seasonalPricing: SeasonalPrice[];
}

export interface AmenityFacility {
    id: string;
    name: string;
}

export interface AmenityCat {
    id: string;
    name: string;
    facilities: AmenityFacility[];
}

export interface Hotel {
    name: string;
    shortDescription: string;
    address: string;
    city: string;
    country: string;
    contactNumber: string;
    email: string;
    checkInTime: string;
    checkOutTime: string;
    starRating: number;
    logoUrl?: string;
    gstNumber?: string;
    website?: string;
    bankDetails?: string;
}

export interface CoGuest {
    id: string;
    name: string;
    aadharNo: string;
    aadharFileUrl?: string;
    nationality: string;
    dob: string;
    dietaryPref: string;
    phone: string;
    isChild?: boolean;
}

export interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    nationality: string;
    aadharNo: string;
    dob: string;
    loyaltyTier: "Bronze" | "Silver" | "Gold" | "Platinum";
    vip: boolean;
    preferredRoom: string;
    dietaryPref: string;
    address: string;
    company: string;
    notes: string;
}

export interface Booking {
    id: string;
    bookingRef: string;
    customerId: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    roomTypeId: string;
    roomTypeName: string;
    roomNumber: string | null;
    checkIn: string;
    checkOut: string;
    nights: number;
    adults: number;
    children: number;
    coGuests: CoGuest[];
    mealPlanId: string;
    mealPlanCode: string;
    totalRoomCost: number;
    totalMealCost: number;
    grandTotal: number;
    currency: string;
    status: "confirmed" | "checked-in" | "checked-out" | "cancelled" | "no-show" | "pending";
    bookingSource: string;
    specialRequests: string;
    earlyCheckIn: boolean;
    lateCheckOut: boolean;
    earlyCheckInTime: string;
    lateCheckOutTime: string;
    checkInActual: string | null;
    checkOutActual: string | null;
    primaryAadharNo?: string;
    primaryAadharFileUrl?: string;
    overrideRoomPrice?: number;
    createdAt: string;
}

export interface MealPlan {
    id: string;
    code: string;
    name: string;
    description: string;
    pricePerPersonPerNight: number;
    active: boolean;
    includedMeals: string[];
}

export interface HousekeepingTask {
    id: string;
    roomTypeId: string;
    roomNumber: string;
    floor: number;
    status: "clean" | "dirty" | "inspected" | "dnd" | "out-of-order";
    priority: "low" | "medium" | "high";
    assignedTo: string;
    lastCleaned: string;
    notes: string;
    updatedAt: string;
}

export interface MaintenanceImage {
    url: string;
    caption: string;
}

export interface MaintenanceComment {
    id: string;
    author: string;
    text: string;
    timestamp: string;
    statusChange?: string;
}

export interface MaintenanceItem {
    id: string;
    roomNumber: string;
    roomTypeId: string;
    issue: string;
    category: string;
    priority: "low" | "medium" | "high";
    status: "open" | "in-progress" | "resolved" | "deferred";
    reportedBy: string;
    assignedTo: string;
    reportedAt: string;
    resolvedAt: string | null;
    notes: string;
    comments: MaintenanceComment[];
    estimatedCost: number;
}

export interface PricingRule {
    id: string;
    roomTypeId: string;
    type: "last_minute" | "early_bird" | "long_stay" | "weekend_surge";
    enabled: boolean;
    label: string;
    threshold: number;
    unit: string;
    discount: number;
}

export type StaffRole = "Front Desk" | "Housekeeping" | "Maintenance" | "F&B" | "Security" | "Management" | "Concierge";
export type StaffShift = "Morning (6AM–2PM)" | "Afternoon (2PM–10PM)" | "Night (10PM–6AM)" | "General (9AM–6PM)";
export type StaffStatus = "Active" | "On Leave" | "Off Duty" | "Resigned";

export interface StaffMember {
    id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    role: StaffRole;
    department: string;
    shift: StaffShift;
    phone: string;
    email: string;
    emergencyContact: string;
    joinDate: string;
    status: StaffStatus;
    notes: string;
    todayAttendance: "present" | "absent" | "late" | "not-marked";
}

export interface LostFoundItem {
    id: string;
    item: string;
    foundLocation: string;
    foundBy: string;
    foundDate: string;
    guestName: string;
    bookingRef: string;
    status: "held" | "claimed" | "discarded";
    notes: string;
}
