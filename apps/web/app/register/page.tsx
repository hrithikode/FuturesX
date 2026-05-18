"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import { registerUser } from "@/lib/api";

export default function RegisterPage() {

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const handleRegister = async () => {
    try {
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
        toast.error("Password must be atleast 6 characters");
        return;
      }
      setLoading(true);

      await registerUser({email, password});

      router.push("/dashboard");
    } catch (error: any) {
        const message = error.response?.data?.message || " Registration failed"
        toast.error(message)
      } finally {
          setLoading(false);
        }
  };

  return (
     <div className="min-h-screen">
      <div className="flex flex-col justify-between p-10">
        <div>
          <h1 className="text-2xl font-bold">PerpX</h1>
        </div> 
      </div>

      <div className="col-span-5 flex items-center justify-center p-10">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold">
              Create your account
            </h2>

            <p className="text-sm text-muted-foreground">
              Get started with your trading dashboard.
            </p>
          </div>

          <div className="space-y-4 border rounded-xl p-6">

            <div className="space-y-4">
              <p className="text-sm">Email</p>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <p className="text-sm">Password</p>
              <Input
                type="password"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              onClick={handleRegister}
              className="w-full cursor-pointer hover:opacity-90"
              size="lg"
            >
              {loading ? "Creating..." : "CREATE ACCOUNT"}
            </Button>

          </div>

          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link
              href='/login'
              className=" underline hover:text-muted-foreground"
            > Sign In 
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}