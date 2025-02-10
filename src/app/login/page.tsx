"use client";

import Image from "next/image";
import LoginForm from "./login-form";

function Footer() {
  return (
    <div className="text-center text-sm text-gray-500">
      <p>© {new Date().getFullYear()} Kapsam Makina</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="w-full max-w-[450px] space-y-8">
        {/* Logo and Text Container */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 blur opacity-5 group-hover:opacity-30 transition duration-1000"></div>
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
            <h1 className="text-2xl font-semibold text-gray-900">Giriş yap</h1>
            <p className="text-gray-600">Kontrol Paneline Erişim</p>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100">
          <LoginForm />

          {/* Support contact */}
          <div className="pt-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <span>Destek için lütfen bize ulaşın.</span>
              <a
                href="mailto:support@kapsammakina.com"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                support@kapsammakina.com
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}
