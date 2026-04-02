// pages/auth/ForgotPassword.tsx
import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import AuthCard from "../../components/ui/AuthCard";
import Card from "../../components/ui/Card";
import { authService } from "../../services/authService";

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
});

const ForgotPassword: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const handleSubmit = async (values: { email: string }) => {
    setIsLoading(true);
    setError(null);
    setResetToken(null);

    try {
      const result = await authService.forgotPassword(values.email);
      setResetToken(result.resetToken);
      setIsSubmitted(true);
    } catch {
      setError("Failed to send reset instructions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-md">
        <AuthCard authType="forgot-password" className="w-full">
          {/* Back to Login */}
          <div className="mb-6">
            <Link
              to="/auth/login"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to login
            </Link>
          </div>

          {/* Success Message */}
          {isSubmitted && (
            <Card
              variant="default"
              color="green"
              className="mb-6 animate-fade-in"
            >
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <p className="font-medium text-green-800">Check your email</p>
                </div>
                <p className="text-sm text-green-700">
                  We've sent password reset instructions to your email address.
                  Please check your inbox and follow the link to reset your
                  password.
                </p>
                {resetToken && (
                  <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3">
                    <p className="text-xs font-medium text-green-700 mb-2">
                      Demo reset link
                    </p>
                    <Link
                      to={`/auth/reset-password?token=${encodeURIComponent(
                        resetToken,
                      )}`}
                      className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                    >
                      Continue to reset password
                    </Link>
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-green-200">
                  <p className="text-xs text-green-600">
                    Didn't receive the email?{" "}
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="font-medium hover:text-green-800"
                    >
                      Try again
                    </button>
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
                    Something went wrong
                  </p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </Card>
          )}

          {!isSubmitted && (
            <>
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-800">
                  Enter the email address associated with your account, and
                  we'll send you a link to reset your password.
                </p>
              </div>

              {isLoading ? (
                <div className="py-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                  <p className="mt-4 text-gray-600 font-medium">
                    Sending reset instructions...
                  </p>
                </div>
              ) : (
                <Formik
                  initialValues={{ email: "" }}
                  validationSchema={ForgotPasswordSchema}
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
                          Send Reset Instructions
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              )}
            </>
          )}
        </AuthCard>
      </div>
    </div>
  );
};

export default ForgotPassword;
