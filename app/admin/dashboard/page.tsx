'use client'

// using anchor tags instead of Next.js Link to avoid missing module/type errors

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a href="/admin/employees/create" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Create Employee</h3>
          <p className="text-gray-600">Add new employees to the system</p>
        </a>
        
        <a href="/admin/employees" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Manage Employees</h3>
          <p className="text-gray-600">View and edit employee records</p>
        </a>
        
        <a href="/admin/reports" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Reports</h3>
          <p className="text-gray-600">View system reports and analytics</p>
        </a>
      </div>
    </div>
  )
}
