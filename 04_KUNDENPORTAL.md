# 👤 بوابة العملاء - Kundenportal
# Customer Portal - Vollständige Spezifikation

---

## 🔐 Authentifizierung (المصادقة)

### 1. Registrierung (التسجيل)

```tsx
// pages/auth/Register.tsx

interface RegisterFormData {
  firstName: string;        // الاسم الأول
  lastName: string;         // الكنية
  email: string;            // البريد الإلكتروني
  phone: string;            // رقم الهاتف (+963)
  password: string;         // كلمة المرور
  confirmPassword: string;  // تأكيد كلمة المرور
  governorate: string;      // المحافظة
  acceptTerms: boolean;     // الموافقة على الشروط
}

/*
الميزات:
✓ التحقق من صحة البيانات في الوقت الفعلي
✓ قوة كلمة المرور (مؤشر بصري)
✓ التحقق من رقم الهاتف السوري
✓ رسالة تأكيد بالبريد الإلكتروني
✓ تسجيل عبر واتساب (OTP)
✓ حماية reCAPTCHA
*/

const RegisterPage = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* صورة جانبية */}
        <div className="auth-image">
          <img src="/images/auth-bg.jpg" alt="" />
          <div className="auth-overlay">
            <h2>مرحباً بك في خدمة تأجير السيارات</h2>
            <p>سجّل الآن واحصل على عروض حصرية</p>
          </div>
        </div>

        {/* نموذج التسجيل */}
        <div className="auth-form-container">
          <div className="auth-header">
            <Logo />
            <h1>إنشاء حساب جديد</h1>
            <p>أدخل بياناتك للتسجيل</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="form-row">
              <FormField
                label="الاسم الأول"
                name="firstName"
                register={register}
                error={errors.firstName}
                placeholder="أدخل اسمك"
              />
              <FormField
                label="الكنية"
                name="lastName"
                register={register}
                error={errors.lastName}
                placeholder="أدخل كنيتك"
              />
            </div>

            <FormField
              label="البريد الإلكتروني"
              name="email"
              type="email"
              register={register}
              error={errors.email}
              placeholder="example@email.com"
              icon={<MailIcon />}
            />

            <FormField
              label="رقم الهاتف"
              name="phone"
              type="tel"
              register={register}
              error={errors.phone}
              placeholder="+963 9XX XXX XXX"
              icon={<PhoneIcon />}
            />

            <FormField
              label="المحافظة"
              name="governorate"
              type="select"
              options={governorates}
              register={register}
              error={errors.governorate}
            />

            <FormField
              label="كلمة المرور"
              name="password"
              type="password"
              register={register}
              error={errors.password}
              icon={<LockIcon />}
            />
            <PasswordStrengthMeter password={watch('password')} />

            <FormField
              label="تأكيد كلمة المرور"
              name="confirmPassword"
              type="password"
              register={register}
              error={errors.confirmPassword}
              icon={<LockIcon />}
            />

            <div className="form-checkbox">
              <input type="checkbox" {...register('acceptTerms')} id="terms" />
              <label htmlFor="terms">
                أوافق على <Link to="/terms">الشروط والأحكام</Link>
              </label>
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? <Spinner /> : 'إنشاء حساب'}
            </button>
          </form>

          <div className="auth-footer">
            <p>لديك حساب بالفعل؟ <Link to="/login">تسجيل الدخول</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### 2. تسجيل الدخول (Login)

```tsx
// pages/auth/Login.tsx

interface LoginFormData {
  emailOrPhone: string;
  password: string;
  rememberMe: boolean;
}

