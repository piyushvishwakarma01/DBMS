import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function Home() {
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Connecting Food Donors with Those in Need
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          MealMate helps reduce food waste by connecting food donors with NGOs and volunteers
          to ensure excess food reaches those who need it most.
        </p>
        <div className="flex gap-4">
          <Link to="/register">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link to="/about">
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">For Donors</h3>
            <p className="text-gray-600 mb-4">
              Easily donate excess food and track your contributions to the community.
            </p>
            <Link to="/register?role=donor">
              <Button variant="ghost">Register as Donor →</Button>
            </Link>
          </div>
          
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">For NGOs</h3>
            <p className="text-gray-600 mb-4">
              Find and collect food donations efficiently to support your community.
            </p>
            <Link to="/register?role=ngo">
              <Button variant="ghost">Register as NGO →</Button>
            </Link>
          </div>
          
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">For Volunteers</h3>
            <p className="text-gray-600 mb-4">
              Help bridge the gap by delivering food from donors to those in need.
            </p>
            <Link to="/register?role=volunteer">
              <Button variant="ghost">Join as Volunteer →</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}