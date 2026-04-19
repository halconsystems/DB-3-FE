'use client';
import SignInForm from "../components/SignInForm";
import Image from "next/image";
import { useLogin } from "../../../hooks/auth/useLogin";
import Loader from "../../../components/ui/loader";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "../../../lib/apiClient";

export default function SignInPage() {
  const { mutate: login, isPending } = useLogin();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyExistingToken = async () => {
      try {
        // Check if user has token in localStorage (Remember Me case)
        const token = localStorage.getItem("token");
        
        if (token) {
          console.log('[SignInPage] Found token in localStorage, verifying...');
          try {
            // Send a simple request to verify token is still valid
            // Using a safe endpoint that requires authentication
            const response = await apiClient.get('/auth/GetAllUsers', {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            
            // If we get here, token is valid
            console.log('[SignInPage] Token verified, redirecting to dashboard');
            router.push('/dashboard');
            return;
          } catch (error: any) {
            // Token is invalid or expired
            if (error?.response?.status === 401) {
              console.log('[SignInPage] Token verification failed with 401, staying on login page');
              localStorage.removeItem("token");
              localStorage.removeItem("fullName");
              // Don't redirect, let user login again
            } else {
              console.error('[SignInPage] Token verification error:', error);
            }
          }
        }
      } catch (error) {
        console.error('[SignInPage] Error checking token:', error);
      } finally {
        setIsVerifying(false);
      }
    };

    // Only verify on client side after mount
    verifyExistingToken();
  }, [router]);

  if (isVerifying) {
    return (
      <main className="authContainer" style={{ position: 'relative' }}>
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          background: 'rgba(255,255,255,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Loader bare />
        </div>
      </main>
    );
  }

  return (
    <main className="authContainer" style={{ position: 'relative' }}>
      {isPending && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          background: 'rgba(255,255,255,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Loader bare />
        </div>
      )}
      <div className="auth_left">
        <Image loading="eager" src="/images/SignIn.jpg" alt="Sign In" width={500} height={700} style={{ width: '100%', height: 'auto' }} />
      </div>
      <div className="auth_right">
        <div className="auth_header">
          <div className="auth_logo">
            <Image loading="eager" src="/images/PDOHA.png" alt="Logo of PDOHA" width={120} height={60} />
          </div>
          <h1 className="auth_title">Welcome to DHA Karachi</h1>
          <h3 className="auth_subtitle">Smart Society . Home For Defenders</h3>
        </div>
        <SignInForm login={login} isPending={isPending} />
      </div>
    </main>
  );
}