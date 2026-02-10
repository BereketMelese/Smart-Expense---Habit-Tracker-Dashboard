// pages/auth/Login.tsx
import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import AuthCard from "../../components/ui/AuthCard";
import Card from "../../components/ui/Card";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  rememberMe: Yup.boolean(),
});

interface LocationState {
  from?: {
    pathname: string;
  };
}

const Login: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const from =
    (location.state as LocationState)?.from?.pathname || "/dashboard";

  const handleSubmit = async (values: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => {
    try {
      await login({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      });

      setLoginSuccess(true);

      // Navigate after a short delay to show success message
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1500);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleDemoLogin = () => {
    handleSubmit({
      email: "demo@example.com",
      password: "password123",
      rememberMe: false,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Auth Card */}
          <div className="lg:col-span-3">
            <AuthCard
              authType="login"
              className="w-full"
              headerAction={
                <Link
                  to="/auth/register"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  New here? Sign up
                  <ExternalLink className="h-3 w-3" />
                </Link>
              }
            >
              {/* Demo Credentials */}
              <Card variant="outline" color="blue" className="mb-6">
                <div className="p-4">
                  <p className="text-sm font-medium text-blue-800 mb-3">
                    Want to test the app? Use demo credentials:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center bg-blue-50/50 p-2 rounded">
                      <span className="text-blue-700 font-medium">Email:</span>
                      <code className="text-blue-800 bg-blue-100 px-2 py-1 rounded">
                        demo@example.com
                      </code>
                    </div>
                    <div className="flex justify-between items-center bg-blue-50/50 p-2 rounded">
                      <span className="text-blue-700 font-medium">
                        Password:
                      </span>
                      <code className="text-blue-800 bg-blue-100 px-2 py-1 rounded">
                        password123
                      </code>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    className="mt-3 w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Click to auto-fill demo credentials
                  </button>
                </div>
              </Card>

              {/* Success Message */}
              {loginSuccess && (
                <Card
                  variant="default"
                  color="green"
                  className="mb-6 animate-fade-in"
                >
                  <div className="flex items-center p-4">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-green-800">
                        Login successful!
                      </p>
                      <p className="text-sm text-green-700">
                        Redirecting you to your dashboard...
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
                      <p className="font-medium text-red-800">Login failed</p>
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
                    Signing you in...
                  </p>
                </div>
              ) : (
                <Formik
                  initialValues={{ email: "", password: "", rememberMe: false }}
                  validationSchema={LoginSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched, isValid, dirty }) => (
                    <Form className="space-y-6">
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
                        {errors.password && touched.password && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.password}
                          </p>
                        )}
                      </div>

                      {/* Remember Me & Forgot Password */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Field
                            id="rememberMe"
                            name="rememberMe"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="rememberMe"
                            className="ml-2 block text-sm text-gray-700"
                          >
                            Remember me on this device
                          </label>
                        </div>

                        <Link
                          to="/auth/forgot-password"
                          className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                        >
                          Forgot password?
                        </Link>
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
                          Sign In to Your Account
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              )}

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center py-3 px-4 border border-gray-800 rounded-lg shadow-sm bg-gray-900 hover:bg-black transition-all duration-200"
                >
                  <svg
                    className="w-5 h-5 mr-2 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-white">GitHub</span>
                </button>
              </div>
            </AuthCard>
          </div>

          {/* Right Column - Info Cards */}
          <div className="lg:col-span-2 space-y-6">
            <Card
              title="Secure Login"
              icon={Lock}
              color="green"
              variant="default"
            >
              <div className="space-y-4">
                <p className="text-gray-600">
                  Your security is our top priority. We use bank-level
                  encryption to protect your data.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>256-bit SSL encryption</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Two-factor authentication available</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Regular security audits</span>
                  </li>
                </ul>
              </div>
            </Card>

            <Card
              title="Why Sign In?"
              icon={CheckCircle}
              color="blue"
              variant="default"
            >
              <div className="space-y-3">
                {[
                  "Access your personalized dashboard",
                  "Track expenses across all devices",
                  "Sync your habit progress",
                  "Get personalized insights",
                  "Export your data anytime",
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Need Help?" color="indigo" variant="outline">
              <div className="space-y-3">
                <Link
                  to="/help"
                  className="block p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                >
                  <p className="font-medium text-indigo-800">
                    Visit Help Center
                  </p>
                  <p className="text-sm text-indigo-600">
                    Find answers to common questions
                  </p>
                </Link>
                <Link
                  to="/contact"
                  className="block p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                >
                  <p className="font-medium text-indigo-800">Contact Support</p>
                  <p className="text-sm text-indigo-600">
                    Get help from our team
                  </p>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
