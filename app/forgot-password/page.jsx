'use client';
import Link from "next/link";
import { useActionState } from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import sendOTP from "../actions/sendOTP";

const ForgotPasswordPage = () => {
  const [sendOTPState, sendOTPAction] = useActionState(sendOTP, {});
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (sendOTPState.error) {
      toast.error(sendOTPState.error);
    }
    if (sendOTPState.success) {
      toast.success('A password reset link has been sent to your email!');
      // Redirect to signin page after successful request
      setTimeout(() => {
        window.location.href = '/signin';
      }, 2000);
    }
  }, [sendOTPState]);

  const handleEmailSubmit = (formData) => {
    const emailValue = formData.get('email');
    setEmail(emailValue);
    sendOTPAction(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f8ff] to-[#e1f0ff] flex flex-col items-center justify-center p-4">
      <Link href="/signin" className="absolute top-6 left-6 text-[#5badec] hover:text-[#4a9ad4] font-medium flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Signin
      </Link>
      
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md">
        <div className="bg-[#5badec] py-4 px-6">
          <h2 className="text-2xl font-bold text-white text-center">
            Reset Password
          </h2>
          <p className="text-white/90 text-center text-sm mt-1">
            Enter your email to receive a password reset link
          </p>
        </div>
        
        <form action={handleEmailSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5badec] focus:border-[#5badec] outline-none transition"
              placeholder="your@email.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={sendOTPState.loading}
            className="w-full bg-[#5badec] hover:bg-[#4a9ad4] disabled:bg-gray-400 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            {sendOTPState.loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Career4Me. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default ForgotPasswordPage;