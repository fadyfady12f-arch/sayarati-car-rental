# 🔧 لوحة تحكم المسؤول - Admin Dashboard
# Vollständiges Admin-Panel

---

## 🏗️ Layout-Struktur

```tsx
// layouts/AdminLayout.tsx

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={`admin-layout ${sidebarCollapsed ? 'collapsed' : ''}`}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <Logo />
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            <MenuIcon />
          </button>
        </div>

        <nav className="sidebar-nav">
          {/* لوحة التحكم */}
          <NavSection title="الرئيسية">
            <NavLink to="/admin">
              <DashboardIcon /> لوحة التحكم
            </NavLink>
          </NavSection>

          {/* إدارة السيارات */}
          <NavSection title="السيارات">
            <NavLink to="/admin/cars">
              <CarIcon /> جميع السيارات
            </NavLink>
            <NavLink to="/admin/cars/new">
              <PlusIcon /> إضافة سيارة
            </NavLink>
            <NavLink to="/admin/categories">
              <FolderIcon /> الفئات
            </NavLink>
            <NavLink to="/admin/features">
              <ListIcon /> الميزات
            </NavLink>
            <NavLink to="/admin/maintenance">
              <WrenchIcon /> الصيانة
            </NavLink>
          </NavSection>

          {/* إدارة الحجوزات */}
          <NavSection title="الحجوزات">
            <NavLink to="/admin/bookings">
              <CalendarIcon /> جميع الحجوزات
            </NavLink>
            <NavLink to="/admin/bookings/pending">
              <ClockIcon /> بانتظار التأكيد
              {pendingCount > 0 && <Badge>{pendingCount}</Badge>}
            </NavLink>
            <NavLink to="/admin/bookings/active">
              <PlayIcon /> الحجوزات النشطة
            </NavLink>
            <NavLink to="/admin/bookings/calendar">
              <CalendarViewIcon /> التقويم
            </NavLink>
          </NavSection>

          {/* إدارة العملاء */}
          <NavSection title="العملاء">
            <NavLink to="/admin/customers">
              <UsersIcon /> جميع العملاء
            </NavLink>
            <NavLink to="/admin/customers/pending">
              <UserCheckIcon /> بانتظار التحقق
            </NavLink>
          </NavSection>

          {/* المالية */}
          <NavSection title="المالية">
            <NavLink to="/admin/payments">
              <CreditCardIcon /> المدفوعات
            </NavLink>
            <NavLink to="/admin/invoices">
              <FileTextIcon /> الفواتير
            </NavLink>
            <NavLink to="/admin/reports">
              <ChartIcon /> التقارير
            </NavLink>
          </NavSection>

          {/* التسويق */}
          <NavSection title="التسويق">
            <NavLink to="/admin/coupons">
              <TicketIcon /> الكوبونات
            </NavLink>
            <NavLink to="/admin/promotions">
              <MegaphoneIcon /> العروض
            </NavLink>
          </NavSection>

          {/* المحتوى */}
          <NavSection title="المحتوى">
            <NavLink to="/admin/reviews">
              <StarIcon /> التقييمات
            </NavLink>
            <NavLink to="/admin/pages">
              <FileIcon /> الصفحات
            </NavLink>
            <NavLink to="/admin/faq">
              <HelpIcon /> الأسئلة الشائعة
            </NavLink>
          </NavSection>

          {/* الفروع */}
          <NavSection title="الفروع">
            <NavLink to="/admin/branches">
              <MapPinIcon /> إدارة الفروع
            </NavLink>
          </NavSection>

          {/* الدعم */}
          <NavSection title="الدعم">
            <NavLink to="/admin/tickets">
              <SupportIcon /> تذاكر الدعم
              {openTickets > 0 && <Badge>{openTickets}</Badge>}
            </NavLink>
          </NavSection>

          {/* الإعدادات */}
          <NavSection title="الإعدادات">
            <NavLink to="/admin/settings">
              <SettingsIcon /> إعدادات النظام
            </NavLink>
            <NavLink to="/admin/users">
              <UserCogIcon /> المستخدمين والصلاحيات
            </NavLink>
            <NavLink to="/admin/logs">
              <ActivityIcon /> سجل النشاط
            </NavLink>
          </NavSection>
        </nav>

        {/* معلومات المستخدم */}
        <div className="sidebar-footer">
          <UserInfo user={currentUser} />
        </div>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-search">
            <GlobalSearch />
          </div>
          <div className="header-actions">
            <QuickActions />
            <NotificationBell />
            <UserMenu />
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
```

---

## 📊 لوحة التحكم الرئيسية (Main Dashboard)

