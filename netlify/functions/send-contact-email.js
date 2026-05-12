/**
 * Netlify serverless function: send contact form via EmailJS REST API.
 * Secrets live only in Netlify environment variables (same pattern as fan-web).
 *
 * Template params sent (use these names in your EmailJS template body):
 *   {{from_name}}, {{from_email}}, {{reply_to}}, {{message}}, {{phone}}, {{name}}, {{email}}
 */

const EMAILJS_API = 'https://api.emailjs.com/api/v1.0/email/send';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
  const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
  const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
  const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;

  const missing = [];
  if (!EMAILJS_SERVICE_ID) missing.push('EMAILJS_SERVICE_ID');
  if (!EMAILJS_TEMPLATE_ID) missing.push('EMAILJS_TEMPLATE_ID');
  if (!EMAILJS_PUBLIC_KEY) missing.push('EMAILJS_PUBLIC_KEY');
  if (!EMAILJS_PRIVATE_KEY) missing.push('EMAILJS_PRIVATE_KEY');

  if (missing.length) {
    console.error('Missing EmailJS env vars:', missing.join(', '));
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Server configuration error',
        missing,
      }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON' }),
    };
  }

  const { name, email, phone, message } = body;

  if (!name || !email || !message) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Name, email and message are required' }),
    };
  }

  const nameStr = String(name).trim();
  const letterCount = (nameStr.match(/\p{L}/gu) || []).length;
  if (letterCount < 3) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid name' }),
    };
  }

  const emailStr = String(email).trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr)) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid email' }),
    };
  }

  const messageStr = String(message).trim();
  if (messageStr.length < 10) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Message too short' }),
    };
  }

  const phoneDisplay =
    phone != null && String(phone).trim() !== '' ? String(phone).trim() : '—';

  const payload = {
    service_id: EMAILJS_SERVICE_ID,
    template_id: EMAILJS_TEMPLATE_ID,
    user_id: EMAILJS_PUBLIC_KEY,
    accessToken: EMAILJS_PRIVATE_KEY,
    template_params: {
      from_name: nameStr,
      from_email: emailStr,
      reply_to: emailStr,
      message: messageStr,
      phone: phoneDisplay,
      name: nameStr,
      email: emailStr,
    },
  };

  try {
    const res = await fetch(EMAILJS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await res.text();

    if (!res.ok) {
      console.error('EmailJS error:', res.status, text);
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to send message' }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error('Send contact error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to send message' }),
    };
  }
};
