import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #f5f0e6 0%, #e8dcc8 100%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: '"Cinzel Decorative", serif', color: '#2c2417' }}>Admin Panel</h1>
          <p className="text-sm" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#8B7355' }}>WoooW Invites Management</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-xl" style={{ border: '1px solid rgba(139,115,85,0.15)' }}>
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>}
          <div className="mb-5">
            <label className="block text-xs tracking-widest uppercase mb-2" style={{ fontFamily: '"Cinzel", serif', color: '#8B7355' }}>Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7355]" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@email.com" required className="w-full pl-10 pr-4 py-3 rounded border text-sm bg-white/60 focus:bg-white transition-colors" style={{ borderColor: 'rgba(139,115,85,0.2)', fontFamily: '"Cormorant Garamond", serif', color: '#2c2417' }} />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-xs tracking-widest uppercase mb-2" style={{ fontFamily: '"Cinzel", serif', color: '#8B7355' }}>Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7355]" />
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" required className="w-full pl-10 pr-10 py-3 rounded border text-sm bg-white/60 focus:bg-white transition-colors" style={{ borderColor: 'rgba(139,115,85,0.2)', fontFamily: '"Cormorant Garamond", serif', color: '#2c2417' }} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B7355] hover:text-[#2c2417]">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 rounded text-sm tracking-widest uppercase transition-all" style={{ fontFamily: '"Cinzel", serif', backgroundColor: '#2c2417', color: '#f5f0e6', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
