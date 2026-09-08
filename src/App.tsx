import { useState, useEffect } from 'react';
import { Phone, MapPin, Mail, Menu, X, RefreshCw, TrendingUp } from 'lucide-react';
import Modal from './components/Modal';
import ContactForm from './components/ContactForm';
import TestDriveForm from './components/TestDriveForm';
import TradeInForm from './components/TradeInForm';
import CarSlider from './components/CarSlider';
import CreditCalculator from './components/CreditCalculator';
import { CarsInStock } from './components/CarsInStock';
import CarDetailsPage from './CarDetailsPage';

function App() {
  const [modalType, setModalType] = useState<'contact' | 'testdrive' | null>(null);
  const [selectedCar, setSelectedCar] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // === НАЧАЛО: БУДИЛЬНИК ДЛЯ SUPABASE ===
  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      fetch(`${supabaseUrl}/rest/v1/leads?select=id&limit=1`, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      }).catch(() => {}); 
    }
  }, []);
  // === КОНЕЦ БУДИЛЬНИКА ===

  const handleReserve = (car: any) => {
    const carModelName = `${car.brand} ${car.model} ${car.complectation}`;
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
    { name: 'Granta', id: 'granta' },
    { name: 'Granta Cross', id: 'granta-cross' },
    { name: 'Vesta', id: 'vesta' },
    { name: 'Vesta Cross', id: 'vesta-cross' },
    { name: 'Largus', id: 'largus' },
    { name: 'Iskra', id: 'iskra' },
    { name: 'Niva Legend', id: 'niva-legend' },
    { name: 'Niva Travel', id: 'niva-travel' },
  ];

