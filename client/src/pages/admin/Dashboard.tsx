import { Card } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { useAuth } from "@/hooks/useAuth"

export function AdminDashboard() {
  const { user } = useAuth()

  return (
    <div className="container mx-auto p-6">
      <Heading>Admin Dashboard</Heading>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold">User Statistics</h3>
          <div className="mt-4 space-y-2">
            <p>Total Users: Loading...</p>
            <p>Active NGOs: Loading...</p>
            <p>Active Donors: Loading...</p>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold">Donation Overview</h3>
          <div className="mt-4 space-y-2">
            <p>Pending Donations: Loading...</p>
            <p>Completed Donations: Loading...</p>
            <p>Total Impact: Loading...</p>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold">System Status</h3>
          <div className="mt-4 space-y-2">
            <p>Server Status: Online</p>
            <p>Last Backup: Loading...</p>
            <p>Active Sessions: Loading...</p>
          </div>
        </Card>
      </div>
    </div>
  )
}