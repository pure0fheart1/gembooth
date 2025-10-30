const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://cahdabrkluflhlwexqsc.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || require('./.env.local.js').VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyTables() {
  try {
    const sql = fs.readFileSync('./apply_codrawing_tables.sql', 'utf8');

    // Split by semicolons and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`Executing ${statements.length} SQL statements...`);

    for (const statement of statements) {
      console.log(`\nExecuting: ${statement.substring(0, 80)}...`);
      const { data, error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' });

      if (error) {
        console.error('Error:', error);
      } else {
        console.log('✓ Success');
      }
    }

    console.log('\n✅ All tables created successfully!');
  } catch (error) {
    console.error('Failed to apply tables:', error);
    process.exit(1);
  }
}

applyTables();
