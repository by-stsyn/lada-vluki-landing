import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function CountdownTimer() {
  const calculateTimeLeft = () => {
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const difference = endOfDay.getTime() - now.getTime();

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6" />
            <span className="text-lg font-semibold">Спешите! Предложение скоро закончится:</span>
          </div>
          <div className="flex gap-3">
            <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 min-w-[70px] text-center">
              <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="text-xs opacity-90">часов</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 min-w-[70px] text-center">
              <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="text-xs opacity-90">минут</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 min-w-[70px] text-center">
              <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
              <div className="text-xs opacity-90">секунд</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
