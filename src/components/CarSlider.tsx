import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarSliderProps {
  images: string[];
  carName: string;
  badge?: string;
  benefit?: string;
}

export default function CarSlider({ images, carName, badge, benefit }: CarSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Увеличенная высота контейнера (соотношение 4:3 / 440-470px на десктопе), чтобы автомобили не обрезались */}
      <div className="relative h-72 sm:h-96 lg:h-[440px] xl:h-[470px] bg-[#f5f6f8] rounded-2xl overflow-hidden group border border-gray-100">
        <img
          src={images[currentIndex]}
          alt={`LADA ${carName} — фото ${currentIndex + 1}`}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
        />

        {/* Верхние фирменные бейджи */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 pointer-events-none">
          {badge ? (
            <span className="bg-[#26303a]/90 backdrop-blur-sm text-white text-xs font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-lg shadow-sm">
              {badge}
            </span>
          ) : <span />}
          {benefit && (
            <span className="bg-[#ff6700] text-white text-xs font-extrabold px-3.5 py-1.5 rounded-lg shadow-sm">
              {benefit}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={goToPrevious}
          aria-label="Предыдущее фото"
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#26303a] rounded-full p-2.5 shadow-md opacity-85 lg:opacity-0 lg:group-hover:opacity-100 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={goToNext}
          aria-label="Следующее фото"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#26303a] rounded-full p-2.5 shadow-md opacity-85 lg:opacity-0 lg:group-hover:opacity-100 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/35 backdrop-blur-sm px-2.5 py-1 rounded-full">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Фото ${index + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-[#ff6700] w-6'
                  : 'bg-white/60 w-1.5 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2.5 mt-3">
        {images.map((image, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goToSlide(index)}
            className={`bg-[#f5f6f8] rounded-xl h-16 sm:h-20 lg:h-24 overflow-hidden transition-all border-2 ${
              index === currentIndex
                ? 'border-[#ff6700] shadow-sm opacity-100'
                : 'border-transparent opacity-65 hover:opacity-100'
            }`}
          >
            <img
              src={image}
              alt={`LADA ${carName} миниатюра ${index + 1}`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
