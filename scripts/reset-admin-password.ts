import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const ADMIN_EMAIL = 'admin@company.com'
const NEW_PASSWORD = 'Admin@123'

async function resetAdminPassword() {
  console.log('🔧 Resetting admin password...\n')

  try {
    // Find user by email
    const { data: users } = await supabase.auth.admin.listUsers()
    const admin = users?.users.find(u => u.email === ADMIN_EMAIL)

    if (!admin) {
      console.error('❌ Admin user not found!')
      console.log('Creating new admin instead...')
      
      // Create new admin
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: NEW_PASSWORD,
        email_confirm: true,
        user_metadata: { 
          full_name: 'System Administrator'
        }
      })

      if (authError) throw authError

      // Create profile
      await supabase.from('profiles').upsert({
        id: authData.user.id,
        email: ADMIN_EMAIL,
        full_name: 'System Administrator',
        department: 'Administration',
        position: 'System Administrator'
      }, { onConflict: 'id' })

      // Assign admin role
      await supabase.from('user_roles').upsert({
        user_id: authData.user.id,
        role: 'admin'
      }, { onConflict: 'user_id' })

      console.log('✅ New admin created!')
    } else {
      console.log('Found admin user:', admin.id)

      // Update password
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        admin.id,
        { password: NEW_PASSWORD }
      )

      if (updateError) throw updateError

      console.log('✅ Password updated successfully!')

      // Make sure profile and role exist
      await supabase.from('profiles').upsert({
        id: admin.id,
        email: ADMIN_EMAIL,
        full_name: admin.user_metadata?.full_name || 'System Administrator',
        department: 'Administration',
        position: 'System Administrator'
      }, { onConflict: 'id' })

      await supabase.from('user_roles').upsert({
        user_id: admin.id,
        role: 'admin'
      }, { onConflict: 'user_id' })

      console.log('✅ Profile and role verified!')
    }

    console.log('\n🎉 Admin account is ready!')
    console.log('\n📝 LOGIN CREDENTIALS:')
    console.log('   Email:', ADMIN_EMAIL)
    console.log('   Password:', NEW_PASSWORD)
    console.log('\n🌐 Login at: http://localhost:3000/login')
    console.log('\n⚠️  Test login now!')

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

resetAdminPassword()
