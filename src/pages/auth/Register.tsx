// pages/auth/Register.tsx
import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import AuthCard from "../../components/ui/AuthCard";
import Card from "../../components/ui/Card";

const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Full name is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  agreeToTerms: Yup.boolean().oneOf(
    [true],
    "You must agree to the terms and conditions",
  ),
});

const Register: React.FC = () => {
  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleSubmit = async (values: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
  }) => {
    try {
      await register({
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      setRegistrationSuccess(true);

      // Navigate after a short delay to show success message
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  const passwordStrength = (password: string) => {
    if (!password)
      return { strength: 0, color: "gray", text: "Enter a password" };

    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;

    let color = "red";
    let text = "Very weak";
    if (strength >= 50) {
      color = "yellow";
      text = "Medium";
    }
    if (strength >= 75) {
      color = "green";
      text = "Strong";
    }
    if (strength === 100) {
      color = "emerald";
      text = "Very strong";
    }

    return { strength, color: `bg-${color}-500`, text };
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Auth Card */}
          <div className="lg:col-span-3">
            <AuthCard
              authType="register"
              className="w-full"
              headerAction={
                <Link
                  to="/auth/login"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  Already have an account? Sign in
                  <ExternalLink className="h-3 w-3" />
                </Link>
              }
            >
              {/* Success Message */}
              {registrationSuccess && (
                <Card
                  variant="default"
                  color="green"
                  className="mb-6 animate-fade-in"
                >
                  <div className="flex items-center p-4">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-green-800">
                        Registration successful!
                      </p>
                      <p className="text-sm text-green-700">
                        Creating your account... Redirecting to dashboard
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Error Message */}
              {error && (
                <Card
                  variant="outline"
                  color="red"
                  className="mb-6 animate-fade-in"
                >
                  <div className="flex items-start p-4">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-red-800">
                        Registration failed
                      </p>
                      <p className="text-sm text-red-700 mt-1">{error}</p>
                      <button
                        onClick={clearError}
                        className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </Card>
              )}

              {isLoading ? (
                <div className="py-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                  <p className="mt-4 text-gray-600 font-medium">
                    Creating your account...
                  </p>
                </div>
              ) : (
                <Formik
                  initialValues={{
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    agreeToTerms: false,
                  }}
                  validationSchema={RegisterSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched, isValid, dirty, values }) => {
                    const strength = passwordStrength(values.password);

                    return (
                      <Form className="space-y-6">
                        {/* Name Field */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <Field
                              name="name"
                              type="text"
                              className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors ${
                                errors.name && touched.name
                                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                              }`}
                              placeholder="John Doe"
                            />
                          </div>
                          {errors.name && touched.name && (
                            <p className="mt-2 text-sm text-red-600">
                              {errors.name}
                            </p>
                          )}
                        </div>

                        {/* Email Field */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <Field
                              name="email"
                              type="email"
                              className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors ${
                                errors.email && touched.email
                                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                              }`}
                              placeholder="you@example.com"
                            />
                          </div>
                          {errors.email && touched.email && (
                            <p className="mt-2 text-sm text-red-600">
                              {errors.email}
                            </p>
                          )}
                        </div>

                        {/* Password Field */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <Field
                              name="password"
                              type={showPassword ? "text" : "password"}
                              className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors ${
                                errors.password && touched.password
                                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                              }`}
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              onClick={() => setShowPassword(!showPassword)}
                              tabIndex={-1}
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                              ) : (
                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                              )}
                            </button>
                          </div>

                          {/* Password Strength Meter */}
                          {values.password && (
                            <div className="mt-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-gray-600">
                                  Password strength:{" "}
                                  <span
                                    className={`text-${strength.text === "Very strong" ? "emerald" : strength.text === "Strong" ? "green" : strength.text === "Medium" ? "yellow" : "red"}-600`}
                                  >
                                    {strength.text}
                                  </span>
                                </span>
                                <span className="text-xs text-gray-500">
                                  {strength.strength}%
                                </span>
                              </div>
                              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${strength.color} transition-all duration-300`}
                                  style={{ width: `${strength.strength}%` }}
                                ></div>
                              </div>
                            </div>
                          )}

                          {errors.password && touched.password && (
                            <p className="mt-2 text-sm text-red-600">
                              {errors.password}
                            </p>
                          )}

                          {/* Password Requirements */}
                          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                            {[
                              {
                                text: "At least 8 characters",
                                test: values.password.length >= 8,
                              },
                              {
                                text: "One uppercase letter",
                                test: /[A-Z]/.test(values.password),
                              },
                              {
                                text: "One lowercase letter",
                                test: /[a-z]/.test(values.password),
                              },
                              {
                                text: "One number",
                                test: /[0-9]/.test(values.password),
                              },
                            ].map((req, index) => (
                              <div key={index} className="flex items-center">
                                {req.test ? (
                                  <CheckCircle className="h-3 w-3 text-green-500 mr-1.5" />
                                ) : (
                                  <div className="h-3 w-3 border border-gray-300 rounded-full mr-1.5"></div>
                                )}
                                <span
                                  className={
                                    req.test
                                      ? "text-green-600"
                                      : "text-gray-500"
                                  }
                                >
                                  {req.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <Field
                              name="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors ${
                                errors.confirmPassword &&
                                touched.confirmPassword
                                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                              }`}
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              tabIndex={-1}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                              ) : (
                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                              )}
                            </button>
                          </div>
                          {errors.confirmPassword &&
                            touched.confirmPassword && (
                              <p className="mt-2 text-sm text-red-600">
                                {errors.confirmPassword}
                              </p>
                            )}
                        </div>

                        {/* Terms and Conditions */}
                        <div>
                          <div className="flex items-start">
                            <Field
                              id="agreeToTerms"
                              name="agreeToTerms"
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                            />
                            <label
                              htmlFor="agreeToTerms"
                              className="ml-2 block text-sm text-gray-700"
                            >
                              I agree to the{" "}
                              <Link
                                to="/terms"
                                className="text-blue-600 hover:text-blue-500 font-medium"
                              >
                                Terms of Service
                              </Link>{" "}
                              and{" "}
                              <Link
                                to="/privacy"
                                className="text-blue-600 hover:text-blue-500 font-medium"
                              >
                                Privacy Policy
                              </Link>
                            </label>
                          </div>
                          {errors.agreeToTerms && touched.agreeToTerms && (
                            <p className="mt-2 text-sm text-red-600">
                              {errors.agreeToTerms}
                            </p>
                          )}
                        </div>

                        {/* Submit Button */}
                        <div>
                          <button
                            type="submit"
                            disabled={!isValid || !dirty}
                            className={`w-full py-3 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                              !isValid || !dirty
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            }`}
                          >
                            Create Your Free Account
                          </button>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
              )}
            </AuthCard>
          </div>

          {/* Right Column - Info Cards */}
          <div className="lg:col-span-2 space-y-6">
            <Card
              title="What You Get"
              icon={CheckCircle}
              color="green"
              variant="default"
            >
              <div className="space-y-4">
                <ul className="space-y-3">
                  {[
                    { text: "30-day free trial", highlight: true },
                    { text: "Unlimited expense tracking" },
                    { text: "Habit streak monitoring" },
                    { text: "Advanced analytics dashboard" },
                    { text: "Export to PDF & Excel" },
                    { text: "Priority email support" },
                  ].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span
                        className={
                          item.highlight
                            ? "font-medium text-green-700"
                            : "text-gray-700"
                        }
                      >
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            <Card title="Start Your Journey" color="blue" variant="default">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      Sign up in 30 seconds
                    </p>
                    <p className="text-sm text-gray-600">
                      No credit card required
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      Set up your profile
                    </p>
                    <p className="text-sm text-gray-600">
                      Add your first expense or habit
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Track & Improve</p>
                    <p className="text-sm text-gray-600">
                      Watch your financial health grow
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Trust & Security" color="indigo" variant="outline">
              <div className="space-y-3">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <p className="font-medium text-indigo-800">
                    Bank-level Security
                  </p>
                  <p className="text-sm text-indigo-600">
                    Your data is encrypted end-to-end
                  </p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <p className="font-medium text-indigo-800">No Hidden Fees</p>
                  <p className="text-sm text-indigo-600">
                    Free forever for basic features
                  </p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <p className="font-medium text-indigo-800">Cancel Anytime</p>
                  <p className="text-sm text-indigo-600">No questions asked</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
