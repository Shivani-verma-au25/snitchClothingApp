import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

const Login = () => {
  const { loading, error } = useSelector((state) => state.auth);
  const {handleLogin} = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // call login function from useAuth hook
    const resp = await handleLogin(formData);
    if(resp?.success){
      navigate('/') // navigate to home page on successful login
      toast.success(resp?.message )      
    }else{
      // handle login failure 
      toast.error(error?.email || error?.password 
      || 
      "Login failed. Please check your credentials and try again."
      )
    }

    // reset form data after submission
    setFormData({
      email:"",
      password : ""
    })
  };


  
  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
          
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes reveal {
            from { opacity: 0; transform: scale(1.05); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-up {
            animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
          }
          .animate-reveal {
            animation: reveal 1.2s ease-out forwards;
          }
          .delay-100 { animation-delay: 100ms; }
          .delay-200 { animation-delay: 200ms; }
          .delay-300 { animation-delay: 300ms; }
          .input-focus-ring:focus-within {
            box-shadow: 0 0 0 2px rgba(227, 216, 255, 0.15);
            border-color: #E3D8FF;
          }
        `}
      </style>

      <div className="min-h-screen flex w-full bg-[#0d0d0f] font-['Inter',_sans-serif]">
        {/* Left Side: Fashion Image (Hidden on small screens) */}
        <div className="hidden lg:flex lg:w-[45%] relative bg-black overflow-hidden items-center justify-center">
          {mounted && (
            <img
              src="/fashion-bg.png"
              alt="Fashion Boutique"
              className="absolute inset-0 w-full h-full object-cover opacity-80 animate-reveal"
            />
          )}
          {/* Gradients to blend text better */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-0"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent z-0"></div>

          <div className="relative z-10 text-white p-16 flex flex-col justify-end h-full w-full animate-fade-up delay-200">
            <h1 className="text-[3rem] font-light tracking-[0.25em] text-[#E3D8FF] mb-6">
              snitch.
            </h1>
            <p className="text-[0.75rem] uppercase tracking-[0.25em] text-[#b4b0c2] max-w-sm leading-relaxed">
              Curate your aesthetic. Discover the latest editorial fashion
              trends and elevate your wardrobe.
            </p>
          </div>
        </div>

        {/* Right Side: Form content */}
        <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
          {/* Subtle noise/texture overlay for the dark theme */}
          <div
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
            }}
          ></div>

          <div className="w-full max-w-[420px] relative z-10">
            <div className="lg:hidden text-center mb-12 animate-fade-up">
              <h1 className="text-4xl font-light tracking-[0.25em] text-[#E3D8FF]">
                snitch.
              </h1>
              <p className="mt-3 text-[0.65rem] uppercase tracking-[0.2em] text-[#888594]">
                Sign in to your account and curate your fashion journey with us.
              </p>
            </div>

            <div className="mb-10 hidden lg:block animate-fade-up">
              <h2 className="text-3xl font-light text-white mb-2">
                Sign in to your account
              </h2>
              <p className="text-[#888594] text-[0.85rem] tracking-wide">
                Join our exclusive fashion community today.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Email */}
              <div className="flex flex-col gap-1.5 animate-fade-up delay-100">
                <label
                  htmlFor="email"
                  className="text-[0.65rem] font-medium tracking-[0.1em] uppercase text-[#CAC4D1] ml-1"
                >
                  Email Address
                </label>
                <div className="relative input-focus-ring rounded-xl transition-all duration-300 border border-[#2a2930] bg-[#1a1a1f]/80 backdrop-blur-sm overflow-hidden group">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-transparent text-sm text-[#E4E1E7] placeholder-[#575560] outline-none group-hover:bg-[#202026]/50 transition-colors"
                    autoComplete="off"
                  />
                </div>
                {error?.email && (
                  <p className="px-1 py-1 rounded-xl  text-[#ffb4ab] text-xs animate-fade-up flex items-center gap-1">
                    {error?.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5 animate-fade-up delay-200">
                <label
                  htmlFor="password"
                  className="text-[0.65rem] font-medium tracking-[0.1em] uppercase text-[#CAC4D1] ml-1"
                >
                  Password
                </label>
                <div className="relative input-focus-ring rounded-xl transition-all duration-300 border border-[#2a2930] bg-[#1a1a1f]/80 backdrop-blur-sm overflow-hidden flex items-center pr-3 group">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-transparent text-sm text-[#E4E1E7] placeholder-[#575560] outline-none group-hover:bg-[#202026]/50 transition-colors"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 text-[#575560] hover:text-[#C9B8FF] transition-colors focus:outline-none cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {error?.password && (
                  <p className="px-1 py-1 rounded-xl text-[#ffb4ab] text-xs animate-fade-up flex items-center gap-1">
                    {error?.password}
                  </p>
                )}
              </div>

              {/* {error && (
                <div className="px-4 py-3 rounded-xl bg-[#2a1315] border border-[#5c2428] text-[#ffb4ab] text-sm animate-fade-up mt-1 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  {error}
                </div>
              )} */}

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full py-4 px-4 rounded-xl text-[0.85rem]  font-medium tracking-wide transition-all duration-300 active:scale-[0.98] hover:brightness-110 animate-fade-up delay-300 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#E3D8FF] focus:ring-offset-2 focus:ring-offset-[#0d0d0f]"
                style={{
                  background: "linear-gradient(135deg, #E3D8FF, #C9B8FF)",
                  color: "#2a2054",
                }}
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-[150%] group-hover:animate-[shimmer_1.5s_infinite]"></div>

                <style>{`
                  @keyframes shimmer {
                    100% { transform: skewX(-12deg) translateX(250%); }
                  }
                `}</style>

                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-10 text-center animate-fade-up delay-300">
              <p className="text-[0.8rem] text-[#888594]">
                don't have an account?{" "}
                <a
                  href="/register"
                  className="text-[#6954ae] hover:text-[#E3D8FF] hover:underline underline-offset-4 transition-all duration-200"
                >
                  Sign up instead
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
