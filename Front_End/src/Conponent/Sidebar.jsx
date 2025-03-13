import { useChatStore } from "../store/useChatStore";
import { useEffect, useState } from "react";
import SidebarSkeleton from "./Skeleton/SideBarSkeleton";
import { User, Search } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";

function Sidebar() {
  const { getUsers, users, setSelectedUser, selectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = users.filter((user) =>
    (showOnlineOnly ? onlineUsers.includes(user._id) : true) &&
    user.FullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="size-6" />
              <span className="font-medium hidden lg:block">Contacts</span>
            </div>
            <Link to="/add-friend" className="btn btn-secondary btn-sm hidden lg:inline-flex">
              ➕ Add Friend
            </Link>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-full bg-base-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="hidden lg:flex items-center justify-between">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-sm"
              />
              <span className="text-sm">Show online only</span>
            </label>
            <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex-1 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">No users found</p>
        ) : (
          filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${selectedUser?._id === user._id ? "bg-base-300 ring-1" : ""}
              `}
            >
              <div className="relative">
                <img
                  src={user.ProfilePic || "/placeholder.svg"}
                  alt={user.FullName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"></span>
                )}
              </div>
              <span className="hidden lg:block truncate">{user.FullName}</span>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
