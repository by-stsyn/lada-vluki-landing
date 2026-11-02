import { useState, useEffect } from 'react';
import { Phone, MapPin, Clock, Menu, X, RefreshCw, TrendingUp } from 'lucide-react';
import Modal from './components/Modal';
import ContactForm from './components/ContactForm';
import TestDriveForm from './components/TestDriveForm';
import TradeInForm from './components/TradeInForm';
import CarSlider from './components/CarSlider';
import CreditCalculator from './components/CreditCalculator';
import { CarsInStock } from './components/CarsInStock';
import Contacts from './components/Contacts';
import CarDetailsPage from './CarDetailsPage';
import { saveUtmParams, trackGoal } from './components/calltouch';

function App() {
  const [modalType, setModalType] = useState<'contact' | 'testdrive' | null>(null);
  const [selectedCar, setSelectedCar] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);

  useEffect(() => {
    saveUtmParams();
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleReserve = (car: any) => {
    const carModelName = [car.brand, car.model, car.complectation].filter(Boolean).join(' ');
    setSelectedCar(carModelName);
    setModalType('contact');
  };
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileMenuOpen(false);
    }
  };

  const carModels = [
    { name: 'Granta', id: 'granta', price: 'от 680 000 ₽' },
    { name: 'Granta Cross', id: 'granta-cross', price: 'от 912 000 ₽' },
    { name: 'Vesta', id: 'vesta', price: 'от 1 222 400 ₽' },
    { name: 'Vesta Cross', id: 'vesta-cross', price: 'от 1 552 800 ₽' },
    { name: 'Largus', id: 'largus', price: 'от 1 461 000 ₽' },
    { name: 'Iskra', id: 'iskra', price: 'от 1 093 600 ₽' },
    { name: 'Niva Legend', id: 'niva-legend', price: 'от 868 000 ₽' },
    { name: 'Niva Travel', id: 'niva-travel', price: 'от 1 282 400 ₽' },
  ];

  const heroSlides = [
    {
      id: 'granta',
      tabLabel: '01. LADA Granta',
      kicker: 'Официальный дилер LADA в Великих Луках',
      title: 'Купи LADA Granta с выгодой до 300 000 ₽ и подарками от Прагматика',
      subtitle: 'Госпрограмма до -20%, дополнительное оборудование до 100 000 ₽ или антикор в подарок на выбор, а также полный бак бензина иногородним.',
      priceTag: 'от 680 000 ₽',
      benefitTag: 'Выгода до 300 000 ₽',
      image: '/promo-lada.webp',
      carName: 'LADA Granta',
    },
    {
      id: 'iskra',
      tabLabel: '02. Новая Iskra',
      kicker: 'Долгожданная новинка в наличии',
      title: 'Новая LADA Iskra с выгодой до 350 000 ₽ в Великих Луках',
      subtitle: 'Выразительный дизайн, дорожный просвет 170 мм и современные технологии комфорта. Испытайте новинку на бесплатном тест-драйве.',
      priceTag: 'от 1 093 600 ₽',
      benefitTag: 'Выгода до 350 000 ₽',
      image: '/lada/iskra-1.jpg',
      carName: 'LADA Iskra',
    },
    {
      id: 'vesta',
      tabLabel: '03. Семейство Vesta',
      kicker: 'Флагман модельного ряда LADA',
      title: 'LADA Vesta и Vesta Cross с выгодой от 520 000 ₽',
      subtitle: 'Просторный салон, энергоемкая подвеска и специальные условия обмена по программе Trade-In с дополнительной скидкой до 130 000 ₽.',
      priceTag: 'от 1 222 400 ₽',
      benefitTag: 'Выгода от 520 000 ₽',
      image: '/lada/vesta-cross-1.jpg',
      carName: 'LADA Vesta',
    },
    {
      id: 'niva-travel',
      tabLabel: '04. Внедорожники Niva 4×4',
      kicker: 'Легендарный полный привод',
      title: 'LADA Niva Travel и Niva Legend с выгодой до 360 000 ₽',
      subtitle: 'Честный постоянный полный привод 4×4 и клиренс до 220 мм для любых дорог. Автомобили с ПТС в наличии в дилерском центре.',
      priceTag: 'от 868 000 ₽',
      benefitTag: 'Выгода до 360 000 ₽',
      image: '/lada/niva-travel-1.jpg',
      carName: 'LADA Niva',
    },
  ];

  const [activeSlide, setActiveSlide] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);

  useEffect(() => {
    if (heroPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [heroPaused, heroSlides.length]);

  const cars = [
    { id: 'granta', name: 'Granta', badge: 'ХИТ ПРОДАЖ', price: 'от 680 000 ₽', benefit: 'Выгода до 300 000 ₽', images: ['/lada/granta-1.jpg', '/lada/granta-2.jpg', '/lada/granta-3.jpg', '/lada/granta-4.jpg'], specs: ['Седан', '1.6 л / 90 л.с.', '5МТ/АМТ', 'Передний привод'], features: ['Габариты: 4268×1700×1500 мм', 'Колёсная база: 2476 мм', 'Дорожный просвет: 180 мм', 'Разгон до 100 км/ч: 11.2 с', 'Макс. скорость: 179 км/ч', 'Расход: 6.8 л/100 км (смешанный)', 'Багажник: 520-815 л',], },
    { id: 'granta-cross', name: 'Granta Cross', badge: 'БЕЗДОРОЖЬЕ', price: 'от 912 000 ₽', benefit: 'Выгода до 300 000 ₽', images: ['/lada/granta-cross-1.jpg', '/lada/granta-cross-2.jpg', '/lada/granta-cross-3.jpg', '/lada/granta-cross-4.jpg'], specs: ['Универсал', '1.6 л / 98 л.с.', '5МТ', 'Передний привод'], features: ['Габариты: 4148×1700×1560 мм', 'Колёсная база: 2476 мм', 'Дорожный просвет: 198 мм', 'Разгон до 100 км/ч: 11.2 с', 'Макс. скорость: 172 км/ч', 'Расход: 6.8 л/100 км (смешанный)', 'Багажник: 355-670 л',], },
    { id: 'vesta', name: 'Vesta', badge: 'ПОПУЛЯРНАЯ', price: 'от 1 222 400 ₽', benefit: 'Выгода от 520 000 ₽', images: ['/lada/vesta-1.jpg', '/lada/vesta-2.jpg', '/lada/vesta-3.jpg', '/lada/vesta-4.jpg'], specs: ['Седан', '1.6-1.8 л / 106-122 л.с.', '5МТ', 'Передний привод'], features: ['Габариты: 4440×1764×1496 мм', 'Колёсная база: 2635 мм', 'Дорожный просвет: 171 мм', 'Разгон до 100 км/ч: 11.3 с', 'Макс. скорость: 182 км/ч', 'Расход: 7.3 л/100 км (смешанный)', 'Багажник: 480 л',], },
    { id: 'vesta-cross', name: 'Vesta Cross', badge: 'БЕЗДОРОЖЬЕ', price: 'от 1 552 800 ₽', benefit: 'Выгода до 480 000 ₽', images: ['/lada/vesta-cross-1.jpg', '/lada/vesta-cross-2.jpg', '/lada/vesta-cross-3.jpg', '/lada/vesta-cross-4.jpg'], specs: ['Универсал', '1.6-1.8 л / 106-122 л.с.', '5МТ/АМТ', 'Передний привод'], features: ['Габариты: 4445×1785×1522 мм', 'Колёсная база: 2635 мм', 'Дорожный просвет: 203 мм', 'Разгон до 100 км/ч: 12.6 с', 'Макс. скорость: 178 км/ч', 'Расход: 7.5 л/100 км (смешанный)', 'Багажник: 480-825 л',], },
    { id: 'largus', name: 'Largus', badge: 'СЕМЕЙНЫЙ', price: 'от 1 461 000 ₽', benefit: 'Выгода от 530 000 ₽', images: ['/lada/largus-1.jpg', '/lada/largus-2.jpg', '/lada/largus-3.jpg', '/lada/largus-4.jpg'], specs: ['Универсал/Фургон', '1.6 л / 90-106 л.с.', '5МТ', 'Передний привод'], features: ['Габариты: 4488×1735×1628 мм', 'Колёсная база: 2905 мм', 'Дорожный просвет: 172 мм', 'Разгон до 100 км/ч: 13.5-14 с', 'Макс. скорость: 160 км/ч', 'Расход: 7.5-7.8 л/100 км (смешанный)', 'Багажник: 560 л',], },
    { id: 'iskra', name: 'Iskra', badge: 'НОВИНКА', price: 'от 1 093 600 ₽', benefit: 'Выгода до 350 000 ₽', images: ['/lada/iskra-1.jpg', '/lada/iskra-2.jpg', '/lada/iskra-cross-3.jpeg', '/lada/iskra-cross-4.jpeg'], specs: ['Седан', '1.6 л / 90-106 л.с.', '5МТ/6МТ/ВТ', 'Передний привод'], features: ['Габариты: 4333×1777×1517 мм', 'Колёсная база: 2603 мм', 'Дорожный просвет: 170 мм', 'Разгон до 100 км/ч: 12.3 с', 'Макс. скорость: 177 км/ч', 'Расход: 7.8 л/100 км (смешанный)', 'Багажник: 500 л (седан), 480 л (универсал)',], },
    { id: 'niva-legend', name: 'Niva Legend', badge: 'ЛЕГЕНДА', price: 'от 868 000 ₽', benefit: 'Выгода до 350 000 ₽', images: ['/lada/niva-legend-1.jpg', '/lada/niva-legend-2.jpg', '/lada/niva-legend-3.jpg', '/lada/niva-legend-4.jpg'], specs: ['Внедорожник', '1.7 л / 83 л.с.', '5МТ', 'Полный привод 4x4'], features: ['Габариты: 3740×1680×1640 мм', 'Колёсная база: 2200 мм', 'Дорожный просвет: 200 мм', 'Разгон до 100 км/ч: 17 с', 'Макс. скорость: 142 км/ч', 'Расход: 9.9 л/100 км (смешанный)', 'Багажник: 265-585 л',], },
    { id: 'niva-travel', name: 'Niva Travel', badge: 'ПРИКЛЮЧЕНИЯ', price: 'от 1 282 400 ₽', benefit: 'Выгода до 360 000 ₽', images: ['/lada/niva-travel-1.jpg', '/lada/niva-travel-2.jpg', '/lada/niva-travel-3.jpg', '/lada/niva-travel-4.jpg'], specs: ['Внедорожник', '1.8 л / 90 л.с.', '5МТ', 'Полный привод 4x4'], features: ['Габариты: 4099×1804×1690 мм', 'Колёсная база: 2450 мм', 'Дорожный просвет: 220 мм', 'Разгон до 100 км/ч: 19 с', 'Макс. скорость: 140 км/ч', 'Расход: 10.2 л/100 км (смешанный)', 'Багажник: 320-650 л',], },
  ];

  const handleSuccess = () => {
    setModalType(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedCar('');
  };

  const openCarModal = (carName: string) => {
    setSelectedCar(carName);
    setModalType('contact');
  };

  const menuItems = [
    { label: 'Модельный ряд', href: 'models' },
    { label: 'В наличии', href: 'stock' },
    { label: 'Тест-драйв', href: 'test-drive' },
    { label: 'Трейд-ин', href: 'trade-in' },
    { label: 'Кредит', href: 'credit' },
    { label: 'Контакты', href: 'contacts' },
  ];

  if (currentPath.startsWith('/car/')) {
    const carId = decodeURIComponent(currentPath.split('/car/')[1] || '');
    return <CarDetailsPage carId={carId} />;
  }

  const currentHero = heroSlides[activeSlide];
  
  return (
    <div className="min-h-screen bg-white">
      {/* Фирменная шапка в стиле официального дилера LADA (lada.ru) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        {/* Верхняя информационная плашка дилера (Адрес и Режим работы) */}
        <div className="hidden lg:block bg-[#26303a] text-gray-200 text-xs border-b border-white/10">
          <div className="container mx-auto px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-300 font-medium">
              <span>Официальный дилер LADA в Псковской области</span>
              <span aria-hidden="true" className="text-gray-500">·</span>
              <span className="text-white font-semibold">Прагматика Великие Луки</span>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => scrollToSection('contacts')}
                className="flex items-center gap-1.5 text-gray-200 hover:text-[#ff6700] transition whitespace-nowrap"
              >
                <MapPin className="w-3.5 h-3.5 text-[#ff6700] shrink-0" />
                <span>г. Великие Луки, ул. Гоголя, 4</span>
              </button>
              <span aria-hidden="true" className="text-gray-600">|</span>
              <div className="flex items-center gap-1.5 text-gray-200 whitespace-nowrap">
                <Clock className="w-3.5 h-3.5 text-[#ff6700] shrink-0" />
                <span>Ежедневно: 08:00 – 20:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Основная навигационная панель */}
        <div className="container mx-auto px-4 py-3.5">
          <div className="flex items-center justify-between gap-4">
            {/* Логотип LADA + название дилера */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-3 text-left group"
              >
                <img src="/logo-lada.svg" alt="LADA" className="h-7 sm:h-8 transition-transform group-hover:scale-[1.02]" />
                <span className="h-6 w-px bg-gray-300 hidden sm:block" />
                <div className="hidden sm:block">
                  <div className="text-sm font-extrabold tracking-tight text-[#26303a] leading-none">
                    ПРАГМАТИКА
                  </div>
                  <div className="text-[11px] font-medium text-gray-500 mt-0.5 leading-none">
                    Великие Луки · ул. Гоголя, 4
                  </div>
                </div>
              </button>
            </div>

            {/* Навигация по разделам (стиль lada.ru) */}
            <nav className="hidden xl:flex items-center gap-7">
              {menuItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="relative py-1 text-sm font-bold text-[#26303a] hover:text-[#ff6700] transition-colors whitespace-nowrap shrink-0 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#ff6700] hover:after:w-full after:transition-all"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Контактный блок и CTA в шапке */}
            <div className="flex items-center gap-3 sm:gap-5 shrink-0">
              <div className="text-right">
                <a
                  href="tel:+78115395565"
                  className="flex items-center gap-2 text-sm sm:text-base font-extrabold text-[#26303a] hover:text-[#ff6700] transition tabular-nums whitespace-nowrap"
                  onClick={() => trackGoal('zvonok')}
                >
                  <span className="w-8 h-8 rounded-lg bg-[#ff6700]/10 text-[#ff6700] flex items-center justify-center sm:hidden">
                    <Phone className="w-4 h-4" />
                  </span>
                  <Phone className="w-4 h-4 text-[#ff6700] hidden sm:inline shrink-0" />
                  <span>+7 (811) 539-55-65</span>
                </a>
                <div className="hidden sm:block text-[11px] text-gray-500 font-medium leading-none mt-0.5">
                  Ежедневно с 08:00 до 20:00
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedCar('');
                  setModalType('contact');
                }}
                className="hidden md:inline-flex items-center justify-center bg-[#ff6700] hover:bg-[#e55c00] text-white text-sm font-bold px-5 py-2.5 rounded-lg transition shadow-sm whitespace-nowrap shrink-0"
              >
                Заказать звонок
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Меню"
                className="xl:hidden p-2 rounded-lg text-[#26303a] hover:bg-gray-100 transition"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Компактная строка адреса для мобильных экранов */}
          <div className="flex lg:hidden items-center justify-between text-[11px] text-gray-600 pt-2 mt-2 border-t border-gray-100">
            <button
              onClick={() => scrollToSection('contacts')}
              className="flex items-center gap-1 hover:text-[#ff6700] transition truncate"
            >
              <MapPin className="w-3 h-3 text-[#ff6700] shrink-0" />
              <span className="truncate">Великие Луки, ул. Гоголя, 4</span>
            </button>
            <div className="flex items-center gap-1 shrink-0">
              <Clock className="w-3 h-3 text-[#ff6700] shrink-0" />
              <span>08:00 – 20:00</span>
            </div>
          </div>

          {/* Выпадающее мобильное меню */}
          {mobileMenuOpen && (
            <nav className="xl:hidden mt-3 pt-3 border-t border-gray-200 pb-2 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left py-2.5 px-2 rounded-lg text-sm font-bold text-[#26303a] hover:bg-gray-50 hover:text-[#ff6700] transition"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSelectedCar('');
                    setModalType('contact');
                  }}
                  className="w-full bg-[#ff6700] text-white px-5 py-3 rounded-lg text-sm font-bold hover:bg-[#e55c00] transition shadow-sm"
                >
                  Оставить заявку
                </button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Главный Hero-блок в фирменном стиле LADA (lada.ru) */}
      <section
        id="hero"
        onMouseEnter={() => setHeroPaused(true)}
        onMouseLeave={() => setHeroPaused(false)}
        className="relative bg-[#182026] text-white overflow-hidden"
      >
        {/* Фоновое изображение активного слайда с выверенным градиентным сведением */}
        <div className="absolute inset-0">
          <img
            key={currentHero.image}
            src={currentHero.image}
            alt={currentHero.carName}
            className="w-full h-full object-cover object-center transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141b21]/95 via-[#182026]/80 to-[#182026]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141b21] via-transparent to-black/25" />
        </div>

        {/* Основной контент Hero */}
        <div className="container mx-auto px-4 pt-10 pb-8 lg:pt-16 lg:pb-12 relative z-10">
          <div className="max-w-3xl">
            {/* Кикер в стиле брендбука LADA */}
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wider uppercase text-[#ff6700] mb-4">
              <span>{currentHero.kicker}</span>
              <span aria-hidden="true" className="text-white/40">·</span>
              <span className="text-white/90">{currentHero.benefitTag}</span>
            </div>

            {/* Главный заголовок */}
            <h1
              className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold leading-[1.12] tracking-tight text-white mb-4"
              style={{ textWrap: 'balance' } as React.CSSProperties}
            >
              {currentHero.title}
            </h1>

            {/* Подзаголовок */}
            <p className="text-sm sm:text-base lg:text-lg text-gray-200 max-w-2xl mb-7 leading-relaxed">
              {currentHero.subtitle}
            </p>

            {/* Ключевые условия дилерского центра (4 архитектурных блока без лишних рамок) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 max-w-2xl">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3.5">
                <div className="text-xs text-gray-300 mb-0.5">Цена модели</div>
                <div className="text-base sm:text-lg font-extrabold text-white tabular-nums">
                  {currentHero.priceTag}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3.5">
                <div className="text-xs text-gray-300 mb-0.5">Госпрограмма</div>
                <div className="text-base sm:text-lg font-extrabold text-[#ff6700] tabular-nums">
                  Выгода до -20%
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3.5">
                <div className="text-xs text-gray-300 mb-0.5">Подарок на выбор</div>
                <div className="text-sm sm:text-base font-extrabold text-white leading-tight">
                  Допы до 100к / Антикор
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3.5">
                <div className="text-xs text-gray-300 mb-0.5">Иногородним</div>
                <div className="text-sm sm:text-base font-extrabold text-white leading-tight">
                  Полный бак бензина
                </div>
              </div>
            </div>

            {/* Кнопки целевого действия */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={() => openCarModal(currentHero.carName)}
                className="bg-[#ff6700] hover:bg-[#e55c00] text-white px-8 py-4 rounded-xl font-extrabold text-base transition shadow-lg whitespace-nowrap"
              >
                Получить спецпредложение
              </button>
              <button
                onClick={() => scrollToSection('stock')}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm px-7 py-4 rounded-xl font-bold text-base transition whitespace-nowrap"
              >
                Автомобили в наличии
              </button>
              <button
                onClick={() => scrollToSection(currentHero.id)}
                className="text-sm font-bold text-gray-300 hover:text-white px-3 py-2 transition whitespace-nowrap text-center"
              >
                Характеристики модели →
              </button>
            </div>
          </div>

          {/* Нижняя панель переключения слайдов + таймер акции (в едином блоке) */}
          <div className="mt-10 pt-6 border-t border-white/15 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
            {/* Вкладки слайдов как на официальном портале LADA */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 flex-grow">
              {heroSlides.map((slide, idx) => {
                const isActive = idx === activeSlide;
                return (
                  <button
                    key={slide.id}
                    onClick={() => setActiveSlide(idx)}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-white/15 border-[#ff6700] text-white shadow-sm'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="text-xs font-extrabold tracking-tight truncate">
                      {slide.tabLabel}
                    </div>
                    <div className="text-[11px] text-gray-300 mt-0.5 tabular-nums truncate">
                      {slide.priceTag}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Компактный блок таймера спецпредложения */}
            <div className="flex flex-col sm:flex-row items-center justify-between lg:justify-end gap-3 bg-[#26303a]/90 border border-white/15 rounded-xl px-4 py-2.5 shrink-0">
              <div className="text-center sm:text-left">
                <div className="text-[11px] uppercase tracking-wider text-[#ff6700] font-bold">
                  Акция ограниченного времени
                </div>
                <div className="text-xs text-gray-300">
                  До конца спецпредложения:
                </div>
              </div>
              <CountdownTimer />
            </div>
          </div>

          <p className="text-[11px] text-gray-400 mt-4 leading-normal">
            Количество автомобилей ограничено. Условия кредитования, наличие автомобилей и подробности акции уточняйте у продавцов-консультантов ДЦ «Прагматика Великие Луки» (ул. Гоголя, 4).
          </p>
        </div>
      </section>

      {/* Быстрая витрина выбора модели (Showroom Dock в стиле lada.ru) */}
      <section className="bg-[#f5f6f8] border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-gray-400 pr-2 shrink-0 hidden md:inline">
              Модельный ряд:
            </span>
            {carModels.map((model) => (
              <button
                key={model.id}
                onClick={() => scrollToSection(model.id)}
                className="group flex items-center gap-2 px-4 py-2 bg-white text-[#26303a] border border-gray-200 rounded-lg text-sm font-bold hover:border-[#ff6700] hover:text-[#ff6700] transition whitespace-nowrap shrink-0 shadow-sm"
              >
                <span>{model.name}</span>
                <span className="text-xs font-semibold text-gray-400 group-hover:text-[#ff6700]/80 tabular-nums">
                  {model.price}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="models" className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">МОДЕЛЬНЫЙ РЯД LADA</h2>
            <p className="text-lg text-gray-600">Найди свой идеальный автомобиль LADA в официальном дилерском центре и получи специальные условия покупки</p>
          </div>
          <div className="space-y-16">
            {cars.map((car, idx) => (
              <div key={idx} id={car.id} className="group scroll-mt-24">
                <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-shadow overflow-hidden border border-gray-100">
                  <div className="grid lg:grid-cols-2 gap-8 p-8">
                    <div className="order-2 lg:order-1">
                      <div className="inline-block bg-[#f7761f] text-white px-5 py-2 rounded-full text-sm font-bold mb-5 shadow-md">
                        {car.badge}
                      </div>
                      <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">{car.name}</h3>
                      {car.specs && car.specs.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {car.specs.map((spec, sIdx) => (
                            <span
                              key={sIdx}
                              className="bg-gray-100 text-gray-700 text-xs sm:text-sm font-semibold px-3 py-1 rounded-lg border border-gray-200"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="bg-gradient-to-br from-[#303c48] to-[#f7761f] text-white rounded-2xl p-6 mb-6 shadow-lg">
                        <div className="text-2xl font-bold mb-4 flex items-center gap-2">
                          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0 M12 8v6 M12 14l-2-2 M12 14l2-2 M9 17h6" />
                          </svg>
                          Специальное предложение
                        </div>
<div className="space-y-3">
                          <div className="flex justify-between items-center border-b border-white/20 pb-2">
                            <span className="text-orange-100">Цена</span>
                            <span className="font-bold text-lg">{car.price}</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-white/20 pb-2">
                            <span className="text-orange-100">Выгода</span>
                            <span className="font-bold text-lg">{car.benefit}</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-white/20 pb-2">
                            <span className="text-orange-100">Госпрограмма</span>
                            <span className="font-bold">до -20%</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-white/20 pb-2">
                            <span className="text-orange-100">Трейд-ин</span>
                            <span className="font-bold">Скидка до 130 000 ₽</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-white/20 pb-2">
                            <span className="text-orange-100">Кредит</span>
                            <span className="font-bold">Выгодные тарифы</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-white/20 pb-2">
                            <span className="text-orange-100">Допы до 100к или Антикор</span>
                            <span className="font-bold text-right leading-tight max-w-[140px]">В подарок на выбор</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-white/20 pb-2">
                            <span className="text-orange-100">Иногородним</span>
                            <span className="font-bold">Бак бензина в авто</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-orange-100">Тест-драйв</span>
                            <span className="font-bold">Бесплатно</span>
                          </div>
                        </div>
                      </div>
                      <div className="mb-6">
                        <h4 className="font-bold text-lg mb-3 text-gray-900">Основные характеристики:</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {car.features.map((feature, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <svg className="w-5 h-5 text-[#f7761f] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="text-sm text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <button
                          onClick={() => openCarModal(car.name)}
                          className="w-full bg-[#303c48] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#f7761f] transition shadow-md"
                        >
                          УЗНАТЬ ПОДРОБНЕЕ
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCar(car.name);
                            setModalType('testdrive');
                          }}
                          className="w-full bg-gray-100 text-gray-900 py-4 rounded-xl font-bold text-lg hover:bg-[#f7761f] hover:text-white transition shadow-md"
                        >
                          ЗАПИСАТЬСЯ НА ТЕСТ-ДРАЙВ
                        </button>
                      </div>
                    </div>
                    <div className="order-1 lg:order-2">
                      <CarSlider images={car.images} carName={car.name} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CarsInStock onReserve={handleReserve} />

      <section id="test-drive" className="py-16 bg-gradient-to-br from-[#303c48] to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-[30px] sm:text-3xl font-bold mb-6 md:text-5xl leading-tight text-center">ЗАПИШИТЕСЬ НА ТЕСТ-ДРАЙВ</h2>
            <p className="text-xl text-gray-300">
              Испытайте автомобиль LADA в действии. Почувствуйте комфорт, управляемость и технологии на реальной дороге.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Преимущества тест-драйва</h3>
              <div className="space-y-4">
                {[
                  'Оцените комфорт и управляемость',
                  'Проверьте все функции и системы',
                  'Получите консультацию специалиста',
                  'Индивидуальный маршрут',
                  'Сравните несколько моделей',
                  'Без обязательств к покупке',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="bg-[#f7761f] rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Заполните форму</h3>
              <TestDriveForm onSuccess={handleSuccess} />
            </div>
          </div>
        </div>
      </section>

      <section id="trade-in" className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-[30px] sm:text-3xl font-bold mb-6 md:text-5xl leading-tight text-gray-900">
              ТРЕЙД-ИН: ОБМЕНЯЙТЕ СВОЙ АВТОМОБИЛЬ
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Хотите обновить свой автомобиль? Обменяйте старый на новую LADA с выгодой! Мы честно оценим ваш автомобиль и предложим лучшие условия обмена.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-[#303c48] to-gray-700 text-white rounded-2xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#f7761f] rounded-full w-14 h-14 flex items-center justify-center">
                  <RefreshCw className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold">Преимущества Trade-In</h3>
              </div>
              <div className="space-y-5">
                <div className="flex gap-4 items-start">
                  <div className="bg-[#f7761f] rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Выгодная оценка</h4>
                    <p className="text-gray-300">
                      Честная рыночная оценка вашего автомобиля с учетом всех его особенностей и состояния
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-[#f7761f] rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Быстрое оформление</h4>
                    <p className="text-gray-300">
                      Оценка и оформление всех документов в день обращения - без лишних поездок и ожиданий
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-[#f7761f] rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Никаких скрытых платежей</h4>
                    <p className="text-gray-300">
                      Прозрачные условия сделки, без комиссий и дополнительных расходов с вашей стороны
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-[#f7761f] rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Снимаем с учета</h4>
                    <p className="text-gray-300">
                      Берем на себя все вопросы по снятию автомобиля с учета и переоформлению документов
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-[#f7761f] rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Любые марки и модели</h4>
                    <p className="text-gray-300">
                      Принимаем автомобили любых марок, моделей и годов выпуска в любом состоянии
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                <p className="text-center text-lg font-semibold mb-2">
                  Оставьте заявку прямо сейчас!
                </p>
                <p className="text-center text-sm text-gray-300">
                  Наш специалист свяжется с вами в течение 15 минут и проконсультирует по всем вопросам
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Узнайте стоимость вашего авто</h3>
                <p className="text-gray-600">
                  Заполните форму, и мы оценим ваш автомобиль в течение 1 часа
                </p>
              </div>
              <TradeInForm onSuccess={handleSuccess} />
            </div>
          </div>
        </div>
      </section>

      <section id="credit" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-[30px] sm:text-3xl font-bold mb-6 md:text-5xl leading-tight text-center text-gray-900">КРЕДИТНЫЙ КАЛЬКУЛЯТОР</h2>
            <p className="text-lg text-gray-600">Рассчитайте ежемесячный платеж и оставьте заявку</p>
          </div>
          <CreditCalculator onSuccess={handleSuccess} />
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-[30px] sm:text-3xl font-bold mb-12 md:text-5xl leading-tight text-center text-gray-900">
            ПОЧЕМУ ПРАГМАТИКА ВЕЛИКИЕ ЛУКИ?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'ОФИЦИАЛЬНЫЙ ДИЛЕР',
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
                desc: 'Мы являемся официальным дилером LADA с 2006 года',
              },
              {
                title: 'УДОБНОЕ РАСПОЛОЖЕНИЕ',
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                desc: 'Высокий уровень доступности вблизи основной транспортной инфраструктуры',
              },
              {
                title: 'БЫСТРОЕ ОБСЛУЖИВАНИЕ',
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                desc: 'Оперативное оформление документов и выдача автомобиля',
              },
              {
                title: 'ВЫГОДНЫЕ УСЛОВИЯ',
                icon: (
                 <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0
       M12 8v6
       M12 14l-2-2
       M12 14l2-2
       M9 17h6" />
</svg>
                ),
                desc: 'Специальные программы кредитования и trade-in',
              },
              {
                title: 'ГАРАНТИЯ И СЕРВИС',
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                desc: 'Полное гарантийное и постгарантийное обслуживание',
              },
              {
                title: 'ПРОФЕССИОНАЛЬНАЯ КОМАНДА',
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                desc: 'Опытные специалисты помогут выбрать идеальный автомобиль',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 text-center border-t-4 border-[#f7761f] shadow-lg hover:shadow-xl transition group">
                <div className="text-[#f7761f] mb-6 flex justify-center group-hover:scale-110 transition">
                  {item.icon}
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Contacts onOpenContactModal={() => setModalType('contact')} />

      <footer className="bg-gradient-to-r from-gray-900 to-[#303c48] text-gray-300 py-10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="mb-4">
              <img src="/logo-lada.svg" alt="LADA" className="h-8 mx-auto mb-4 opacity-80" />
            </div>
            <p className="text-lg mb-2 font-semibold text-white">Прагматика LADA Великие Луки</p>
            <p className="mb-4">Официальный дилер LADA в Великих Луках</p>
            <p className="mb-4"><a href="/privacy.pdf" target="_blank" className="underline text-blue-500" >
    Политика конфиденциальности
  </a></p>
            <p className="mb-4"><a href="https://vluki.lada.ru/?utm_source=yandex&utm_medium=cpc&utm_campaign=yandex_pr" target="_blank" className="underline text-blue-500" > vluki.lada.ru
  </a></p>

<p className="text-sm text-gray-400">Филиал ООО "Псков-Лада"  Великие Луки. ИНН: 6027196721, КПП:	602543001</p>

            <p className="text-sm text-gray-400">© 2026 Все права защищены</p>
          </div>
        </div>
      </footer>

      <Modal
        isOpen={modalType === 'contact'}
        onClose={closeModal}
        title={selectedCar ? `Узнать подробности: ${selectedCar}` : 'Оставить заявку'}
      >
        <ContactForm
          leadType="general"
          onSuccess={handleSuccess}
          carModel={selectedCar}
        />
      </Modal>

      <Modal
        isOpen={modalType === 'testdrive'}
        onClose={closeModal}
        title="Записаться на тест-драйв"
      >
        <TestDriveForm
          onSuccess={handleSuccess}
          preselectedModel={selectedCar}
        />
      </Modal>

      {showSuccess && (
        <div className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-fade-in">
          <p className="font-semibold text-lg">Заявка успешно отправлена!</p>
          <p className="text-sm text-green-100">Мы свяжемся с вами в ближайшее время</p>
        </div>
      )}
    </div>
  );
}

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // === ИСПРАВЛЕННЫЙ ТАЙМЕР ===
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const difference = endOfDay.getTime() - now.getTime();
      return {
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []); // Добавлен пустой массив зависимостей
  // === КОНЕЦ ИСПРАВЛЕНИЯ ===

  return (
    <div className="flex gap-2">
      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[60px] text-center text-white">
        <div className="text-xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
        <div className="text-xs opacity-90">часов</div>
      </div>
      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[60px] text-center text-white">
        <div className="text-xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
        <div className="text-xs opacity-90">минут</div>
      </div>
      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[60px] text-center text-white">
        <div className="text-xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
        <div className="text-xs opacity-90">секунд</div>
      </div>
    </div>
  );
}

export default App;
