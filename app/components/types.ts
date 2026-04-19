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
    status: "Available" | "Closed" | "Fully Booked" | "On Request";
    bookedCount: number;
    maintenanceCount: number;
    totalCount: number;
    overbookingLimit: number;
    instantBooking: boolean;
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
    loyaltyTier?: "Bronze" | "Silver" | "Gold" | "Platinum";
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

export interface LegalSection {
    id: string;
    type: "legal-block";
    heading: string;
    description: string;
}

export interface NearbyPlace {
    id: string;
    name: string;
    description: string;
    distance: string;
    image: string;
    lat?: number;
    lng?: number;
    createdAt: string;
}

export interface PageBlock {
    id: string;
    type: string;
    layout: string;
    adminTitle?: string;
    content: any[];
    columns?: any[][];
}

// ── About Page CMS types ──────────────────────────────────────────────────────

export interface AboutStat {
    id: string;
    value: string;   // e.g. "24+"
    label: string;   // e.g. "Years of Luxury"
}

export interface TextImageSection {
    id: string;
    type: "text-image";
    heading: string;
    subheading?: string;
    description: string;        // full paragraph text
    highlightTerms: string;     // comma-separated terms to auto-bold in gold
    image: string;              // URL or data URI
    imagePosition: "left" | "right";
    stats: AboutStat[];
}

export interface QuoteSection {
    id: string;
    type: "quote";
    eyebrow: string;
    text: string;
}

export type AboutSection = TextImageSection | QuoteSection;

export interface CMSPage {
    id: string;
    title: string;
    slug: string;
    subtitle?: string;              // eyebrow / tagline (e.g. "Our Heritage")
    sections?: (AboutSection | LegalSection)[];      // used by About & Legal CMS
    content: PageBlock[];
    metaTitle?: string;
    metaDescription?: string;
    image?: string;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

// ── Home Page CMS types ───────────────────────────────────────────────────────

export interface HomeStat {
    id: string;
    value: string;   // e.g. "24+"
    label: string;   // e.g. "Years of Excellence"
}

export interface HomePillar {
    id: string;
    icon: string;    // Emoji or icon name
    title: string;
    desc: string;
}

export interface HeroSection {
    id: string;
    type: "hero";
    title: string;              // Main headline e.g. "Smart, Simple"
    titleEm: string;            // Italic/gold word e.g. "Comfort"
    subtitle: string;           // Paragraph below headline
    primaryButtonLabel: string;
    primaryButtonLink: string;
    secondaryButtonLabel: string;
    secondaryButtonLink: string;
    images: { url: string }[];  // Slider images
    stats: HomeStat[];          // Stats shown below hero content
}

export interface HomeTextSection {
    id: string;
    type: "text-image";
    heading: string;
    subheading?: string;
    description: string;
    highlightTerms: string;
    images: { url: string }[]; // Changed from single image for "Add Images" support
    imagePosition: "left" | "right";
    stats: HomeStat[];
    pillars?: HomePillar[];
}

export interface HomeQuoteSection {
    id: string;
    type: "quote";
    eyebrow: string;
    text: string;
}

export interface HomeTestimonialsSection {
    id: string;
    type: "testimonials";
    eyebrow: string;
    heading: string;
    headingEm: string;
}

export type HomeSection = HeroSection | HomeTextSection | HomeQuoteSection | HomeTestimonialsSection;

export interface GalleryImage {
    id: string;
    url: string;
    label: string;
    order: number;
    createdAt: string;
}

export interface Testimonial {
    id: string;
    name: string;
    // role: string;      // Removed for simplification
    location: string;
    text: string;
    rating: number;
    // img: string;       // Removed for simplification
    isActive: boolean;
    stayDate: string;     // Added: format YYYY-MM
    createdAt: string;
}
