import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { assets } from "../assets/assets";

const LoginAdmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:4000/api/auth/admin-login', {
        email,
        password,
      });

      if (response.data.success) {
        navigate('/administration');
      } else {
        setError(response.data.message || 'فشل تسجيل الدخول');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ ما');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-white-400">
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="شعار الأدمن"
        className="absolute left-5 sm:left-20 top-5 w-48 sm:w-60 cursor-pointer"
      />

      <div className="bg-slate-900 p-10 rounded-lg shadow-xl w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          تسجيل دخول الأدمن
        </h2>

        <p className="text-center text-sm mb-6">الوصول إلى لوحة التحكم</p>

        {error && (
          <div className="p-3 mb-4 bg-red-100 text-red-700 border border-red-300 rounded text-center text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mailIcon} alt="بريد" className="w-4 h-4" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none w-full text-white placeholder:text-gray-400"
              type="email"
              placeholder="بريد الأدمن الإلكتروني"
              required
            />
          </div>

          <div className="mb-6 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lockIcon} alt="قفل" className="w-4 h-4" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent outline-none w-full text-white placeholder:text-gray-400"
              type="password"
              placeholder="كلمة المرور"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium"
          >
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>

        <p className="text-gray-400 text-center text-xs mt-6">
          لست أدمن؟{' '}
          <span
            onClick={() => navigate('/')}
            className="text-blue-400 cursor-pointer underline"
          >
            انتقل إلى تسجيل دخول المستخدم
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginAdmin;