// Quick script to apply the usage limit fix directly via Supabase client
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = 'https://cahdabrkluflhlwexqsc.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'YOUR_SERVICE_KEY_HERE'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyFix() {
  console.log('📝 Reading SQL migration file...')

  const sqlFile = path.join(__dirname, 'supabase', 'migrations', '20250124000000_fix_usage_check_nulls.sql')
  const sql = fs.readFileSync(sqlFile, 'utf8')

  console.log('🚀 Applying fix to database...')

  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql })

    if (error) {
      console.error('❌ Error applying fix:', error)
      console.log('\n📋 Please apply the SQL manually via Supabase Dashboard:')
      console.log('   https://supabase.com/dashboard/project/cahdabrkluflhlwexqsc/sql/new')
      console.log('\n📄 SQL file location:')
      console.log('   ' + sqlFile)
      process.exit(1)
    }

    console.log('✅ Fix applied successfully!')
    console.log('🎉 Your unlimited plan should now work correctly!')
    console.log('\n🔄 Please refresh your browser to test.')

  } catch (err) {
    console.error('❌ Unexpected error:', err.message)
    console.log('\n📋 Please apply the SQL manually via Supabase Dashboard:')
    console.log('   https://supabase.com/dashboard/project/cahdabrkluflhlwexqsc/sql/new')
    console.log('\n📄 Copy the SQL from:')
    console.log('   ' + sqlFile)
    process.exit(1)
  }
}

applyFix()
