# 🗄️ Datenbank Schema - PostgreSQL + Prisma
# مخطط قاعدة البيانات

---

## Prisma Schema (schema.prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==========================================
// المستخدمون - BENUTZER
// ==========================================

model User {
  id                String    @id @default(uuid())
  email             String    @unique
  phone             String    @unique
  password          String
  firstName         String    @map("first_name")
  lastName          String    @map("last_name")
  profileImage      String?   @map("profile_image")
  role              UserRole  @default(CUSTOMER)
  isActive          Boolean   @default(true) @map("is_active")
  isVerified        Boolean   @default(false) @map("is_verified")
  verificationToken String?   @map("verification_token")
  resetToken        String?   @map("reset_token")
  resetTokenExpiry  DateTime? @map("reset_token_expiry")

  // Adresse
  street            String?
  city              String?
  governorate       String?   // المحافظة
  postalCode        String?   @map("postal_code")

  // Führerschein
  licenseNumber     String?   @map("license_number")
  licenseExpiry     DateTime? @map("license_expiry")
  licenseImage      String?   @map("license_image")
  nationalId        String?   @map("national_id")
  nationalIdImage   String?   @map("national_id_image")

  // Zeitstempel
  createdAt         DateTime  @default(now()) @map("created_at")
  updatedAt         DateTime  @updatedAt @map("updated_at")
  lastLogin         DateTime? @map("last_login")

  // Beziehungen
  bookings          Booking[]
  reviews           Review[]
  favorites         Favorite[]
  notifications     Notification[]
  payments          Payment[]
  supportTickets    SupportTicket[]
  activityLogs      ActivityLog[]

  @@map("users")
}

enum UserRole {
  CUSTOMER    // عميل
  ADMIN       // مسؤول
  SUPER_ADMIN // المسؤول الأعلى
  EMPLOYEE    // موظف
}

// ==========================================
// السيارات - FAHRZEUGE
// ==========================================

model Car {
  id              String      @id @default(uuid())

  // Grundinformationen
  brand           String      // الماركة (Toyota, BMW, etc.)
  model           String      // الموديل
  year            Int         // سنة الصنع
  color           String      // اللون
  licensePlate    String      @unique @map("license_plate") // رقم اللوحة
  vin             String?     @unique // رقم الهيكل

  // Kategorisierung
  category        CarCategory // الفئة
  transmission    Transmission // ناقل الحركة
  fuelType        FuelType    @map("fuel_type") // نوع الوقود

  // Technische Daten
  seats           Int         // عدد المقاعد
  doors           Int         // عدد الأبواب
  engineSize      Float?      @map("engine_size") // حجم المحرك (لتر)
  horsepower      Int?        // القوة (حصان)
  tankCapacity    Float?      @map("tank_capacity") // سعة الخزان (لتر)
  mileage         Int         @default(0) // الكيلومترات

  // Preise (بالليرة السورية)
  pricePerDay     Decimal     @map("price_per_day") @db.Decimal(12, 2)
  pricePerWeek    Decimal?    @map("price_per_week") @db.Decimal(12, 2)
  pricePerMonth   Decimal?    @map("price_per_month") @db.Decimal(12, 2)
  deposit         Decimal     @default(0) @db.Decimal(12, 2) // التأمين

  // Status
  status          CarStatus   @default(AVAILABLE)
  isActive        Boolean     @default(true) @map("is_active")
  isFeatured      Boolean     @default(false) @map("is_featured")

  // Standort
  currentLocation String?     @map("current_location")
  branchId        String?     @map("branch_id")
  branch          Branch?     @relation(fields: [branchId], references: [id])

  // Bilder
  mainImage       String?     @map("main_image")
  images          CarImage[]

  // 3D Modell
  model3dUrl      String?     @map("model_3d_url")

  // Ausstattung
  features        CarFeature[]

  // Wartung
  lastService     DateTime?   @map("last_service")
  nextService     DateTime?   @map("next_service")
  insuranceExpiry DateTime?   @map("insurance_expiry")

  // Zeitstempel
  createdAt       DateTime    @default(now()) @map("created_at")
  updatedAt       DateTime    @updatedAt @map("updated_at")

  // Beziehungen
  bookings        Booking[]
  reviews         Review[]
  favorites       Favorite[]
  maintenanceRecords MaintenanceRecord[]

  @@map("cars")
}

