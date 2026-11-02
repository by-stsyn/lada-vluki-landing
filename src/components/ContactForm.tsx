import { useState } from 'react';
import { sendToCalltouch, getUtmParams, trackGoal, formatPhoneInput } from './calltouch';

interface ContactFormProps {
  leadType: 'general' | 'credit';
  onSuccess: () => void;
  carModel?: string;
}

export default function ContactForm({ leadType, onSuccess, carModel }: ContactFormProps) {
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
    if (!consent) { setError('Вы должны дать согласие на обработку персональных данных.'); return; }
    if (!isPhoneValid) { setError('Введите номер телефона полностью'); return; }
    
    setError('');
    setLoading(true);

    try {
      const formLabel = leadType === 'general' ? 'Бронирование / Консультация' : 'Кредит';

      // 1. Отправка в Calltouch с подписью города Великие Луки и тегами
      await sendToCalltouch({
        fio: name,
        phone,
        subject: 'Заявка с сайта: LADA Великие Луки',
        comment: `Форма: ${formLabel}${carModel ? ` | Модель: ${carModel}` : ' | Общая заявка'}`,
        tags: carModel ? `Заявка,${carModel}` : 'Заявка',
      });

      // 2. Отправка в Web3Forms
      const accessKey = import.meta.env.VITE_WEB3FORMS_KEY || 'cf05b6d7-94ea-4763-afbc-9b5b7619a6a4';
      const utm = getUtmParams();
      
      const formData = {
        access_key: accessKey,
        subject: '🚀 Новая заявка: LADA Великие Луки',
        from_name: 'LADA Прагматика Великие Луки',
        'Город': 'Великие Луки (Прагматика LADA)',
        'Имя клиента': name,
        'Телефон': phone,
        'Форма': formLabel,
        ...(carModel && { 'Интересует авто': carModel }),
        'Страница': window.location.href,
        ...(utm.utm_source && { 'UTM Source': utm.utm_source }),
        ...(utm.utm_medium && { 'UTM Medium': utm.utm_medium }),
        ...(utm.utm_campaign && { 'UTM Campaign': utm.utm_campaign }),
      };

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        trackGoal('forma');
        setName(''); setPhone(''); setConsent(false);
        onSuccess();
      } else {
        throw new Error('Ошибка на стороне Web3Forms');
      }

    } catch (err) {
      console.error('Ошибка отправки:', err);
      setError('Ошибка сети. Проверьте подключение к интернету и попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {carModel && (
        <div className="bg-orange-50 border-l-4 border-[#f7761f] p-4 rounded">
          <p className="text-sm font-semibold text-gray-700">Модель: {carModel}</p>
        </div>
      )}
      <div>
        <label htmlFor="contact-name" className="block text-sm font-semibold text-gray-700 mb-2">Ваше имя *</label>
        <input type="text" id="contact-name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#f7761f] focus:ring-2 focus:ring-[#f7761f]/20 outline-none transition" placeholder="Иван Иванов" />
      </div>
      <div>
        <label htmlFor="contact-phone" className="block text-sm font-semibold text-gray-700 mb-2">Телефон *</label>
        <input type="tel" id="contact-phone" value={phone} onChange={handlePhoneChange} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#f7761f] focus:ring-2 focus:ring-[#f7761f]/20 outline-none transition" placeholder="+7 (___) ___-__-__" />
      </div>
      <div className="flex items-start space-x-2">
        <input type="checkbox" id="contact-consent" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
        <label htmlFor="contact-consent" className="text-sm text-gray-700">Я даю согласие группе компаний «Прагматика» на <a href="/privacy.pdf" target="_blank" className="underline text-[#f7761f]">обработку моих персональных данных</a>.</label>
      </div>
      {error && (<div className="bg-red-50 border-l-4 border-red-500 p-4 rounded"><p className="text-sm text-red-700">{error}</p></div>)}
      <button type="submit" disabled={loading || !consent || !isPhoneValid} className="w-full bg-[#303c48] hover:bg-[#f7761f] text-white py-4 rounded-lg font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg">
        {loading ? 'Отправка...' : 'Отправить заявку'}
      </button>
    </form>
  );
}
