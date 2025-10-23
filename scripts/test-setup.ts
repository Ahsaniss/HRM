import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSetup() {
  console.log('🧪 Testing Supabase Setup...\n')

  // Test 1: Check connection
  console.log('1️⃣ Testing connection...')
  const { data: healthCheck, error: healthError } = await supabase
    .from('profiles')
    .select('count')
    .limit(1)

  if (healthError) {
    console.error('❌ Connection failed:', healthError.message)
    return
  }
  console.log('✅ Connection successful\n')

  // Test 2: Check tables
  console.log('2️⃣ Checking tables...')
  const tables = ['profiles', 'user_roles', 'departments', 'positions', 'performance_reviews', 'leave_requests', 'attendance']
  
  for (const table of tables) {
    const { error } = await supabase.from(table).select('count').limit(1)
    if (error) {
      console.error(`❌ Table ${table} not found`)
    } else {
      console.log(`✅ Table ${table} exists`)
    }
  }

  console.log('\n3️⃣ Checking departments...')
  const { data: depts } = await supabase.from('departments').select('name')
  console.log(`✅ Found ${depts?.length || 0} departments:`, depts?.map(d => d.name).join(', '))

  console.log('\n✨ Setup test complete!')
}

testSetup()
