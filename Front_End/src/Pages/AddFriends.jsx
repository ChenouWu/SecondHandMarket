import { useState } from "react"
import { Search } from "lucide-react"
import axiosInstance from "../libs/axios"
import toast from "react-hot-toast"

function AddFriends() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    setIsLoading(true)
    try {
      const response = await axiosInstance.post("/friend/add", {
        FullName: searchTerm.trim(),
      })
      toast.success(response.data.message)  // 成功提示
      setSearchTerm("")  // 清空输入框
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add friend")  // 失败提示
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <div className="w-full max-w-xl px-4">
        <form onSubmit={handleSearch} className="max-w-xl mx-auto">
          <div className="join w-full">
            <input
              type="text"
              placeholder="Search for users by full name"
              className="input input-bordered join-item flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className={`btn join-item ${isLoading ? "loading" : ""}`} disabled={isLoading}>
              <Search className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddFriends
