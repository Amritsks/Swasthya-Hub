
export default other = () =>{
    return(
        <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
  <h2 className="text-xl mb-4 font-semibold">Pharmacist Login</h2>

  <input
    type="email"
    className="w-full p-2 mb-3 border rounded"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />

  {/* 🔐 Password Field */}
  <div className="relative mb-3">
    <input
      type={showPassword ? "password" : "text"}
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full p-2 pr-10 border rounded"
    />

    <button
      type="button"
      onClick={() => setShowPassword((p) => !p)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>

  <button
    onClick={handleLogin}
    disabled={loading}
    className="w-full bg-teal-600 text-white py-2 rounded disabled:opacity-50"
  >
    {loading ? "Logging in..." : "Login"}
  </button>

  {error && <p className="text-red-600 mt-2">{error}</p>}
</div>
    );
}