// Vercel Serverless Proxy — /api/gas
// Forwards all requests from the frontend to Google Apps Script.
// The browser only ever calls this same-origin endpoint,
// so there is zero CORS or redirect problem in Android WebView.

export default async function handler(req, res) {
  // Allow POST only
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  const GAS_URL = process.env.GAS_API_URL || 'https://script.google.com/macros/s/AKfycbwW34tT5k0eKOaNan7iVuk0SebCYRYsQC4T2WmONMEZT5M2KeKWyKpcsy4NqBNcc6Dk/exec';

  // Read raw body from the request
  let rawBody = '';
  try {
    rawBody = await readBody(req);
  } catch (e) {
    return res.status(400).json({ success: false, message: 'Could not read request body.' });
  }

  // Ensure body is in payload=<json> format that GAS expects
  const forwardBody = rawBody.startsWith('payload=')
    ? rawBody
    : 'payload=' + encodeURIComponent(rawBody);

  // Call Google Apps Script server-side — no browser/WebView involved
  let text;
  try {
    const gasRes = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: forwardBody,
      redirect: 'follow',
    });
    text = await gasRes.text();
  } catch (err) {
    return res.status(502).json({
      success: false,
      message: 'Cannot reach backend. Please try again.',
    });
  }

  // Parse and return GAS response as-is
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    return res.status(502).json({
      success: false,
      message: 'Bad response from backend.',
    });
  }

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json(data);
}

// Read the full body of an incoming request stream
function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}
