import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Performance Pulse</h1>
        </div>

        <Card className="p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
            <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Creation Restricted</h2>
          <p className="text-gray-600 mb-6">
            Employee accounts can only be created by HR administrators. 
            Please contact your HR department to get access credentials.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Need access?</strong><br />
              Contact: hr@yourcompany.com
            </p>
          </div>

          <Link 
            to="/auth"
            className="inline-block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            Go to Login
          </Link>
        </Card>

        <p className="text-center text-sm text-gray-600 mt-8">
          © 2024 Performance Pulse. All rights reserved.
        </p>
      </div>
    </div>
  );
}
