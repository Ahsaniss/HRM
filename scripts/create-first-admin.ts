import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createFirstAdmin() {
  const email = 'admin@yourcompany.com'
  const password = 'Admin123!'
  const fullName = 'System Administrator'

  console.log('🔧 Creating first admin account...\n')

  try {
    // Create user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName }
    })

    if (authError) throw authError

    console.log('✅ User created:', authData.user.id)

    // Create profile
    await supabase.from('profiles').insert({
      id: authData.user.id,
      email,
      full_name: fullName,
      department: 'Administration',
      position: 'System Administrator'
    })

    console.log('✅ Profile created')

    // Assign admin role
    await supabase.from('user_roles').insert({
      user_id: authData.user.id,
      role: 'admin'
    })

    console.log('✅ Admin role assigned')
    console.log('\n🎉 First admin created successfully!')
    console.log('\n📧 Email:', email)
    console.log('🔑 Password:', password)
    console.log('\n⚠️  Please login and change the password immediately!')
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

createFirstAdmin()
