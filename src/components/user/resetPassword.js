import React, { useState, useEffect } from "react";
import axios from "axios";
import "./resetPassword.css";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Extract email from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email");

    if (email) {
      setFormData((prevState) => ({ ...prevState, email }));
    }
  }, []);

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const calculatePasswordStrength = (password) => {
    if (!password) return 0;

    // Basic strength calculation
    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;

    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    return Math.min(5, strength);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Update password strength when password changes
    if (name === "newPassword") {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.otp) newErrors.otp = "OTP is required";
    if (!formData.newPassword)
      newErrors.newPassword = "New password is required";
    if (formData.newPassword.length < 8)
      newErrors.newPassword = "Password must be at least 8 characters";
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post("/api/users/reset-password", {
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      });

      // Show success notification
      setNotification({
        show: true,
        message: "Password reset successful! Redirecting you to sign in...",
        type: "success",
      });

      // Redirect to signin page after 2 seconds
      setTimeout(() => {
        window.location.href = "/signin";
      }, 2000);
    } catch (error) {
      // Extract a string message from the error object without using optional chaining
      let errorMessage = "Failed to reset password";

      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      } else if (error && error.message) {
        errorMessage = error.message;
      }

      // Show error notification
      setNotification({
        show: true,
        message: errorMessage,
        type: "error",
      });

      // Safely check for field information in error response
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.field
      ) {
        setErrors({ ...errors, [error.response.data.field]: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  const getStrengthClass = () => {
    if (passwordStrength < 2) return "strength-weak";
    if (passwordStrength < 4) return "strength-medium";
    return "strength-strong";
  };

  const getStrengthLabel = () => {
    if (passwordStrength < 2) return "Weak";
    if (passwordStrength < 4) return "Moderate";
    return "Strong";
  };

  const getStrengthLabelClass = () => {
    if (passwordStrength < 2) return "weak";
    if (passwordStrength < 4) return "medium";
    return "strong";
  };

  return (
    <div className="reset-password-container">
      {/* Custom notification */}
      {notification.show && (
        <div
          className={`notification ${
            notification.type === "success"
              ? "notification-success"
              : "notification-error"
          }`}
        >
          <div className="flex-center">
            {notification.type === "success" ? (
              <svg
                className="notification-icon"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            ) : (
              <svg
                className="notification-icon"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            )}
            {notification.message}
          </div>
        </div>
      )}

      <div className="reset-password-header">
        <h2 className="reset-password-title">Reset Your Password</h2>
        <p className="reset-password-subtitle">
          Enter your OTP and create a new password
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-input ${errors.email ? "error" : ""}`}
            placeholder="Enter your email address"
            readOnly={formData.email !== ""}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="otp" className="form-label">
            OTP Code
          </label>
          <input
            type="text"
            id="otp"
            name="otp"
            value={formData.otp}
            onChange={handleChange}
            className={`form-input ${errors.otp ? "error" : ""}`}
            placeholder="Enter the OTP sent to your email"
          />
          {errors.otp && <p className="error-message">{errors.otp}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="newPassword" className="form-label">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className={`form-input ${errors.newPassword ? "error" : ""}`}
            placeholder="Enter new password"
          />
          {formData.newPassword && (
            <div className="password-strength">
              <div className="flex-row">
                <div className="strength-bar">
                  <div
                    className={`strength-indicator ${getStrengthClass()}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  ></div>
                </div>
                <span className={`strength-label ${getStrengthLabelClass()}`}>
                  {getStrengthLabel()}
                </span>
              </div>
              <p className="password-hint">
                Use 8+ characters with a mix of letters, numbers & symbols
              </p>
            </div>
          )}
          {errors.newPassword && (
            <p className="error-message">{errors.newPassword}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`form-input ${errors.confirmPassword ? "error" : ""}`}
            placeholder="Confirm new password"
          />
          {errors.confirmPassword && (
            <p className="error-message">{errors.confirmPassword}</p>
          )}
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? (
            <span className="flex-center">
              <svg
                className="spinner"
                width="16"
                height="16"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Resetting...
            </span>
          ) : (
            "Reset Password"
          )}
        </button>

        <a href="/signin" className="signin-link">
          Return to Sign In
        </a>
      </form>
    </div>
  );
};

export default ResetPassword;
