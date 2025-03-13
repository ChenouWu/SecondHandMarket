  import { useState, useEffect } from "react"
  import { useParams, Link } from "react-router-dom"
  import axiosInstance from "../libs/axios"
  import { User, Phone, Mail, Calendar, MessageCircle, ArrowLeft } from "lucide-react"
  import toast from "react-hot-toast";

  function SinglePostingPage() {
    const [posting, setPosting] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeImage, setActiveImage] = useState(0)
    const [comment, setComment] = useState("")
    const { id } = useParams()

    useEffect(() => {
      const fetchPosting = async () => {
        try {
          const response = await axiosInstance.get(`/posting/getPostById/${id}`)
          setPosting(response.data)
          setIsLoading(false)
        } catch (err) {
          console.error("Error fetching posting:", err)
          setError("Failed to load posting. Please try again later.")
          setIsLoading(false)
        }
      }
      fetchPosting()
    }, [id]);

    const handleAddFriend = async()=>{
      try{
        const res =  await axiosInstance.post('/friend/add',{
          FullName: posting.createdBy.FullName
        })

        if (res.data.message === "Friend added successfully" || res.data.message === "Already friends") {
          toast.success("You can now chat with the seller!");
          navigate(`/HomePage`);
      } else {
          toast.error("Failed to add friend.");
      }
    }catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to contact seller.";
        toast.error(errorMessage); 
    }
      }
    
      const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
    
        try {
            const response = await axiosInstance.post(`/comments/comment/${id}`, { comment });
    
            // ✅ 更新 UI，添加新评论
            setPosting((prev) => ({
                ...prev,
                comments: [...prev.comments, response.data],
            }));
    
            setComment("");
        } catch (err) {
            console.error("Error adding comment:", err);
            toast.error("Failed to add comment.");
        }
    };
    
    const handleReplySubmit = async (e, commentId, replyText) => {
      e.preventDefault();
      if (!replyText.trim()) return;
  
      try {
          const response = await axiosInstance.post(`/comments/reply/${id}/${commentId}`, {
              comment: replyText,
          });
  
          // ✅ 更新 UI，找到对应的 `commentId` 并插入 `replies`
          setPosting((prev) => ({
              ...prev,
              comments: prev.comments.map((comment) =>
                  comment._id === commentId
                      ? { ...comment, replies: [...comment.replies, response.data] }
                      : comment
              ),
          }));
  
          toast.success("Reply added successfully!");
      } catch (err) {
          console.error("Error replying to comment:", err);
          toast.error("Failed to send reply.");
      }
  };
  
    

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-spinner loading-lg" ></span>
        </div>
      )
    }

    if (error) {
      return (
        <div className="container mx-auto px-4 py-8 pt-20">
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
        </div>
      )
    }

    if (!posting) {
      return null
    }

    return (
      <div className="container mx-auto px-4 py-8 pt-20">
        <Link to="/" className="btn btn-ghost mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Listings
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {posting.images && posting.images.length > 0 ? (
              <>
                <div className="relative rounded-lg overflow-hidden h-80">
                  <img
                    src={posting.images[activeImage] || "/placeholder.svg"}
                    className="w-full h-full object-cover"
                    alt={`Posting image ${activeImage + 1}`}
                  />
                </div>
                {/* Thumbnails */}
                {posting.images.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {posting.images.map((image, index) => (
                      <div
                        key={index}
                        className={`cursor-pointer rounded-md overflow-hidden w-20 h-20 flex-shrink-0 border-2 ${
                          index === activeImage ? "border-primary" : "border-transparent"
                        }`}
                        onClick={() => setActiveImage(index)}
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          className="w-full h-full object-cover"
                          alt={`Thumbnail ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-base-300 h-80 flex items-center justify-center rounded-lg">
                <span className="text-base-content/50">No image available</span>
              </div>
            )}
          </div>

          {/* Posting Details */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{posting.title}</h1>
            <div className="flex items-center space-x-2">
              <span className="badge badge-outline">{posting.category}</span>
              <span className="text-sm text-base-content/70">
                <Calendar className="inline-block w-4 h-4 mr-1" />
                Posted on {new Date(posting.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-base-content/80">{posting.description}</p>

            {/* Seller Information */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">
                  <User className="w-5 h-5" />
                  Seller Information
                </h2>
                <p className="font-semibold">{posting.createdBy.FullName}</p>
                <p className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {posting.contactInfo}
                </p>
                <p className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {posting.createdBy.Email}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
                <button  className="btn btn-primary flex-1" onClick={()=>{handleAddFriend()}}>
                  <Mail className="w-5 h-5 mr-2" />
                    Contact Seller
                </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Comments ({posting.comments?.length || 0})</h2>

          <form onSubmit={handleCommentSubmit} className="mb-6">
    <div className="flex gap-4">
        <input
            type="text"
            placeholder="Add a comment..."
            className="input input-bordered flex-grow"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
            <MessageCircle className="w-5 h-5 mr-2" />
            Comment
        </button>
    </div>
</form>

<div className="space-y-4">
    {posting.comments && posting.comments.length > 0 ? (
        posting.comments.map((comment) => (
            <div key={comment._id} className="card bg-base-200">
                <div className="card-body p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="avatar">
                            <div className="w-8 h-8 rounded-full">
                                <img
                                    src={comment.userId?.ProfilePic || "/placeholder-avatar.png"}
                                    alt={comment.userId?.FullName || "User"}
                                />
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold text-sm">{comment.userId?.FullName || "User"}</p>
                            <p className="text-xs text-base-content/70">
                                {new Date(comment.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <p>{comment.comment}</p>

                    {/* 回复框 */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const replyText = e.target.elements.replyText.value;
                            handleReplySubmit(e, comment._id, replyText);
                            e.target.reset();
                        }}
                        className="mt-2 flex gap-2"
                    >
                        <input
                            type="text"
                            name="replyText"
                            placeholder="Reply to this comment..."
                            className="input input-bordered flex-grow"
                        />
                        <button type="submit" className="btn btn-primary btn-sm">
                            Reply
                        </button>
                    </form>

                    {/* 显示回复列表 */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="ml-6 mt-2 space-y-2">
                            {comment.replies.map((reply) => (
                                <div key={reply._id} className="text-sm bg-base-300 p-2 rounded">
                                    <strong>{reply.userId?.FullName || "User"}:</strong> {reply.comment}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        ))
    ) : (
        <p className="text-base-content/70">No comments yet. Be the first to comment!</p>
    )}
</div>
        </div>
      </div>
    )
  }
  
  export default SinglePostingPage

