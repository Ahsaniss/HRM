'use client'

export default function EmployeeDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Employee Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">My Profile</h3>
          <p className="text-gray-600">View and update your personal information</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Leave Requests</h3>
          <p className="text-gray-600">Submit and track leave requests</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Performance Reviews</h3>
          <p className="text-gray-600">View your performance evaluations</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Attendance</h3>
          <p className="text-gray-600">Check-in/out and view attendance history</p>
        </div>
      </div>
    </div>
  )
}
