import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yriiydhieaaylaurfzet.supabase.co';
const supabaseAnonKey = 'sb_publishable_Vj6p48QuEeh_xoI_c1asig_na-RmYct';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testing Supabase Connection...');
  const { data: readData, error: readError } = await supabase.from('courses').select('*');
  console.log('Read result:', readData?.length, readError);

  const { data: insertData, error: insertError } = await supabase.from('courses').insert([
    { id: 'test_123', title: 'Test', active: true }
  ]).select();
  console.log('Insert error:', insertError?.message || 'Success');
}

testConnection();
