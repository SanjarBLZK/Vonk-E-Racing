import { supabase, supabaseAdmin } from './supabase';

export async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test basic connection with anon key
    const { data, error } = await supabase
      .from('roles')
      .select('count')
      .single();

    if (error) {
      console.error('Anon key connection failed:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return false;
    }

    console.log('✅ Anon key connection successful');
    console.log('Roles count:', data);

    // Test admin connection
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('roles')
      .select('*')
      .limit(1);

    if (adminError) {
      console.error('Admin key connection failed:', adminError);
      return false;
    }

    console.log('✅ Admin key connection successful');
    console.log('Sample role:', adminData);

    return true;
  } catch (err) {
    console.error('Connection test failed:', err);
    return false;
  }
}

// Run the test
testSupabaseConnection().then(success => {
  if (success) {
    console.log('🎉 All Supabase connections working!');
  } else {
    console.log('❌ Supabase connection issues detected');
  }
});
