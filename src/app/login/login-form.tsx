"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
    } catch (error) {
      toast.error("Giriş başarısız oldu. Lütfen bilgilerinizi kontrol edin.", {
        style: {
          background: "#dc2626",
          color: "white",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="ornek@kapsammakina.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="focus:border-transparent focus-visible:ring-blue-500 focus-visible:ring-2"
            required
            autoComplete="email"
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
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="focus:border-transparent focus-visible:ring-blue-500 focus-visible:ring-2"
            required
            autoComplete="current-password"
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        disabled={isLoading}
      >
        {isLoading ? (
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
