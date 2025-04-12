"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  Loader2,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  InfoIcon,
} from "lucide-react";
import { toast } from "sonner";
import { login } from "./action";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsLoading(true);

    try {
      const data = await login(username, password);

      if (data.error) {
        setFormError(data.error);
        toast.error(data.error);
        setIsLoading(false);
        return;
      }

      toast.success("Başarıyla giriş yapıldı");

      // Add a small delay to ensure cookies are properly set
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Force a router refresh to update server state
      router.refresh();

      // Redirect to callback URL if exists, otherwise go to dashboard
      const params = new URLSearchParams(window.location.search);
      const callbackUrl = params.get("callbackUrl") ?? "/dashboard";

      // Try both approaches to ensure the redirect happens
      router.push(callbackUrl);
      // As a fallback, also use direct navigation
      setTimeout(() => {
        window.location.href = callbackUrl;
      }, 200);
    } catch (error) {
      if (error instanceof Error) {
        setFormError(error.message);
        toast.error(error.message);
      } else {
        setFormError("Beklenmeyen bir hata oluştu");
        toast.error("Beklenmeyen bir hata oluştu");
      }
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-2 text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Giriş Yap
        </h1>
        <p className="text-sm text-slate-500">
          Sisteme erişim için giriş bilgilerinizi kullanın
        </p>
      </div>

      {formError && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 flex items-start gap-2"
        >
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div className="text-sm font-medium">{formError}</div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-slate-700 font-medium">
            Kullanıcı Adı
          </Label>
          <Input
            id="username"
            type="text"
            className={cn(
              "h-11 border-slate-200",
              formError && "border-red-300"
            )}
            placeholder="Kullanıcı adınızı giriniz"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            autoComplete="username"
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-slate-700 font-medium">
              Şifre
            </Label>
            <Link
              href="/forgot-password"
              className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium"
            >
              Şifremi Unuttum
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Şifrenizi giriniz"
              value={password}
              className={cn(
                "h-11 border-slate-200",
                formError && "border-red-300"
              )}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              disabled={isLoading}
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
          className={cn(
            "w-full h-11 mt-2 bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm",
            "text-white font-medium flex items-center justify-center"
          )}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Giriş yapılıyor...
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              Giriş Yap
            </>
          )}
        </Button>
      </form>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <div className="flex items-start gap-3">
          <InfoIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Hesap oluşturma bilgilendirmesi</p>
            <p>
              Sisteme giriş yapabilmek için önceden tanımlanmış bir hesaba
              ihtiyacınız vardır. Hesap oluşturma talebi için lütfen
              yöneticinizle iletişime geçiniz.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
