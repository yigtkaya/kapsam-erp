"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useTransition } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { login } from "./action";
import { useAuth } from "@/providers/auth-provider";

export default function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error state

    startTransition(async () => {
      try {
        const result = await login(username, password);

        console.log(result);

        if (result?.error) {
          setError(result.error);
          toast.error(result.error, {
            duration: 5000,
          });
          return;
        }

        if (result?.user) {
          setUser({
            id: result.user.user.id,
            username: result.user.user.username,
            email: result.user.user.email,
            role: result.user.user.role,
            departments: result.user.user.departments,
          });
          toast.success("Başarıyla giriş yapıldı");
          router.push("/dashboard");
        }
      } catch (error: any) {
        const errorMessage =
          error.message || "Giriş yapılırken bir hata oluştu";
        setError(errorMessage);
        toast.error(errorMessage, {
          duration: 5000,
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Kullanıcı Adı</Label>
          <Input
            id="username"
            type="text"
            placeholder="ornek_kullanici"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="text-black focus:border-transparent focus-visible:ring-blue-500 focus-visible:ring-2"
            required
            autoComplete="username"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Şifre</Label>
            <a
              href="#"
              className="text-sm text-blue-600 hover:text-blue-700"
              onClick={(e) => {
                e.preventDefault();
                router.push("/forgot-password");
              }}
            >
              Şifrenizi mi unuttunuz?
            </a>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-black focus:border-transparent focus-visible:ring-blue-500 focus-visible:ring-2 pr-10"
              required
              autoComplete="current-password"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {!showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Giriş yapılıyor...
          </>
        ) : (
          "Giriş yap"
        )}
      </Button>
    </form>
  );
}
