"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { BACKEND_URL } from "@/app/config";
import axios from "axios";

const GUEST_CREDENTIALS = {
  email: "user@gmail.com",
  password: "12345678",
};

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { setToken, setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e?: React.FormEvent, isGuest = false) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMessage(""); // Clear previous errors

    try {
      const response = await axios.post(
        `${BACKEND_URL}/user/login`,
        isGuest ? GUEST_CREDENTIALS : { email, password }
      );
      const data = response.data;

      if (data.success) {
        setToken(data.data.token);
        setUser(data.data.user);
        router.push("/dashboard");
      } else {
        setErrorMessage(data.message || "Invalid email or password");
      }
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 hover:scale-[1.01]">
          <div className="text-center mb-6 text-black">
            <h1 className="text-3xl font-bold gradient-text mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Sign in to continue to ExcaliSketch
            </p>
          </div>

          {errorMessage && (
            <div className="text-red-600 bg-red-100 p-2 rounded-md mb-4 text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full text-black"
              />
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full text-black"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/5 text-gray-600 cursor-pointer"
              >
                {showPassword ? (
                  <img src="/icons/eye.png" alt="Show" width={25} />
                ) : (
                  <img src="/icons/hidden.png" alt="Hide" width={25} />
                )}
              </span>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing
                  in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground text-black">
              Don't have an account?{" "}
              <Link
                href="/auth/sign-up"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
