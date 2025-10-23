// @deno-types="https://esm.sh/@supabase/supabase-js@2.39.3/dist/module/index.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Supabase automatically provides these environment variables 
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Parse and validate request body
    let body
    try {
      body = await req.json()
    } catch (e) {
      throw new Error('Invalid JSON in request body')
    }

    const { email, full_name, department, position, role } = body

    // Validate required fields
    if (!email || !full_name) {
      throw new Error('Email and full name are required')
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format')
    }

    console.log('Creating employee:', { email, full_name, department, position, role })

    // Generate a secure temporary password
    const tempPassword = crypto.randomUUID().slice(0, 12) + 'A1!'

    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        full_name,
        department,
        position,
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      throw new Error(`Failed to create user: ${authError.message}`)
    }

    if (!authData || !authData.user) {
      throw new Error('User creation failed: no user data returned')
    }

    console.log('User created in auth:', authData.user.id)

    // Create or update profile directly (don't rely on triggers)
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: authData.user.id,
        email: email,
        full_name: full_name,
        department: department || null,
        position: position || null,
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id'
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // Rollback: delete the auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      throw new Error(`Failed to create profile: ${profileError.message}`)
    }

    console.log('Profile created successfully')

    // Assign role
    const userRole = role || 'employee'
    
    // Validate role
    const validRoles = ['employee', 'manager', 'admin', 'hr']
    if (!validRoles.includes(userRole)) {
      throw new Error(`Invalid role: ${userRole}. Must be one of: ${validRoles.join(', ')}`)
    }

    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .upsert({
        user_id: authData.user.id,
        role: userRole,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      })

    if (roleError) {
      console.error('Role assignment error:', roleError)
      // Rollback: delete the auth user and profile
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      await supabaseAdmin.from('profiles').delete().eq('id', authData.user.id)
      throw new Error(`Failed to assign role: ${roleError.message}`)
    }

    console.log('Role assigned successfully')

    return new Response(
      JSON.stringify({
        success: true,
        user_id: authData.user.id,
        email,
        temporary_password: tempPassword,
        message: 'Employee account created successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error creating employee:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
