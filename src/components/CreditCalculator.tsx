import { useState, useEffect } from 'react';
import { sendToCalltouch, getUtmParams, trackGoal } from './calltouch';

interface CreditCalculatorProps {
  onSuccess: () => void;
  carPrice?: number;
  carModel?: string;
}

export default function CreditCalculator({ onSuccess, carPrice, carModel }: CreditCalculatorProps) {
  const [price, setPrice] = useState(carPrice || 1000000);
  const [initialPayment, setInitialPayment] = useState(Math.round((carPrice || 1000000) * 0.2));
  const [months, setMonths] = useState(60);
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isPhoneValid = phone.length === 18;

  useEffect(() => {
    if (carPrice) {
      setPrice(carPrice);
      setInitialPayment(Math.round(carPrice * 0.2));
    }
  }, [carPrice]);

  useEffect(() => {
    const loanAmount = Math.max(price - initialPayment, 0);
    const rate = 0.0001; // 0.01%
    const monthlyRate = rate / 12;
    const payment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    setMonthlyPayment(Math.max(Math.round(payment), 0));
  }, [price, initialPayment, months]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (!val) { setPhone(''); return; }
    if (['7', '8', '9'].includes(val[0])) {
      if (val[0] === '9') val = '7' + val;
      else val = '7' + val.substring(1);
    } else { val = '7' + val; }
    let formatted = '+7';
    if (val.length > 1) formatted += ' (' + val.substring(1, 4);
    if (val.length > 4) formatted += ') ' + val.substring(4, 7);
    if (val.length > 7) formatted += '-' + val.substring(7, 9);
    if (val.length > 9) formatted += '-' + val.substring(9, 11);
    setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) { setError('Дайте согласие на обработку данных'); return; }
    if (!isPhoneValid) { setError('Введите номер полностью'); return; }
    
    setError('');
    setLoading(true);

    try {
      // 1. Отправка в Calltouch с подписью города Великие Луки
      await sendToCalltouch({
        fio: name,
        phone,
        subject: 'Кредит: LADA Великие Луки',
        comment: `Форма: Кредитный калькулятор | Авто: ${carModel || 'Не указано'} | Цена: ${price.toLocaleString('ru-RU')} руб | Взнос: ${initialPayment.toLocaleString('ru-RU')} руб | Срок: ${months} мес | Платеж: ${monthlyPayment.toLocaleString('ru-RU')} руб/мес`,
        tags: carModel ? `Кредит,${carModel}` : 'Кредит',
      });

      // 2. Отправка в Web3Forms
      const accessKey = import.meta.env.VITE_WEB3FORMS_KEY || 'cf05b6d7-94ea-4763-afbc-9b5b7619a6a4';
      const utm = getUtmParams();
      const formData = {
        access_key: accessKey,
        subject: '💰 Кредит: LADA Великие Луки',
        from_name: 'LADA Прагматика Великие Луки',
        'Город': 'Великие Луки (Прагматика LADA)',
        'Имя клиента': name,
        'Телефон': phone,
        'Интересует авто': carModel || 'Любое',
        'Стоимость автомобиля': `${price.toLocaleString('ru-RU')} руб.`,
        'Первый взнос': `${initialPayment.toLocaleString('ru-RU')} руб.`,
        'Срок кредита': `${months} мес.`,
        'Желаемый платеж': `${monthlyPayment.toLocaleString('ru-RU')} руб./мес.`,
        'Страница': window.location.href,
        ...(utm.utm_source && { 'UTM Source': utm.utm_source }),
        ...(utm.utm_medium && { 'UTM Medium': utm.utm_medium }),
        ...(utm.utm_campaign && { 'UTM Campaign': utm.utm_campaign }),
      };

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        trackGoal('forma');
        setName(''); setPhone(''); setConsent(false);
        onSuccess();
      } else { throw new Error('API Error'); }
    } catch (err) {
      setError('Ошибка сети. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12">
      <div className="space-y-8">
        <div>
          <div className="flex justify-between mb-2">
            <label className="font-semibold text-gray-700">Стоимость автомобиля</label>
            <span className="font-bold text-xl">{price.toLocaleString()} ₽</span>
          </div>
          <input type="range" min="500000" max="3000000" step="50000" value={price} onChange={(e) => {
            const newPrice = Number(e.target.value);
            setPrice(newPrice);
            if (initialPayment > newPrice) setInitialPayment(newPrice * 0.2);
          }} className="w-full accent-[#f7761f]" />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="font-semibold text-gray-700">Первоначальный взнос</label>
            <span className="font-bold text-xl">{initialPayment.toLocaleString()} ₽</span>
          </div>
          <input type="range" min="0" max={price} step="10000" value={initialPayment} onChange={(e) => setInitialPayment(Number(e.target.value))} className="w-full accent-[#f7761f]" />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="font-semibold text-gray-700">Срок кредита</label>
            <span className="font-bold text-xl">{months} мес.</span>
          </div>
          <input type="range" min="12" max="96" step="12" value={months} onChange={(e) => setMonths(Number(e.target.value))} className="w-full accent-[#f7761f]" />
        </div>

        <div className="bg-orange-50 rounded-2xl p-6 border border-[#f7761f]/20">
          <p className="text-sm text-gray-600 mb-2">Ежемесячный платеж:</p>
          <div className="text-4xl font-black text-[#f7761f]">{monthlyPayment.toLocaleString()} ₽</div>
          <p className="text-xs text-gray-500 mt-2">* Расчет является предварительным</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 sm:p-8 rounded-2xl">
        <h3 className="text-2xl font-bold mb-6">Оставить заявку на кредит</h3>
        {carModel && (
          <div className="bg-white border-l-4 border-[#f7761f] p-4 rounded mb-4 shadow-sm">
            <p className="text-sm font-semibold text-gray-700">Модель: {carModel}</p>
          </div>
        )}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Ваше имя *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#f7761f] outline-none" placeholder="Иван Иванов" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Телефон *</label>
          <input type="tel" value={phone} onChange={handlePhoneChange} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#f7761f] outline-none" placeholder="+7 (___) ___-__-__" />
        </div>
        <div className="flex items-start space-x-2">
          <input type="checkbox" id="credit-consent" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
          <label htmlFor="credit-consent" className="text-sm text-gray-700">Я даю согласие на <a href="/privacy.pdf" target="_blank" className="underline text-[#f7761f]">обработку персональных данных</a>.</label>
        </div>
        {error && (<div className="bg-red-50 border-l-4 border-red-500 p-4 rounded"><p className="text-sm text-red-700">{error}</p></div>)}
        <button type="submit" disabled={loading || !consent || !isPhoneValid} className="w-full bg-[#303c48] hover:bg-[#f7761f] text-white py-4 rounded-lg font-bold text-lg transition disabled:opacity-50 shadow-lg">
          {loading ? 'Отправка...' : 'Отправить заявку'}
        </button>
      </form>
    </div>
  );
}