```tsx
// pages/admin/Dashboard.tsx

const AdminDashboard = () => {
  const { data: stats } = useDashboardStats();
  const { data: recentBookings } = useRecentBookings(5);
  const { data: alerts } = useSystemAlerts();

  return (
    <div className="admin-dashboard">
      <PageHeader title="لوحة التحكم" />

      {/* التنبيهات */}
      {alerts?.length > 0 && (
        <AlertsSection alerts={alerts} />
      )}

      {/* الإحصائيات الرئيسية */}
      <div className="stats-grid">
        <StatCard
          title="إجمالي الحجوزات اليوم"
          value={stats?.todayBookings || 0}
          change={stats?.bookingsChange}
          icon={<CalendarIcon />}
          color="blue"
        />
        <StatCard
          title="الإيرادات اليومية"
          value={formatPrice(stats?.todayRevenue || 0)}
          change={stats?.revenueChange}
          icon={<CurrencyIcon />}
          color="green"
        />
        <StatCard
          title="السيارات المتاحة"
          value={`${stats?.availableCars || 0}/${stats?.totalCars || 0}`}
          icon={<CarIcon />}
          color="purple"
        />
        <StatCard
          title="العملاء النشطين"
          value={stats?.activeCustomers || 0}
          change={stats?.customersChange}
          icon={<UsersIcon />}
          color="orange"
        />
      </div>

      {/* إحصائيات إضافية */}
      <div className="secondary-stats">
        <MiniStat label="حجوزات قيد الانتظار" value={stats?.pendingBookings} />
        <MiniStat label="حجوزات نشطة الآن" value={stats?.activeBookings} />
        <MiniStat label="سيارات في الصيانة" value={stats?.carsInMaintenance} />
        <MiniStat label="تذاكر دعم مفتوحة" value={stats?.openTickets} />
      </div>

      <div className="dashboard-grid">
        {/* رسم بياني للإيرادات */}
        <section className="chart-section revenue-chart">
          <div className="section-header">
            <h2>الإيرادات</h2>
            <PeriodSelector
              value={revenuePeriod}
              onChange={setRevenuePeriod}
            />
          </div>
          <RevenueChart data={revenueData} period={revenuePeriod} />
        </section>

        {/* رسم بياني للحجوزات */}
        <section className="chart-section bookings-chart">
          <div className="section-header">
            <h2>الحجوزات</h2>
            <PeriodSelector
              value={bookingsPeriod}
              onChange={setBookingsPeriod}
            />
          </div>
          <BookingsChart data={bookingsData} period={bookingsPeriod} />
        </section>

        {/* الحجوزات الأخيرة */}
        <section className="recent-bookings">
          <div className="section-header">
            <h2>أحدث الحجوزات</h2>
            <Link to="/admin/bookings">عرض الكل</Link>
          </div>
          <RecentBookingsTable bookings={recentBookings} />
        </section>

        {/* توزيع السيارات */}
        <section className="cars-distribution">
          <h2>توزيع السيارات حسب الحالة</h2>
          <CarStatusPieChart data={stats?.carsByStatus} />
        </section>

        {/* أفضل السيارات */}
        <section className="top-cars">
          <h2>أكثر السيارات طلباً</h2>
          <TopCarsTable cars={stats?.topCars} />
        </section>

        {/* النشاط الأخير */}
        <section className="recent-activity">
          <h2>النشاط الأخير</h2>
          <ActivityFeed activities={recentActivities} />
        </section>

        {/* التقويم المصغر */}
        <section className="mini-calendar">
          <h2>الحجوزات القادمة</h2>
          <MiniBookingCalendar />
        </section>

        {/* تنبيهات الصيانة */}
        <section className="maintenance-alerts">
          <h2>تنبيهات الصيانة</h2>
          <MaintenanceAlertsList />
        </section>
      </div>
    </div>
  );
};
```

---

## 🚗 إدارة السيارات (Cars Management)

### قائمة السيارات

