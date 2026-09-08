import { Car, Calendar } from 'lucide-react';

interface CarCardProps {
  name: string;
  price: string;
  image: string;
  features: string[];
  badge?: string;
  onDetailsClick: () => void;
  onTestDriveClick: () => void;
}

export default function CarCard({
  name,
  price,
  image,
  features,
  badge,
  onDetailsClick,
  onTestDriveClick,
}: CarCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="w-full h-64 object-cover"
        />
        {badge && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm">
            {badge}
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
        <div className="text-3xl font-bold text-red-600 mb-4">{price}</div>

        <div className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onDetailsClick}
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            <Car className="w-4 h-4" />
            Подробнее
          </button>
          <button
            onClick={onTestDriveClick}
            className="flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            <Calendar className="w-4 h-4" />
            Тест-драйв
          </button>
        </div>
      </div>
    </div>
  );
}
