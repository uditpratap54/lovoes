import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const TO_EMAIL = import.meta.env.VITE_EMAILJS_TO_EMAIL;

export const sendEmail = async (response) => {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn('EmailJS not configured.');
    return false;
  }
  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        response,
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        to_email: TO_EMAIL,
        subject: `Operation Sheetal — ${response === 'accepted' ? '❤️ She Said YES!' : '💙 She Chose Friends'}`,
      },
      PUBLIC_KEY
    );
    return true;
  } catch (e) {
    console.error('EmailJS error:', e);
    return false;
  }
};
