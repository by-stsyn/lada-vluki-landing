import { useState } from 'react';
import { sendToCalltouch, getUtmParams, trackGoal } from './calltouch';

interface TradeInFormProps {
  onSuccess: () => void;
}

export default function TradeInForm({ onSuccess }: TradeInFormProps) {
  const [carBrand, setCarBrand] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isPhoneValid = phone.length === 18;

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
        subject: 'Trade-In: LADA Великие Луки',
        comment: `Форма: Trade-In | Авто клиента: ${carBrand} ${carModel} (${carYear} г.в.)`,
        tags: 'Trade-In,Трейд-ин',
      });

      // 2. Отправка в Web3Forms
      const accessKey = import.meta.env.VITE_WEB3FORMS_KEY || 'cf05b6d7-94ea-4763-afbc-9b5b7619a6a4';
      const utm = getUtmParams();
      const formData = {
        access_key: accessKey,
        subject: '🔄 Trade-In: LADA Великие Луки',
        from_name: 'LADA Прагматика Великие Луки',
        'Город': 'Великие Луки (Прагматика LADA)',
        'Имя клиента': name,
        'Телефон': phone,
        'Марка старого авто': carBrand,
        'Модель старого авто': carModel,
        'Год выпуска': carYear,
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
        setCarBrand(''); setCarModel(''); setCarYear(''); setName(''); setPhone(''); setConsent(false);
        onSuccess();
      } else { throw new Error('API Error'); }
    } catch (err) {
      setError('Ошибка сети. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Марка авто *</label>
          <input type="text" value={carBrand} onChange={(e) => setCarBrand(e.target.value)} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#f7761f] outline-none transition" placeholder="Например: Kia" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Модель *</label>
          <input type="text" value={carModel} onChange={(e) => setCarModel(e.target.value)} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#f7761f] outline-none transition" placeholder="Rio" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Год выпуска *</label>
          <input type="number" min="1990" max="2026" value={carYear} onChange={(e) => setCarYear(e.target.value)} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#f7761f] outline-none transition" placeholder="2018" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Ваше имя *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#f7761f] outline-none transition" placeholder="Иван Иванов" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Телефон *</label>
          <input type="tel" value={phone} onChange={handlePhoneChange} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#f7761f] outline-none transition" placeholder="+7 (___) ___-__-__" />
        </div>
      </div>

      <div className="flex items-start space-x-2 pt-2">
        <input type="checkbox" id="tradein-consent" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
        <label htmlFor="tradein-consent" className="text-sm text-gray-700">Я даю согласие на <a href="/privacy.pdf" target="_blank" className="underline text-[#f7761f]">обработку персональных данных</a>.</label>
      </div>
      
      {error && (<div className="bg-red-50 border-l-4 border-red-500 p-4 rounded"><p className="text-sm text-red-700">{error}</p></div>)}
      
      <button type="submit" disabled={loading || !consent || !isPhoneValid} className="w-full bg-[#303c48] hover:bg-[#f7761f] text-white py-4 rounded-lg font-bold text-lg transition disabled:opacity-50 mt-4 shadow-lg">
        {loading ? 'Отправка...' : 'Оценить мой автомобиль'}
      </button>
    </form>
  );
}