```tsx
// pages/admin/cars/CarsList.tsx

const AdminCarsList = () => {
  const [filters, setFilters] = useState<CarFilters>({});
  const { data, isLoading } = useCars(filters);

  return (
    <div className="cars-management">
      <PageHeader title="إدارة السيارات">
        <Link to="/admin/cars/new" className="add-btn">
          <PlusIcon /> إضافة سيارة
        </Link>
      </PageHeader>

      {/* الفلاتر */}
      <div className="filters-bar">
        <SearchInput
          placeholder="بحث بالماركة أو الموديل أو رقم اللوحة..."
          value={filters.search}
          onChange={(search) => setFilters({ ...filters, search })}
        />

        <FilterSelect
          label="الفئة"
          options={categories}
          value={filters.category}
          onChange={(category) => setFilters({ ...filters, category })}
        />

        <FilterSelect
          label="الحالة"
          options={statusOptions}
          value={filters.status}
          onChange={(status) => setFilters({ ...filters, status })}
        />

        <FilterSelect
          label="الفرع"
          options={branches}
          value={filters.branch}
          onChange={(branch) => setFilters({ ...filters, branch })}
        />

        <button className="reset-btn" onClick={() => setFilters({})}>
          إعادة تعيين
        </button>
      </div>

      {/* الإحصائيات */}
      <div className="cars-stats">
        <StatBadge label="الإجمالي" value={data?.total} />
        <StatBadge label="متاحة" value={data?.available} color="green" />
        <StatBadge label="مؤجرة" value={data?.rented} color="blue" />
        <StatBadge label="صيانة" value={data?.maintenance} color="orange" />
      </div>

      {/* جدول السيارات */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>
                <Checkbox
                  checked={allSelected}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>السيارة</th>
              <th>رقم اللوحة</th>
              <th>الفئة</th>
              <th>السعر/يوم</th>
              <th>الحالة</th>
              <th>الفرع</th>
              <th>الحجوزات</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {data?.cars.map((car) => (
              <tr key={car.id}>
                <td>
                  <Checkbox
                    checked={selectedCars.includes(car.id)}
                    onChange={() => toggleSelect(car.id)}
                  />
                </td>
                <td>
                  <div className="car-cell">
                    <img src={car.mainImage} alt="" />
                    <div>
                      <strong>{car.brand} {car.model}</strong>
                      <span>{car.year} • {car.color}</span>
                    </div>
                  </div>
                </td>
                <td>{car.licensePlate}</td>
                <td>
                  <CategoryBadge category={car.category} />
                </td>
                <td>{formatPrice(car.pricePerDay)}</td>
                <td>
                  <StatusBadge status={car.status} />
                </td>
                <td>{car.branch?.nameAr || '-'}</td>
                <td>{car.bookingsCount}</td>
                <td>
                  <ActionMenu>
                    <ActionItem
                      icon={<EyeIcon />}
                      label="عرض"
                      onClick={() => viewCar(car.id)}
                    />
                    <ActionItem
                      icon={<EditIcon />}
                      label="تعديل"
                      onClick={() => editCar(car.id)}
                    />
                    <ActionItem
                      icon={<CopyIcon />}
                      label="نسخ"
                      onClick={() => duplicateCar(car.id)}
                    />
                    <ActionItem
                      icon={<WrenchIcon />}
                      label="صيانة"
                      onClick={() => addMaintenance(car.id)}
                    />
                    <ActionItem
                      icon={<TrashIcon />}
                      label="حذف"
                      onClick={() => deleteCar(car.id)}
                      danger
                    />
                  </ActionMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bulk Actions */}
      {selectedCars.length > 0 && (
        <BulkActionsBar>
          <span>{selectedCars.length} سيارة محددة</span>
          <button onClick={bulkUpdateStatus}>تغيير الحالة</button>
          <button onClick={bulkUpdatePrices}>تعديل الأسعار</button>
          <button onClick={bulkDelete} className="danger">حذف</button>
        </BulkActionsBar>
      )}

      <Pagination
        currentPage={page}
        totalPages={data?.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};
```

### إضافة/تعديل سيارة

