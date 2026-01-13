# 🏠 الصفحة الرئيسية - Landing Page
# Hauptseite mit modernem Design

---

## 🎨 Design-Konzept

### Farbpalette
```css
:root {
  /* Primärfarben */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-200: #bfdbfe;
  --primary-300: #93c5fd;
  --primary-400: #60a5fa;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --primary-800: #1e40af;
  --primary-900: #1e3a8a;

  /* Sekundärfarben (Gold/Luxus) */
  --secondary-50: #fffbeb;
  --secondary-100: #fef3c7;
  --secondary-200: #fde68a;
  --secondary-300: #fcd34d;
  --secondary-400: #fbbf24;
  --secondary-500: #f59e0b;

  /* Neutrale Farben */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-800: #1f2937;
  --gray-900: #111827;

  /* Status */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
}
```

### Typografie (Arabisch)
```css
/* Arabische Schriftarten */
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&display=swap');

body {
  font-family: 'Tajawal', 'Cairo', sans-serif;
  direction: rtl;
  text-align: right;
}
```

---

## 📱 Komponenten der Landing Page

### 1. Header / Navigation (الترويسة)

```tsx
// components/landing/Header.tsx

interface HeaderProps {
  isScrolled: boolean;
}

/*
الميزات:
- Logo على اليمين (RTL)
- قائمة التنقل الرئيسية
- زر تسجيل الدخول / التسجيل
- تغيير اللغة (عربي/إنجليزي)
- شريط ثابت عند التمرير (Sticky)
- خلفية شفافة تصبح صلبة عند التمرير
- قائمة الهاتف المحمول (Hamburger Menu)
*/

// القائمة الرئيسية
const navItems = [
  { label: 'الرئيسية', href: '/' },
  { label: 'السيارات', href: '/cars' },
  { label: 'الأسعار', href: '/pricing' },
  { label: 'الفروع', href: '/branches' },
  { label: 'من نحن', href: '/about' },
  { label: 'اتصل بنا', href: '/contact' },
];
```

**تصميم الترويسة:**
- ارتفاع: 80px (سطح المكتب) / 64px (الهاتف)
- خلفية: شفافة → أبيض مع ظل عند التمرير
- لوغو متحرك مع تأثير hover
- أزرار بتأثيرات انتقالية سلسة

---

### 2. Hero Section (القسم البطل)

```tsx
// components/landing/HeroSection.tsx

/*
الميزات:
- خلفية فيديو أو صورة متحركة
- عرض سيارة 3D تفاعلية (Three.js)
- عنوان رئيسي متحرك
- نموذج البحث السريع
- إحصائيات متحركة
- أزرار CTA
*/

interface HeroSearchForm {
  pickupLocation: string;    // موقع الاستلام
  returnLocation: string;    // موقع الإرجاع
  pickupDate: Date;          // تاريخ الاستلام
  returnDate: Date;          // تاريخ الإرجاع
  carCategory?: CarCategory; // فئة السيارة
}
```

**العناصر:**

```jsx
<section className="hero-section">
  {/* خلفية متحركة */}
  <div className="hero-background">
    <video autoPlay muted loop playsInline>
      <source src="/videos/hero-bg.mp4" type="video/mp4" />
    </video>
    <div className="hero-overlay" /> {/* تدرج شفاف */}
  </div>

  {/* المحتوى */}
  <div className="hero-content">
    <motion.h1
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      استأجر سيارة أحلامك في سوريا
    </motion.h1>

    <motion.p
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      أفضل الأسعار • أحدث السيارات • خدمة 24/7
    </motion.p>

    {/* نموذج البحث */}
    <SearchForm />

    {/* إحصائيات */}
    <div className="hero-stats">
      <StatCounter value={500} label="سيارة متاحة" />
      <StatCounter value={10000} label="عميل سعيد" />
      <StatCounter value={15} label="فرع" />
      <StatCounter value={5} label="سنوات خبرة" />
    </div>
  </div>

  {/* سيارة 3D */}
  <div className="hero-3d-car">
    <Car3DViewer modelUrl="/models/featured-car.glb" />
  </div>
</section>
```

