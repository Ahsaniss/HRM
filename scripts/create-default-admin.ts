import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing environment variables')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing')
  console.error('\nMake sure .env.local exists with these variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// DEFAULT ADMIN CREDENTIALS
const DEFAULT_ADMIN = {
  email: 'admin@company.com',
  password: 'Admin@123',
  fullName: 'System Administrator'
}

async function createDefaultAdmin() {
  console.log('🔧 Creating default admin account...\n')
  console.log('📧 Email:', DEFAULT_ADMIN.email)
  console.log('🔑 Password:', DEFAULT_ADMIN.password)
  console.log('')

  try {
    // Check if admin already exists
    const { data: existingUser } = await supabase.auth.admin.listUsers()
    const adminExists = existingUser?.users.find(u => u.email === DEFAULT_ADMIN.email)

    if (adminExists) {
      console.log('⚠️  Admin account already exists!')
      console.log('User ID:', adminExists.id)
      
      // Try to update profile and role instead
      console.log('\n🔄 Updating profile and role...')
      
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: adminExists.id,
          email: DEFAULT_ADMIN.email,
          full_name: DEFAULT_ADMIN.fullName,
          department: 'Administration',
          position: 'System Administrator'
        }, {
          onConflict: 'id'
        })

      if (profileError) {
        console.error('Profile update error:', profileError)
      } else {
        console.log('✅ Profile updated')
      }

      // Update role
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: adminExists.id,
          role: 'admin'
        }, {
          onConflict: 'user_id'
        })

      if (roleError) {
        console.error('Role update error:', roleError)
      } else {
        console.log('✅ Admin role assigned')
      }

      console.log('\n✅ You can login with:')
      console.log('   Email:', DEFAULT_ADMIN.email)
      console.log('   Password:', DEFAULT_ADMIN.password)
      return
    }

    // Create admin user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: DEFAULT_ADMIN.email,
      password: DEFAULT_ADMIN.password,
      email_confirm: true,
      user_metadata: { 
        full_name: DEFAULT_ADMIN.fullName 
      }
    })

    if (authError) throw authError

    console.log('✅ User created:', authData.user.id)

    // Create profile with upsert
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: authData.user.id,
      email: DEFAULT_ADMIN.email,
      full_name: DEFAULT_ADMIN.fullName,
      department: 'Administration',
      position: 'System Administrator'
    }, {
      onConflict: 'id'
    })

    if (profileError) {
      console.error('Profile error:', profileError)
      throw profileError
    }
    console.log('✅ Profile created')

    // Assign admin role with upsert
    const { error: roleError } = await supabase.from('user_roles').upsert({
      user_id: authData.user.id,
      role: 'admin'
    }, {
      onConflict: 'user_id'
    })

    if (roleError) {
      console.error('Role error:', roleError)
      throw roleError
    }
    console.log('✅ Admin role assigned')

    console.log('\n🎉 Default admin created successfully!')
    console.log('\n📝 LOGIN CREDENTIALS:')
    console.log('   Email:', DEFAULT_ADMIN.email)
    console.log('   Password:', DEFAULT_ADMIN.password)
    console.log('\n🌐 Login at: http://localhost:3000/login')
    console.log('\n⚠️  Remember to change the password after first login!')
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

createDefaultAdmin()
