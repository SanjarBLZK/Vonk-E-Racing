// Simple test to check if Supabase URL and keys work
const testUrl = 'https://lyreegaeymsldxlbpfpi.supabase.co';
const testKey = 'sb_publishable_eN3GWDS4BoGIiqThU3BHfg_ZQlBRdio';

export function testBasicConnection() {
  console.log('Testing basic connection...');
  console.log('URL:', testUrl);
  console.log('Key starts with:', testKey.substring(0, 20) + '...');
  
  // Test with fetch directly
  fetch(`${testUrl}/rest/v1/`, {
    headers: {
      'apikey': testKey,
      'Authorization': `Bearer ${testKey}`
    }
  })
  .then(response => {
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    return response.text();
  })
  .then(data => {
    console.log('Response data:', data);
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
}
