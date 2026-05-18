"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      if(!email.trim()) {
        toast.error("Email is required");
        return;
      }

      if(!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Enter a valid email");
      return;
      }

      if(!password.trim()) {
        toast.error("Password is required");
        return;
      }

      if(password.length < 6) {
        toast.error("Wrong password");
        return;
      }

      await loginUser({email, password});

      router.push("/dashboard");

    } catch (error) {
      console.error(error);
      toast.error("login failed")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">

      <div className=" flex flex-col justify-between p-10">

        <div>
          <h1 className="text-2xl font-bold">
            PerpX
          </h1>
        </div>
      </div>

  
      <div className="col-span-5 flex items-center justify-center p-10">

        <div className="w-full max-w-md space-y-6">

          <div className="space-y-2">
            <h2 className="text-3xl font-semibold">
              Sign in to PerpX
            </h2>

            <p className="text-sm text-muted-foreground">
              Continue where you left off.
            </p>
          </div>

          <div className="space-y-4 border rounded-xl p-6">

            <div className="space-y-4">
              <p className="text-sm">
                Email
              </p>

              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <p className="text-sm">
                Password
              </p>

              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading
                ? "Signing In..." : "SIGN IN"}
            </Button>

          </div>

          <p className="text-sm text-center">
            New here? {" "}
            <Link
              href='/register'
              className="underline hover:text-muted-foreground"
            >Create Account
          </Link>
          </p>

        </div>
      </div>
    </div>
  );
}