'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="auth_form">
      <div className="form_title">Sign In</div>

      <div className="input_fields">
        <div className="input_field">
          <label htmlFor="email" className="auth_label">Email Address</label>
          <input
            type="email"
            className="auth_input"
            placeholder="Email Address Here"
            name="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="input_field">
          <label htmlFor="password" className="auth_label">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            className="auth_input"
            placeholder="Password Here"
            name="password"
            id="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button type="button" className="toggle_password" onClick={() => setShowPassword(!showPassword)}>
            <img src="/icons/password.svg" alt="" />
          </button>
        </div>
        <div className="forget"><a href="/auth/forgot-password" className="auth_link">Forgot Password?</a></div>
      </div>

      <div className="terms">
        <input
          type="checkbox"
          id="remember"
          name="remember"
          checked={formData.remember}
          onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
        />
        <label htmlFor="remember">I Agree to Terms &amp; Conditions</label>
      </div>

      <button type="submit" className="auth_button">Sign In</button>

      <p className="auth_text">Don't have an account? <a href="/auth/sign-up" className="auth_link">Sign Up</a></p>
    </form>
  );
}
