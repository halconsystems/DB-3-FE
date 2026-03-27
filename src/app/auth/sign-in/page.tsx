'use client';
import SignInForm from "../components/SignInForm";
import Image from "next/image";
import { useLogin } from "../../../hooks/auth/useLogin";
import Loader from "../../../components/ui/loader";
export default function SignInPage() {
  const { mutate: login, isPending } = useLogin();
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
        <Image src="/images/SignIn.jpg" alt="Sign In" width={500} height={700} style={{ width: '100%', height: 'auto' }} />
      </div>
      <div className="auth_right">
        <div className="auth_header">
          <div className="auth_logo">
            <Image src="/images/PDOHA.png" alt="Logo of PDOHA" width={120} height={60} />
          </div>
          <h1 className="auth_title">Welcome to DHA Karachi</h1>
          <h3 className="auth_subtitle">Smart Society . Home For Defenders</h3>
        </div>
        <SignInForm login={login} isPending={isPending} />
      </div>
    </main>
  );
}