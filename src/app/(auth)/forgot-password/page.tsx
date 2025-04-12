"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Add actual API integration here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      // For now, just simulate a successful request
      setSubmitted(true);
      toast.success("Şifre sıfırlama bağlantısı gönderildi");
    } catch (error) {
      toast.error("İşlem sırasında bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Şifrenizi mi unuttunuz?
        </h1>
        <p className="text-sm text-slate-500">
          E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim
        </p>
      </div>

      {submitted ? (
        <div className="space-y-6">
          <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
            <div className="flex flex-col items-center text-center space-y-2 py-2">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-blue-900">E-posta gönderildi</h3>
              <p className="text-sm text-blue-700 max-w-xs">
                Şifre sıfırlama bağlantısı {email} adresine gönderildi. Lütfen
                gelen kutunuzu kontrol edin.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setSubmitted(false)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Farklı bir e-posta adresi kullan
          </Button>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              Giriş sayfasına dön
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 font-medium">
              E-posta Adresi
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@sirket.com"
              autoComplete="email"
              required
              disabled={isLoading}
              className="h-11 border-slate-200"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 mt-2 bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm text-white font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                İşleniyor...
              </>
            ) : (
              "Şifre Sıfırlama Bağlantısı Gönder"
            )}
          </Button>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              Giriş sayfasına dön
            </Link>
          </div>
        </form>
      )}
    </motion.div>
  );
}