```tsx
// pages/admin/cars/CarForm.tsx

const CarForm = ({ car }: { car?: Car }) => {
  const isEdit = !!car;

  return (
    <div className="car-form-page">
      <PageHeader
        title={isEdit ? 'تعديل السيارة' : 'إضافة سيارة جديدة'}
        backLink="/admin/cars"
      />

      <form onSubmit={handleSubmit} className="car-form">
        <Tabs defaultValue="basic">
          <TabsList>
            <TabsTrigger value="basic">المعلومات الأساسية</TabsTrigger>
            <TabsTrigger value="technical">المواصفات الفنية</TabsTrigger>
            <TabsTrigger value="pricing">التسعير</TabsTrigger>
            <TabsTrigger value="images">الصور</TabsTrigger>
            <TabsTrigger value="features">الميزات</TabsTrigger>
            <TabsTrigger value="3d">النموذج ثلاثي الأبعاد</TabsTrigger>
          </TabsList>

          {/* المعلومات الأساسية */}
          <TabsContent value="basic">
            <FormSection title="معلومات السيارة">
              <div className="form-grid">
                <FormField
                  label="الماركة"
                  name="brand"
                  type="select"
                  options={carBrands}
                  required
                />
                <FormField
                  label="الموديل"
                  name="model"
                  required
                />
                <FormField
                  label="سنة الصنع"
                  name="year"
                  type="number"
                  min={2000}
                  max={new Date().getFullYear() + 1}
                  required
                />
                <FormField
                  label="اللون"
                  name="color"
                  type="color-picker"
                  required
                />
                <FormField
                  label="رقم اللوحة"
                  name="licensePlate"
                  required
                />
                <FormField
                  label="رقم الهيكل (VIN)"
                  name="vin"
                />
              </div>
            </FormSection>

            <FormSection title="التصنيف">
              <div className="form-grid">
                <FormField
                  label="الفئة"
                  name="category"
                  type="select"
                  options={carCategories}
                  required
                />
                <FormField
                  label="ناقل الحركة"
                  name="transmission"
                  type="radio-group"
                  options={[
                    { value: 'AUTOMATIC', label: 'أوتوماتيك' },
                    { value: 'MANUAL', label: 'عادي' },
                  ]}
                  required
                />
                <FormField
                  label="نوع الوقود"
                  name="fuelType"
                  type="select"
                  options={fuelTypes}
                  required
                />
              </div>
            </FormSection>

            <FormSection title="الموقع">
              <div className="form-grid">
                <FormField
                  label="الفرع"
                  name="branchId"
                  type="select"
                  options={branches}
                />
                <FormField
                  label="الموقع الحالي"
                  name="currentLocation"
                />
              </div>
            </FormSection>

            <FormSection title="الحالة">
              <div className="form-grid">
                <FormField
                  label="حالة السيارة"
                  name="status"
                  type="select"
                  options={carStatuses}
                  required
                />
                <FormField
                  label="نشطة"
                  name="isActive"
                  type="switch"
                />
                <FormField
                  label="مميزة"
                  name="isFeatured"
                  type="switch"
                />
              </div>
            </FormSection>
          </TabsContent>

          {/* المواصفات الفنية */}
          <TabsContent value="technical">
            <FormSection title="المواصفات">
              <div className="form-grid">
                <FormField
                  label="عدد المقاعد"
                  name="seats"
                  type="number"
                  min={2}
                  max={12}
                  required
                />
                <FormField
                  label="عدد الأبواب"
                  name="doors"
                  type="number"
                  min={2}
                  max={5}
                  required
                />
                <FormField
                  label="حجم المحرك (لتر)"
                  name="engineSize"
                  type="number"
                  step={0.1}
                />
                <FormField
                  label="القوة (حصان)"
                  name="horsepower"
                  type="number"
                />
                <FormField
                  label="سعة الخزان (لتر)"
                  name="tankCapacity"
                  type="number"
                />
                <FormField
                  label="عداد الكيلومترات"
                  name="mileage"
                  type="number"
                  required
                />
              </div>
            </FormSection>

            <FormSection title="الصيانة والتأمين">
              <div className="form-grid">
                <FormField
                  label="آخر صيانة"
                  name="lastService"
                  type="date"
                />
                <FormField
                  label="الصيانة القادمة"
                  name="nextService"
                  type="date"
                />
                <FormField
                  label="انتهاء التأمين"
                  name="insuranceExpiry"
                  type="date"
                />
              </div>
            </FormSection>
          </TabsContent>

          {/* التسعير */}
          <TabsContent value="pricing">
            <FormSection title="الأسعار (بالليرة السورية)">
              <div className="form-grid">
                <FormField
                  label="السعر اليومي"
                  name="pricePerDay"
                  type="number"
                  required
                  suffix="ل.س"
                />
                <FormField
                  label="السعر الأسبوعي"
                  name="pricePerWeek"
                  type="number"
                  suffix="ل.س"
                  helperText="اتركه فارغاً للحساب التلقائي"
                />
                <FormField
                  label="السعر الشهري"
                  name="pricePerMonth"
                  type="number"
                  suffix="ل.س"
                  helperText="اتركه فارغاً للحساب التلقائي"
                />
                <FormField
                  label="مبلغ التأمين"
                  name="deposit"
                  type="number"
                  required
                  suffix="ل.س"
                />
              </div>
            </FormSection>

            {/* حاسبة الأسعار */}
            <div className="pricing-calculator">
              <h4>حاسبة الأسعار</h4>
              <PricingCalculator pricePerDay={watch('pricePerDay')} />
            </div>
          </TabsContent>

          {/* الصور */}
          <TabsContent value="images">
            <FormSection title="صور السيارة">
              <ImageUploader
                images={images}
                onUpload={handleImageUpload}
                onReorder={handleReorder}
                onDelete={handleImageDelete}
                maxImages={10}
              />
              <p className="helper-text">
                الصورة الأولى ستكون الصورة الرئيسية. اسحب لإعادة الترتيب.
              </p>
            </FormSection>
          </TabsContent>

          {/* الميزات */}
          <TabsContent value="features">
            <FormSection title="ميزات السيارة">
              <FeaturesSelector
                selectedFeatures={selectedFeatures}
                onChange={setSelectedFeatures}
              />
            </FormSection>
          </TabsContent>

          {/* النموذج ثلاثي الأبعاد */}
          <TabsContent value="3d">
            <FormSection title="النموذج ثلاثي الأبعاد">
              <Model3DUploader
                currentModel={car?.model3dUrl}
                onUpload={handleModel3DUpload}
              />
              <p className="helper-text">
                يدعم صيغ: GLB, GLTF. الحجم الأقصى: 50MB
              </p>

              {model3dUrl && (
                <div className="model-preview">
                  <h4>معاينة النموذج</h4>
                  <Car3DViewer modelUrl={model3dUrl} />
                </div>
              )}
            </FormSection>
          </TabsContent>
        </Tabs>

        {/* أزرار الإجراءات */}
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={goBack}>
            إلغاء
          </button>
          <button type="submit" className="save-btn" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : (isEdit ? 'حفظ التغييرات' : 'إضافة السيارة')}
          </button>
        </div>
      </form>
    </div>
  );
};
```

---

## 📅 إدارة الحجوزات (Bookings Management)

### قائمة الحجوزات

