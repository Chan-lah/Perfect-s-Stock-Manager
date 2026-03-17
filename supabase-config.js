// ============================================================
// supabase-config.js — Supabase Client Initialization
// ============================================================
var SUPABASE_URL  = 'https://mzzhznxrgbhemxcvbcon.supabase.co';
var SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16emh6bnhyZ2JoZW14Y3ZiY29uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NTQxMjksImV4cCI6MjA4OTMzMDEyOX0.l4eJM9pOGN8FC1lgB4DoVAwb0j0ARZteunSQQzxNyUE';

var _supabase = null;
try {
  if (window.supabase && window.supabase.createClient) {
    _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
    console.log('[PSM] Supabase client ready');
  } else {
    console.warn('[PSM] Supabase JS library not loaded');
  }
} catch(e) {
  console.warn('[PSM] Supabase init error:', e);
}
