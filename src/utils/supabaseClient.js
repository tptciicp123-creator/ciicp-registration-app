import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yriiydhieaaylaurfzet.supabase.co';
const supabaseAnonKey = 'sb_publishable_Vj6p48QuEeh_xoI_c1asig_na-RmYct';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
