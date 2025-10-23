'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DebugPage() {
  const [status, setStatus] = useState<any>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    const info: any = {
      hasSession: !!session,
      user: session?.user || null,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      timestamp: new Date().toISOString()
    }

    if (session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      const { data: role } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      info.profile = profile
      info.role = role
    }

    setStatus(info)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Debug Info</h1>
        <pre className="bg-white p-4 rounded shadow overflow-auto">
          {JSON.stringify(status, null, 2)}
        </pre>
        
        <div className="mt-4 space-x-2">
          <button 
            onClick={checkAuth}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Refresh
          </button>
          <button 
            onClick={() => supabase.auth.signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
