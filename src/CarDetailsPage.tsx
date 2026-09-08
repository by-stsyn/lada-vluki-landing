import { useEffect, useState, useRef } from 'react';
import { Phone, ArrowLeft, CheckCircle2, ShieldCheck, Percent, Car as CarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchCars, type Car } from './api/carsApi';
import CreditCalculator from './components/CreditCalculator';
import TestDriveForm from './components/TestDriveForm';
import ContactForm from './components/ContactForm';

export default function CarDetailsPage({ carId }: { carId: string }) {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const thumbnailsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCars()
      .then((cars) => {
        const foundCar = cars.find((c) => c.id === carId || c.vin === carId);
        setCar(foundCar || null);
        if (foundCar?.photos?.length) {
          setActivePhoto(foundCar.photos[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  },[carId]);

  useEffect(() => {
    if (car && car.vin && carId !== car.vin) {
      window.history.replaceState(null, '', `/car/${car.vin}`);
    }
  }, [car, carId]);

  useEffect(() => {
    if (thumbnailsContainerRef.current && activePhoto) {
      const activeThumbnail = thumbnailsContainerRef.current.querySelector(`[data-photo-url="${activePhoto}"]`);
      if (activeThumbnail) {
        activeThumbnail.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  },[activePhoto]);

  const handleSuccess = () => {
    if (typeof window !== 'undefined') {
      if ((window as any).ym) { (window as any).ym(96344039, 'reachGoal', 'forma'); }
      if ((window as any).ct) { (window as any).ct('goal', 'forma'); }
    }
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };
  
  const scrollToTestDrive = () => {
    document.getElementById('test-drive-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  
  const nextPhoto = () => {
    if (!car || !car.photos || car.photos.length < 2) return;
    const currentIndex = car.photos.indexOf(activePhoto);
    const nextIndex = (currentIndex + 1) % car.photos.length;
    setActivePhoto(car.photos[nextIndex]);
  };

  const prevPhoto = () => {
    if (!car || !car.photos || car.photos.length < 2) return;
    const currentIndex = car.photos.indexOf(activePhoto);
    const prevIndex = (currentIndex - 1 + car.photos.length) % car.photos.length;
    setActivePhoto(car.photos[prevIndex]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-bold text-gray-400 animate-pulse">Загрузка данных автомобиля...</div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Автомобиль не найден</h1>
        <p className="text-gray-500 mb-6">Возможно, он уже продан или ссылка устарела.</p>
        <button onClick={() => window.location.href = '/'} className="bg-[#303c48] text-white px-8 py-3 rounded-xl font-semibold hover:bg-brand-orange transition shadow-md">
          Вернуться в каталог
        </button>
      </div>
    );
  }

  // Безопасные вычисления данных для форм
  const finalPrice = Math.max(car.finalPrice || car.price || 0, 0);
  const regularPrice = car.price || finalPrice;
  const fullCarName = [car.brand, car.model, car.complectation].filter(Boolean).join(' ');
  const baseCarName = [car.brand, car.model].filter(Boolean).join(' ');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-200 animate-gradient-xy flex flex-col">
      <style>{`
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-xy {
          background-size: 200% 200%;
          animation: gradient-xy 15s ease infinite;
        }
      `}</style>
      
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm flex-shrink-0">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <button onClick={() => window.location.href = '/'} className="text-gray-600 hover:text-brand-orange transition flex items-center gap-2 font-semibold bg-gray-100 px-3 py-2 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">В каталог</span>
            </button>
            <span className="text-gray-300 hidden sm:inline">|</span>
            <img src="/logo-lada.svg" alt="LADA" className="h-6 sm:h-7 hidden sm:block" />
            <span className="text-gray-300 hidden md:inline">|</span>
            <span className="text-sm font-semibold text-gray-800 hidden md:inline">Прагматика Великие Луки</span>
          </div>
          <a 
            href="tel:+78115395565" 
            onClick={() => {
              if (typeof window !== 'undefined') {
                if ((window as any).ym) { (window as any).ym(96344039, 'reachGoal', 'zvonok'); }
                if ((window as any).ct) { (window as any).ct('goal', 'zvonok'); }
              }
            }}
            className="flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-brand-orange transition"
          >
            <Phone className="w-5 h-5" />
            <span className="text-base sm:text-lg">+7 (811) 539-55-65</span>
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl flex-grow">
        <div className="mb-8">
            <div className="inline-block bg-brand-orange text-white px-4 py-1.5 rounded-full text-xs font-bold mb-4 shadow-sm tracking-wide">
              АВТОМОБИЛЬ В НАЛИЧИИ
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 flex flex-wrap items-baseline gap-3">
              {car.brand} {car.model} 
              {car.complectation && <span className="text-gray-500 text-2xl md:text-3xl font-medium">{car.complectation}</span>}
            </h1>
            {car.vin && <p className="text-gray-400 mt-2 font-mono text-sm">VIN: {car.vin}</p>}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/70 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-lg border border-gray-100">
              {car.photos && car.photos.length > 0 ? (
                <>
                  <div className="relative group h-[300px] sm:h-[400px] md:h-[500px] bg-gray-100 rounded-2xl overflow-hidden mb-4">
                    <img src={activePhoto} alt={baseCarName} loading="lazy" className="w-full h-full object-cover" />
                    {car.photos.length > 1 && (
                      <>
                        <button onClick={prevPhoto} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 text-white w-12 h-12 rounded-full hover:bg-black/60 transition opacity-0 group-hover:opacity-100 flex items-center justify-center"><ChevronLeft className="w-7 h-7" /></button>
                        <button onClick={nextPhoto} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 text-white w-12 h-12 rounded-full hover:bg-black/60 transition opacity-0 group-hover:opacity-100 flex items-center justify-center"><ChevronRight className="w-7 h-7" /></button>
                      </>
                    )}
                  </div>
                  <div ref={thumbnailsContainerRef} className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {car.photos.map((photo) => (
                      <button key={photo} data-photo-url={photo} onClick={() => setActivePhoto(photo)} className={`flex-shrink-0 w-24 h-20 md:w-32 md:h-24 rounded-xl overflow-hidden border-2 transition-all duration-300 bg-gray-100 ${activePhoto === photo ? 'border-brand-orange ring-4 ring-orange-500/20' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                        <img src={photo} alt="" loading="lazy" className="w-full h-full object-cover" /> 
                      </button>
                    ))}
                  </div>
                </>
              ) : ( <div className="w-full h-[300px] md:h-[500px] bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 font-medium">Фотографии скоро появятся</div> )}
            </div>

            <div className="bg-white/70 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Информация об автомобиле</h3>
              <div className="grid sm:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-100">
                <div><p className="text-sm text-gray-500 mb-1">Марка</p><p className="font-bold text-lg">{car.brand}</p></div>
                <div><p className="text-sm text-gray-500 mb-1">Модель</p><p className="font-bold text-lg">{car.model}</p></div>
                <div><p className="text-sm text-gray-500 mb-1">Комплектация</p><p className="font-bold text-lg text-brand-orange">{car.complectation || 'Не указана'}</p></div>
                <div><p className="text-sm text-gray-500 mb-1">Состояние</p><p className="font-bold text-lg">Новый</p></div>
              </div>
              <h4 className="font-bold text-xl mb-4">Почему стоит купить в Прагматика:</h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3"><Percent className="w-6 h-6 text-brand-orange flex-shrink-0 mt-0.5" /><div><p className="font-bold text-gray-900">Гарантия лучшей цены</p><p className="text-sm text-gray-500">Улучшим предложения конкурентов</p></div></div>
                <div className="flex items-start gap-3"><ShieldCheck className="w-6 h-6 text-brand-orange flex-shrink-0 mt-0.5" /><div><p className="font-bold text-gray-900">Официальный дилер</p><p className="text-sm text-gray-500">Заводская гарантия на авто</p></div></div>
                <div className="flex items-start gap-3"><CarIcon className="w-6 h-6 text-brand-orange flex-shrink-0 mt-0.5" /><div><p className="font-bold text-gray-900">Выгодный Trade-In</p><p className="text-sm text-gray-500">Оценим ваш авто выше рынка</p></div></div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-white/80 to-gray-100/80 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-xl border border-gray-200 sticky top-24">
              <div className="mb-8">
                <p className="text-sm text-gray-500 mb-1 font-medium">Финальная цена со скидками:</p>
                <div className="text-4xl md:text-5xl font-bold text-[#303c48]">{finalPrice.toLocaleString('ru-RU')} ₽</div>
                {regularPrice > finalPrice && (
                  <div className="mt-3 flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg">
                    <span className="text-sm text-gray-600 font-medium">Выгода:</span>
                    <span className="font-bold text-brand-orange">{(regularPrice - finalPrice).toLocaleString('ru-RU')} ₽</span>
                  </div>
                )}
                {regularPrice > finalPrice && (<div className="mt-3 text-sm text-gray-400 line-through">Цена без скидок: {regularPrice.toLocaleString('ru-RU')} ₽</div>)}
              </div>
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-bold text-xl text-gray-900 mb-2">Забронировать автомобиль</h4>
                <p className="text-sm text-gray-500 mb-6">Оставьте заявку, чтобы зафиксировать цену. Это вас ни к чему не обязывает.</p>
                {/* Исправлена передача названия авто */}
                <ContactForm leadType="general" onSuccess={handleSuccess} carModel={fullCarName} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-12 border-t border-gray-200 mb-8 space-y-16">
          <div>
            <div className="text-center mb-8"><h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Кредит от 0.01%</h2><p className="text-lg text-gray-500">Рассчитайте комфортный платеж на этот {car.model}</p></div>
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100 p-6 md:p-10 max-w-5xl mx-auto">
              {/* Добавлена передача цены и названия в калькулятор (если он это поддерживает) */}
              <CreditCalculator onSuccess={handleSuccess} carPrice={finalPrice} carModel={fullCarName} />
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-[#303c48] rounded-3xl shadow-xl grid lg:grid-cols-2 items-center overflow-hidden">
              <div className="p-8 md:p-12 text-white order-2 lg:order-1">
                <h3 className="text-3xl font-bold mb-4">Лучший способ выбрать — это тест-драйв</h3>
                <p className="text-gray-300 mb-6">Запишитесь и испытайте {car.model} в реальных дорожных условиях. Это бесплатно и ни к чему не обязывает.</p>
                <button onClick={scrollToTestDrive} className="bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition shadow-lg animate-pulse">
                  Записаться на тест-драйв
                </button>
              </div>
              <div className="h-64 lg:h-full order-1 lg:order-2"><img src={car.photos?.[1] || car.photos?.[0] || '/promo-lada.webp'} alt={`Тест-драйв ${baseCarName}`} loading="lazy" className="w-full h-full object-cover" /></div>
            </div>
          </div>

          <div id="test-drive-section" className="w-full max-w-2xl mx-auto scroll-mt-24">
            <div className="text-center mb-8"><h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Испытайте авто в деле</h2><p className="text-lg text-gray-500">Заполните форму ниже для записи</p></div>
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100 p-6 md:p-10">
              {/* Исправлена передача названия авто */}
              <TestDriveForm onSuccess={handleSuccess} preselectedModel={baseCarName} />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-gray-900 to-[#303c48] text-gray-300 py-10 mt-auto">
        {/* ... твой футер без изменений ... */}
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="mb-4"><img src="/logo-lada.svg" alt="LADA" className="h-8 mx-auto mb-4 opacity-80" /></div>
            <p className="text-lg mb-2 font-semibold text-white">Прагматика LADA Великие Луки</p>
            <p className="mb-4">Официальный дилер LADA в Великих Луках</p>
            <p className="mb-4"><a href="/privacy.pdf" target="_blank" className="underline text-blue-500">Политика конфиденциальности</a></p>
            <p className="mb-4"><a href="https://vlyki.pskov.lada.ru/?utm_source=yandex&utm_medium=cpc&utm_campaign=yandex_pr" target="_blank" className="underline text-blue-500">vlyki.pskov.lada.ru</a></p>
            <p className="text-sm text-gray-400">Филиал ООО "Псков-Лада" Великие Луки. ИНН: 6027196721, КПП: 602543001</p>
            <p className="text-sm text-gray-400 mt-6">© 2026 Все права защищены</p>
          </div>
        </div>
      </footer>

      {showSuccess && ( <div className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-fade-in flex items-center gap-3"><CheckCircle2 className="w-6 h-6" /><div><p className="font-semibold text-lg">Заявка успешно отправлена!</p><p className="text-sm text-green-100">Менеджер свяжется с вами за 5 минут</p></div></div> )}
    </div>
  );
}
