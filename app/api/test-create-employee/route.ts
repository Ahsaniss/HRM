export async function POST() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-employee`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          email: `test${Date.now()}@example.com`,
          full_name: 'Test Employee',
          department: 'Engineering',
          position: 'Software Engineer',
          role: 'employee'
        })
      }
    )

    const data = await response.json()
    return new Response(JSON.stringify(data), {
      status: response.ok ? 200 : response.status,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create employee' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
