"use client"

import { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"
import axiosInstance from "../libs/axios"
import { useNavigate } from "react-router-dom"

const categories = ["For Sale", "Looking For", "Ride Share", "Friendship", "Others"]

function Landing() {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get("/posting/getAllPost")
        setPosts(response.data)
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching posts:", err)
        setError("Failed to load posts. Please try again later.")
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handleViewDetails = (postId) => {
    navigate(`/posting/${postId}`)
  }

  return (
    <div className="min-h-screen bg-base-100 pt-16">
      {/* Hero Section - Redesigned with texture */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 relative overflow-hidden shadow-lg">
        {/* Texture overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2256%22%20height%3D%2256%22%3E%3Cpath%20fill%3D%22%23fff%22%20d%3D%22M8%2016l8%208%208-8-8-8-8%208zm40%2024l8%208%208-8-8-8-8%208zM8%2048l8%208%208-8-8-8-8%208zm40-40l8%208%208-8-8-8-8%208z%22%2F%3E%3C%2Fsvg%3E')]"></div>

        {/* Content with subtle depth */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-sm">
                Welcome to SecondChance Market
              </h1>
              <p className="text-xl mb-8 text-white/90 max-w-lg">
                Discover amazing deals on pre-loved items or find a new home for your treasures.
              </p>
              <button className="btn bg-white text-indigo-700 hover:bg-white/90 border-none px-6 py-3 rounded-lg font-semibold shadow-md">
                Start Exploring
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
            <div className="lg:w-1/2 flex justify-center"></div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Posts */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Posts</h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : error ? (
            <div className="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {posts.map((post) => (
                <div key={post._id} className="card bg-base-100 shadow-xl">
                  {post.images && post.images.length > 0 && (
                    <figure>
                      <img
                        src={post.images[0] || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                    </figure>
                  )}
                  <div className="card-body">
                    <h3 className="card-title text-lg">{post.title}</h3>
                    <p className="text-sm text-base-content/70">{post.description.substring(0, 100)}...</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="badge badge-outline">{post.category}</span>
                      <div className="flex items-center space-x-2">
                        <img
                          src={post.createdBy.ProfilePic || "/placeholder-avatar.png"}
                          alt={post.createdBy.FullName}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-xs">{post.createdBy.FullName}</span>
                      </div>
                    </div>
                    <div className="card-actions justify-end mt-4">
                      <button className="btn btn-primary btn-sm" onClick={() => handleViewDetails(post._id)}>
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral text-neutral-content mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold">SecondChance Market</h3>
              <p>Give your items a second life</p>
            </div>
            <nav className="flex flex-wrap justify-center gap-4">
              <a href="#" className="hover:underline">
                Terms of Service
              </a>
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
              <a href="#" className="hover:underline">
                Contact Us
              </a>
            </nav>
          </div>
          <div className="mt-8 text-center">
            <p>&copy; 2023 SecondChance Market. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing

