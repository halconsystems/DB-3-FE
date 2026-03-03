'use client';
import { useState } from "react";

interface SignUpFormProps {
  onDocumentUpload?: () => void;
}

export default function SignUpForm({ onDocumentUpload }: SignUpFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    cnic: '',
    vehicleId: '',
    document1: null as File | null,
    document2: null as File | null
  });

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    if (onDocumentUpload) {
      onDocumentUpload();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, docNumber: 1 | 2) => {
    const file = e.target.files?.[0] || null;
    setFormData({
      ...formData,
      [`document${docNumber}`]: file
    });
  };

  return (
    <div style={{ height: currentStep === 1 ? "auto" : "100vh" }}>
      <div className="auth_lines">
        <div className={`auth_line ${currentStep === 1 ? 'active' : ''}`} onClick={() => { setCurrentStep(1) }}></div>
        <div className={`auth_line ${currentStep === 2 ? 'active' : ''}`} onClick={() => { setCurrentStep(2) }}></div>
      </div>

      {currentStep === 1 ? (
        <form onSubmit={handleNextStep} className="auth_form">
          <div className="form_title">Sign Up</div>

          <div className="input_fields">
            <div className="input_field">
              <label htmlFor="fullName" className="auth_label">Full Name</label>
              <input
                type="text"
                className="auth_input"
                placeholder="Full Name Here"
                name="fullName"
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>

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

            <div className="input_field">
              <label htmlFor="cnic" className="auth_label">CNIC</label>
              <input
                type="text"
                className="auth_input"
                placeholder="CNIC Here"
                name="cnic"
                id="cnic"
                value={formData.cnic}
                onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                required
              />
            </div>

            <div className="input_field">
              <label htmlFor="vehicleId" className="auth_label">Vehicle ID</label>
              <input
                type="text"
                className="auth_input"
                placeholder="Vehicle ID Here"
                name="vehicleId"
                id="vehicleId"
                value={formData.vehicleId}
                onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth_button">Next</button>

          <p className="auth_text">Already have an account? <a href="/auth/sign-in" className="auth_link">Login</a></p>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="auth_form">
          <div className="form_title">Upload Documents</div>

             <div className="capsuleFile mb-2">
              <div className="fileLabelRow">
                <label className="labelRed">CNIC Front</label>
                <label className="plusButton">
                  +
                  <input 
                    type="file" 
                    accept="image/*"
                    name="document1"
                    id="document1"
                    onChange={(e) => handleFileChange(e, 1)}
                    required
                  />
                </label>
              </div>
              <div className="fileInfo">
                <span className="fileSubtext">No file chosen</span>
              </div>
            </div>

             <div className="capsuleFile">
              <div className="fileLabelRow">
                <label className="labelRed">CNIC Back</label>
                <label className="plusButton">
                  +
                  <input 
                    type="file" 
                    accept="image/*"
                    name="document2"
                    id="document2"
                    onChange={(e) => handleFileChange(e, 2)}
                    required
                  />
                </label>
              </div>
              <div className="fileInfo">
                <span className="fileSubtext">No file chosen</span>
              </div>
            </div>
{/* 
            <div className="input_field capsuleFile">
              <label htmlFor="document2" className="auth_label">Document 2</label>
              <input
                type="file"
                className="auth_input"
                name="document2"
                id="document2"
                onChange={(e) => handleFileChange(e, 2)}
                required
              />
            </div>
          </div> */}

          <button type="submit" className="auth_button" id="authBtn1">Submit</button>

          <p className="auth_text">Already have an account? <a href="/auth/sign-in" className="auth_link">Login</a></p>
        </form>
      )}
    </div>
  );
}