const cars = [
    { id: 'granta', name: 'Granta', badge: 'ХИТ ПРОДАЖ', price: 'от 680 000 ₽', benefit: 'Выгода до 300 000 ₽', images: ['/lada/granta-1.jpg', '/lada/granta-2.jpg', '/lada/granta-3.jpg', '/lada/granta-4.jpg'], specs: ['Седан', '1.6 л / 90 л.с.', '5МТ/АМТ', 'Передний привод'], features: ['Габариты: 4268×1700×1500 мм', 'Колёсная база: 2476 мм', 'Дорожный просвет: 180 мм', 'Разгон до 100 км/ч: 11.2 с', 'Макс. скорость: 179 км/ч', 'Расход: 6.8 л/100 км (смешанный)', 'Багажник: 520-815 л',], },
    { id: 'granta-cross', name: 'Granta Cross', badge: 'БЕЗДОРОЖЬЕ', price: 'от 912 000 ₽', benefit: 'Выгода до 300 000 ₽', images: ['/lada/granta-cross-1.jpg', '/lada/granta-cross-2.jpg', '/lada/granta-cross-3.jpg', '/lada/granta-cross-4.jpg'], specs: ['Универсал', '1.6 л / 98 л.с.', '5МТ', 'Передний привод'], features: ['Габариты: 4148×1700×1560 мм', 'Колёсная база: 2476 мм', 'Дорожный просвет: 198 мм', 'Разгон до 100 км/ч: 11.2 с', 'Макс. скорость: 172 км/ч', 'Расход: 6.8 л/100 км (смешанный)', 'Багажник: 355-670 л',], },
    { id: 'vesta', name: 'Vesta', badge: 'ПОПУЛЯРНАЯ', price: 'от 1 222 400 ₽', benefit: 'Выгода от 520 000 ₽', images: ['/lada/vesta-1.jpg', '/lada/vesta-2.jpg', '/lada/vesta-3.jpg', '/lada/vesta-4.jpg'], specs: ['Седан', '1.6-1.8 л / 106-122 л.с.', '5МТ', 'Передний привод'], features: ['Габариты: 4440×1764×1496 мм', 'Колёсная база: 2635 мм', 'Дорожный просвет: 171 мм', 'Разгон до 100 км/ч: 11.3 с', 'Макс. скорость: 182 км/ч', 'Расход: 7.3 л/100 км (смешанный)', 'Багажник: 480 л',], },
    { id: 'vesta-cross', name: 'Vesta Cross', badge: 'БЕЗДОРОЖЬЕ', price: 'от 1 552 800 ₽', benefit: 'Выгода до 480 000 ₽', images: ['/lada/vesta-cross-1.jpg', '/lada/vesta-cross-2.jpg', '/lada/vesta-cross-3.jpg', '/lada/vesta-cross-4.jpg'], specs: ['Универсал', '1.6-1.8 л / 106-122 л.с.', '5МТ/АМТ', 'Передний привод'], features: ['Габариты: 4445×1785×1522 мм', 'Колёсная база: 2635 мм', 'Дорожный просвет: 203 мм', 'Разгон до 100 км/ч: 12.6 с', 'Макс. скорость: 178 км/ч', 'Расход: 7.5 л/100 км (смешанный)', 'Багажник: 480-825 л',], },
    { id: 'largus', name: 'Largus', badge: 'СЕМЕЙНЫЙ', price: 'от 1 461 000 ₽', benefit: 'Выгода от 530 000 ₽', images: ['/lada/largus-1.jpg', '/lada/largus-2.jpg', '/lada/largus-3.jpg', '/lada/largus-4.jpg'], specs: ['Универсал/Фургон', '1.6 л / 90-106 л.с.', '5МТ', 'Передний привод'], features: ['Габариты: 4488×1735×1628 мм', 'Колёсная база: 2905 мм', 'Дорожный просвет: 172 мм', 'Разгон до 100 км/ч: 13.5-14 с', 'Макс. скорость: 160 км/ч', 'Расход: 7.5-7.8 л/100 км (смешанный)', 'Багажник: 560 л',], },
    { id: 'iskra', name: 'Iskra', badge: 'НОВИНКА', price: 'от 1 093 600 ₽', benefit: 'Выгода до 350 000 ₽', images: ['/lada/iskra-1.jpg', '/lada/iskra-2.jpg', '/lada/iskra-3.jpg', '/lada/iskra-4.jpg'], specs: ['Седан', '1.6 л / 90-106 л.с.', '5МТ/6МТ/ВТ', 'Передний привод'], features: ['Габариты: 4333×1777×1517 мм', 'Колёсная база: 2603 мм', 'Дорожный просвет: 170 мм', 'Разгон до 100 км/ч: 12.3 с', 'Макс. скорость: 177 км/ч', 'Расход: 7.8 л/100 км (смешанный)', 'Багажник: 500 л (седан), 480 л (универсал)',], },
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
    { label: 'Модели', href: 'models' },
    { label: 'В наличии', href: 'stock' },
    { label: 'Тест-драйв', href: 'test-drive' },
    { label: 'Трейд-ин', href: 'trade-in' },
    { label: 'Кредит', href: 'credit' },
    { label: 'Контакты', href: 'contacts' },
  ];

  const path = window.location.pathname;
  if (path.startsWith('/car/')) {
    const carId = path.split('/car/')[1];
    return <CarDetailsPage carId={carId} />;
  }
  
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
              <img src="/logo-lada.svg" alt="LADA" className="h-7" />
              <span className="hidden sm:block text-gray-300">|</span>
              <span className="text-xs sm:text-sm text-center sm:text-left font-semibold text-gray-800">
                Прагматика Великие Луки
              </span>
            </div>
            <nav className="hidden lg:flex items-center gap-6">
              {menuItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="text-sm font-medium text-gray-700 hover:text-[#303c48] transition"
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-4">
              <a
                href="tel:+78115395565"
                className="flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-[#303c48] transition"
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).ym) {
                    (window as any).ym(96344039, 'reachGoal', 'zvonok');
                  }
                }}
              >
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">+7 (811) 539-55-65</span>
              </a>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
          {mobileMenuOpen && (
            <nav className="lg:hidden mt-4 pb-4 border-t pt-4 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left py-2 text-sm font-medium text-gray-700 hover:text-[#303c48]"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setModalType('contact');
                }}
                className="block w-full bg-[#303c48] text-white px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-[#f7761f] transition mt-3"
              >
                Оставить заявку
              </button>
            </nav>
          )}
        </div>
      </header>

      <section id="hero" className="relative bg-gradient-to-br min-h-[500px] from-gray-900 via-[#303c48] to-gray-900 text-white pt-12 pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-black/40">
          <img
            src="/promo-lada.webp"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-black/50 backdrop-blur-sm rounded-xl px-4 py-6 sm:px-6 sm:py-8 text-center">
            <h1 className="text-[30px] sm:text-3xl md:text-5xl font-bold leading-tight">
              Купи LADA Granta c выгодой до 300 000 руб. и подарками от Прагматика Великие Луки
            </h1>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full z-10">
          <div className="bg-black/60 backdrop-blur-sm py-3 px-4 text-center">
            <p className="text-xs sm:text-sm text-gray-200 max-w-4xl mx-auto">
              Количество автомобилей ограничено. Условия кредитования, наличие автомобилей и подробности акции уточняйте у продавцов консультантов ДЦ.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#303c48] py-6">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-[#f7761f] to-[#e66718] rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-white text-center lg:text-left">
                <div className="text-sm text-orange-100">Специальное предложение</div>
                <div className="text-xl font-bold">Действует ограниченное время!</div>
              </div>
              <CountdownTimer />
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <button
                  onClick={() => setModalType('contact')}
                  className="bg-white text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
                >
                  Оставить заявку
                </button>
                <button
                  onClick={() => scrollToSection('models')}
                  className="bg-[#303c48] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#1f2933] transition"
                >
                  Смотреть модели
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="bg-gradient-to-b from-gray-50 to-white py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {carModels.map((model) => (
              <button
                key={model.id}
                onClick={() => scrollToSection(model.id)}
                className="px-5 py-2.5 bg-white text-gray-700 border-2 border-gray-200 rounded-full text-sm font-semibold hover:border-[#f7761f] hover:text-[#f7761f] transition whitespace-nowrap"
              >
                {model.name}
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
                      <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{car.name}</h3>
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

      <section id="contacts" className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-[30px] sm:text-3xl font-bold mb-12 md:text-5xl leading-tight text-center text-gray-900">КОНТАКТЫ И АДРЕС</h2>
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="p-10 space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Прагматика LADA Великие Луки</h3>
                </div>

                <div className="flex gap-4">
                  <div className="bg-[#f7761f] rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-2">АДРЕС</h4>
                    <p className="text-gray-600 text-lg">Псковская область, Великие Луки, ул. Гоголя, 4</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-[#f7761f] rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-2">ТЕЛЕФОН</h4>
<a 
                      href="tel:+78115395565" 
                      className="text-[#f7761f] hover:text-[#e66718] font-bold text-xl"
                      onClick={() => {
                        if (typeof window !== 'undefined' && (window as any).ym) {
                          (window as any).ym(96344039, 'reachGoal', 'zvonok');
                        }
                      }}
                    >
                      +7 (811) 539-55-65
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-[#f7761f] rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-2">РЕЖИМ РАБОТЫ</h4>
                    <p className="text-gray-600 text-lg">Ежедневно: 8:00 - 20:00</p>
                    <p className="text-gray-500">Без выходных</p>
                  </div>
                </div>

                <button
                  onClick={() => setModalType('contact')}
                  className="w-full bg-[#303c48] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#f7761f] transition shadow-lg"
                >
                  СВЯЗАТЬСЯ С НАМИ
                </button>
              </div>

              <div className="h-full min-h-[500px] bg-gray-200">
                <iframe
                  src="https://yandex.ru/map-widget/v1/?ll=30.567245,56.359901&z=16&l=map&pt=30.567245,56.35990,pm2rdm"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  title="Карта"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

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
