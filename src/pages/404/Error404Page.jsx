import { Home, ArrowLeft } from 'lucide-react'

const Error404Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-black flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        {/* 404 Number with Gradient */}
        <div className="relative mb-8">
          <h1 className="text-8xl sm:text-9xl md:text-[12rem] lg:text-[16rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-600 animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 blur-3xl opacity-50 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-600"></div>
        </div>

        {/* Main Message */}
        <div className="space-y-4 mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Oops! Trang không tồn tại
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
            Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
          </p>
        </div>

        {/* Floating Elements Animation */}
        <div className="hidden md:block absolute top-20 left-10 w-20 h-20 bg-cyan-500 rounded-full opacity-20 animate-bounce"></div>
        <div className="hidden lg:block absolute bottom-20 right-10 w-32 h-32 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="hidden md:block absolute top-40 right-20 w-16 h-16 bg-cyan-400 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}></div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
          <a
            href="/"
            className="group flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl w-full sm:w-auto justify-center"
          >
            <Home className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="text-sm sm:text-base">Về Trang Chủ</span>
          </a>

          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-105 border border-white/20 w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm sm:text-base">Quay Lại</span>
          </button>
        </div>

        {/* Error Code */}
        <p className="mt-12 sm:mt-16 text-xs sm:text-sm text-gray-500">
          Error Code: 404 | Page Not Found
        </p>
      </div>
    </div>
  )
}

export default Error404Page