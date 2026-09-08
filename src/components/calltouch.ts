declare global {
  interface Window {
    ct?: (...args: any[]) => any;
  }
}

export const sendToCalltouch = ({
  fio,
  phone,
  subject,
  comment = '',
  tags = '',
}: {
  fio: string;
  phone: string;
  subject: string;
  comment?: string;
  tags?: string;
}) => {
  try {
    const ct_site_id = '51665';
    const ct_counter_id = 'ipzjgrg1';

    // 👉 UTM
    const params = new URLSearchParams(window.location.search);

    const utm_source = params.get('utm_source') || localStorage.getItem('utm_source') || '';
    const utm_medium = params.get('utm_medium') || localStorage.getItem('utm_medium') || '';
    const utm_campaign = params.get('utm_campaign') || localStorage.getItem('utm_campaign') || '';
    const utm_content = params.get('utm_content') || localStorage.getItem('utm_content') || '';
    const utm_term = params.get('utm_term') || localStorage.getItem('utm_term') || '';

    const utmString = `
utm_source=${utm_source}
utm_medium=${utm_medium}
utm_campaign=${utm_campaign}
utm_content=${utm_content}
utm_term=${utm_term}
    `.trim();

    const fullComment = `${comment}\n\nUTM:\n${utmString}`;

    const fullTags = [tags, utm_source, utm_medium, utm_campaign]
      .filter(Boolean)
      .join(',');

    // 👉 sessionId (ВНЕ объекта)
    let sessionId: string | null = null;

    try {
      if (window.ct) {
        const result = window.ct('calltracking_params', ct_counter_id);
        sessionId = result?.sessionId || null;
      }
    } catch (e) {
      console.warn('Calltouch sessionId error:', e);
    }

    // 👉 объект запроса
    const ct_data = {
      fio,
      phoneNumber: phone,
      email: '',
      subject,
      comment: fullComment,
      tags: fullTags,
      requestUrl: window.location.href,
      sessionId: sessionId,
    };

    fetch(`https://api.calltouch.ru/calls-service/RestAPI/requests/${ct_site_id}/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(ct_data as any).toString(),
    });
  } catch (err) {
    console.error('Calltouch error:', err);
  }
};