model CarImage {
  id        String   @id @default(uuid())
  carId     String   @map("car_id")
  car       Car      @relation(fields: [carId], references: [id], onDelete: Cascade)
  imageUrl  String   @map("image_url")
  altText   String?  @map("alt_text")
  order     Int      @default(0)
  createdAt DateTime @default(now()) @map("created_at")

  @@map("car_images")
}

model CarFeature {
  id       String  @id @default(uuid())
  carId    String  @map("car_id")
  car      Car     @relation(fields: [carId], references: [id], onDelete: Cascade)
  feature  Feature @relation(fields: [featureId], references: [id])
  featureId String @map("feature_id")

  @@unique([carId, featureId])
  @@map("car_features")
}

model Feature {
  id          String       @id @default(uuid())
  nameAr      String       @map("name_ar") // الاسم بالعربية
  nameEn      String?      @map("name_en") // الاسم بالإنجليزية
  icon        String?      // أيقونة
  category    String?      // فئة الميزة
  cars        CarFeature[]

  @@map("features")
}

enum CarCategory {
  ECONOMY     // اقتصادية
  COMPACT     // صغيرة
  MIDSIZE     // متوسطة
  FULLSIZE    // كبيرة
  LUXURY      // فاخرة
  SUV         // دفع رباعي
  VAN         // فان
  PICKUP      // بيك أب
  SPORTS      // رياضية
  CONVERTIBLE // مكشوفة
}

enum Transmission {
  AUTOMATIC   // أوتوماتيك
  MANUAL      // عادي
}

enum FuelType {
  PETROL      // بنزين
  DIESEL      // ديزل
  HYBRID      // هايبرد
  ELECTRIC    // كهربائي
  LPG         // غاز
}

enum CarStatus {
  AVAILABLE   // متاحة
  RENTED      // مؤجرة
  MAINTENANCE // صيانة
  RESERVED    // محجوزة
  UNAVAILABLE // غير متاحة
}

// ==========================================
// الحجوزات - BUCHUNGEN
// ==========================================

