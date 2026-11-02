import { useState } from 'react';
import { sendToCalltouch, getUtmParams, trackGoal, formatPhoneInput } from './calltouch';

interface TestDriveFormProps {
  onSuccess: () => void;
  preselectedModel?: string;
}

export default function TestDriveForm({ onSuccess, preselectedModel }: TestDriveFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isPhoneValid = phone.length === 18;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneInput(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) { setError('Дайте согласие на обработку данных.'); return; }
    if (!isPhoneValid) { setError('Введите номер полностью'); return; }
    
    setError('');
    setLoading(true);

    try {
      // 1. Отправка в Calltouch с подписью города Великие Луки
      await sendToCalltouch({
        fio: name,
        phone,
        subject: 'Тест-драйв: LADA Великие Луки',
        comment: `Форма: Запись на тест-драйв | Модель: ${preselectedModel || 'Не выбрана'}`,
        tags: preselectedModel ? `Тест-драйв,${preselectedModel}` : 'Тест-драйв',
      });

      // 2. Отправка в Web3Forms
      const accessKey = import.meta.env.VITE_WEB3FORMS_KEY || 'cf05b6d7-94ea-4763-afbc-9b5b7619a6a4';
      const utm = getUtmParams();
      const formData = {
        access_key: accessKey,
        subject: '🚗 Тест-драйв: LADA Великие Луки',
        from_name: 'LADA Прагматика Великие Луки',
        'Город': 'Великие Луки (Прагматика LADA)',
        'Имя клиента': name,
        'Телефон': phone,
        'Интересующая модель': preselectedModel || 'Не указана',
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
      } else {
        throw new Error('Web3Forms Error');
      }
    } catch (err) {
      setError('Ошибка сети. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {preselectedModel && (
        <div className="bg-orange-50 border-l-4 border-[#f7761f] p-4 rounded mb-4">
          <p className="text-sm font-semibold text-gray-700">Автомобиль: {preselectedModel}</p>
        </div>
      )}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Ваше имя *</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#f7761f] focus:ring-2 focus:ring-[#f7761f]/20 outline-none transition" placeholder="Иван Иванов" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Телефон *</label>
        <input type="tel" value={phone} onChange={handlePhoneChange} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#f7761f] focus:ring-2 focus:ring-[#f7761f]/20 outline-none transition" placeholder="+7 (___) ___-__-__" />
      </div>
      <div className="flex items-start space-x-2">
        <input type="checkbox" id="td-consent" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
        <label htmlFor="td-consent" className="text-sm text-gray-700">Я даю согласие на <a href="/privacy.pdf" target="_blank" className="underline text-[#f7761f]">обработку персональных данных</a>.</label>
      </div>
      {error && (<div className="bg-red-50 border-l-4 border-red-500 p-4 rounded"><p className="text-sm text-red-700">{error}</p></div>)}
      <button type="submit" disabled={loading || !consent || !isPhoneValid} className="w-full bg-[#303c48] hover:bg-[#f7761f] text-white py-4 rounded-lg font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg">
        {loading ? 'Отправка...' : 'Записаться на тест-драйв'}
      </button>
    </form>
  );
}
