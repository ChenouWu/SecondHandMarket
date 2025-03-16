"use client"

import { useState } from "react"
import { ArrowUpFromLine } from "lucide-react"
import axiosInstance from "../libs/axios"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

function Posting() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    contactInfo: "",
    category: "Others", // Keeping default category but not showing in UI
  })
  const [images, setImages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach((file) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        setImages((prev) => [...prev, reader.result])
      }
    })
  }

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await axiosInstance.post("/posting/createposting", {
        ...formData,
        images,
      })
      toast.success(response.data.message)
      navigate("/Landing")
    } catch (err) {
      setError("Failed to create posting. Please try again.")
      console.error("Error creating posting:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pt-24">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Create a New Posting</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2 text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2 text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="6"
            className="w-full px-4 py-3 rounded-3xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
          ></textarea>
        </div>

        <div>
          <label htmlFor="contactInfo" className="block text-sm font-medium mb-2 text-gray-700">
            Contact Information
          </label>
          <input
            type="text"
            id="contactInfo"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Images</label>
          <div className="flex items-center space-x-4">
            <label
              htmlFor="image-upload"
              className="flex items-center px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              <ArrowUpFromLine className="w-4 h-4 mr-2" />
              Upload Images
              <input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            <span className="text-sm text-gray-500">{images.length} image(s) selected</span>
          </div>
          {images.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Uploaded ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-4 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors focus:outline-none"
          disabled={isLoading}
        >
          Create Posting
        </button>
      </form>
    </div>
  )
}

export default Posting

