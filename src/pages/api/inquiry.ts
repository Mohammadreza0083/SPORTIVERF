import type { APIRoute } from 'astro';

export const prerender = false;

const TELEGRAM_BOT_TOKEN = '8921060827:AAHUNo_mdKGBwTlbysIf3nbBYd3BIX9k1Pw';
const TELEGRAM_CHAT_ID = '269309616';

const corsHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export const OPTIONS: APIRoute = async () => {
  return new Response(
    JSON.stringify({ success: true, message: 'CORS Preflight OK' }),
    { status: 200, headers: corsHeaders }
  );
};

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      success: false,
      status: 'error',
      message: 'Method Not Allowed. Please submit inquiries via POST with JSON body.'
    }),
    { status: 400, headers: corsHeaders }
  );
};

export const POST: APIRoute = async ({ request }) => {
  let data: Record<string, unknown> = {};

  // Extract query parameters first as guaranteed fallback
  try {
    const url = new URL(request.url);
    const searchObj = Object.fromEntries(url.searchParams.entries());
    data = { ...searchObj };
  } catch (urlErr) {
    console.warn('[Inquiry API] URL parsing error:', urlErr);
  }

  // Attempt to parse JSON body or Connect middleware body
  try {
    const reqBody = (request as unknown as { body?: unknown }).body;
    if (reqBody && typeof reqBody === 'object') {
      data = { ...data, ...(reqBody as Record<string, unknown>) };
    } else {
      const parsed = await request.json();
      if (parsed && typeof parsed === 'object') {
        data = { ...data, ...(parsed as Record<string, unknown>) };
      }
    }
  } catch {
    try {
      const rawText = await request.text();
      if (rawText && rawText.trim().length > 0) {
        const parsedText = JSON.parse(rawText);
        if (parsedText && typeof parsedText === 'object') {
          data = { ...data, ...(parsedText as Record<string, unknown>) };
        }
      }
    } catch {
      try {
        const formData = await request.formData();
        const fdObj = Object.fromEntries(formData.entries());
        data = { ...data, ...fdObj };
      } catch {
        // Keep searchParams fallback in data
      }
    }
  }

  console.warn('[Inquiry API Server Received Final Data]', data);

  try {
    const fullName = (
      data.fullName ||
      data.name ||
      data.agentName ||
      data.fullname ||
      data['fullName'] ||
      ''
    ).toString().trim();

    const email = (
      data.email ||
      data.emailAddress ||
      data.mail ||
      data['email'] ||
      ''
    ).toString().trim();

    const rawPhone = (
      data.phone ||
      data.whatsapp ||
      data.phoneNumber ||
      data.mobile ||
      data.tel ||
      data['phone'] ||
      ''
    ).toString().trim();

    const sport = (data.sport || 'FOOTBALL').toString().trim();
    const starTier = (data.starTier || '5-Star VIP').toString().trim();
    const participants = (data.participants || data.athletesCount || '1').toString().trim();
    const notes = (data.notes || data.message || 'No additional demands').toString().trim();
    const campTitle = (data.campTitle || data.tourTitle || 'SPORTIVERF Expedition').toString().trim();
    const locale = (data.locale || 'en').toString().toUpperCase();

    // 1. Full Name Validation
    if (!fullName || fullName.length < 2) {
      return new Response(
        JSON.stringify({
          success: false,
          status: 'error',
          message: 'Validation Error: Full Name is required and must be at least 2 characters.'
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 2. Strict Email Regex Validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          status: 'error',
          message: 'Validation Error: Please enter a valid email address (e.g. name@domain.com).'
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 3. Strict Phone / WhatsApp Validation (7 to 15 digits, no fake repeated digits)
    const phoneDigits = rawPhone.replace(/[^0-9]/g, '');
    const isRepeatedDigits = /^(\d)\1+$/.test(phoneDigits);

    if (!rawPhone || phoneDigits.length < 7 || phoneDigits.length > 15 || isRepeatedDigits) {
      return new Response(
        JSON.stringify({
          success: false,
          status: 'error',
          message: 'Validation Error: Please enter a valid international phone number with country code (7–15 digits).'
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const messageText = `
🏆 *NEW SPORTIVERF PRICING INQUIRY*
━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 *Camp:* ${campTitle}
⭐ *Tier:* ${starTier} | *Sport:* ${sport}
👤 *Athlete/Agent:* ${fullName}
📧 *Email:* \`${email}\`
📱 *Phone/WhatsApp:* \`${rawPhone}\`
👥 *Athletes Count:* ${participants}
🌐 *Locale:* ${locale}
📝 *Notes:* ${notes}
⏰ *Time:* ${now} UTC
━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ *Action Required:* Click button below to contact via WhatsApp:
`.trim();

    // Send Telegram payload with interactive Inline Keyboard Button for WhatsApp
    let telegramDelivered = false;
    try {
      const telegramRes = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: messageText,
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: '💬 Open WhatsApp Chat',
                    url: `https://wa.me/${phoneDigits}`
                  }
                ]
              ]
            }
          })
        }
      );
      telegramDelivered = telegramRes.ok;
    } catch (tgErr) {
      console.error('Telegram dispatch error:', tgErr);
    }

    const referenceId = `SRF-${Date.now().toString().slice(-6)}`;

    return new Response(
      JSON.stringify({
        success: true,
        status: 'success',
        message: 'Inquiry received successfully and transmitted to Telegram Concierge.',
        referenceId,
        telegramDelivered
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err: unknown) {
    console.error('Inquiry API Handler Error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Internal server error processing inquiry.';
    return new Response(
      JSON.stringify({
        success: false,
        status: 'error',
        message: errorMessage
      }),
      { status: 500, headers: corsHeaders }
    );
  }
};
