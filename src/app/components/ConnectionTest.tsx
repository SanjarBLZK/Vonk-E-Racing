import { useState, useEffect } from 'react';
import { supabase, supabaseAdmin } from '../../lib/supabase';
import { testBasicConnection } from '../../lib/simple-test';

export function ConnectionTest() {
  const [status, setStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState('');

  useEffect(() => {
    console.log('ConnectionTest component mounted');
    testConnection();
    testBasicConnection(); // Also run the simple test
  }, []);

  const testConnection = async () => {
    try {
      // First, let's test if we can connect to Supabase at all
      console.log('Testing basic Supabase connection...');
      
      // Test basic connection with a simpler query
      const { data, error } = await supabase
        .from('roles')
        .select('count')
        .single();

      if (error) {
        console.error('Connection error:', error);
        
        // Check if it's a table not found error
        if (error.code === 'PGRST116') {
          setStatus('error');
          setMessage('❌ Database tables not found');
          setDetails('The database schema was not created. Run the SQL query in Supabase SQL editor first.');
          return;
        }
        
        // Check if it's a permissions error
        if (error.code === 'PGRST301' || error.message.includes('permission')) {
          setStatus('error');
          setMessage('❌ Permission denied');
          setDetails('Check CORS settings in Supabase Dashboard > Settings > API');
          return;
        }
        
        setStatus('error');
        setMessage(`❌ Connection failed: ${error.message}`);
        setDetails(`Code: ${error.code || 'Unknown'} | Check browser console and Supabase CORS settings`);
        return;
      }

      console.log('Connection successful:', data);
      setStatus('connected');
      setMessage('✅ Database connection successful!');
      setDetails(`Found ${data?.count || 0} roles in database`);
    } catch (err) {
      console.error('Test error:', err);
      setStatus('error');
      setMessage(`❌ Test failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setDetails('Make sure CORS is configured in Supabase Dashboard > Settings > API');
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-slate-800 border-slate-700">
      <h3 className="text-lg font-semibold mb-2 text-white">Database Connection Test</h3>
      
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-3 h-3 rounded-full ${
          status === 'testing' ? 'bg-yellow-500 animate-pulse' :
          status === 'connected' ? 'bg-green-500' :
          'bg-red-500'
        }`} />
        <span className="text-white">{message}</span>
      </div>
      
      {details && (
        <p className="text-sm text-slate-400">{details}</p>
      )}
      
      {status === 'error' && (
        <button 
          onClick={testConnection}
          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry Connection
        </button>
      )}
    </div>
  );
}
