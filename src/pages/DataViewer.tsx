import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Profile = {
  id: string;
  email?: string | null;
  full_name?: string | null;
  department?: string | null;
  position?: string | null;
  created_at?: string | null;
}

type UserRole = {
  user_id: string;
  role?: string | null;
  created_at?: string | null;
}

export default function DataViewer() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;
      setProfiles(profilesData || []);

      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;
      setUserRoles(rolesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-8">Loading data...</div>;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Database Viewer</h1>
        <p className="text-gray-600 mb-2">
          <strong>Project URL:</strong> {import.meta.env.VITE_SUPABASE_URL}
        </p>
      </div>

      {/* Profiles Table */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Profiles ({profiles.length})</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-50">
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Department</th>
                <th className="border px-4 py-2">Position</th>
                <th className="border px-4 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => (
                <tr key={profile.id}>
                  <td className="border px-4 py-2 text-xs">{profile.id}</td>
                  <td className="border px-4 py-2">{profile.email}</td>
                  <td className="border px-4 py-2">{profile.full_name}</td>
                  <td className="border px-4 py-2">{profile.department}</td>
                  <td className="border px-4 py-2">{profile.position}</td>
                  <td className="border px-4 py-2 text-xs">
                    {profile.created_at ? new Date(profile.created_at).toLocaleString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* User Roles Table */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">User Roles ({userRoles.length})</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-50">
              <tr>
                <th className="border px-4 py-2">User ID</th>
                <th className="border px-4 py-2">Role</th>
                <th className="border px-4 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {userRoles.map((role) => (
                <tr key={role.user_id}>
                  <td className="border px-4 py-2 text-xs">{role.user_id}</td>
                  <td className="border px-4 py-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {role.role}
                    </span>
                  </td>
                  <td className="border px-4 py-2 text-xs">
                    {role.created_at ? new Date(role.created_at).toLocaleString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Button onClick={loadData}>
        Refresh Data
      </Button>
    </div>
  );
}