**CSS Styles:**
```css
.hero-section {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  inset: 0;
  z-index: -1;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(30, 64, 175, 0.9) 0%,
    rgba(37, 99, 235, 0.7) 50%,
    rgba(59, 130, 246, 0.5) 100%
  );
}

.hero-content {
  max-width: 600px;
  padding: 2rem;
  color: white;
}

.hero-3d-car {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 60%;
  height: 80%;
  pointer-events: auto;
}
```

---

### 3. نموذج البحث (Search Form)

```tsx
// components/landing/SearchForm.tsx

/*
مكونات النموذج:
1. موقع الاستلام (Dropdown مع Autocomplete)
2. موقع الإرجاع (مع خيار "نفس الموقع")
3. تاريخ الاستلام (Date Picker)
4. وقت الاستلام (Time Picker)
5. تاريخ الإرجاع (Date Picker)
6. وقت الإرجاع (Time Picker)
7. زر البحث
*/

const SearchForm = () => {
  return (
    <motion.form
      className="search-form"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <div className="search-form-grid">
        {/* موقع الاستلام */}
        <div className="form-group">
          <label>
            <MapPinIcon />
            موقع الاستلام
          </label>
          <LocationSelect
            placeholder="اختر موقع الاستلام"
            options={branches}
          />
        </div>

        {/* تاريخ ووقت الاستلام */}
        <div className="form-group">
          <label>
            <CalendarIcon />
            تاريخ الاستلام
          </label>
          <DateTimePicker
            minDate={new Date()}
            placeholder="اختر التاريخ"
          />
        </div>

        {/* تاريخ ووقت الإرجاع */}
        <div className="form-group">
          <label>
            <CalendarIcon />
            تاريخ الإرجاع
          </label>
          <DateTimePicker
            minDate={pickupDate}
            placeholder="اختر التاريخ"
          />
        </div>

        {/* زر البحث */}
        <button type="submit" className="search-btn">
          <SearchIcon />
          ابحث عن سيارة
        </button>
      </div>
    </motion.form>
  );
};
```

**تصميم النموذج:**
```css
.search-form {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.search-form-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.search-btn {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(37, 99, 235, 0.3);
}
```

---

### 4. قسم الفئات (Categories Section)

```tsx
// components/landing/CategoriesSection.tsx

const categories = [
  {
    id: 'economy',
    nameAr: 'اقتصادية',
    icon: '🚗',
    image: '/images/categories/economy.jpg',
    description: 'سيارات موفرة للوقود بأسعار مناسبة',
    startingPrice: 50000, // ليرة سورية
  },
  {
    id: 'suv',
    nameAr: 'دفع رباعي',
    icon: '🚙',
    image: '/images/categories/suv.jpg',
    description: 'مثالية للرحلات والطرق الوعرة',
    startingPrice: 100000,
  },
  {
    id: 'luxury',
    nameAr: 'فاخرة',
    icon: '🏎️',
    image: '/images/categories/luxury.jpg',
    description: 'أفخم السيارات لتجربة استثنائية',
    startingPrice: 200000,
  },
  {
    id: 'van',
    nameAr: 'عائلية',
    icon: '🚐',
    image: '/images/categories/van.jpg',
    description: 'مساحة واسعة للعائلة والأمتعة',
    startingPrice: 80000,
  },
];

const CategoriesSection = () => {
  return (
    <section className="categories-section">
      <div className="container">
        <SectionTitle
          title="اختر فئة السيارة"
          subtitle="تشكيلة واسعة تناسب جميع احتياجاتك"
        />

        <div className="categories-grid">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              className="category-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="category-image">
                <img src={category.image} alt={category.nameAr} />
                <div className="category-overlay">
                  <span className="category-icon">{category.icon}</span>
                </div>
              </div>
              <div className="category-content">
                <h3>{category.nameAr}</h3>
                <p>{category.description}</p>
                <div className="category-price">
                  يبدأ من <span>{formatPrice(category.startingPrice)}</span> / يوم
                </div>
                <Link to={`/cars?category=${category.id}`} className="category-btn">
                  عرض السيارات
                  <ArrowLeftIcon /> {/* RTL */}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

---

### 5. السيارات المميزة (Featured Cars)

```tsx
// components/landing/FeaturedCars.tsx

