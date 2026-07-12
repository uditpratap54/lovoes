const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

export const sendTelegram = async (message) => {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn('Telegram not configured.');
    return false;
  }
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    );
    return res.ok;
  } catch (e) {
    console.error('Telegram error:', e);
    return false;
  }
};

export const buildAcceptMessage = () =>
  `❤️ <b>Operation Sheetal — Update</b>\n\n` +
  `🎉 <b>Sheetal ACCEPTED!</b>\n\n` +
  `She said YES! 🥳\n` +
  `Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n\n` +
  `Mission: Make Each Other Smile 😊`;

export const buildRejectMessage = () =>
  `💙 <b>Operation Sheetal — Update</b>\n\n` +
  `She chose to remain friends for now.\n` +
  `Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n\n` +
  `Stay respectful. That's the mission. 🤍`;
