"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { login } from "./action";
import { useRouter } from "next/navigation";
import type { User } from "@/types/auth"; // assume this defines your User type

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("LoginForm - Submitting login form");
      const data = await login(username, password);
      console.log("LoginForm - Login response:", {
        success: data.success,
        hasUser: !!data.user,
        error: data.error,
      });

      if (data.error) {
        toast.error(data.error);
        setIsLoading(false);
        return;
      }

      toast.success("Başarıyla giriş yapıldı");

      // Add a small delay to ensure cookies are properly set
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Force a router refresh to update server state
      router.refresh();
      console.log("LoginForm - Router refreshed");

      // Redirect to callback URL if exists, otherwise go to dashboard
      const params = new URLSearchParams(window.location.search);
      const callbackUrl = params.get("callbackUrl") ?? "/dashboard";
      console.log("LoginForm - Redirecting to:", callbackUrl);

      // Try both approaches to ensure the redirect happens
      router.push(callbackUrl);
      // As a fallback, also use direct navigation
      setTimeout(() => {
        window.location.href = callbackUrl;
      }, 200);
    } catch (error) {
      console.error("LoginForm - Login error:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Beklenmeyen bir hata oluştu");
      }
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="username">Kullanıcı Adı</Label>
        <Input
          id="username"
          type="text"
          className="text-black"
          placeholder="Kullanıcı adınızı giriniz"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Şifre</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Şifrenizi giriniz"
            value={password}
            className="text-black"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Giriş yapılıyor...
          </>
        ) : (
          "Giriş Yap"
        )}
      </Button>
    </form>
  );
}
