import { Card } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { useAuth } from "@/hooks/useAuth"

export function NgoDashboard() {
  const { user } = useAuth()

  return (
    <div className="container mx-auto p-6">
      <Heading>Welcome back, {user?.name}</Heading>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold">Available Donations</h3>
          {/* Add available donations list */}
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold">Recent Collections</h3>
          {/* Add recent collections */}
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold">Statistics</h3>
          {/* Add NGO stats */}
        </Card>
      </div>
    </div>
  )
}