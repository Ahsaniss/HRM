// Run this to see your Supabase project details
console.log('=== SUPABASE PROJECT INFO ===')
console.log('Project URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
console.log('\n📍 Go to this URL to access your database:')
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', 'https://app.supabase.com/project/'))
console.log('\n⚠️ You need to login with the email used to create this project')
