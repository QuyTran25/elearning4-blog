import { useState } from 'react';
import { useLogin } from '../hooks/useLogin';

export default function LoginForm() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    validationErrors,
    handleLogin,
  } = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-[24px] w-[328px]">
      {error && (
        <div className="p-3 bg-red-50 border border-red-300 rounded-[8px] text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Email Field */}
      <div className="flex flex-col">
        <label className="block font-sans font-semibold text-[14px] leading-[20px] tracking-[0.7px] text-[#474651] mb-[8px] px-[4px]">
          Email hoặc Username
        </label>
        <div className={`relative w-[328px] h-[50px] border rounded-[8px] bg-white transition-colors flex items-center ${
          validationErrors.email ? 'border-red-500' : 'border-[#C8C5D3] focus-within:border-[#1A146B]'
        }`}>
          <span className="absolute left-[16px] text-[#777682] flex items-center">
            <svg width="16" height="16" viewBox="492 422.822 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M500 430.822C498.9 430.822 497.958 430.431 497.175 429.647C496.392 428.864 496 427.922 496 426.822C496 425.722 496.392 424.781 497.175 423.997C497.958 423.214 498.9 422.822 500 422.822C501.1 422.822 502.042 423.214 502.825 423.997C503.608 424.781 504 425.722 504 426.822C504 427.922 503.608 428.864 502.825 429.647C502.042 430.431 501.1 430.822 500 430.822ZM492 438.822V436.022C492 435.456 492.146 434.935 492.438 434.46C492.729 433.985 493.117 433.622 493.6 433.372C494.633 432.856 495.683 432.468 496.75 432.21C497.817 431.951 498.9 431.822 500 431.822C501.1 431.822 502.183 431.951 503.25 432.21C504.317 432.468 505.367 432.856 506.4 433.372C506.883 433.622 507.271 433.985 507.562 434.46C507.854 434.935 508 435.456 508 436.022V438.822H492ZM494 436.822H506V436.022C506 435.839 505.954 435.672 505.863 435.522C505.771 435.372 505.65 435.256 505.5 435.172C494.6 434.722 493.692 434.385 492.775 434.16C491.858 433.935 490.933 433.822 500 433.822C499.067 433.822 498.142 433.935 497.225 434.16C496.308 434.385 495.4 434.722 494.5 435.172C494.35 435.256 494.229 435.372 494.138 435.522C494.046 435.672 494 435.839 494 436.022V436.822ZM500 428.822C500.55 428.822 501.021 428.626 501.413 428.235C501.804 427.843 502 427.372 502 426.822C502 426.272 501.804 425.801 501.413 425.41C501.021 425.018 500.55 424.822 500 424.822C499.45 424.822 498.979 425.018 498.588 425.41C498.196 425.801 498 426.272 498 426.822C498 427.372 498.196 427.843 498.588 428.235C498.979 428.626 499.45 428.822 500 428.822Z" fill="#777682"/>
            </svg>
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@techblog.com"
            className="w-full h-full pl-[48px] pr-[16px] bg-transparent outline-none font-sans font-normal text-[16px] leading-[19px] text-[#474651] placeholder-[#777682]/50"
            disabled={isLoading}
          />
        </div>
        {validationErrors.email && (
          <p className="mt-1 text-xs text-red-600 px-[4px]">{validationErrors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-[8px] px-[4px]">
          <label className="font-sans font-semibold text-[14px] leading-[20px] tracking-[0.7px] text-[#474651]">
            Mật khẩu
          </label>
          <a href="#" className="font-sans font-semibold text-[14px] leading-[20px] text-[#1A146B] hover:text-[#251d8d] transition-colors">
            Quên mật khẩu?
          </a>
        </div>
        <div className={`relative w-[328px] h-[50px] border rounded-[8px] bg-white transition-colors flex items-center ${
          validationErrors.password ? 'border-red-500' : 'border-[#C8C5D3] focus-within:border-[#1A146B]'
        }`}>
          <span className="absolute left-[16px] text-[#777682] flex items-center">
            <svg width="16" height="21" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M8 1.5C5.79086 1.5 4 3.29086 4 5.5V8.5H3C1.89543 8.5 1 9.39543 1 10.5V18.5C1 19.6046 1.89543 20.5 3 20.5H13C14.1046 20.5 15 19.6046 15 18.5V10.5C15 9.39543 14.1046 8.5 13 8.5H12V5.5C12 3.29086 10.2091 1.5 8 1.5ZM6 5.5C6 4.39543 6.89543 3.5 8 3.5C9.10457 3.5 10 4.39543 10 5.5V8.5H6V5.5ZM8 12.5C8.82843 12.5 9.5 13.1716 9.5 14C9.5 14.8284 8.82843 15.5 8 15.5C7.17157 15.5 6.5 14.8284 6.5 14C6.5 13.1716 7.17157 12.5 8 12.5Z" fill="#777682"/>
            </svg>
          </span>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full h-full pl-[48px] pr-[48px] bg-transparent outline-none font-sans font-normal text-[16px] leading-[19px] text-[#474651] placeholder-[#777682]/50"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-[16px] text-[#777682] hover:text-[#1A146B] transition-colors flex items-center"
            disabled={isLoading}
          >
            {showPassword ? (
              <svg width="22" height="15" viewBox="0 0 22 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M11 0.5C6 0.5 1.73 3.61 0 8C1.73 12.39 6 15.5 11 15.5C16 15.5 20.27 12.39 22 8C20.27 3.61 16 0.5 11 0.5ZM11 13C8.24 13 6 10.76 6 8C6 5.24 8.24 3 11 3C13.76 3 16 5.24 16 8C16 10.76 13.76 13 11 13ZM11 5C9.34 5 8 6.34 8 8C8 9.66 9.34 11 11 11C12.66 11 14 9.66 14 8C14 6.34 12.66 5 11 5Z" fill="#777682"/>
                <line x1="2" y1="13" x2="20" y2="2" stroke="#777682" strokeWidth="2" />
              </svg>
            ) : (
              <svg width="22" height="15" viewBox="0 0 22 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M11 0.5C6 0.5 1.73 3.61 0 8C1.73 12.39 6 15.5 11 15.5C16 15.5 20.27 12.39 22 8C20.27 3.61 16 0.5 11 0.5ZM11 13C8.24 13 6 10.76 6 8C6 5.24 8.24 3 11 3C13.76 3 16 5.24 16 8C16 10.76 13.76 13 11 13ZM11 5C9.34 5 8 6.34 8 8C8 9.66 9.34 11 11 11C12.66 11 14 9.66 14 8C14 6.34 12.66 5 11 5Z" fill="#777682"/>
              </svg>
            )}
          </button>
        </div>
        {validationErrors.password && (
          <p className="mt-1 text-xs text-red-600 px-[4px]">{validationErrors.password}</p>
        )}
      </div>

      {/* Remember Me */}
      <div className="flex items-center gap-[8px] px-[4px] pt-[4px]">
        <input
          type="checkbox"
          id="remember"
          className="w-[16px] h-[16px] text-[#1A146B] border-[#C8C5D3] rounded-[4px] focus:ring-0 cursor-pointer"
          disabled={isLoading}
        />
        <label htmlFor="remember" className="font-sans font-semibold text-[14px] leading-[20px] tracking-[0.7px] text-[#474651] cursor-pointer select-none">
          Ghi nhớ phiên đăng nhập
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-[328px] h-[58px] bg-[#1A146B] hover:bg-[#251d8d] active:bg-[#150f55] disabled:bg-gray-400 text-white rounded-[8px] flex items-center justify-center gap-[8px] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.05)] mt-[24px]"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="font-serif font-semibold text-[16px] leading-[26px] text-white">Đang đăng nhập...</span>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span className="font-serif font-semibold text-[16px] leading-[26px] text-white">Đăng nhập</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.16669 7.00002H12.8334M12.8334 7.00002L7.00002 1.16669M12.8334 7.00002L7.00002 12.8334" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        )}
      </button>

      {/* Footer Note */}
      <div className="border-t border-[#C8C5D3]/30 pt-[22.9px] mt-[24px] flex flex-col items-center w-[328px]">
        <p className="font-sans font-medium text-[12px] leading-[17px] text-center text-[#474651] max-w-[286.28px]">
          © 2024 Tech Blog Management System. All rights reserved.
        </p>
      </div>
    </form>
  );
}

