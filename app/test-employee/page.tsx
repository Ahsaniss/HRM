'use client'

import { useState } from 'react'

export default function TestEmployee() {
  const [result, setResult] = useState('')

  const testCreate = async () => {
    const res = await fetch('/api/test-create-employee', { method: 'POST' })
    const data = await res.json()
    setResult(JSON.stringify(data, null, 2))
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Employee Creation</h1>
      <button onClick={testCreate} className="bg-blue-500 text-white px-4 py-2 rounded">
        Create Test Employee
      </button>
      <pre className="mt-4 p-4 bg-gray-100 rounded">{result}</pre>
    </div>
  )
}
