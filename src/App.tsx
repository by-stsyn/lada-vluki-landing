import { useState, useEffect } from 'react';
import { Phone, MapPin, Clock, Menu, X, RefreshCw, TrendingUp, ChevronDown, Check, Sparkles, Car as CarIcon, Calendar } from 'lucide-react';
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
  
  const [activeCategory, setActiveCategory] = useState<'all' | 'sedan' | 'cross' | 'suv' | 'wagon'>('all');
  const [expandedSpecsId, setExpandedSpecsId] = useState<string | null>(null);
  const [stockFilterRequest, setStockFilterRequest] = useState<{ model: string; timestamp: number } | null>(null);

  const handleViewModelInStock = (modelName: string) => {
    setStockFilterRequest({ model: modelName, timestamp: Date.now() });
    scrollToSection('stock');
  };

  const scrollToSection = (id: string) => {
    const isCarModel = carModels.some((m) => m.id === id);
    if (isCarModel && activeCategory !== 'all') {
      setActiveCategory('all');
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
      setMobileMenuOpen(false);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileMenuOpen(false);
    }
  };

  const carModels = [
    { name: 'Granta', id: 'granta' },
    { name: 'Granta Cross', id: 'granta-cross' },
    { name: 'Vesta', id: 'vesta' },
    { name: 'Vesta Cross', id: 'vesta-cross' },
    { name: 'Largus', id: 'largus' },
    { name: 'Iskra', id: 'iskra' },
    { name: 'Niva Legend', id: 'niva-legend' },
    { name: 'Niva Travel', id: 'niva-travel' },
  ];

  const categories = [
    { id: 'all' as const, label: 'Все модели' },
    { id: 'sedan' as const, label: 'Седаны' },
    { id: 'cross' as const, label: 'Кросс-версии' },
    { id: 'suv' as const, label: 'Внедорожники 4×4' },
    { id: 'wagon' as const, label: 'Универсалы' },
  ];

  const cars = [
    {
      id: 'granta',
      name: 'Granta',
      category: 'sedan' as const,
      badge: 'ХИТ ПРОДАЖ',
      price: 'от 680 000 ₽',
      monthlyPayment: 'от 6 900 ₽/мес.',
      benefit: 'Выгода до 300 000 ₽',
      images: ['/lada/granta-1.jpg', '/lada/granta-2.jpg', '/lada/granta-3.jpg', '/lada/granta-4.jpg'],
      specs: ['Седан', '1.6 л / 90 л.с.', '5МТ / АМТ', 'Передний привод'],
      keyMetrics: [
        { label: 'Клиренс', value: '180 мм' },
        { label: 'Расход', value: '6.8 л / 100 км' },
        { label: 'Багажник', value: '520–815 л' },
        { label: 'Разгон 0–100', value: '11.2 с' },
      ],
      features: [
        'Габариты: 4268×1700×1500 мм',
        'Колёсная база: 2476 мм',
        'Дорожный просвет: 180 мм',
        'Разгон до 100 км/ч: 11.2 с',
        'Макс. скорость: 179 км/ч',
        'Расход: 6.8 л/100 км (смешанный)',
        'Багажник: 520-815 л',
      ],
    },
    {
      id: 'granta-cross',
      name: 'Granta Cross',
      category: 'cross' as const,
      badge: 'КРОСС-УНИВЕРСАЛ',
      price: 'от 912 000 ₽',
      monthlyPayment: 'от 9 300 ₽/мес.',
      benefit: 'Выгода до 300 000 ₽',
      images: ['/lada/granta-cross-1.jpg', '/lada/granta-cross-2.jpg', '/lada/granta-cross-3.jpg', '/lada/granta-cross-4.jpg'],
      specs: ['Универсал Cross', '1.6 л / 98 л.с.', '5МТ', 'Передний привод'],
      keyMetrics: [
        { label: 'Клиренс', value: '198 мм' },
        { label: 'Расход', value: '6.8 л / 100 км' },
        { label: 'Багажник', value: '355–670 л' },
        { label: 'Разгон 0–100', value: '11.2 с' },
      ],
      features: [
        'Габариты: 4148×1700×1560 мм',
        'Колёсная база: 2476 мм',
        'Дорожный просвет: 198 мм',
        'Разгон до 100 км/ч: 11.2 с',
        'Макс. скорость: 172 км/ч',
        'Расход: 6.8 л/100 км (смешанный)',
        'Багажник: 355-670 л',
      ],
    },
    {
      id: 'vesta',
      name: 'Vesta',
      category: 'sedan' as const,
      badge: 'ФЛАГМАН',
      price: 'от 1 222 400 ₽',
      monthlyPayment: 'от 12 400 ₽/мес.',
      benefit: 'Выгода от 520 000 ₽',
      images: ['/lada/vesta-1.jpg', '/lada/vesta-2.jpg', '/lada/vesta-3.jpg', '/lada/vesta-4.jpg'],
      specs: ['Седан', '1.6–1.8 л / 106–122 л.с.', '5МТ / АТ', 'Передний привод'],
      keyMetrics: [
        { label: 'Клиренс', value: '171 мм' },
        { label: 'Расход', value: '7.3 л / 100 км' },
        { label: 'Багажник', value: '480 л' },
        { label: 'Разгон 0–100', value: '11.3 с' },
      ],
      features: [
        'Габариты: 4440×1764×1496 мм',
        'Колёсная база: 2635 мм',
        'Дорожный просвет: 171 мм',
        'Разгон до 100 км/ч: 11.3 с',
        'Макс. скорость: 182 км/ч',
        'Расход: 7.3 л/100 км (смешанный)',
        'Багажник: 480 л',
      ],
    },
    {
      id: 'vesta-cross',
      name: 'Vesta Cross',
      category: 'cross' as const,
      badge: 'КРОСС-ВЕРСИЯ',
      price: 'от 1 552 800 ₽',
      monthlyPayment: 'от 15 800 ₽/мес.',
      benefit: 'Выгода до 480 000 ₽',
      images: ['/lada/vesta-cross-1.jpg', '/lada/vesta-cross-2.jpg', '/lada/vesta-cross-3.jpg', '/lada/vesta-cross-4.jpg'],
      specs: ['Универсал Cross', '1.6–1.8 л / 106–122 л.с.', '5МТ / АМТ', 'Передний привод'],
      keyMetrics: [
        { label: 'Клиренс', value: '203 мм' },
        { label: 'Расход', value: '7.5 л / 100 км' },
        { label: 'Багажник', value: '480–825 л' },
        { label: 'Разгон 0–100', value: '12.6 с' },
      ],
      features: [
        'Габариты: 4445×1785×1522 мм',
        'Колёсная база: 2635 мм',
        'Дорожный просвет: 203 мм',
        'Разгон до 100 км/ч: 12.6 с',
        'Макс. скорость: 178 км/ч',
        'Расход: 7.5 л/100 км (смешанный)',
        'Багажник: 480-825 л',
      ],
    },
    {
      id: 'largus',
      name: 'Largus',
      category: 'wagon' as const,
      badge: 'СЕМЕЙНЫЙ',
      price: 'от 1 461 000 ₽',
      monthlyPayment: 'от 14 900 ₽/мес.',
      benefit: 'Выгода от 530 000 ₽',
      images: ['/lada/largus-1.jpg', '/lada/largus-2.jpg', '/lada/largus-3.jpg', '/lada/largus-4.jpg'],
      specs: ['Универсал / Фургон', '1.6 л / 90–106 л.с.', '5МТ', 'Передний привод'],
      keyMetrics: [
        { label: 'Клиренс', value: '172 мм' },
        { label: 'Расход', value: '7.5 л / 100 км' },
        { label: 'Багажник', value: '560–2350 л' },
        { label: 'Колёсная база', value: '2905 мм' },
      ],
      features: [
        'Габариты: 4488×1735×1628 мм',
        'Колёсная база: 2905 мм',
        'Дорожный просвет: 172 мм',
        'Разгон до 100 км/ч: 13.5-14 с',
        'Макс. скорость: 160 км/ч',
        'Расход: 7.5-7.8 л/100 км (смешанный)',
        'Багажник: 560 л',
      ],
    },
    {
      id: 'iskra',
      name: 'Iskra',
      category: 'sedan' as const,
      badge: 'НОВИНКА',
      price: 'от 1 093 600 ₽',
      monthlyPayment: 'от 11 100 ₽/мес.',
      benefit: 'Выгода до 350 000 ₽',
      images: ['/lada/iskra-1.jpg', '/lada/iskra-2.jpg', '/lada/iskra-cross-3.jpeg', '/lada/iskra-cross-4.jpeg'],
      specs: ['Седан / SW Cross', '1.6 л / 90–106 л.с.', '5МТ / 6МТ / АТ', 'Передний привод'],
      keyMetrics: [
        { label: 'Клиренс', value: '170 мм' },
        { label: 'Расход', value: '7.8 л / 100 км' },
        { label: 'Багажник', value: '500 л' },
        { label: 'Разгон 0–100', value: '12.3 с' },
      ],
      features: [
        'Габариты: 4333×1777×1517 мм',
        'Колёсная база: 2603 мм',
        'Дорожный просвет: 170 мм',
        'Разгон до 100 км/ч: 12.3 с',
        'Макс. скорость: 177 км/ч',
        'Расход: 7.8 л/100 км (смешанный)',
        'Багажник: 500 л (седан), 480 л (универсал)',
      ],
    },
    {
      id: 'niva-legend',
      name: 'Niva Legend',
      category: 'suv' as const,
      badge: 'ПОЛНЫЙ ПРИВОД 4×4',
      price: 'от 868 000 ₽',
      monthlyPayment: 'от 8 800 ₽/мес.',
      benefit: 'Выгода до 350 000 ₽',
      images: ['/lada/niva-legend-1.jpg', '/lada/niva-legend-2.jpg', '/lada/niva-legend-3.jpg', '/lada/niva-legend-4.jpg'],
      specs: ['Внедорожник', '1.7 л / 83 л.с.', '5МТ', 'Полный привод 4×4'],
      keyMetrics: [
        { label: 'Клиренс', value: '200 мм' },
        { label: 'Привод', value: 'Постоянный 4×4' },
        { label: 'Багажник', value: '265–585 л' },
        { label: 'Расход', value: '9.9 л / 100 км' },
      ],
      features: [
        'Габариты: 3740×1680×1640 мм',
        'Колёсная база: 2200 мм',
        'Дорожный просвет: 200 мм',
        'Разгон до 100 км/ч: 17 с',
        'Макс. скорость: 142 км/ч',
        'Расход: 9.9 л/100 км (смешанный)',
        'Багажник: 265-585 л',
      ],
    },
    {
      id: 'niva-travel',
      name: 'Niva Travel',
      category: 'suv' as const,
      badge: 'ВНЕДОРОЖНИК 4×4',
      price: 'от 1 282 400 ₽',
      monthlyPayment: 'от 13 100 ₽/мес.',
      benefit: 'Выгода до 360 000 ₽',
      images: ['/lada/niva-travel-1.jpg', '/lada/niva-travel-2.jpg', '/lada/niva-travel-3.jpg', '/lada/niva-travel-4.jpg'],
      specs: ['Внедорожник', '1.8 л / 90 л.с.', '5МТ', 'Полный привод 4×4'],
      keyMetrics: [
        { label: 'Клиренс', value: '220 мм' },
        { label: 'Привод', value: 'Постоянный 4×4' },
        { label: 'Багажник', value: '320–650 л' },
        { label: 'Расход', value: '10.2 л / 100 км' },
      ],
      features: [
        'Габариты: 4099×1804×1690 мм',
        'Колёсная база: 2450 мм',
        'Дорожный просвет: 220 мм',
        'Разгон до 100 км/ч: 19 с',
        'Макс. скорость: 140 км/ч',
        'Расход: 10.2 л/100 км (смешанный)',
        'Багажник: 320-650 л',
      ],
    },
  ];

  const filteredCars = activeCategory === 'all'
    ? cars
    : cars.filter((car) => car.category === activeCategory);

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
                  <span className="calltouch_phone">+7 (811) 539-55-65</span>
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

      {/* Сдержанный Hero-блок в фирменном стиле LADA */}
      <section id="hero" className="relative bg-[#182026] text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/promo-lada.webp"
            alt="Модельный ряд LADA"
            decoding="async"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#182026]/95 via-[#182026]/80 to-[#182026]/10" />
        </div>

        <div className="container mx-auto px-4 py-14 sm:py-20 lg:py-24 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#ff6700]" />
              <span>Официальный дилер LADA в Великих Луках</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-extrabold leading-[1.1] tracking-tight text-white mb-4">
              Новая LADA от <span className="text-[#ff6700]">680 000 ₽</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-200 font-medium mb-7">
              Специальные условия покупки в дилерском центре «Прагматика»:
            </p>

            <ul className="space-y-3 mb-9 text-base sm:text-lg text-gray-100">
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6700] shrink-0" />
                <span>Госпрограмма с выгодой до <strong>20%</strong></span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6700] shrink-0" />
                <span>Доп. оборудование до <strong>100 000 ₽</strong> или антикор в подарок</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6700] shrink-0" />
                <span>Полный бак бензина в подарок при покупке</span>
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={() => {
                  setSelectedCar('');
                  setModalType('contact');
                }}
                className="bg-[#ff6700] hover:bg-[#e55c00] text-white px-8 py-4 rounded-lg font-bold text-base transition shadow-lg whitespace-nowrap"
              >
                Получить спецпредложение
              </button>
              <button
                onClick={() => scrollToSection('stock')}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm px-7 py-4 rounded-lg font-bold text-base transition whitespace-nowrap"
              >
                Автомобили в наличии
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Лаконичная полоса быстрого перехода к моделям */}
      <section className="bg-[#f5f6f8] border-b border-gray-200 py-3.5">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-start lg:justify-center gap-2 overflow-x-auto">
            {carModels.map((model) => (
              <button
                key={model.id}
                onClick={() => scrollToSection(model.id)}
                className="px-4 py-2 bg-white text-[#26303a] border border-gray-200 rounded-lg text-sm font-bold hover:border-[#ff6700] hover:text-[#ff6700] transition whitespace-nowrap shrink-0"
              >
                {model.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="models" className="py-16 lg:py-20 bg-[#f5f6f8]">
        <div className="container mx-auto px-4">
          {/* Заголовок и фильтр по типам кузова в стиле шоурума LADA */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#ff6700] mb-2">
                <span className="w-2 h-2 rounded-full bg-[#ff6700]" />
                <span>Официальный модельный ряд</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#26303a] tracking-tight">
                МОДЕЛЬНЫЙ РЯД LADA
              </h2>
            </div>

            {/* Табы фильтрации по кузову */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-[#26303a] text-white shadow-sm'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-[#ff6700] hover:text-[#26303a]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Карточки моделей в фирменном дилерском стиле */}
          <div className="space-y-8 lg:space-y-10">
            {filteredCars.map((car) => {
              const isExpanded = expandedSpecsId === car.id;
              return (
                <div key={car.id} id={car.id} className="scroll-mt-28">
                  <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-shadow border border-gray-200/80 overflow-hidden">
                    <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 p-5 sm:p-7 lg:p-8 items-start">
                      {/* Левая колонка: Фотогалерея с бейджами */}
                      <div className="lg:col-span-7">
                        <CarSlider
                          images={car.images}
                          carName={car.name}
                          badge={car.badge}
                          benefit={car.benefit}
                        />
                      </div>

                      {/* Правая колонка: Коммерческий блок и характеристики */}
                      <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
                        {/* Название модели и теги силовой установки */}
                        <div>
                          <div className="flex items-baseline justify-between gap-3 mb-2">
                            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#26303a] tracking-tight">
                              LADA {car.name}
                            </h3>
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              В наличии с ПТС
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {car.specs.map((spec, sIdx) => (
                              <span
                                key={sIdx}
                                className="bg-[#f5f6f8] text-gray-700 text-xs font-semibold px-3 py-1 rounded-lg border border-gray-200/80"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Блок цены, выгоды и ежемесячного платежа */}
                        <div className="bg-[#f5f6f8] rounded-2xl p-4 sm:p-5 border border-gray-200/80">
                          <div className="flex flex-wrap items-end justify-between gap-4 pb-4 border-b border-gray-200">
                            <div>
                              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                Цена с учетом акций
                              </div>
                              <div className="text-2xl sm:text-3xl font-extrabold text-[#26303a] tabular-nums leading-none">
                                {car.price}
                              </div>
                            </div>
                            <div className="text-left sm:text-right">
                              <div className="text-xs font-semibold text-gray-500 mb-1">
                                В кредит по госпрограмме
                              </div>
                              <div className="text-base sm:text-lg font-extrabold text-[#ff6700] tabular-nums leading-none">
                                {car.monthlyPayment}
                              </div>
                            </div>
                          </div>

                          {/* 4 ключевых привилегии в лаконичной сетке 2x2 */}
                          <div className="grid grid-cols-2 gap-2.5 pt-3.5 text-xs sm:text-[13px] font-semibold text-[#26303a]">
                            <div className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-[#ff6700] shrink-0" />
                              <span>Госпрограмма до -20%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-[#ff6700] shrink-0" />
                              <span>Трейд-ин до 130 000 ₽</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-[#ff6700] shrink-0" />
                              <span>Допы до 100к / Антикор</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-[#ff6700] shrink-0" />
                              <span>Полный бак в подарок</span>
                            </div>
                          </div>
                        </div>

                        {/* 4 главных технических показателя */}
                        <div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {car.keyMetrics.map((metric, mIdx) => (
                              <div
                                key={mIdx}
                                className="bg-white border border-gray-200 rounded-xl px-3 py-2.5"
                              >
                                <div className="text-[11px] font-medium text-gray-500 truncate">
                                  {metric.label}
                                </div>
                                <div className="text-xs sm:text-sm font-extrabold text-[#26303a] tabular-nums mt-0.5 truncate">
                                  {metric.value}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Раскрывающийся список полных характеристик */}
                          <button
                            type="button"
                            onClick={() => setExpandedSpecsId(isExpanded ? null : car.id)}
                            className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#ff6700] transition"
                          >
                            <span>{isExpanded ? 'Скрыть подробные характеристики' : 'Все технические характеристики'}</span>
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            />
                          </button>

                          {isExpanded && (
                            <div className="mt-2.5 p-3.5 bg-[#f5f6f8] rounded-xl border border-gray-200 grid sm:grid-cols-2 gap-2 text-xs text-gray-700">
                              {car.features.map((feature, fIdx) => (
                                <div key={fIdx} className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff6700] shrink-0" />
                                  <span>{feature}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Конверсионный блок кнопок */}
                        <div className="space-y-2.5 pt-1">
                          <button
                            type="button"
                            onClick={() => openCarModal(`LADA ${car.name}`)}
                            className="w-full bg-[#ff6700] hover:bg-[#e55c00] text-white py-3.5 px-6 rounded-xl font-extrabold text-base transition shadow-md"
                          >
                            Получить спецпредложение
                          </button>
                          <div className="grid grid-cols-2 gap-2.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCar(`LADA ${car.name}`);
                                setModalType('testdrive');
                              }}
                              className="inline-flex items-center justify-center gap-2 bg-[#26303a] hover:bg-[#182026] text-white py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition"
                            >
                              <Calendar className="w-4 h-4 text-[#ff6700] shrink-0" />
                              <span>Тест-драйв</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleViewModelInStock(car.name)}
                              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[#26303a] border border-gray-300 hover:border-[#ff6700] py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition"
                            >
                              <CarIcon className="w-4 h-4 text-[#ff6700] shrink-0" />
                              <span>Авто в наличии</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CarsInStock
        onReserve={handleReserve}
        externalFilterRequest={stockFilterRequest}
      />

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

export default App;
