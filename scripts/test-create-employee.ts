import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

async function testCreateEmployee() {
  // Validate environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL is not set in .env.local')
    process.exit(1)
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('❌ Error: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in .env.local')
    process.exit(1)
  }

  const functionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-employee`
  
  const testEmployee = {
    email: 'john.doe@company.com',
    full_name: 'John Doe',
    department: 'Engineering',
    position: 'Software Engineer',
    role: 'employee'
  }

  console.log('🧪 Testing employee creation...\n')
  console.log('Function URL:', functionUrl)
  console.log('Request body:', testEmployee)
  console.log('\n')

  try {
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(testEmployee)
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✅ Employee created successfully!')
      console.log('\nResponse:', JSON.stringify(data, null, 2))
      console.log('\n⚠️ TEMPORARY PASSWORD:', data.temporary_password)
      console.log('📧 Send this to:', data.email)
    } else {
      console.error('❌ Error creating employee:')
      console.error(JSON.stringify(data, null, 2))
    }
  } catch (error) {
    console.error('❌ Request failed:', error)
  }
}

testCreateEmployee()
