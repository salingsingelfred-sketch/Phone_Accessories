// ============================================================
// PHONE ACCESSORIES INVENTORY SYSTEM - Configuration
// ============================================================
// API_URL points to the Vercel serverless proxy at /api/gas.
// The proxy forwards all requests to Google Apps Script
// server-side, so the browser never makes a cross-origin
// request. This fixes login inside MIT App Inventor WebViewer.
//
// Do NOT change API_URL back to a script.google.com URL.
// To update the Google Apps Script target, change the
// GAS_API_URL environment variable in your Vercel project
// settings instead.

const CONFIG = {
  API_URL: '/api/gas',
  APP_TITLE: 'Phone Accessories Inventory System',
  VERSION: '1.0.0',
  SESSION_KEY: 'pais_session',
};
