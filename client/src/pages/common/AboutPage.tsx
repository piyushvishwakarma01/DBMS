import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">About MealMate</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            MealMate aims to reduce food waste and hunger by creating an efficient
            connection between food donors, NGOs, and volunteers. We believe that
            by working together, we can make a significant impact in our communities.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">1. Food Donors</h3>
              <p className="text-gray-600">
                Restaurants, hotels, and food businesses can easily donate their
                excess food through our platform.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">2. NGOs</h3>
              <p className="text-gray-600">
                Organizations can find and collect food donations to distribute
                to those in need.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">3. Volunteers</h3>
              <p className="text-gray-600">
                Help transport food from donors to NGOs, making the process
                more efficient.
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Get Involved</h2>
          <p className="text-gray-600 mb-6">
            Join our mission to reduce food waste and help those in need. Whether
            you're a food business, an NGO, or want to volunteer, there's a place
            for you in our community.
          </p>
          
          <div className="space-y-4">
            <Link to="/register?role=donor">
              <Button className="w-full" variant="outline">Register as Donor</Button>
            </Link>
            <Link to="/register?role=ngo">
              <Button className="w-full" variant="outline">Register as NGO</Button>
            </Link>
            <Link to="/register?role=volunteer">
              <Button className="w-full" variant="outline">Become a Volunteer</Button>
            </Link>
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-4">
              Have questions or suggestions? We'd love to hear from you.
            </p>
            <Link to="/contact">
              <Button>Get in Touch</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}