model Booking {
  id              String        @id @default(uuid())
  bookingNumber   String        @unique @map("booking_number") // رقم الحجز

  // Beziehungen
  userId          String        @map("user_id")
  user            User          @relation(fields: [userId], references: [id])
  carId           String        @map("car_id")
  car             Car           @relation(fields: [carId], references: [id])

  // Zeitraum
  startDate       DateTime      @map("start_date")
  endDate         DateTime      @map("end_date")
  actualReturnDate DateTime?    @map("actual_return_date")

  // Orte
  pickupLocation  String        @map("pickup_location")
  returnLocation  String        @map("return_location")
  pickupBranchId  String?       @map("pickup_branch_id")
  returnBranchId  String?       @map("return_branch_id")

  // Preise
  dailyRate       Decimal       @map("daily_rate") @db.Decimal(12, 2)
  totalDays       Int           @map("total_days")
  subtotal        Decimal       @db.Decimal(12, 2)
  extras          Decimal       @default(0) @db.Decimal(12, 2)
  discount        Decimal       @default(0) @db.Decimal(12, 2)
  tax             Decimal       @default(0) @db.Decimal(12, 2)
  totalAmount     Decimal       @map("total_amount") @db.Decimal(12, 2)
  depositAmount   Decimal       @map("deposit_amount") @db.Decimal(12, 2)
  depositReturned Boolean       @default(false) @map("deposit_returned")

  // Status
  status          BookingStatus @default(PENDING)
  paymentStatus   PaymentStatus @default(PENDING) @map("payment_status")

  // Zusatzoptionen
  extras          BookingExtra[]

  // Fahrzeugzustand
  pickupMileage   Int?          @map("pickup_mileage")
  returnMileage   Int?          @map("return_mileage")
  pickupFuel      Int?          @map("pickup_fuel") // Prozent
  returnFuel      Int?          @map("return_fuel")
  pickupCondition String?       @map("pickup_condition")
  returnCondition String?       @map("return_condition")
  pickupPhotos    String[]      @map("pickup_photos")
  returnPhotos    String[]      @map("return_photos")

  // Fahrer (wenn anders als Kunde)
  driverName      String?       @map("driver_name")
  driverLicense   String?       @map("driver_license")
  driverPhone     String?       @map("driver_phone")

  // Notizen
  customerNotes   String?       @map("customer_notes")
  adminNotes      String?       @map("admin_notes")

  // Gutschein
  couponId        String?       @map("coupon_id")
  coupon          Coupon?       @relation(fields: [couponId], references: [id])

  // Zeitstempel
  createdAt       DateTime      @default(now()) @map("created_at")
  updatedAt       DateTime      @updatedAt @map("updated_at")
  confirmedAt     DateTime?     @map("confirmed_at")
  cancelledAt     DateTime?     @map("cancelled_at")
  cancelReason    String?       @map("cancel_reason")

  // Beziehungen
  payments        Payment[]
  review          Review?

  @@map("bookings")
}

model BookingExtra {
  id          String   @id @default(uuid())
  bookingId   String   @map("booking_id")
  booking     Booking  @relation(fields: [bookingId], references: [id], onDelete: Cascade)
  extraId     String   @map("extra_id")
  extra       Extra    @relation(fields: [extraId], references: [id])
  quantity    Int      @default(1)
  pricePerDay Decimal  @map("price_per_day") @db.Decimal(12, 2)
  totalPrice  Decimal  @map("total_price") @db.Decimal(12, 2)

  @@map("booking_extras")
}

model Extra {
  id          String         @id @default(uuid())
  nameAr      String         @map("name_ar")
  nameEn      String?        @map("name_en")
  description String?
  pricePerDay Decimal        @map("price_per_day") @db.Decimal(12, 2)
  icon        String?
  isActive    Boolean        @default(true) @map("is_active")
  bookings    BookingExtra[]

  @@map("extras")
}

enum BookingStatus {
  PENDING     // قيد الانتظار
  CONFIRMED   // مؤكد
  ACTIVE      // نشط (السيارة مع العميل)
  COMPLETED   // مكتمل
  CANCELLED   // ملغي
  NO_SHOW     // لم يحضر
}

enum PaymentStatus {
  PENDING     // قيد الانتظار
  PARTIAL     // جزئي
  PAID        // مدفوع
  REFUNDED    // مسترجع
  FAILED      // فشل
}

// ==========================================
// المدفوعات - ZAHLUNGEN
// ==========================================

model Payment {
  id            String        @id @default(uuid())
  paymentNumber String        @unique @map("payment_number")

  userId        String        @map("user_id")
  user          User          @relation(fields: [userId], references: [id])
  bookingId     String        @map("booking_id")
  booking       Booking       @relation(fields: [bookingId], references: [id])

  amount        Decimal       @db.Decimal(12, 2)
  currency      String        @default("SYP") // ليرة سورية
  method        PaymentMethod
  status        PaymentStatus @default(PENDING)

  transactionId String?       @map("transaction_id")
  receiptUrl    String?       @map("receipt_url")
  notes         String?

  paidAt        DateTime?     @map("paid_at")
  createdAt     DateTime      @default(now()) @map("created_at")
  updatedAt     DateTime      @updatedAt @map("updated_at")

  @@map("payments")
}

enum PaymentMethod {
  CASH          // نقدي
  BANK_TRANSFER // حوالة بنكية
  CREDIT_CARD   // بطاقة ائتمان
  MOBILE_PAYMENT // دفع إلكتروني
}

