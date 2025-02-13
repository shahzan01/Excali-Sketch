"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { useToast } from "@repo/ui/use-toast";
import { useAuth } from "./../../../lib/auth";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { BACKEND_URL } from "./../../config";
import Image from "next/image";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/user/signup`, {
        email,
        password,
        name,
      });
      if (!response.data) {
        throw new Error("Failed to sign up");
      }
      const data = response.data;
      router.push("/auth/sign-in");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 hover:scale-[1.01]">
        <div className="text-center mb-8 text-black">
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Create Account
          </h1>
          <p className="text-muted-foreground">
            Join ExcaliSketch to start creating
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full text-black"
            />
          </div>

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

          <div className=" relative">
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
              className=" absolute right-2 top-1/2 transform -translate-y-1/5 text-gray-600  cursor-pointer"
            >
              {showPassword ? (
                <Image src="/icons/eye.png" alt="img" height={25} width={25} />
              ) : (
                <Image
                  src="/icons/hidden.png"
                  alt="img"
                  width={25}
                  height={25}
                />
              )}
            </span>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-black"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Sign up"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground text-black">
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
