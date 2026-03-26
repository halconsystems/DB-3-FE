'use client';
import SignUpForm from "../components/SignUpForm";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <main className="authContainer">
      <div className="auth_left">
        <Image src="/images/signUp.jpg" alt="Sign Up" width={500} height={700} style={{ width: '100%', height: 'auto' }} />
      </div>
      <div className="auth_right">
        <div className="auth_header">
          <div className="auth_logo">
            <Image src="/images/PDOHA.png" alt="Logo of PDOHA" width={120} height={60} />
          </div>
          <h1 className="auth_title">Welcome to DHA Karachi</h1>
          <h3 className="auth_subtitle">Smart Society . Home For Defenders</h3>
        </div>
        <SignUpForm />
      </div>
    </main>
  );
}