const LoginPage = () => {
  return (
    <div className="auth-page">
      <form className="auth-form">
        <FormField
          label="البريد الإلكتروني أو رقم الهاتف"
          name="emailOrPhone"
          register={register}
          error={errors.emailOrPhone}
          icon={<UserIcon />}
        />

        <FormField
          label="كلمة المرور"
          name="password"
          type="password"
          register={register}
          error={errors.password}
          icon={<LockIcon />}
        />

        <div className="form-options">
          <div className="form-checkbox">
            <input type="checkbox" {...register('rememberMe')} id="remember" />
            <label htmlFor="remember">تذكرني</label>
          </div>
          <Link to="/forgot-password" className="forgot-link">
            نسيت كلمة المرور؟
          </Link>
        </div>

        <button type="submit" className="submit-btn">
          تسجيل الدخول
        </button>

        <div className="divider">
          <span>أو</span>
        </div>

        <button type="button" className="social-btn whatsapp">
          <WhatsAppIcon />
          الدخول عبر واتساب
        </button>
      </form>
    </div>
  );
};
```

### 3. استعادة كلمة المرور

```tsx
// pages/auth/ForgotPassword.tsx
// pages/auth/ResetPassword.tsx

/*
الخطوات:
1. إدخال البريد الإلكتروني أو رقم الهاتف
2. استلام رمز التحقق (OTP) عبر SMS أو Email
3. إدخال رمز التحقق
4. تعيين كلمة مرور جديدة
*/
```

---

## 🏠 لوحة تحكم العميل (Customer Dashboard)

### Layout الرئيسي

```tsx
// layouts/CustomerLayout.tsx

