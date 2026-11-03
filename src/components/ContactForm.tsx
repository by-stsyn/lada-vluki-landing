import { useState, useId } from 'react';
import { sendToCalltouch, getUtmParams, trackGoal, formatPhoneInput } from './calltouch';

interface ContactFormProps {
  leadType: 'general' | 'credit';
  onSuccess: () => void;
  carModel?: string;
}

export default function ContactForm({ leadType, onSuccess, carModel }: ContactFormProps) {
  const formId = useId();
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
    if (!consent) {
      setError('Вы должны дать согласие на обработку персональных данных.');
      return;
    }
    if (!isPhoneValid) {
      setError('Введите номер телефона полностью');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const formLabel = leadType === 'general' ? 'Бронирование / Консультация' : 'Кредит';
      const accessKey = import.meta.env.VITE_WEB3FORMS_KEY || 'cf05b6d7-94ea-4763-afbc-9b5b7619a6a4';
      const utm = getUtmParams();

      const formData = {
        access_key: accessKey,
        subject: '🚀 Новая заявка: LADA Великие Луки',
        from_name: 'LADA Прагматика Великие Луки',
        'Город': 'Великие Луки (Прагматика LADA)',
        'Имя клиента': name.trim(),
        'Телефон': phone,
        'Форма': formLabel,
        ...(carModel && { 'Интересует авто': carModel }),
        'Страница': window.location.href,
        ...(utm.utm_source && { 'UTM Source': utm.utm_source }),
        ...(utm.utm_medium && { 'UTM Medium': utm.utm_medium }),
        ...(utm.utm_campaign && { 'UTM Campaign': utm.utm_campaign }),
        ...(utm.utm_content && { 'UTM Content': utm.utm_content }),
        ...(utm.utm_term && { 'UTM Term': utm.utm_term }),
      };

      const [ctOk, web3Res] = await Promise.all([
        sendToCalltouch({
          fio: name,
          phone,
          subject: 'Заявка с сайта: LADA Великие Луки',
          comment: `Форма: ${formLabel}${carModel ? ` | Модель: ${carModel}` : ' | Общая заявка'}`,
          tags: carModel ? `Заявка,${carModel}` : 'Заявка',
        }),
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(formData),
        })
          .then(async (r) => {
            const json = await r.json().catch(() => null);
            return Boolean(r.ok && json?.success);
          })
          .catch(() => false),
      ]);

      if (web3Res || ctOk) {
        trackGoal('forma');
        setName('');
        setPhone('');
        setConsent(false);
        onSuccess();
      } else {
        throw new Error('Ошибка отправки заявки');
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
        <div className="bg-orange-50 border-l-4 border-[#ff6700] p-4 rounded">
          <p className="text-sm font-semibold text-gray-700">Модель: {carModel}</p>
        </div>
      )}
      <div>
        <label htmlFor={`${formId}-name`} className="block text-sm font-semibold text-gray-700 mb-2">
          Ваше имя *
        </label>
        <input
          type="text"
          id={`${formId}-name`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#ff6700] focus:ring-2 focus:ring-[#ff6700]/20 outline-none transition"
          placeholder="Иван Иванов"
        />
      </div>
      <div>
        <label htmlFor={`${formId}-phone`} className="block text-sm font-semibold text-gray-700 mb-2">
          Телефон *
        </label>
        <input
          type="tel"
          id={`${formId}-phone`}
          value={phone}
          onChange={handlePhoneChange}
          required
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#ff6700] focus:ring-2 focus:ring-[#ff6700]/20 outline-none transition"
          placeholder="+7 (___) ___-__-__"
        />
      </div>
      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          id={`${formId}-consent`}
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 accent-[#ff6700]"
        />
        <label htmlFor={`${formId}-consent`} className="text-sm text-gray-700">
          Я даю согласие группе компаний «Прагматика» на{' '}
          <a href="/privacy.pdf" target="_blank" rel="noopener noreferrer" className="underline text-[#ff6700]">
            обработку моих персональных данных
          </a>
          .
        </label>
      </div>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      <button
        type="submit"
        disabled={loading || !consent || !isPhoneValid}
        className="w-full bg-[#26303a] hover:bg-[#ff6700] text-white py-4 rounded-lg font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {loading ? 'Отправка...' : 'Отправить заявку'}
      </button>
    </form>
  );
}
