'use client';
import SignUpForm from "../components/SignUpForm";

export default function SignUpPage() {
  return (
    <main className="authContainer">
      <div className="auth_left">
        <img src="/images/signUp.jpg" alt="" />
      </div>
      <div className="auth_right">
        <div className="auth_header">
          <div className="auth_logo">
            <img src="/images/PDOHA.png" alt="Logo of PDOHA" />
          </div>
          <h1 className="auth_title">Welcome to DHA Karachi</h1>
          <h3 className="auth_subtitle">Smart Society . Home For Defenders</h3>
        </div>
        <SignUpForm />
      </div>
    </main>
  );
}