const FeaturedCars = () => {
  const { data: cars, isLoading } = useQuery({
    queryKey: ['featured-cars'],
    queryFn: () => carsService.getFeatured(),
  });

  return (
    <section className="featured-cars-section">
      <div className="container">
        <SectionTitle
          title="السيارات المميزة"
          subtitle="أفضل سياراتنا المختارة لك"
        />

        {isLoading ? (
          <CarsSkeleton count={4} />
        ) : (
          <div className="cars-slider">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000 }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
            >
              {cars?.map((car) => (
                <SwiperSlide key={car.id}>
                  <CarCard car={car} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        <div className="section-footer">
          <Link to="/cars" className="view-all-btn">
            عرض جميع السيارات
            <ArrowLeftIcon />
          </Link>
        </div>
      </div>
    </section>
  );
};
```

**بطاقة السيارة:**
```tsx
// components/common/CarCard.tsx

const CarCard = ({ car }: { car: Car }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <motion.div
      className="car-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
    >
      {/* شارات */}
      <div className="car-badges">
        {car.isFeatured && <span className="badge featured">مميزة</span>}
        {car.discount && <span className="badge discount">-{car.discount}%</span>}
      </div>

      {/* زر المفضلة */}
      <button
        className={`favorite-btn ${isFavorite ? 'active' : ''}`}
        onClick={() => setIsFavorite(!isFavorite)}
      >
        <HeartIcon filled={isFavorite} />
      </button>

      {/* الصورة */}
      <div className="car-image">
        <img src={car.mainImage} alt={`${car.brand} ${car.model}`} />
        {isHovered && (
          <motion.div
            className="car-quick-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button className="quick-view-btn">
              <EyeIcon />
              معاينة سريعة
            </button>
          </motion.div>
        )}
      </div>

      {/* المحتوى */}
      <div className="car-content">
        <div className="car-category">{getCategoryName(car.category)}</div>
        <h3 className="car-title">{car.brand} {car.model} {car.year}</h3>

        {/* المواصفات */}
        <div className="car-specs">
          <span><UsersIcon /> {car.seats} مقاعد</span>
          <span><GearIcon /> {getTransmissionName(car.transmission)}</span>
          <span><FuelIcon /> {getFuelName(car.fuelType)}</span>
        </div>

        {/* التقييم */}
        <div className="car-rating">
          <StarRating rating={car.avgRating} />
          <span>({car.reviewCount} تقييم)</span>
        </div>

        {/* السعر */}
        <div className="car-price">
          <div className="price-amount">
            {formatPrice(car.pricePerDay)}
            <span className="price-period">/ يوم</span>
          </div>
          {car.oldPrice && (
            <span className="old-price">{formatPrice(car.oldPrice)}</span>
          )}
        </div>

        {/* الأزرار */}
        <div className="car-actions">
          <Link to={`/cars/${car.id}`} className="details-btn">
            التفاصيل
          </Link>
          <Link to={`/booking/${car.id}`} className="book-btn">
            احجز الآن
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
```

---

### 6. كيف تعمل الخدمة (How It Works)

```tsx
// components/landing/HowItWorks.tsx

const steps = [
  {
    number: 1,
    icon: <SearchIcon />,
    title: 'ابحث عن سيارة',
    description: 'اختر موقع الاستلام والتاريخ وابحث عن السيارة المناسبة',
  },
  {
    number: 2,
    icon: <CarIcon />,
    title: 'اختر سيارتك',
    description: 'قارن بين السيارات واختر ما يناسب احتياجاتك وميزانيتك',
  },
  {
    number: 3,
    icon: <CreditCardIcon />,
    title: 'احجز وادفع',
    description: 'أكمل الحجز بسهولة واختر طريقة الدفع المناسبة',
  },
  {
    number: 4,
    icon: <KeyIcon />,
    title: 'استلم سيارتك',
    description: 'توجه إلى الفرع في الموعد المحدد واستلم مفاتيح سيارتك',
  },
];

const HowItWorks = () => {
  return (
    <section className="how-it-works">
      <div className="container">
        <SectionTitle
          title="كيف تستأجر سيارة؟"
          subtitle="أربع خطوات بسيطة للحصول على سيارتك"
        />

        <div className="steps-container">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="step-card"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div className="step-number">{step.number}</div>
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              {index < steps.length - 1 && (
                <div className="step-connector">
                  <ArrowLeftIcon />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

---

### 7. المزايا والخدمات (Features)

```tsx
// components/landing/FeaturesSection.tsx

const features = [
  {
    icon: <ShieldCheckIcon />,
    title: 'تأمين شامل',
    description: 'جميع سياراتنا مؤمنة بشكل كامل لراحة بالك',
  },
  {
    icon: <Clock24Icon />,
    title: 'دعم 24/7',
    description: 'فريق دعم متاح على مدار الساعة لمساعدتك',
  },
  {
    icon: <MapIcon />,
    title: 'توصيل مجاني',
    description: 'نوصل السيارة لموقعك في المدن الرئيسية',
  },
  {
    icon: <CurrencyIcon />,
    title: 'أفضل الأسعار',
    description: 'أسعار تنافسية وعروض حصرية لعملائنا',
  },
  {
    icon: <CarServiceIcon />,
    title: 'سيارات جديدة',
    description: 'أسطول حديث من أحدث موديلات السيارات',
  },
  {
    icon: <DocumentIcon />,
    title: 'إجراءات سهلة',
    description: 'حجز سريع بدون تعقيدات أو إجراءات طويلة',
  },
];

const FeaturesSection = () => {
  return (
    <section className="features-section">
      <div className="container">
        <SectionTitle
          title="لماذا تختارنا؟"
          subtitle="خدمات متميزة تجعل تجربتك استثنائية"
        />

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

---

### 8. آراء العملاء (Testimonials)

```tsx
// components/landing/TestimonialsSection.tsx

const TestimonialsSection = () => {
  const { data: testimonials } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => reviewsService.getTopReviews(6),
  });

  return (
    <section className="testimonials-section">
      {/* خلفية متحركة */}
      <div className="testimonials-bg">
        <div className="floating-shapes" />
      </div>

      <div className="container">
        <SectionTitle
          title="ماذا يقول عملاؤنا"
          subtitle="آراء حقيقية من عملاء سعداء"
          light
        />

        <div className="testimonials-carousel">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000 }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {testimonials?.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <TestimonialCard testimonial={testimonial} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* إحصائيات التقييم */}
        <div className="rating-stats">
          <div className="overall-rating">
            <span className="rating-number">4.8</span>
            <StarRating rating={4.8} size="large" />
            <span className="rating-count">بناءً على 5,000+ تقييم</span>
          </div>
        </div>
      </div>
    </section>
  );
};
```

---

### 9. الفروع والمواقع (Branches)

```tsx
// components/landing/BranchesSection.tsx

const BranchesSection = () => {
  return (
    <section className="branches-section">
      <div className="container">
        <SectionTitle
          title="فروعنا في سوريا"
          subtitle="نخدمك في جميع المحافظات السورية"
        />

        <div className="branches-layout">
          {/* خريطة تفاعلية */}
          <div className="branches-map">
            <SyriaMap
              branches={branches}
              onBranchClick={(branch) => setSelectedBranch(branch)}
            />
          </div>

          {/* قائمة الفروع */}
          <div className="branches-list">
            {branches.map((branch) => (
              <BranchCard key={branch.id} branch={branch} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// المحافظات السورية
const governorates = [
  'دمشق',
  'ريف دمشق',
  'حلب',
  'حمص',
  'حماة',
  'اللاذقية',
  'طرطوس',
  'إدلب',
  'دير الزور',
  'الحسكة',
  'الرقة',
  'درعا',
  'السويداء',
  'القنيطرة',
];
```

---

### 10. التطبيق والتحميل (App Download CTA)

```tsx
// components/landing/AppDownloadSection.tsx

const AppDownloadSection = () => {
  return (
    <section className="app-download-section">
      <div className="container">
        <div className="app-content">
          <div className="app-text">
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              حمّل تطبيقنا الآن
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              احجز سيارتك بسهولة من هاتفك في أي وقت ومن أي مكان
            </motion.p>

            <div className="app-features">
              <div className="app-feature">
                <CheckIcon />
                <span>حجز سريع وسهل</span>
              </div>
              <div className="app-feature">
                <CheckIcon />
                <span>إشعارات فورية</span>
              </div>
              <div className="app-feature">
                <CheckIcon />
                <span>عروض حصرية للتطبيق</span>
              </div>
            </div>

            <div className="download-buttons">
              <a href="#" className="store-btn app-store">
                <AppleIcon />
                <div>
                  <span>حمّل من</span>
                  <strong>App Store</strong>
                </div>
              </a>
              <a href="#" className="store-btn play-store">
                <GooglePlayIcon />
                <div>
                  <span>حمّل من</span>
                  <strong>Google Play</strong>
                </div>
              </a>
            </div>
          </div>

          {/* صورة الهاتف */}
          <div className="app-mockup">
            <motion.img
              src="/images/app-mockup.png"
              alt="تطبيق الهاتف"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
```

---

### 11. Footer (التذييل)

```tsx
// components/landing/Footer.tsx

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            {/* معلومات الشركة */}
            <div className="footer-section company-info">
              <img src="/logo.svg" alt="Logo" className="footer-logo" />
              <p>
                شركة رائدة في تأجير السيارات في سوريا، نقدم خدمات متميزة
                وأسطول حديث من السيارات لتلبية جميع احتياجاتكم.
              </p>
              <div className="social-links">
                <a href="#"><FacebookIcon /></a>
                <a href="#"><InstagramIcon /></a>
                <a href="#"><TwitterIcon /></a>
                <a href="#"><WhatsAppIcon /></a>
              </div>
            </div>

            {/* روابط سريعة */}
            <div className="footer-section">
              <h4>روابط سريعة</h4>
              <ul>
                <li><Link to="/">الرئيسية</Link></li>
                <li><Link to="/cars">السيارات</Link></li>
                <li><Link to="/about">من نحن</Link></li>
                <li><Link to="/contact">اتصل بنا</Link></li>
                <li><Link to="/faq">الأسئلة الشائعة</Link></li>
              </ul>
            </div>

            {/* خدماتنا */}
            <div className="footer-section">
              <h4>خدماتنا</h4>
              <ul>
                <li><Link to="/cars?category=economy">سيارات اقتصادية</Link></li>
                <li><Link to="/cars?category=luxury">سيارات فاخرة</Link></li>
                <li><Link to="/cars?category=suv">سيارات دفع رباعي</Link></li>
                <li><Link to="/long-term">إيجار طويل الأمد</Link></li>
                <li><Link to="/corporate">خدمات الشركات</Link></li>
              </ul>
            </div>

            {/* معلومات الاتصال */}
            <div className="footer-section contact-info">
              <h4>تواصل معنا</h4>
              <ul>
                <li>
                  <PhoneIcon />
                  <a href="tel:+963999999999">+963 999 999 999</a>
                </li>
                <li>
                  <MailIcon />
                  <a href="mailto:info@carrental.sy">info@carrental.sy</a>
                </li>
                <li>
                  <MapPinIcon />
                  <span>دمشق، شارع الحمرا، بناء رقم 123</span>
                </li>
                <li>
                  <ClockIcon />
                  <span>السبت - الخميس: 8 ص - 8 م</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* النشرة البريدية */}
      <div className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h4>اشترك في نشرتنا البريدية</h4>
            <p>احصل على أحدث العروض والأخبار</p>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
              />
              <button type="submit">اشترك</button>
            </form>
          </div>
        </div>
      </div>

      {/* حقوق النشر */}
      <div className="footer-bottom">
        <div className="container">
          <p>© 2024 جميع الحقوق محفوظة - شركة تأجير السيارات</p>
          <div className="footer-links">
            <Link to="/privacy">سياسة الخصوصية</Link>
            <Link to="/terms">الشروط والأحكام</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
```

---

## ➡️ Weiter zu: 04_KUNDENPORTAL.md
