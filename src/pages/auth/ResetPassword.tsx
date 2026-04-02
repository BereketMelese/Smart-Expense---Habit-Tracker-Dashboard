import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, AlertCircle, CheckCircle, Lock } from "lucide-react";
import AuthCard from "../../components/ui/AuthCard";
import Card from "../../components/ui/Card";
import { authService } from "../../services/authService";

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    if (!resetToken) {
      setError("A reset token is required to change your password.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authService.resetPassword({
        resetToken,
        password: values.password,
      });

      setIsSuccess(true);
      window.setTimeout(() => {
        navigate("/auth/login", { replace: true });
      }, 1800);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to reset your password.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-md">
        <AuthCard authType="reset-password" className="w-full">
          <div className="mb-6">
            <Link
              to="/auth/forgot-password"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to reset request
            </Link>
          </div>

          {isSuccess && (
            <Card
              variant="default"
              color="green"
              className="mb-6 animate-fade-in"
            >
              <div className="flex items-center p-4">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-green-800">Password updated</p>
                  <p className="text-sm text-green-700">
                    Redirecting you to the login screen...
                  </p>
                </div>
              </div>
            </Card>
          )}

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
                    Could not reset password
                  </p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </Card>
          )}

          {!resetToken && !isSuccess && (
            <Card variant="outline" color="red" className="mb-6">
              <div className="p-4 text-sm text-red-700">
                This reset link is missing its token. Request a new one from the
                forgot password screen.
              </div>
            </Card>
          )}

          {!isSuccess && resetToken && (
            <>
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-800">
                  Choose a new password for your account.
                </p>
              </div>

              {isLoading ? (
                <div className="py-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                  <p className="mt-4 text-gray-600 font-medium">
                    Updating password...
                  </p>
                </div>
              ) : (
                <Formik
                  initialValues={{ password: "", confirmPassword: "" }}
                  validationSchema={ResetPasswordSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched, isValid, dirty }) => (
                    <Form className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <Field
                            name="password"
                            type="password"
                            className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors ${
                              errors.password && touched.password
                                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            }`}
                            placeholder="••••••••"
                          />
                        </div>
                        {errors.password && touched.password && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.password}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <Field
                            name="confirmPassword"
                            type="password"
                            className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors ${
                              errors.confirmPassword && touched.confirmPassword
                                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            }`}
                            placeholder="••••••••"
                          />
                        </div>
                        {errors.confirmPassword && touched.confirmPassword && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>

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
                          Update Password
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

export default ResetPassword;
