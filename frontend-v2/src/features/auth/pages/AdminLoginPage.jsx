import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/LoginForm';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 mx-auto text-blue-600 mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600">Đang kiểm tra phiên đăng nhập...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative px-4"
      style={{
        background: 'radial-gradient(128.06% 160.08% at 0% 0%, rgba(49, 46, 129, 0.04) 0%, rgba(49, 46, 129, 0) 50%), radial-gradient(128.06% 160.08% at 0% 0%, rgba(49, 46, 129, 0.03) 0%, rgba(49, 46, 129, 0) 50%), radial-gradient(128.06% 160.08% at 100% 100%, rgba(49, 46, 129, 0.05) 0%, rgba(49, 46, 129, 0) 50%), linear-gradient(0deg, #F7F9FB, #F7F9FB), #FFFFFF'
      }}
    >
      <div className="flex flex-col items-center gap-[16.8px]">
        {/* Main Card */}
        <div className="w-[408px] bg-white rounded-[12px] p-[40px] shadow-[0px_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center">
          {/* Branding Section */}
          <div className="flex flex-row items-center gap-[8px] pb-[16px] relative">
            <svg width="27" height="21" viewBox="572.097 226.238 26.666 21.334" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M574.763 247.572C574.03 247.572 573.402 247.311 572.88 246.788C572.358 246.266 572.097 245.638 572.097 244.905V228.905C572.097 228.172 572.358 227.544 572.88 227.022C573.402 226.499 574.03 226.238 574.763 226.238H596.097C596.83 226.238 597.458 226.499 597.98 227.022C598.502 227.544 598.763 228.172 598.763 228.905V244.905C598.763 245.638 598.502 246.266 597.98 246.788C597.458 247.311 596.83 247.572 596.097 247.572H574.763ZM574.763 244.905H596.097V231.572H574.763V244.905ZM579.43 243.572L577.563 241.705L580.997 238.238L577.53 234.772L579.43 232.905L584.763 238.238L579.43 243.572ZM585.43 243.572V240.905H593.43V243.572H585.43Z" fill="#1A146B"/>
            </svg>
            <span className="font-serif font-bold text-[24px] leading-[34px] text-[#1A146B]">
              Tech Blog
            </span>
          </div>

          {/* Title Section */}
          <div className="flex flex-col items-center gap-[7px] pb-[24px]">
            <h1 className="font-serif font-bold text-[30px] leading-[39px] text-[#191C1E] text-center">
              Chào mừng Admin<br />quay trở lại
            </h1>
            <p className="font-sans font-normal text-[16px] leading-[26px] text-[#474651] text-center">
              Vui lòng đăng nhập để quản trị hệ thống.
            </p>
          </div>

          {/* Form */}
          <LoginForm />
        </div>

        {/* Security Badges */}
        <div className="w-[408px] flex flex-row justify-center items-center gap-[16px] opacity-50">
          <div className="flex flex-row items-center gap-[4px]">
            <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M5.5 1C3.84315 1 2.5 2.34315 2.5 4V5H2C1.44772 5 1 5.44772 1 6V11C1 11.5523 1.44772 12 2 12H9C9.55228 12 10 11.5523 10 11V6C10 5.44772 9.55228 5 9 5H8.5V4C8.5 2.34315 7.15685 1 5.5 1ZM3.5 4C3.5 2.89543 4.39543 2 5.5 2C6.60457 2 7.5 2.89543 7.5 4V5H3.5V4ZM5.5 7.5C6.05228 7.5 6.5 7.94772 6.5 8.5C6.5 9.05228 6.05228 9.5 5.5 9.5C4.94772 9.5 4.5 9.05228 4.5 8.5C4.5 7.94772 4.94772 7.5 5.5 7.5Z" fill="#191C1E"/>
            </svg>
            <span className="font-sans font-medium text-[12px] leading-[17px] text-[#191C1E]">
              SSL Secured
            </span>
          </div>
          <div className="flex flex-row items-center gap-[4px]">
            <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M5.5 1C3.84315 1 2.5 2.34315 2.5 4V5H2C1.44772 5 1 5.44772 1 6V11C1 11.5523 1.44772 12 2 12H9C9.55228 12 10 11.5523 10 11V6C10 5.44772 9.55228 5 9 5H8.5V4C8.5 2.34315 7.15685 1 5.5 1ZM3.5 4C3.5 2.89543 4.39543 2 5.5 2C6.60457 2 7.5 2.89543 7.5 4V5H3.5V4ZM5.5 7.5C6.05228 7.5 6.5 7.94772 6.5 8.5C6.5 9.05228 6.05228 9.5 5.5 9.5C4.94772 9.5 4.5 9.05228 4.5 8.5C4.5 7.94772 4.94772 7.5 5.5 7.5Z" fill="#191C1E"/>
            </svg>
            <span className="font-sans font-medium text-[12px] leading-[17px] text-[#191C1E]">
              Encrypted Data
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}


