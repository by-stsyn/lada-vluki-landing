import { useEffect, useRef } from 'react';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import { trackGoal } from './calltouch';

declare global {
  interface Window {
    ymaps?: any;
  }
}

interface ContactsProps {
  onOpenContactModal: () => void;
}

// Точные координаты дилерского центра Прагматика LADA Великие Луки (ул. Гоголя, 4): [широта, долгота]
const DEALER_COORDS: [number, number] = [56.359901, 30.567245];
const DEALER_CITY = 'Великие Луки';
const DEALER_NAME = 'Прагматика LADA Великие Луки';
const DEALER_ADDRESS = 'Псковская область, Великие Луки, ул. Гоголя, 4';
const YANDEX_MAPS_SCRIPT_ID = 'yandex-maps-api-script';

export default function Contacts({ onOpenContactModal }: ContactsProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    let mapInstance: any = null;

    const initMap = () => {
      if (!isMounted || !mapRef.current || !window.ymaps) return;

      window.ymaps.ready(() => {
        if (!isMounted || !mapRef.current) return;

        // Очищаем контейнер перед инициализацией на случай повторного рендера в StrictMode
        mapRef.current.innerHTML = '';

        mapInstance = new window.ymaps.Map(
          mapRef.current,
          {
            center: DEALER_COORDS,
            zoom: 16,
            controls: ['zoomControl'],
          },
          {
            suppressMapOpenBlock: true,
            yandexMapDisablePoiInteractivity: true, // отключает клики по чужим организациям на карте
          }
        );

        // Отключаем зум колесиком мыши, чтобы не мешать скроллу страницы
        mapInstance.behaviors.disable('scrollZoom');

        const placemark = new window.ymaps.Placemark(
          DEALER_COORDS,
          {
            hintContent: `${DEALER_NAME} — ${DEALER_ADDRESS}`,
            balloonContentHeader: `<strong>${DEALER_NAME}</strong>`,
            balloonContentBody: `
              <div style="font-family: Manrope, sans-serif; font-size: 13px; line-height: 1.5; color: #26303a;">
                <div>${DEALER_ADDRESS}</div>
                <div style="margin-top: 4px;">Ежедневно: 08:00 – 20:00</div>
                <div style="margin-top: 6px; font-weight: 700;">
                  <a href="tel:+78115395565" style="color: #ff6700; text-decoration: none;">+7 (811) 539-55-65</a>
                </div>
              </div>
            `,
            balloonContentFooter: `Официальный дилер LADA в г. ${DEALER_CITY}`,
          },
          {
            preset: 'islands#AutoIcon',
            iconColor: '#ff6700',
          }
        );

        mapInstance.geoObjects.add(placemark);
      });
    };

    if (window.ymaps) {
      initMap();
    } else {
      let script = document.getElementById(YANDEX_MAPS_SCRIPT_ID) as HTMLScriptElement | null;

      if (!script) {
        script = document.createElement('script');
        script.id = YANDEX_MAPS_SCRIPT_ID;
        script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
        script.async = true;
        document.head.appendChild(script);
      }

      script.addEventListener('load', initMap);

      return () => {
        isMounted = false;
        script?.removeEventListener('load', initMap);
        if (mapInstance) {
          mapInstance.destroy();
          mapInstance = null;
        }
      };
    }

    return () => {
      isMounted = false;
      if (mapInstance) {
        mapInstance.destroy();
        mapInstance = null;
      }
    };
  }, []);

  return (
    <section id="contacts" className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-[30px] sm:text-3xl font-bold mb-12 md:text-5xl leading-tight text-center text-gray-900">
          КОНТАКТЫ И АДРЕС
        </h2>
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 sm:p-10 space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{DEALER_NAME}</h3>
                <p className="text-sm text-gray-500">Официальный дилер LADA в г. {DEALER_CITY}</p>
              </div>

              <div className="flex gap-4">
                <div className="bg-[#f7761f] rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900 mb-1">АДРЕС</h4>
                  <p className="text-gray-600 text-lg">{DEALER_ADDRESS}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-[#f7761f] rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900 mb-1">ТЕЛЕФОН</h4>
                  <a
                    href="tel:+78115395565"
                    className="text-[#f7761f] hover:text-[#e66718] font-bold text-xl"
                    onClick={() => trackGoal('zvonok')}
                  >
                    +7 (811) 539-55-65
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-[#f7761f] rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900 mb-1">РЕЖИМ РАБОТЫ</h4>
                  <p className="text-gray-600 text-lg">Ежедневно: 8:00 - 20:00</p>
                  <p className="text-gray-500">Без выходных</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={onOpenContactModal}
                  className="flex-1 bg-[#303c48] text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-[#f7761f] transition shadow-lg"
                >
                  СВЯЗАТЬСЯ С НАМИ
                </button>
                <a
                  href={`https://yandex.ru/maps/?rtext=~${DEALER_COORDS[0]},${DEALER_COORDS[1]}&rtt=auto`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-[#f7761f] text-gray-700 hover:text-[#f7761f] py-4 px-6 rounded-xl font-bold text-base transition"
                >
                  <Navigation className="w-5 h-5" />
                  <span>Маршрут</span>
                </a>
              </div>
            </div>

            <div className="h-full min-h-[400px] lg:min-h-[500px] bg-gray-100 relative">
              <div ref={mapRef} className="w-full h-full min-h-[400px] lg:min-h-[500px]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
