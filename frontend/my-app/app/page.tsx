import Link from "next/link";

export default function Home() {
  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.squarespace-cdn.com/content/v1/578f777ad1758e8ac84046f1/e5a8d773-5169-4971-b708-fd5bd7ef377d/Call+for+Administrative+Volunteers.png?format=2500w')",
      }}
    >
      {/* Soft Black Shadow (Gradient Overlay) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 p-10 bg-white/20 backdrop-blur-lg rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-white drop-shadow-lg">Welcome</h1>
        
        <div className="flex gap-4">
          {/* Login Button */}
          <Link
            href="/auth/login"
            className="px-10 py-4 bg-gradient-to-r from-sky-400 to-sky-300 text-white font-semibold text-lg rounded-xl shadow-lg hover:from-sky-500 hover:to-sky-400 focus:ring-4 focus:ring-sky-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Login
          </Link>

          {/* Signup Button */}
          <Link
            href="/auth/signup"
            className="px-10 py-4 bg-gradient-to-r from-pink-400 to-pink-300 text-white font-semibold text-lg rounded-xl shadow-lg hover:from-pink-500 hover:to-pink-400 focus:ring-4 focus:ring-pink-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
