"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add password reset logic
    console.log("Reset password for:", email);
    setSuccessMessage("Password reset instructions sent to your email!");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="w-full max-w-[450px] space-y-8">
        {/* Logo and Text Container */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 blur opacity-5 group-hover:opacity-30 transition duration-1000" />
              <Image
                src="/logo.jpg"
                alt="Kapsam Makina Logo"
                width={120}
                height={120}
                priority
              />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">
              Şifremi Unuttum
            </h1>
            <p className="text-gray-600">
              Şifre sıfırlama talimatları e-postanıza gönderilecektir
            </p>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta adresi"
              className="text-black focus:border-transparent focus-visible:ring-blue-500 focus-visible:ring-2"
            />

            {successMessage && (
              <div className="text-blue-600 text-sm text-center">
                {successMessage}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Email Gönder
            </Button>

            <div className="pt-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Giriş Sayfasına Dön
                </Link>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Kapsam Makina</p>
        </div>
      </div>
    </main>
  );
}