// ==========================================
// التقييمات - BEWERTUNGEN
// ==========================================

model Review {
  id          String   @id @default(uuid())

  userId      String   @map("user_id")
  user        User     @relation(fields: [userId], references: [id])
  carId       String   @map("car_id")
  car         Car      @relation(fields: [carId], references: [id])
  bookingId   String   @unique @map("booking_id")
  booking     Booking  @relation(fields: [bookingId], references: [id])

  rating      Int      // 1-5 نجوم
  title       String?
  comment     String?

  // Detailbewertungen
  cleanliness Int?     // النظافة
  comfort     Int?     // الراحة
  performance Int?     // الأداء
  value       Int?     // القيمة مقابل السعر

  isApproved  Boolean  @default(false) @map("is_approved")
  isHidden    Boolean  @default(false) @map("is_hidden")

  // Admin Antwort
  adminReply  String?  @map("admin_reply")
  repliedAt   DateTime? @map("replied_at")

  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("reviews")
}

// ==========================================
// المفضلة - FAVORITEN
// ==========================================

model Favorite {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  carId     String   @map("car_id")
  car       Car      @relation(fields: [carId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now()) @map("created_at")

  @@unique([userId, carId])
  @@map("favorites")
}

// ==========================================
// الفروع - FILIALEN
// ==========================================

model Branch {
  id          String   @id @default(uuid())
  nameAr      String   @map("name_ar")
  nameEn      String?  @map("name_en")

  // Adresse
  address     String
  city        String
  governorate String   // المحافظة
  latitude    Float?
  longitude   Float?

  // Kontakt
  phone       String
  email       String?

  // Öffnungszeiten
  openingHours Json?   @map("opening_hours")

  isActive    Boolean  @default(true) @map("is_active")
  isMainBranch Boolean @default(false) @map("is_main_branch")

  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  cars        Car[]

  @@map("branches")
}

// ==========================================
// كوبونات الخصم - GUTSCHEINE
// ==========================================

model Coupon {
  id            String      @id @default(uuid())
  code          String      @unique
  description   String?

  discountType  DiscountType @map("discount_type")
  discountValue Decimal     @map("discount_value") @db.Decimal(12, 2)
  maxDiscount   Decimal?    @map("max_discount") @db.Decimal(12, 2)
  minBooking    Decimal?    @map("min_booking") @db.Decimal(12, 2)

  usageLimit    Int?        @map("usage_limit")
  usedCount     Int         @default(0) @map("used_count")
  userLimit     Int         @default(1) @map("user_limit")

  startDate     DateTime    @map("start_date")
  endDate       DateTime    @map("end_date")
  isActive      Boolean     @default(true) @map("is_active")

  createdAt     DateTime    @default(now()) @map("created_at")
  updatedAt     DateTime    @updatedAt @map("updated_at")

  bookings      Booking[]

  @@map("coupons")
}

enum DiscountType {
  PERCENTAGE  // نسبة مئوية
  FIXED       // مبلغ ثابت
}

// ==========================================
// الصيانة - WARTUNG
// ==========================================

model MaintenanceRecord {
  id          String          @id @default(uuid())
  carId       String          @map("car_id")
  car         Car             @relation(fields: [carId], references: [id])

  type        MaintenanceType
  description String
  cost        Decimal         @db.Decimal(12, 2)
  mileage     Int

  performedAt DateTime        @map("performed_at")
  nextDue     DateTime?       @map("next_due")
  nextMileage Int?            @map("next_mileage")

  vendor      String?
  invoiceNumber String?       @map("invoice_number")
  notes       String?

  createdAt   DateTime        @default(now()) @map("created_at")
  updatedAt   DateTime        @updatedAt @map("updated_at")

  @@map("maintenance_records")
}

enum MaintenanceType {
  OIL_CHANGE      // تغيير زيت
  TIRE_CHANGE     // تغيير إطارات
  BRAKE_SERVICE   // صيانة فرامل
  ENGINE_SERVICE  // صيانة محرك
  AC_SERVICE      // صيانة مكيف
  GENERAL_SERVICE // صيانة عامة
  REPAIR          // إصلاح
  INSPECTION      // فحص
  WASH            // غسيل
  OTHER           // أخرى
}

// ==========================================
// الإشعارات - BENACHRICHTIGUNGEN
// ==========================================

model Notification {
  id          String           @id @default(uuid())
  userId      String           @map("user_id")
  user        User             @relation(fields: [userId], references: [id], onDelete: Cascade)

  type        NotificationType
  title       String
  message     String
  data        Json?

  isRead      Boolean          @default(false) @map("is_read")
  readAt      DateTime?        @map("read_at")

  createdAt   DateTime         @default(now()) @map("created_at")

  @@map("notifications")
}

enum NotificationType {
  BOOKING_CONFIRMED   // تأكيد الحجز
  BOOKING_CANCELLED   // إلغاء الحجز
  BOOKING_REMINDER    // تذكير بالحجز
  PAYMENT_RECEIVED    // استلام الدفع
  REVIEW_REQUEST      // طلب تقييم
  PROMO               // عروض
  SYSTEM              // نظام
}

// ==========================================
// الدعم الفني - SUPPORT
// ==========================================

model SupportTicket {
  id          String       @id @default(uuid())
  ticketNumber String      @unique @map("ticket_number")

  userId      String       @map("user_id")
  user        User         @relation(fields: [userId], references: [id])

  subject     String
  category    TicketCategory
  priority    TicketPriority @default(MEDIUM)
  status      TicketStatus   @default(OPEN)

  messages    TicketMessage[]

  createdAt   DateTime     @default(now()) @map("created_at")
  updatedAt   DateTime     @updatedAt @map("updated_at")
  closedAt    DateTime?    @map("closed_at")

  @@map("support_tickets")
}

model TicketMessage {
  id          String        @id @default(uuid())
  ticketId    String        @map("ticket_id")
  ticket      SupportTicket @relation(fields: [ticketId], references: [id], onDelete: Cascade)

  message     String
  isFromAdmin Boolean       @default(false) @map("is_from_admin")
  attachments String[]

  createdAt   DateTime      @default(now()) @map("created_at")

  @@map("ticket_messages")
}

enum TicketCategory {
  BOOKING     // حجز
  PAYMENT     // دفع
  CAR_ISSUE   // مشكلة في السيارة
  ACCOUNT     // حساب
  COMPLAINT   // شكوى
  SUGGESTION  // اقتراح
  OTHER       // أخرى
}

enum TicketPriority {
  LOW         // منخفض
  MEDIUM      // متوسط
  HIGH        // عالي
  URGENT      // عاجل
}

enum TicketStatus {
  OPEN        // مفتوح
  IN_PROGRESS // قيد المعالجة
  WAITING     // بانتظار الرد
  RESOLVED    // تم الحل
  CLOSED      // مغلق
}

// ==========================================
// سجل النشاط - AKTIVITÄTSLOG
// ==========================================

model ActivityLog {
  id          String   @id @default(uuid())
  userId      String?  @map("user_id")
  user        User?    @relation(fields: [userId], references: [id])

  action      String
  entity      String
  entityId    String?  @map("entity_id")
  details     Json?
  ipAddress   String?  @map("ip_address")
  userAgent   String?  @map("user_agent")

  createdAt   DateTime @default(now()) @map("created_at")

  @@map("activity_logs")
}

// ==========================================
// إعدادات النظام - SYSTEMEINSTELLUNGEN
// ==========================================

model Setting {
  id        String   @id @default(uuid())
  key       String   @unique
  value     Json
  category  String?

  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("settings")
}
```

---

## ➡️ Weiter zu: 03_LANDING_PAGE.md
