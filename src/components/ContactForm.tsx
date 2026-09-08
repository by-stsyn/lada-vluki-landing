import { useState } from 'react';

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
    let val = e.target.value.replace(/\D/g, '');
    if (!val) { setPhone(''); return; }
    if (['7', '8', '9'].includes(val[0])) {
      if (val[0] === '9') val = '7' + val;
      else val = '7' + val.substring(1);
    } else {
      val = '7' + val;
    }
    let formatted = '+7';
    if (val.length > 1) formatted += ' (' + val.substring(1, 4);
    if (val.length > 4) formatted += ') ' + val.substring(4, 7);
    if (val.length > 7) formatted += '-' + val.substring(7, 9);
    if (val.length > 9) formatted += '-' + val.substring(9, 11);
    setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) { setError('Вы должны дать согласие на обработку персональных данных.'); return; }
    if (!isPhoneValid) { setError('Введите номер телефона полностью'); return; }
    
    setError('');
    setLoading(true);

    try {
      // 1. Отправка в Calltouch (Напрямую или через твой скрипт)
      try {
        const ctSiteId = '51665'; // Проверь, правильный ли ID для Лады
        const calltouchUrl = `https://api.calltouch.ru/calls-service/RestAPI/requests/${ctSiteId}/register/`;
        
        const ctData = new URLSearchParams();
        ctData.append('fio', name);
        ctData.append('phoneNumber', phone.replace(/\D/g, ''));
        ctData.append('subject', 'Заявка с сайта: LADA Великие Луки');
        if (carModel) ctData.append('comment', `Модель: ${carModel} | Форма: ${leadType}`);
        ctData.append('requestUrl', window.location.href);
        
        const sessionId = (window as any).call_value || (window as any).ct_local_session_id;
        if (sessionId) ctData.append('sessionId', sessionId);

        await fetch(calltouchUrl, { method: 'POST', body: ctData });
      } catch (ctError) {
        console.error('❌ Ошибка Calltouch:', ctError);
      }

      // 2. Отправка в Web3Forms (Замена Supabase)
      const accessKey = import.meta.env.VITE_WEB3FORMS_KEY || 'cf05b6d7-94ea-4763-afbc-9b5b7619a6a4';
      
      const formData = {
        access_key: accessKey,
        subject: '🚀 Новая заявка: LADA Великие Луки',
        from_name: 'LADA Landing',
        'Имя клиента': name,
        'Телефон': phone,
        'Форма': leadType === 'general' ? 'Бронирование / Узнать подробности' : 'Кредит',
        ...(carModel && { 'Интересует авто': carModel }),
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

      // Если Web3Forms ответил 200 OK
      if (response.ok && result.success) {
        // Отстукиваем цели Яндекс.Метрики и Calltouch
        if (typeof window !== 'undefined') {
          if ((window as any).ym) { (window as any).ym(96344039, 'reachGoal', 'forma'); }
          if ((window as any).ct) { (window as any).ct('goal', 'forma'); }
        }
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
