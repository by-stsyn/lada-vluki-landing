declare global {
  interface Window {
    ct?: (...args: any[]) => any;
    ym?: (...args: any[]) => any;
    call_value?: string;
    ct_local_session_id?: string;
  }
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

export const saveUtmParams = () => {
  if (typeof window === 'undefined') return;
  try {
    const params = new URLSearchParams(window.location.search);
    UTM_KEYS.forEach((key) => {
      const val = params.get(key);
      if (val) {
        localStorage.setItem(key, val);
      }
    });
  } catch (e) {
    // ignore storage errors
  }
};

export const getUtmParams = () => {
  if (typeof window === 'undefined') {
    return { utm_source: '', utm_medium: '', utm_campaign: '', utm_content: '', utm_term: '' };
  }
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  UTM_KEYS.forEach((key) => {
    try {
      result[key] = params.get(key) || localStorage.getItem(key) || '';
    } catch {
      result[key] = params.get(key) || '';
    }
  });
  return result as Record<(typeof UTM_KEYS)[number], string>;
};

export const trackGoal = (goalName: 'forma' | 'zvonok') => {
  if (typeof window === 'undefined') return;
  try {
    if (window.ym) {
      window.ym(96344039, 'reachGoal', goalName);
    }
    if (window.ct) {
      window.ct('goal', goalName);
    }
  } catch (e) {
    console.warn('Analytics goal error:', e);
  }
};

const getCalltouchSessionId = (counterIds: string[]): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    if (typeof window.ct === 'function') {
      for (const counterId of counterIds) {
        const res = window.ct('calltracking_params', counterId);
        if (res && typeof res.sessionId === 'string' && res.sessionId.trim() !== '') {
          return res.sessionId.trim();
        }
      }
      const defaultRes = window.ct('calltracking_params');
      if (defaultRes && typeof defaultRes.sessionId === 'string' && defaultRes.sessionId.trim() !== '') {
        return defaultRes.sessionId.trim();
      }
    }
    const fallback = window.call_value || window.ct_local_session_id;
    if (typeof fallback === 'string' && fallback.trim() !== '') {
      return fallback.trim();
    }
  } catch (e) {
    console.warn('Calltouch sessionId error:', e);
  }
  return null;
};

export const sendToCalltouch = async ({
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
    const cleanPhone = phone.replace(/\D/g, '');
    const utm = getUtmParams();

    const utmPairs = Object.entries(utm)
      .filter(([, val]) => Boolean(val))
      .map(([key, val]) => `${key}=${val}`);

    const cityPrefix = 'Город: Великие Луки | ДЦ: Прагматика LADA Великие Луки';
    const baseComment = [cityPrefix, comment].filter(Boolean).join(' | ');
    const fullComment = utmPairs.length > 0
      ? `${baseComment} | UTM: ${utmPairs.join(', ')}`
      : baseComment;

    const fullTags = [
      'Великие Луки',
      'Прагматика Великие Луки',
      'LADA',
      tags,
      utm.utm_source,
      utm.utm_medium,
      utm.utm_campaign,
    ]
      .map((t) => t?.trim())
      .filter(Boolean)
      .join(',');

    // Ensure subject always contains the city signature
    const finalSubject = subject.includes('Великие Луки')
      ? subject
      : `${subject} (Великие Луки)`;

    const counterIds = ['26272840', 'ipzjgrg1'];
    const sessionId = getCalltouchSessionId(counterIds);

    const ctParams = new URLSearchParams();
    ctParams.append('fio', fio.trim());
    ctParams.append('phoneNumber', cleanPhone);
    ctParams.append('subject', finalSubject);
    ctParams.append('comment', fullComment);
    ctParams.append('tags', fullTags);
    ctParams.append('requestUrl', window.location.href);

    if (sessionId) {
      ctParams.append('sessionId', sessionId);
    }

    // Send to configured site_id or both 16642 (from Calltouch API settings) and 51665
    const envSiteId = import.meta.env.VITE_CALLTOUCH_SITE_ID;
    const siteIds = envSiteId ? [envSiteId] : ['16642', '51665'];

    await Promise.allSettled(
      siteIds.map((siteId) =>
        fetch(`https://api.calltouch.ru/calls-service/RestAPI/requests/${siteId}/register/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: ctParams.toString(),
        })
      )
    );
  } catch (err) {
    console.error('Calltouch error:', err);
  }
};