```tsx
// pages/admin/bookings/BookingsList.tsx

const AdminBookingsList = () => {
  return (
    <div className="bookings-management">
      <PageHeader title="إدارة الحجوزات">
        <div className="header-actions">
          <button onClick={exportToExcel}>
            <DownloadIcon /> تصدير
          </button>
          <Link to="/admin/bookings/new" className="add-btn">
            <PlusIcon /> حجز جديد
          </Link>
        </div>
      </PageHeader>

      {/* الفلاتر */}
      <FiltersBar>
        <SearchInput placeholder="رقم الحجز، اسم العميل، رقم الهاتف..." />
        <DateRangePicker />
        <FilterSelect label="الحالة" options={bookingStatuses} />
        <FilterSelect label="حالة الدفع" options={paymentStatuses} />
        <FilterSelect label="الفرع" options={branches} />
      </FiltersBar>

      {/* الجدول */}
      <DataTable
        columns={[
          { key: 'bookingNumber', label: 'رقم الحجز', sortable: true },
          { key: 'customer', label: 'العميل', render: CustomerCell },
          { key: 'car', label: 'السيارة', render: CarCell },
          { key: 'dates', label: 'الفترة', render: DatesCell },
          { key: 'totalAmount', label: 'المبلغ', sortable: true },
          { key: 'status', label: 'الحالة', render: StatusCell },
          { key: 'paymentStatus', label: 'الدفع', render: PaymentStatusCell },
          { key: 'actions', label: '', render: ActionsCell },
        ]}
        data={bookings}
        onRowClick={(booking) => navigate(`/admin/bookings/${booking.id}`)}
      />

      <Pagination />
    </div>
  );
};
```

### تفاصيل الحجز للمسؤول

```tsx
// pages/admin/bookings/BookingDetails.tsx

const AdminBookingDetails = () => {
  const { id } = useParams();
  const { data: booking } = useAdminBooking(id);

  return (
    <div className="admin-booking-details">
      <PageHeader
        title={`حجز #${booking?.bookingNumber}`}
        backLink="/admin/bookings"
      >
        <div className="status-actions">
          <StatusBadge status={booking?.status} size="large" />
          <BookingStatusDropdown
            currentStatus={booking?.status}
            onStatusChange={handleStatusChange}
          />
        </div>
      </PageHeader>

      <div className="booking-details-grid">
        {/* معلومات العميل */}
        <section className="customer-section">
          <h2>معلومات العميل</h2>
          <div className="customer-card">
            <UserAvatar user={booking?.user} size="large" />
            <div className="customer-info">
              <h3>{booking?.user.firstName} {booking?.user.lastName}</h3>
              <p><PhoneIcon /> {booking?.user.phone}</p>
              <p><MailIcon /> {booking?.user.email}</p>
              <Link to={`/admin/customers/${booking?.user.id}`}>
                عرض الملف الشخصي
              </Link>
            </div>
          </div>

          {/* سجل العميل */}
          <div className="customer-history">
            <h4>سجل العميل</h4>
            <div className="history-stats">
              <span>الحجوزات السابقة: {booking?.user.bookingsCount}</span>
              <span>إجمالي الإنفاق: {formatPrice(booking?.user.totalSpent)}</span>
            </div>
          </div>
        </section>

        {/* معلومات السيارة */}
        <section className="car-section">
          <h2>معلومات السيارة</h2>
          <div className="car-card">
            <img src={booking?.car.mainImage} alt="" />
            <div className="car-info">
              <h3>{booking?.car.brand} {booking?.car.model}</h3>
              <p>رقم اللوحة: {booking?.car.licensePlate}</p>
              <p>الفئة: {getCategoryName(booking?.car.category)}</p>
              <Link to={`/admin/cars/${booking?.car.id}`}>
                عرض تفاصيل السيارة
              </Link>
            </div>
          </div>
        </section>

        {/* تفاصيل الحجز */}
        <section className="booking-info-section">
          <h2>تفاصيل الحجز</h2>
          <InfoGrid>
            <InfoItem label="تاريخ الاستلام" value={formatDateTime(booking?.startDate)} />
            <InfoItem label="تاريخ الإرجاع" value={formatDateTime(booking?.endDate)} />
            <InfoItem label="موقع الاستلام" value={booking?.pickupLocation} />
            <InfoItem label="موقع الإرجاع" value={booking?.returnLocation} />
            <InfoItem label="عدد الأيام" value={booking?.totalDays} />
          </InfoGrid>
        </section>

        {/* تفاصيل مالية */}
        <section className="financial-section">
          <h2>التفاصيل المالية</h2>
          <PaymentBreakdown booking={booking} />

          <div className="payment-actions">
            {booking?.paymentStatus === 'PENDING' && (
              <button onClick={() => recordPayment(booking.id)}>
                تسجيل دفعة
              </button>
            )}
            <button onClick={() => generateInvoice(booking.id)}>
              إنشاء فاتورة
            </button>
          </div>
        </section>

        {/* حالة السيارة */}
        {(booking?.status === 'ACTIVE' || booking?.status === 'COMPLETED') && (
          <section className="vehicle-condition">
            <h2>حالة السيارة</h2>

            <Tabs defaultValue="pickup">
              <TabsList>
                <TabsTrigger value="pickup">عند الاستلام</TabsTrigger>
                <TabsTrigger value="return" disabled={!booking?.actualReturnDate}>
                  عند الإرجاع
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pickup">
                <VehicleConditionForm
                  type="pickup"
                  data={{
                    mileage: booking?.pickupMileage,
                    fuel: booking?.pickupFuel,
                    condition: booking?.pickupCondition,
                    photos: booking?.pickupPhotos,
                  }}
                  editable={booking?.status === 'CONFIRMED'}
                  onSave={handleSavePickupCondition}
                />
              </TabsContent>

              <TabsContent value="return">
                <VehicleConditionForm
                  type="return"
                  data={{
                    mileage: booking?.returnMileage,
                    fuel: booking?.returnFuel,
                    condition: booking?.returnCondition,
                    photos: booking?.returnPhotos,
                  }}
                  editable={booking?.status === 'ACTIVE'}
                  onSave={handleSaveReturnCondition}
                />
              </TabsContent>
            </Tabs>
          </section>
        )}

        {/* ملاحظات */}
        <section className="notes-section">
          <h2>الملاحظات</h2>

          <div className="notes-grid">
            <div className="note-box customer-notes">
              <h4>ملاحظات العميل</h4>
              <p>{booking?.customerNotes || 'لا توجد ملاحظات'}</p>
            </div>

            <div className="note-box admin-notes">
              <h4>ملاحظات المسؤول</h4>
              <EditableNote
                value={booking?.adminNotes}
                onSave={handleSaveAdminNotes}
              />
            </div>
          </div>
        </section>

        {/* سجل النشاط */}
        <section className="activity-log">
          <h2>سجل النشاط</h2>
          <BookingActivityLog bookingId={booking?.id} />
        </section>
      </div>

      {/* إجراءات */}
      <div className="booking-actions-bar">
        {booking?.status === 'PENDING' && (
          <>
            <button className="confirm-btn" onClick={handleConfirm}>
              <CheckIcon /> تأكيد الحجز
            </button>
            <button className="reject-btn" onClick={handleReject}>
              <XIcon /> رفض
            </button>
          </>
        )}

        {booking?.status === 'CONFIRMED' && (
          <button className="activate-btn" onClick={handleActivate}>
            <PlayIcon /> بدء الإيجار
          </button>
        )}

        {booking?.status === 'ACTIVE' && (
          <button className="complete-btn" onClick={handleComplete}>
            <CheckCircleIcon /> إنهاء الإيجار
          </button>
        )}

        <button className="print-btn" onClick={handlePrint}>
          <PrinterIcon /> طباعة
        </button>

        <button className="contact-btn" onClick={handleContact}>
          <MessageIcon /> مراسلة العميل
        </button>
      </div>
    </div>
  );
};
```

### تقويم الحجوزات

```tsx
// pages/admin/bookings/BookingsCalendar.tsx

