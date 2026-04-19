import React from 'react';

const Login = () => {
  return (
    <div className="flex items-center justify-center h-full p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Login</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" className="w-full p-2 border border-slate-200 rounded-lg" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input type="password" className="w-full p-2 border border-slate-200 rounded-lg" placeholder="••••••••" />
          </div>
          <button className="w-full bg-blue-600 text-white p-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
