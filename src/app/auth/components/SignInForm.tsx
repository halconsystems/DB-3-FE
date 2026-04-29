'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

interface SignInFormProps {
  login: (data: { email: string; password: string }, options: any) => void;
  isPending: boolean;
}

export default function SignInForm({ login, isPending }: SignInFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [formError, setFormError] = useState("");

  // Autofill from localStorage if Remember Me was previously checked
  useEffect(() => {
    const remembered = localStorage.getItem("rememberMe");
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    if (remembered === "true" && savedEmail && savedPassword) {
      setFormData({
        email: savedEmail,
        password: savedPassword,
        remember: true
      });
    }
  }, []);

  if (isPending) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Handle Remember Me checkbox
    if (formData.remember) {
      // Save credentials for next time
      localStorage.setItem("rememberMe", "true");
      localStorage.setItem("rememberedEmail", formData.email);
      localStorage.setItem("rememberedPassword", formData.password);
    } else {
      // Clear saved credentials if Remember Me is unchecked
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberedPassword");
    }

    login(
      { email: formData.email, password: formData.password },
      {
        onSuccess: (data: any) => {
          const token = data.data.token;
          const fullName = data.data.fullName || data.data.name || '';

          if (formData.remember) {
            // Save token to localStorage (persistent across sessions)
            localStorage.setItem("token", token);
            if (fullName) {
              localStorage.setItem("fullName", fullName);
            }
            // Clear sessionStorage if it exists
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("fullName");
          } else {
            // Save token to sessionStorage only (temporary, clears when browser closes)
            sessionStorage.setItem("token", token);
            if (fullName) {
              sessionStorage.setItem("fullName", fullName);
            }
            // Clear localStorage token to avoid using old token
            localStorage.removeItem("token");
            localStorage.removeItem("fullName");
          }

          // Set cookie for middleware to check
          if (typeof document !== 'undefined') {
            const maxAge = formData.remember ? 60 * 60 * 24 * 365 : ''; // 1 year for Remember Me, session for normal
            document.cookie = `token=${token}; path=/;${formData.remember ? ' max-age=' + (60 * 60 * 24 * 365) : ''}`;
          }

          console.log('[SignInForm] Login successful, redirecting to dashboard');
          router.push('/dashboard');
        },
        onError: (error: any) => {
          console.error('[SignInForm] Login error:', error);
          if (error?.response?.status === 400) {
            setFormError("Invalid email or password");
          } else if (error?.response?.status === 401) {
            setFormError("Unauthorized. Please check your credentials.");
          } else {
            setFormError("Login failed. Please try again.");
          }
        }
      }
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="auth_form">
        {formError && (
          <div style={{ color: 'red', marginBottom: 12 }}>{formError}</div>
        )}
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
            <button
              type="button"
              className="toggle_password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} color="#30B33D" /> : <Eye size={18} color="#30B33D" />}
            </button> 
          </div>
        </div>

        <div className="terms">
          <input
            type="checkbox"
            id="remember"
            name="remember"
            checked={formData.remember}
            onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
          />
          <label htmlFor="remember">Remember Me</label>
        </div>

        <button type="submit" className="auth_button" disabled={isPending}>
          Sign In
        </button>
      </form>
    </>
  );
}
