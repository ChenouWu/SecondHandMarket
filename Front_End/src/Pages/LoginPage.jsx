import { useState,useEffect } from "react"
import { Form, Link } from "react-router-dom"
import { Mail, Lock, LogIn } from "lucide-react"
import { useAuthStore } from "../store/useAuthStore"

function LoginPage() {
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  })
  const [rememberMe, setRememberMe] = useState(false)
  const { login, isLoggingIn,au } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(formData)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8 px-4">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">Please sign in to your account</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="email"
                    name="Email"
                    type="email"
                    autoComplete="email"
                    required
                    className="input input-bordered w-full pl-10"
                    placeholder="Email address"
                    value={formData.Email}
                    onChange={(e) => setFormData({...formData, Email: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="password"
                    name="Password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="input input-bordered w-full pl-10"
                    placeholder="Password"
                    value={FormData.Password}
                    onChange={(e) => setFormData({ ...formData, Password: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-primary hover:text-primary-focus">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className={`btn btn-primary w-full ${isLoggingIn ? "loading" : ""}`}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Signing in..." : "Sign in"}
                {!isLoggingIn && <LogIn className="w-4 h-4 ml-2" />}
              </button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="font-medium text-primary hover:text-primary-focus">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

