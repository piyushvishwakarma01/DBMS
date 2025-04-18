import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRealtime } from "@/hooks/useRealtime"
import { useState, useEffect } from "react"
import { Donation } from "@/types"
import axios from "axios"

export function DonorDashboard() {
  const { user } = useAuth()
  const [donations, setDonations] = useState<Donation[]>([])

  // Fetch donations from the backend
  useEffect(() => {
    if (user) {
      axios
        .get(`/api/donations`, { params: { userId: user.id } })
        .then((response) => setDonations(response.data))
        .catch((error) => console.error("Error fetching donations:", error))
    }
  }, [user])

  // Realtime updates for donations
  useRealtime("donation_updates", (payload) => {
    if (payload.new) {
      setDonations((prev) => [...prev, payload.new])
    } else if (payload.old) {
      setDonations((prev) => prev.filter((d) => d.id !== payload.old.id))
    }
  })

  // Handle new donation creation
  const handleNewDonation = () => {
    const newDonation = {
      userId: user.id,
      foodItems: [{ foodType: "Rice", quantity: 10, unit: "kg" }],
      expiryDate: new Date().toISOString(),
      images: [{ imageUrl: "https://example.com/image.jpg" }],
    }

    axios
      .post(`/api/donations`, newDonation)
      .then((response) => setDonations((prev) => [...prev, response.data]))
      .catch((error) => console.error("Error creating donation:", error))
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Donor Dashboard</h1>
        <Button onClick={handleNewDonation}>
          <Plus className="mr-2 h-4 w-4" />
          New Donation
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {donations.map((donation) => (
          <Card key={donation.id}>
            <CardHeader>
              <CardTitle>{donation.foodItems?.[0]?.foodType || "Unknown"}</CardTitle>
              <CardDescription>
                {donation.foodItems?.[0]?.quantity || 0} {donation.foodItems?.[0]?.unit || ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Status: {donation.status || "Unknown"}</p>
              <p>Expiry: {donation.expiryDate ? new Date(donation.expiryDate).toLocaleDateString() : "N/A"}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}