const BookingsCalendar = () => {
  return (
    <div className="bookings-calendar-page">
      <PageHeader title="تقويم الحجوزات" />

      <div className="calendar-controls">
        <ViewSelector
          value={view}
          onChange={setView}
          options={['month', 'week', 'day', 'timeline']}
        />
        <CarFilter />
        <BranchFilter />
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={view}
        locale="ar"
        direction="rtl"
        events={bookingEvents}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        eventContent={renderEventContent}
        headerToolbar={{
          start: 'prev,next today',
          center: 'title',
          end: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
      />
    </div>
  );
};
```

---

## 👥 إدارة العملاء (Customers Management)

```tsx
// pages/admin/customers/CustomersList.tsx

const AdminCustomersList = () => {
  return (
    <div className="customers-management">
      <PageHeader title="إدارة العملاء">
        <button onClick={exportCustomers}>
          <DownloadIcon /> تصدير
        </button>
      </PageHeader>

      <FiltersBar>
        <SearchInput placeholder="الاسم، البريد، رقم الهاتف..." />
        <FilterSelect label="الحالة" options={customerStatuses} />
        <FilterSelect label="حالة التحقق" options={verificationStatuses} />
        <DateRangePicker label="تاريخ التسجيل" />
      </FiltersBar>

      <DataTable
        columns={[
          { key: 'user', label: 'العميل', render: CustomerCell },
          { key: 'phone', label: 'الهاتف' },
          { key: 'email', label: 'البريد' },
          { key: 'bookingsCount', label: 'الحجوزات', sortable: true },
          { key: 'totalSpent', label: 'إجمالي الإنفاق', sortable: true },
          { key: 'isVerified', label: 'التحقق', render: VerificationCell },
          { key: 'isActive', label: 'الحالة', render: StatusCell },
          { key: 'createdAt', label: 'تاريخ التسجيل', sortable: true },
          { key: 'actions', label: '', render: ActionsCell },
        ]}
        data={customers}
      />
    </div>
  );
};

// تفاصيل العميل
const AdminCustomerDetails = () => {
  return (
    <div className="customer-details-page">
      <PageHeader
        title={`${customer.firstName} ${customer.lastName}`}
        backLink="/admin/customers"
      />

      <div className="customer-header">
        <UserAvatar user={customer} size="xlarge" />
        <div className="customer-info">
          <h1>{customer.firstName} {customer.lastName}</h1>
          <div className="customer-badges">
            {customer.isVerified && <Badge color="green">موثق</Badge>}
            {customer.isActive ? (
              <Badge color="green">نشط</Badge>
            ) : (
              <Badge color="red">معطل</Badge>
            )}
          </div>
          <div className="customer-meta">
            <span><MailIcon /> {customer.email}</span>
            <span><PhoneIcon /> {customer.phone}</span>
            <span><CalendarIcon /> عضو منذ {formatDate(customer.createdAt)}</span>
          </div>
        </div>
        <div className="customer-actions">
          <button onClick={toggleActive}>
            {customer.isActive ? 'تعطيل الحساب' : 'تفعيل الحساب'}
          </button>
          <button onClick={resetPassword}>إعادة تعيين كلمة المرور</button>
          <button onClick={sendMessage}>إرسال رسالة</button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="bookings">الحجوزات</TabsTrigger>
          <TabsTrigger value="payments">المدفوعات</TabsTrigger>
          <TabsTrigger value="documents">المستندات</TabsTrigger>
          <TabsTrigger value="activity">النشاط</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <CustomerOverview customer={customer} />
        </TabsContent>

        <TabsContent value="bookings">
          <CustomerBookingsTable customerId={customer.id} />
        </TabsContent>

        <TabsContent value="payments">
          <CustomerPaymentsTable customerId={customer.id} />
        </TabsContent>

        <TabsContent value="documents">
          <CustomerDocuments customer={customer} />
        </TabsContent>

        <TabsContent value="activity">
          <CustomerActivityLog customerId={customer.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
```

---

## 💰 المالية والتقارير (Finance & Reports)

### صفحة المدفوعات

```tsx
// pages/admin/payments/PaymentsList.tsx

const AdminPaymentsList = () => {
  return (
    <div className="payments-management">
      <PageHeader title="المدفوعات" />

      {/* ملخص مالي */}
      <div className="financial-summary">
        <SummaryCard
          label="إيرادات اليوم"
          value={formatPrice(stats.todayRevenue)}
          icon={<TrendingUpIcon />}
          change={stats.revenueChange}
        />
        <SummaryCard
          label="إيرادات الشهر"
          value={formatPrice(stats.monthRevenue)}
          icon={<CalendarIcon />}
        />
        <SummaryCard
          label="مدفوعات معلقة"
          value={formatPrice(stats.pendingPayments)}
          icon={<ClockIcon />}
          color="warning"
        />
        <SummaryCard
          label="تأمينات محتجزة"
          value={formatPrice(stats.heldDeposits)}
          icon={<LockIcon />}
        />
      </div>

      {/* قائمة المدفوعات */}
      <DataTable
        columns={[
          { key: 'paymentNumber', label: 'رقم العملية' },
          { key: 'booking', label: 'الحجز' },
          { key: 'customer', label: 'العميل' },
          { key: 'amount', label: 'المبلغ' },
          { key: 'method', label: 'الطريقة' },
          { key: 'status', label: 'الحالة' },
          { key: 'paidAt', label: 'تاريخ الدفع' },
          { key: 'actions', label: '' },
        ]}
        data={payments}
      />
    </div>
  );
};
```

### التقارير

```tsx
// pages/admin/reports/Reports.tsx

const AdminReports = () => {
  return (
    <div className="reports-page">
      <PageHeader title="التقارير والإحصائيات" />

      <Tabs defaultValue="revenue">
        <TabsList>
          <TabsTrigger value="revenue">الإيرادات</TabsTrigger>
          <TabsTrigger value="bookings">الحجوزات</TabsTrigger>
          <TabsTrigger value="cars">السيارات</TabsTrigger>
          <TabsTrigger value="customers">العملاء</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <RevenueReport />
        </TabsContent>

        <TabsContent value="bookings">
          <BookingsReport />
        </TabsContent>

        <TabsContent value="cars">
          <CarsReport />
        </TabsContent>

        <TabsContent value="customers">
          <CustomersReport />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const RevenueReport = () => {
  return (
    <div className="report-section">
      {/* فلاتر الفترة */}
      <div className="report-filters">
        <PeriodSelector value={period} onChange={setPeriod} />
        <DateRangePicker value={dateRange} onChange={setDateRange} />
        <BranchFilter />
        <button onClick={exportReport}>
          <DownloadIcon /> تصدير PDF
        </button>
      </div>

      {/* الرسوم البيانية */}
      <div className="charts-grid">
        <ChartCard title="الإيرادات حسب الفترة">
          <LineChart data={revenueData} />
        </ChartCard>

        <ChartCard title="الإيرادات حسب طريقة الدفع">
          <PieChart data={revenueByMethod} />
        </ChartCard>

        <ChartCard title="الإيرادات حسب الفرع">
          <BarChart data={revenueByBranch} />
        </ChartCard>

        <ChartCard title="الإيرادات حسب فئة السيارة">
          <BarChart data={revenueByCategory} />
        </ChartCard>
      </div>

      {/* جدول تفصيلي */}
      <div className="report-table">
        <h3>تفاصيل الإيرادات</h3>
        <RevenueDetailsTable data={detailedRevenue} />
      </div>
    </div>
  );
};
```

---

## ⚙️ الإعدادات (Settings)

```tsx
// pages/admin/settings/Settings.tsx

const AdminSettings = () => {
  return (
    <div className="settings-page">
      <PageHeader title="إعدادات النظام" />

      <Tabs defaultValue="general" orientation="vertical">
        <TabsList>
          <TabsTrigger value="general">إعدادات عامة</TabsTrigger>
          <TabsTrigger value="pricing">التسعير</TabsTrigger>
          <TabsTrigger value="booking">الحجز</TabsTrigger>
          <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
          <TabsTrigger value="email">البريد الإلكتروني</TabsTrigger>
          <TabsTrigger value="sms">الرسائل النصية</TabsTrigger>
          <TabsTrigger value="payment">طرق الدفع</TabsTrigger>
          <TabsTrigger value="appearance">المظهر</TabsTrigger>
          <TabsTrigger value="localization">اللغة والمنطقة</TabsTrigger>
          <TabsTrigger value="backup">النسخ الاحتياطي</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="pricing">
          <PricingSettings />
        </TabsContent>

        <TabsContent value="booking">
          <BookingSettings />
        </TabsContent>

        {/* ... باقي التبويبات */}
      </Tabs>
    </div>
  );
};

const GeneralSettings = () => {
  return (
    <SettingsSection title="الإعدادات العامة">
      <FormField
        label="اسم الشركة"
        name="companyName"
        defaultValue={settings.companyName}
      />
      <FormField
        label="البريد الإلكتروني"
        name="email"
        type="email"
        defaultValue={settings.email}
      />
      <FormField
        label="رقم الهاتف"
        name="phone"
        defaultValue={settings.phone}
      />
      <FormField
        label="العنوان"
        name="address"
        type="textarea"
        defaultValue={settings.address}
      />
      <FormField
        label="شعار الشركة"
        name="logo"
        type="image-upload"
        currentValue={settings.logo}
      />
      <FormField
        label="أيقونة الموقع"
        name="favicon"
        type="image-upload"
        currentValue={settings.favicon}
      />
    </SettingsSection>
  );
};

const BookingSettings = () => {
  return (
    <SettingsSection title="إعدادات الحجز">
      <FormField
        label="الحد الأدنى لمدة الإيجار (أيام)"
        name="minRentalDays"
        type="number"
        min={1}
      />
      <FormField
        label="الحد الأقصى لمدة الإيجار (أيام)"
        name="maxRentalDays"
        type="number"
      />
      <FormField
        label="وقت الإلغاء المجاني (ساعات)"
        name="freeCancellationHours"
        type="number"
      />
      <FormField
        label="نسبة خصم الإلغاء المتأخر (%)"
        name="lateCancellationFee"
        type="number"
      />
      <FormField
        label="الحجز المسبق (أيام كحد أدنى)"
        name="advanceBookingDays"
        type="number"
      />
      <FormField
        label="تأكيد تلقائي للحجوزات"
        name="autoConfirmBookings"
        type="switch"
      />
    </SettingsSection>
  );
};
```

---

## 👥 إدارة المستخدمين والصلاحيات

```tsx
// pages/admin/users/UserManagement.tsx

const UserManagement = () => {
  return (
    <div className="user-management">
      <PageHeader title="المستخدمين والصلاحيات">
        <button onClick={() => setShowAddModal(true)}>
          <PlusIcon /> إضافة مستخدم
        </button>
      </PageHeader>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">المستخدمين</TabsTrigger>
          <TabsTrigger value="roles">الأدوار</TabsTrigger>
          <TabsTrigger value="permissions">الصلاحيات</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <AdminUsersList />
        </TabsContent>

        <TabsContent value="roles">
          <RolesManagement />
        </TabsContent>

        <TabsContent value="permissions">
          <PermissionsMatrix />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// مصفوفة الصلاحيات
const permissions = {
  cars: {
    view: 'عرض السيارات',
    create: 'إضافة سيارة',
    edit: 'تعديل السيارات',
    delete: 'حذف السيارات',
  },
  bookings: {
    view: 'عرض الحجوزات',
    create: 'إنشاء حجز',
    edit: 'تعديل الحجوزات',
    confirm: 'تأكيد الحجوزات',
    cancel: 'إلغاء الحجوزات',
  },
  customers: {
    view: 'عرض العملاء',
    edit: 'تعديل العملاء',
    delete: 'حذف العملاء',
  },
  payments: {
    view: 'عرض المدفوعات',
    create: 'تسجيل مدفوعات',
    refund: 'استرداد مدفوعات',
  },
  reports: {
    view: 'عرض التقارير',
    export: 'تصدير التقارير',
  },
  settings: {
    view: 'عرض الإعدادات',
    edit: 'تعديل الإعدادات',
  },
};
```

---

## ➡️ Weiter zu: 06_3D_VISUALISIERUNG.md