const CustomerLayout = () => {
  return (
    <div className="customer-layout">
      {/* Sidebar */}
      <aside className="customer-sidebar">
        <div className="sidebar-header">
          <UserAvatar user={user} size="large" />
          <h3>{user.firstName} {user.lastName}</h3>
          <span className="member-since">عضو منذ {formatDate(user.createdAt)}</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/customer/dashboard">
            <DashboardIcon />
            لوحة التحكم
          </NavLink>
          <NavLink to="/customer/bookings">
            <CarIcon />
            حجوزاتي
          </NavLink>
          <NavLink to="/customer/favorites">
            <HeartIcon />
            المفضلة
          </NavLink>
          <NavLink to="/customer/payments">
            <CreditCardIcon />
            المدفوعات
          </NavLink>
          <NavLink to="/customer/reviews">
            <StarIcon />
            تقييماتي
          </NavLink>
          <NavLink to="/customer/support">
            <SupportIcon />
            الدعم الفني
          </NavLink>
          <NavLink to="/customer/notifications">
            <BellIcon />
            الإشعارات
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </NavLink>
          <NavLink to="/customer/profile">
            <SettingsIcon />
            الملف الشخصي
          </NavLink>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <LogoutIcon />
          تسجيل الخروج
        </button>
      </aside>

      {/* Main Content */}
      <main className="customer-main">
        <header className="customer-header">
          <div className="header-search">
            <SearchIcon />
            <input type="text" placeholder="بحث..." />
          </div>
          <div className="header-actions">
            <NotificationDropdown />
            <UserDropdown />
          </div>
        </header>

        <div className="customer-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
```

### صفحة لوحة التحكم الرئيسية

```tsx
// pages/customer/Dashboard.tsx

const CustomerDashboard = () => {
  const { data: stats } = useCustomerStats();
  const { data: activeBookings } = useActiveBookings();
  const { data: recentActivity } = useRecentActivity();

  return (
    <div className="customer-dashboard">
      <h1>مرحباً، {user.firstName}! 👋</h1>

      {/* البطاقات الإحصائية */}
      <div className="stats-grid">
        <StatCard
          icon={<CarIcon />}
          label="إجمالي الحجوزات"
          value={stats?.totalBookings || 0}
          color="blue"
        />
        <StatCard
          icon={<CheckCircleIcon />}
          label="الحجوزات المكتملة"
          value={stats?.completedBookings || 0}
          color="green"
        />
        <StatCard
          icon={<ClockIcon />}
          label="الحجوزات النشطة"
          value={stats?.activeBookings || 0}
          color="orange"
        />
        <StatCard
          icon={<CurrencyIcon />}
          label="إجمالي الإنفاق"
          value={formatPrice(stats?.totalSpent || 0)}
          color="purple"
        />
      </div>

      {/* الحجز النشط الحالي */}
      {activeBookings?.length > 0 && (
        <section className="active-booking-section">
          <h2>حجزك الحالي</h2>
          <ActiveBookingCard booking={activeBookings[0]} />
        </section>
      )}

      {/* الحجوزات القادمة */}
      <section className="upcoming-bookings">
        <div className="section-header">
          <h2>الحجوزات القادمة</h2>
          <Link to="/customer/bookings">عرض الكل</Link>
        </div>
        <div className="bookings-list">
          {upcomingBookings?.map((booking) => (
            <BookingCard key={booking.id} booking={booking} compact />
          ))}
        </div>
      </section>

      {/* النشاط الأخير */}
      <section className="recent-activity">
        <h2>النشاط الأخير</h2>
        <ActivityTimeline activities={recentActivity} />
      </section>

      {/* إجراءات سريعة */}
      <section className="quick-actions">
        <h2>إجراءات سريعة</h2>
        <div className="actions-grid">
          <QuickActionCard
            icon={<SearchIcon />}
            title="ابحث عن سيارة"
            to="/cars"
          />
          <QuickActionCard
            icon={<SupportIcon />}
            title="تواصل مع الدعم"
            to="/customer/support"
          />
          <QuickActionCard
            icon={<FileTextIcon />}
            title="الفواتير"
            to="/customer/payments"
          />
        </div>
      </section>
    </div>
  );
};
```

---

## 📋 إدارة الحجوزات (Bookings Management)

### قائمة الحجوزات

```tsx
// pages/customer/Bookings.tsx

const CustomerBookings = () => {
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');
  const { data: bookings, isLoading } = useCustomerBookings(filter);

  return (
    <div className="bookings-page">
      <PageHeader
        title="حجوزاتي"
        subtitle="إدارة جميع حجوزاتك"
      />

      {/* فلاتر */}
      <div className="bookings-filters">
        <TabFilter
          options={[
            { value: 'all', label: 'الكل' },
            { value: 'PENDING', label: 'قيد الانتظار' },
            { value: 'CONFIRMED', label: 'مؤكدة' },
            { value: 'ACTIVE', label: 'نشطة' },
            { value: 'COMPLETED', label: 'مكتملة' },
            { value: 'CANCELLED', label: 'ملغاة' },
          ]}
          value={filter}
          onChange={setFilter}
        />

        <div className="view-toggle">
          <button className={viewMode === 'grid' ? 'active' : ''}>
            <GridIcon />
          </button>
          <button className={viewMode === 'list' ? 'active' : ''}>
            <ListIcon />
          </button>
        </div>
      </div>

      {/* قائمة الحجوزات */}
      {isLoading ? (
        <BookingsSkeleton />
      ) : bookings?.length === 0 ? (
        <EmptyState
          icon={<CarIcon />}
          title="لا توجد حجوزات"
          description="لم تقم بأي حجز بعد"
          action={
            <Link to="/cars" className="primary-btn">
              ابحث عن سيارة
            </Link>
          }
        />
      ) : (
        <div className={`bookings-${viewMode}`}>
          {bookings?.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};
```

### بطاقة الحجز

```tsx
// components/customer/BookingCard.tsx

const BookingCard = ({ booking }: { booking: Booking }) => {
  const statusConfig = getBookingStatusConfig(booking.status);

  return (
    <div className="booking-card">
      {/* صورة السيارة */}
      <div className="booking-car-image">
        <img src={booking.car.mainImage} alt={booking.car.model} />
        <span className={`status-badge ${statusConfig.color}`}>
          {statusConfig.label}
        </span>
      </div>

      {/* تفاصيل الحجز */}
      <div className="booking-details">
        <div className="booking-header">
          <h3>{booking.car.brand} {booking.car.model}</h3>
          <span className="booking-number">#{booking.bookingNumber}</span>
        </div>

        <div className="booking-dates">
          <div className="date-item">
            <CalendarIcon />
            <div>
              <span className="label">الاستلام</span>
              <span className="value">{formatDate(booking.startDate)}</span>
              <span className="location">{booking.pickupLocation}</span>
            </div>
          </div>
          <div className="date-separator">
            <ArrowLeftIcon />
            <span>{booking.totalDays} يوم</span>
          </div>
          <div className="date-item">
            <CalendarIcon />
            <div>
              <span className="label">الإرجاع</span>
              <span className="value">{formatDate(booking.endDate)}</span>
              <span className="location">{booking.returnLocation}</span>
            </div>
          </div>
        </div>

        <div className="booking-price">
          <span className="total-label">الإجمالي</span>
          <span className="total-amount">{formatPrice(booking.totalAmount)}</span>
        </div>

        {/* الإجراءات */}
        <div className="booking-actions">
          <Link to={`/customer/bookings/${booking.id}`} className="view-btn">
            عرض التفاصيل
          </Link>

          {booking.status === 'PENDING' && (
            <button className="cancel-btn" onClick={() => handleCancel(booking.id)}>
              إلغاء الحجز
            </button>
          )}

          {booking.status === 'CONFIRMED' && (
            <button className="modify-btn" onClick={() => handleModify(booking.id)}>
              تعديل الحجز
            </button>
          )}

          {booking.status === 'COMPLETED' && !booking.review && (
            <button className="review-btn" onClick={() => openReviewModal(booking)}>
              أضف تقييم
            </button>
          )}

          {booking.status === 'COMPLETED' && (
            <button className="rebook-btn" onClick={() => handleRebook(booking)}>
              احجز مجدداً
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
```

### تفاصيل الحجز

```tsx
// pages/customer/BookingDetails.tsx

const BookingDetails = () => {
  const { id } = useParams();
  const { data: booking, isLoading } = useBooking(id);

  if (isLoading) return <BookingDetailsSkeleton />;

  return (
    <div className="booking-details-page">
      <PageHeader
        title={`حجز #${booking.bookingNumber}`}
        backLink="/customer/bookings"
      />

      <div className="booking-details-grid">
        {/* معلومات السيارة */}
        <section className="car-info-section">
          <h2>معلومات السيارة</h2>
          <div className="car-info-card">
            <img src={booking.car.mainImage} alt="" />
            <div className="car-info">
              <h3>{booking.car.brand} {booking.car.model} {booking.car.year}</h3>
              <div className="car-specs">
                <span><UsersIcon /> {booking.car.seats} مقاعد</span>
                <span><GearIcon /> {getTransmissionName(booking.car.transmission)}</span>
                <span><FuelIcon /> {getFuelName(booking.car.fuelType)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* تفاصيل الحجز */}
        <section className="booking-info-section">
          <h2>تفاصيل الحجز</h2>

          <div className="info-grid">
            <InfoItem
              icon={<CalendarIcon />}
              label="تاريخ الاستلام"
              value={formatDateTime(booking.startDate)}
            />
            <InfoItem
              icon={<CalendarIcon />}
              label="تاريخ الإرجاع"
              value={formatDateTime(booking.endDate)}
            />
            <InfoItem
              icon={<MapPinIcon />}
              label="موقع الاستلام"
              value={booking.pickupLocation}
            />
            <InfoItem
              icon={<MapPinIcon />}
              label="موقع الإرجاع"
              value={booking.returnLocation}
            />
            <InfoItem
              icon={<ClockIcon />}
              label="مدة الإيجار"
              value={`${booking.totalDays} يوم`}
            />
            <InfoItem
              icon={<StatusIcon />}
              label="حالة الحجز"
              value={
                <StatusBadge status={booking.status} />
              }
            />
          </div>
        </section>

        {/* تفاصيل الدفع */}
        <section className="payment-section">
          <h2>تفاصيل الدفع</h2>

          <div className="payment-breakdown">
            <div className="payment-row">
              <span>السعر اليومي</span>
              <span>{formatPrice(booking.dailyRate)}</span>
            </div>
            <div className="payment-row">
              <span>عدد الأيام</span>
              <span>× {booking.totalDays}</span>
            </div>
            <div className="payment-row">
              <span>المجموع الفرعي</span>
              <span>{formatPrice(booking.subtotal)}</span>
            </div>

            {booking.extras > 0 && (
              <div className="payment-row">
                <span>الإضافات</span>
                <span>{formatPrice(booking.extras)}</span>
              </div>
            )}

            {booking.discount > 0 && (
              <div className="payment-row discount">
                <span>الخصم</span>
                <span>-{formatPrice(booking.discount)}</span>
              </div>
            )}

            <div className="payment-row tax">
              <span>الضريبة</span>
              <span>{formatPrice(booking.tax)}</span>
            </div>

            <div className="payment-row total">
              <span>الإجمالي</span>
              <span>{formatPrice(booking.totalAmount)}</span>
            </div>

            <div className="payment-row deposit">
              <span>التأمين (مسترد)</span>
              <span>{formatPrice(booking.depositAmount)}</span>
            </div>
          </div>

          <div className="payment-status">
            <PaymentStatusBadge status={booking.paymentStatus} />
          </div>
        </section>

        {/* الإضافات */}
        {booking.bookingExtras?.length > 0 && (
          <section className="extras-section">
            <h2>الإضافات</h2>
            <ul className="extras-list">
              {booking.bookingExtras.map((extra) => (
                <li key={extra.id}>
                  <span>{extra.extra.nameAr}</span>
                  <span>{formatPrice(extra.totalPrice)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* الجدول الزمني */}
        <section className="timeline-section">
          <h2>سجل الحجز</h2>
          <BookingTimeline booking={booking} />
        </section>
      </div>

      {/* إجراءات */}
      <div className="booking-actions-footer">
        {booking.status === 'PENDING' && (
          <>
            <button className="secondary-btn" onClick={handleCancel}>
              إلغاء الحجز
            </button>
            <button className="primary-btn" onClick={handlePay}>
              الدفع الآن
            </button>
          </>
        )}

        {booking.status === 'CONFIRMED' && (
          <button className="secondary-btn" onClick={handleModify}>
            تعديل الحجز
          </button>
        )}

        <button className="outline-btn" onClick={handleDownloadInvoice}>
          <DownloadIcon />
          تحميل الفاتورة
        </button>

        <button className="outline-btn" onClick={handleContactSupport}>
          <SupportIcon />
          تواصل مع الدعم
        </button>
      </div>
    </div>
  );
};
```

---

## 🚗 صفحة حجز سيارة جديدة (New Booking Flow)

### الخطوة 1: اختيار السيارة والتواريخ

```tsx
// pages/booking/Step1-SelectCar.tsx

const BookingStep1 = () => {
  return (
    <div className="booking-step">
      <BookingProgress currentStep={1} />

      <div className="booking-content">
        {/* تفاصيل السيارة */}
        <div className="selected-car">
          <Car3DViewer modelUrl={car.model3dUrl} />
          <CarDetails car={car} />
        </div>

        {/* نموذج التواريخ */}
        <div className="booking-form">
          <h2>اختر التواريخ والموقع</h2>

          <FormField
            label="موقع الاستلام"
            name="pickupLocation"
            type="select"
            options={branches}
          />

          <div className="form-checkbox">
            <input
              type="checkbox"
              checked={sameLocation}
              onChange={(e) => setSameLocation(e.target.checked)}
            />
            <label>الإرجاع لنفس الموقع</label>
          </div>

          {!sameLocation && (
            <FormField
              label="موقع الإرجاع"
              name="returnLocation"
              type="select"
              options={branches}
            />
          )}

          <div className="date-picker-row">
            <FormField
              label="تاريخ الاستلام"
              name="pickupDate"
              type="date"
            />
            <FormField
              label="وقت الاستلام"
              name="pickupTime"
              type="time"
            />
          </div>

          <div className="date-picker-row">
            <FormField
              label="تاريخ الإرجاع"
              name="returnDate"
              type="date"
            />
            <FormField
              label="وقت الإرجاع"
              name="returnTime"
              type="time"
            />
          </div>

          {/* ملخص السعر */}
          <PriceSummary
            dailyRate={car.pricePerDay}
            days={totalDays}
          />
        </div>
      </div>

      <div className="booking-navigation">
        <button className="back-btn" onClick={goBack}>السابق</button>
        <button className="next-btn" onClick={goNext}>التالي</button>
      </div>
    </div>
  );
};
```

### الخطوة 2: الإضافات والتأمين

```tsx
// pages/booking/Step2-Extras.tsx

const BookingStep2 = () => {
  return (
    <div className="booking-step">
      <BookingProgress currentStep={2} />

      <div className="extras-grid">
        <h2>اختر الإضافات</h2>

        {extras.map((extra) => (
          <ExtraCard
            key={extra.id}
            extra={extra}
            selected={selectedExtras.includes(extra.id)}
            onToggle={() => toggleExtra(extra.id)}
          />
        ))}
      </div>

      {/* خيارات التأمين */}
      <div className="insurance-section">
        <h2>خيارات التأمين</h2>

        <InsuranceOption
          type="basic"
          title="التأمين الأساسي"
          description="يغطي الأضرار الأساسية للسيارة"
          price={0}
          included
        />

        <InsuranceOption
          type="full"
          title="التأمين الشامل"
          description="تغطية كاملة بدون تحمّل"
          price={25000}
          selected={insurance === 'full'}
          onSelect={() => setInsurance('full')}
        />
      </div>
    </div>
  );
};
```

### الخطوة 3: بيانات السائق

```tsx
// pages/booking/Step3-DriverInfo.tsx

const BookingStep3 = () => {
  return (
    <div className="booking-step">
      <BookingProgress currentStep={3} />

      <div className="driver-form">
        <h2>بيانات السائق</h2>

        <div className="form-option">
          <input
            type="radio"
            name="driver"
            value="self"
            checked={driverType === 'self'}
            onChange={() => setDriverType('self')}
          />
          <label>أنا السائق</label>
        </div>

        <div className="form-option">
          <input
            type="radio"
            name="driver"
            value="other"
            checked={driverType === 'other'}
            onChange={() => setDriverType('other')}
          />
          <label>سائق آخر</label>
        </div>

        {driverType === 'other' && (
          <div className="other-driver-form">
            <FormField label="اسم السائق" name="driverName" />
            <FormField label="رقم الهاتف" name="driverPhone" />
            <FormField label="رقم رخصة القيادة" name="driverLicense" />
          </div>
        )}

        {/* رفع المستندات */}
        {!user.licenseImage && (
          <div className="document-upload">
            <h3>رفع رخصة القيادة</h3>
            <FileUpload
              accept="image/*"
              onUpload={handleLicenseUpload}
            />
          </div>
        )}
      </div>
    </div>
  );
};
```

### الخطوة 4: المراجعة والدفع

```tsx
// pages/booking/Step4-Review.tsx

const BookingStep4 = () => {
  return (
    <div className="booking-step">
      <BookingProgress currentStep={4} />

      <div className="review-content">
        {/* ملخص الحجز */}
        <section className="booking-summary">
          <h2>ملخص الحجز</h2>

          <div className="summary-car">
            <img src={car.mainImage} alt="" />
            <div>
              <h3>{car.brand} {car.model}</h3>
              <p>{car.category}</p>
            </div>
          </div>

          <div className="summary-dates">
            <div>
              <strong>الاستلام:</strong>
              <span>{formatDateTime(bookingData.pickupDate)}</span>
              <span>{bookingData.pickupLocation}</span>
            </div>
            <div>
              <strong>الإرجاع:</strong>
              <span>{formatDateTime(bookingData.returnDate)}</span>
              <span>{bookingData.returnLocation}</span>
            </div>
          </div>

          {selectedExtras.length > 0 && (
            <div className="summary-extras">
              <strong>الإضافات:</strong>
              <ul>
                {selectedExtras.map((extra) => (
                  <li key={extra.id}>{extra.nameAr}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* تفاصيل السعر */}
        <section className="price-details">
          <h2>تفاصيل السعر</h2>
          <PriceBreakdown
            dailyRate={car.pricePerDay}
            days={totalDays}
            extras={extrasTotal}
            discount={discount}
            deposit={car.deposit}
          />
        </section>

        {/* كوبون الخصم */}
        <section className="coupon-section">
          <h2>كوبون خصم</h2>
          <CouponInput onApply={handleApplyCoupon} />
        </section>

        {/* طريقة الدفع */}
        <section className="payment-method">
          <h2>طريقة الدفع</h2>

          <div className="payment-options">
            <PaymentOption
              type="cash"
              title="الدفع نقداً"
              description="ادفع عند الاستلام"
              selected={paymentMethod === 'cash'}
              onSelect={() => setPaymentMethod('cash')}
            />
            <PaymentOption
              type="bank"
              title="حوالة بنكية"
              description="تحويل إلى حسابنا البنكي"
              selected={paymentMethod === 'bank'}
              onSelect={() => setPaymentMethod('bank')}
            />
          </div>
        </section>

        {/* الشروط والأحكام */}
        <div className="terms-checkbox">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
          />
          <label>
            قرأت وأوافق على <Link to="/terms">شروط وأحكام الإيجار</Link>
          </label>
        </div>
      </div>

      <div className="booking-navigation">
        <button className="back-btn" onClick={goBack}>السابق</button>
        <button
          className="confirm-btn"
          onClick={handleConfirm}
          disabled={!acceptedTerms || isSubmitting}
        >
          {isSubmitting ? <Spinner /> : 'تأكيد الحجز'}
        </button>
      </div>
    </div>
  );
};
```

---

## ⭐ التقييمات (Reviews)

```tsx
// pages/customer/Reviews.tsx

const CustomerReviews = () => {
  return (
    <div className="reviews-page">
      <PageHeader title="تقييماتي" />

      <Tabs defaultValue="my-reviews">
        <TabsList>
          <TabsTrigger value="my-reviews">تقييماتي</TabsTrigger>
          <TabsTrigger value="pending">بانتظار التقييم</TabsTrigger>
        </TabsList>

        <TabsContent value="my-reviews">
          {reviews?.map((review) => (
            <ReviewCard key={review.id} review={review} editable />
          ))}
        </TabsContent>

        <TabsContent value="pending">
          {pendingReviews?.map((booking) => (
            <PendingReviewCard
              key={booking.id}
              booking={booking}
              onReview={() => openReviewModal(booking)}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// نموذج التقييم
const ReviewModal = ({ booking, onClose }) => {
  return (
    <Modal isOpen onClose={onClose}>
      <h2>تقييم السيارة</h2>

      <div className="car-preview">
        <img src={booking.car.mainImage} alt="" />
        <span>{booking.car.brand} {booking.car.model}</span>
      </div>

      <form onSubmit={handleSubmit}>
        {/* التقييم العام */}
        <div className="rating-field">
          <label>التقييم العام</label>
          <StarRatingInput value={rating} onChange={setRating} />
        </div>

        {/* تقييمات تفصيلية */}
        <div className="detailed-ratings">
          <RatingField label="النظافة" name="cleanliness" />
          <RatingField label="الراحة" name="comfort" />
          <RatingField label="الأداء" name="performance" />
          <RatingField label="القيمة مقابل السعر" name="value" />
        </div>

        {/* العنوان والتعليق */}
        <FormField
          label="عنوان التقييم"
          name="title"
          placeholder="لخّص تجربتك في كلمات قليلة"
        />

        <FormField
          label="تعليقك"
          name="comment"
          type="textarea"
          placeholder="شاركنا تجربتك مع السيارة..."
          rows={4}
        />

        <div className="modal-actions">
          <button type="button" onClick={onClose}>إلغاء</button>
          <button type="submit">إرسال التقييم</button>
        </div>
      </form>
    </Modal>
  );
};
```

---

## 💳 المدفوعات (Payments)

```tsx
// pages/customer/Payments.tsx

const CustomerPayments = () => {
  return (
    <div className="payments-page">
      <PageHeader title="المدفوعات والفواتير" />

      {/* ملخص المدفوعات */}
      <div className="payments-summary">
        <SummaryCard
          label="إجمالي المدفوعات"
          value={formatPrice(stats.totalPaid)}
          icon={<CheckCircleIcon />}
        />
        <SummaryCard
          label="المستحقات"
          value={formatPrice(stats.pending)}
          icon={<ClockIcon />}
          color="warning"
        />
        <SummaryCard
          label="التأمينات المستردة"
          value={formatPrice(stats.depositsReturned)}
          icon={<RefundIcon />}
        />
      </div>

      {/* قائمة المدفوعات */}
      <div className="payments-list">
        <table className="data-table">
          <thead>
            <tr>
              <th>رقم العملية</th>
              <th>الحجز</th>
              <th>المبلغ</th>
              <th>الطريقة</th>
              <th>الحالة</th>
              <th>التاريخ</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {payments?.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.paymentNumber}</td>
                <td>
                  <Link to={`/customer/bookings/${payment.bookingId}`}>
                    #{payment.booking.bookingNumber}
                  </Link>
                </td>
                <td>{formatPrice(payment.amount)}</td>
                <td>{getPaymentMethodName(payment.method)}</td>
                <td>
                  <PaymentStatusBadge status={payment.status} />
                </td>
                <td>{formatDate(payment.createdAt)}</td>
                <td>
                  <button onClick={() => downloadReceipt(payment.id)}>
                    <DownloadIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

---

## ⚙️ الملف الشخصي (Profile Settings)

```tsx
// pages/customer/Profile.tsx

const CustomerProfile = () => {
  return (
    <div className="profile-page">
      <PageHeader title="الملف الشخصي" />

      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">المعلومات الشخصية</TabsTrigger>
          <TabsTrigger value="documents">المستندات</TabsTrigger>
          <TabsTrigger value="security">الأمان</TabsTrigger>
          <TabsTrigger value="preferences">التفضيلات</TabsTrigger>
        </TabsList>

        {/* المعلومات الشخصية */}
        <TabsContent value="personal">
          <PersonalInfoForm user={user} />
        </TabsContent>

        {/* المستندات */}
        <TabsContent value="documents">
          <DocumentsSection>
            <DocumentUpload
              type="license"
              label="رخصة القيادة"
              currentFile={user.licenseImage}
              expiryDate={user.licenseExpiry}
            />
            <DocumentUpload
              type="nationalId"
              label="الهوية الشخصية"
              currentFile={user.nationalIdImage}
            />
          </DocumentsSection>
        </TabsContent>

        {/* الأمان */}
        <TabsContent value="security">
          <SecuritySection>
            <ChangePasswordForm />
            <TwoFactorAuth enabled={user.twoFactorEnabled} />
            <ActiveSessions sessions={sessions} />
            <DeleteAccountSection />
          </SecuritySection>
        </TabsContent>

        {/* التفضيلات */}
        <TabsContent value="preferences">
          <PreferencesSection>
            <NotificationPreferences />
            <LanguagePreference />
          </PreferencesSection>
        </TabsContent>
      </Tabs>
    </div>
  );
};
```

---

## 🔔 الإشعارات (Notifications)

```tsx
// pages/customer/Notifications.tsx

const CustomerNotifications = () => {
  const { data: notifications } = useNotifications();
  const { mutate: markAllRead } = useMarkAllRead();

  return (
    <div className="notifications-page">
      <PageHeader title="الإشعارات">
        <button onClick={() => markAllRead()}>
          تحديد الكل كمقروء
        </button>
      </PageHeader>

      <div className="notifications-list">
        {notifications?.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRead={() => markAsRead(notification.id)}
          />
        ))}
      </div>
    </div>
  );
};
```

---

## 🎫 الدعم الفني (Support)

```tsx
// pages/customer/Support.tsx

const CustomerSupport = () => {
  return (
    <div className="support-page">
      <PageHeader title="الدعم الفني" />

      <div className="support-options">
        <SupportCard
          icon={<ChatIcon />}
          title="المحادثة المباشرة"
          description="تحدث مع فريق الدعم الآن"
          onClick={openLiveChat}
        />
        <SupportCard
          icon={<TicketIcon />}
          title="فتح تذكرة"
          description="أرسل استفسارك وسنرد خلال 24 ساعة"
          to="/customer/support/new-ticket"
        />
        <SupportCard
          icon={<PhoneIcon />}
          title="اتصل بنا"
          description="+963 999 999 999"
          href="tel:+963999999999"
        />
        <SupportCard
          icon={<QuestionIcon />}
          title="الأسئلة الشائعة"
          description="ابحث عن إجابة سريعة"
          to="/faq"
        />
      </div>

      {/* تذاكري */}
      <section className="my-tickets">
        <h2>تذاكري</h2>
        <TicketsList tickets={tickets} />
      </section>
    </div>
  );
};
```

---

## ➡️ Weiter zu: 05_ADMIN_DASHBOARD.md
