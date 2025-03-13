import { useState } from "react"
import { Upload, X } from "lucide-react"
import axiosInstance from "../libs/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const categories = ["For Sale", "Looking For", "Ride Share", "Friendship", "Others"]

function Posting() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    contactInfo: "",
    category: "Others",
  });

  const [images, setImages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  let isPosted = false;

  const navigate = useNavigate()
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setImages(prev => [...prev, reader.result]);
        }
    });
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
      isPosted = true;
      navigate("/Landing"); 
      // Reset form or redirect user after successful submission
    } catch (err) {
      setError("Failed to create posting. Please try again.")
      console.error("Error creating posting:", err)
    } finally {
      setIsLoading(false)
    }
    if(isPosted){

    }
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <h1 className="text-2xl font-bold mb-10">Create a New Posting</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="textarea textarea-bordered w-full"
          ></textarea>
        </div>

        <div>
          <label htmlFor="contactInfo" className="block text-sm font-medium mb-2">
            Contact Information
          </label>
          <input
            type="text"
            id="contactInfo"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-2">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Images</label>
          <div className="flex items-center space-x-4">
            <label className="btn btn-outline">
              <Upload className="w-4 h-4 mr-2" />
              Upload Images
              <input 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={(e) => handleImageUpload(e)} 
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
                    className="w-24 h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
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
        )}

        <button type="submit" className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`} disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Posting"}
        </button>
      </form>
    </div>
  )
}

export default Posting

