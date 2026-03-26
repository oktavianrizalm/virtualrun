'use client'

import { signup } from './actions'
import Link from 'next/link'
import ReCAPTCHA from 'react-google-recaptcha'
import { useState } from 'react'

export default function SignupPage() {
  const [captchaValue, setCaptchaValue] = useState<string | null>(null)

  return (
    <div className="flex min-h-[calc(100vh-80px)] mt-20 w-full items-center justify-center bg-[#0e0e10] px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#68fcbf]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-[450px] bg-[#161618] rounded-2xl p-10 shadow-2xl relative z-10 border border-white/5 my-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-[#1c2127] rounded-xl flex items-center justify-center mb-6 border border-[#68fcbf]/20 shadow-[0_0_15px_rgba(104,252,191,0.1)]">
            <svg className="w-7 h-7 text-[#68fcbf]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
          </div>
          <h1 className="text-3xl font-black text-white font-headline tracking-wide mb-2">Create Account</h1>
          <p className="text-[#8c8f94] text-[10px] font-bold tracking-[0.2em] text-center">JOIN THE VIRTUAL EVENT.</p>
        </div>
        
        <form className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#68fcbf] uppercase tracking-widest" htmlFor="full_name">
              Nama Lengkap
            </label>
            <input
              className="w-full bg-[#1c1c1e] border border-transparent rounded-xl px-5 py-3.5 text-white placeholder-[#5c5f66] focus:outline-none focus:border-[#68fcbf]/50 focus:ring-1 focus:ring-[#68fcbf]/50 transition-all font-medium text-sm"
              id="full_name"
              name="full_name"
              placeholder="John Doe"
              type="text"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#68fcbf] uppercase tracking-widest" htmlFor="email">
              Email
            </label>
            <input
              className="w-full bg-[#1c1c1e] border border-transparent rounded-xl px-5 py-3.5 text-white placeholder-[#5c5f66] focus:outline-none focus:border-[#68fcbf]/50 focus:ring-1 focus:ring-[#68fcbf]/50 transition-all font-medium text-sm"
              id="email"
              name="email"
              placeholder="runner@kinetic.pulse"
              type="email"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#68fcbf] uppercase tracking-widest" htmlFor="phone">
              Nomor Telpon
            </label>
            <input
              className="w-full bg-[#1c1c1e] border border-transparent rounded-xl px-5 py-3.5 text-white placeholder-[#5c5f66] focus:outline-none focus:border-[#68fcbf]/50 focus:ring-1 focus:ring-[#68fcbf]/50 transition-all font-medium text-sm"
              id="phone"
              name="phone"
              placeholder="+62 812 3456 7890"
              type="tel"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#68fcbf] uppercase tracking-widest" htmlFor="password">
              Password
            </label>
            <input
              className="w-full bg-[#1c1c1e] border border-transparent rounded-xl px-5 py-3.5 text-white placeholder-[#5c5f66] focus:outline-none focus:border-[#68fcbf]/50 focus:ring-1 focus:ring-[#68fcbf]/50 transition-all font-medium text-sm"
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#68fcbf] uppercase tracking-widest" htmlFor="confirm_password">
              Verifikasi Password
            </label>
            <input
              className="w-full bg-[#1c1c1e] border border-transparent rounded-xl px-5 py-3.5 text-white placeholder-[#5c5f66] focus:outline-none focus:border-[#68fcbf]/50 focus:ring-1 focus:ring-[#68fcbf]/50 transition-all font-medium text-sm"
              id="confirm_password"
              name="confirm_password"
              placeholder="••••••••"
              type="password"
              required
            />
          </div>
          
          <div className="pt-2 flex justify-center w-full">
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"} // Menggunakan Google test key sebagai cadangan bawaan
              onChange={(val) => setCaptchaValue(val)}
              theme="dark"
            />
            <input type="hidden" name="captchaToken" value={captchaValue || ''} />
          </div>
          
          <div className="flex flex-col gap-4 pt-4">
            <button
              formAction={signup}
              className="w-full bg-[#57edb1] hover:bg-[#68fcbf] text-[#004931] font-bold text-sm tracking-widest uppercase py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(87,237,177,0.3)] hover:shadow-[0_0_30px_rgba(104,252,191,0.5)] active:scale-[0.98]"
            >
              Sign Up / Daftar
            </button>
            <div className="text-center pt-2">
              <Link href="/login" className="text-sm font-semibold text-[#8c8f94] hover:text-white transition-colors">
                Already have an account? <span className="text-[#57edb1]">Log in</span>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
