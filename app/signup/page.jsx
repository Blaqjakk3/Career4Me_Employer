'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import createEmployer from "../../app/actions/createAccount";

const SignUp = () => {
  const [state, formAction] = useActionState(createEmployer, {});
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if(state.error) toast.error(state.error);
    if (state.success) {
      toast.success('Account created successfully! You can now log in.');
      router.push('/signin');
    }
  }, [state]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f8ff] to-[#e1f0ff] flex flex-col items-center justify-center p-4">
      <Link href="/" className="absolute top-6 left-6 text-[#5badec] hover:text-[#4a9ad4] font-medium flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back Home
      </Link>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md">
        <div className="bg-[#5badec] py-4 px-6">
          <h2 className="text-2xl font-bold text-white text-center">
            Create Employer Account
          </h2>
          <p className="text-white/90 text-center text-sm mt-1">
            Join thousands of employers finding top talent
          </p>
        </div>
        
        <form action={formAction} className="p-6 space-y-5">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Employer Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5badec] focus:border-[#5badec] outline-none transition"
                placeholder="Anonymous Company Ltd"
                required
              />
            </div>

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

            <div>
              <label htmlFor="field" className="block text-sm font-medium text-gray-700 mb-1">
                Industry Field
              </label>
              <select
                id="field"
                name="field"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5badec] focus:border-[#5badec] outline-none transition appearance-none bg-white"
                required
              >
                <option value="">Select your industry</option>
                <option value="Technology">Technology</option>
                <option value="Telecommunications">Telecommunications</option>
                <option value="Business">Business</option>
                <option value="Health">Health</option>
                <option value="Sports">Sports</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Banking and Finance">Banking and Finance</option>
                <option value="Education">Education</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5badec] focus:border-[#5badec] outline-none transition pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-[#5badec]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Use at least 8 characters</p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#5badec] hover:bg-[#4a9ad4] text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            Create Account
          </button>

          <div className="text-center text-sm text-gray-600 pt-2">
            Already have an account?{' '}
            <Link href="/signin" className="text-[#5badec] hover:text-[#4a9ad4] font-medium">
              Sign in here
            </Link>
          </div>
        </form>
      </div>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Career4Me. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default SignUp;