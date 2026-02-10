import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFoundPage: React.FC = () => {
  const popularPages = [
    { path: "/", label: "Home", description: "Main landing page" },
    {
      path: "/dashboard",
      label: "Dashboard",
      description: "Your personal dashboard",
    },
    {
      path: "/expenses",
      label: "Expense Tracker",
      description: "Track your expenses",
    },
    {
      path: "/habits",
      label: "Habit Tracker",
      description: "Build and track habits",
    },
    { path: "/login", label: "Login", description: "Sign in to your account" },
    {
      path: "/register",
      label: "Register",
      description: "Create a new account",
    },
  ];

  return (
    <div className="flex-1 flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-50 p-10 mb-12">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          {/* Animated 404 */}
          <div className="relative flex justify-center mb-8">
            <div className="text-9xl font-bold text-gray-900 opacity-10 animate-pulse">
              404
            </div>
          </div>
          {/* Main Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            The page you're looking for doesn't exist or has been moved. Don't
            worry, let's get you back on track!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column: Help & Actions */}
          <div className="space-y-6">
            {/* Search Box */}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  to="/"
                  className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center">
                    <Home className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="font-medium text-gray-800">
                      Go to Homepage
                    </span>
                  </div>
                  <ArrowLeft className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transform rotate-180" />
                </Link>

                <button
                  onClick={() => window.history.back()}
                  className="flex items-center justify-between w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center">
                    <ArrowLeft className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="font-medium text-gray-800">Go Back</span>
                  </div>
                  <span className="text-sm text-gray-500">Previous page</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Popular Pages */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Popular Pages You Might Like
            </h3>
            <div className="space-y-4">
              {popularPages.map((page, index) => (
                <Link
                  key={index}
                  to={page.path}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className="flex items-start">
                    <div className="shrink-0">
                      <div className="w-10 h-10 bg-linear-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-colors">
                        <div className="w-6 h-6 bg-linear-to-r from-blue-600 to-indigo-600 rounded flex items-center justify-center">
                          <span className="text-xs font-bold text-white">
                            {page.label.charAt(0)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-gray-800 group-hover:text-blue-600">
                        {page.label}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {page.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Still having trouble? We're here to help!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:support@expensetracker.com"
              className="px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Contact Support
            </a>
            <a
              href="/help"
              className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300"
            >
              Visit Help Center
            </a>
          </div>
        </div>

        {/* Fun Stats */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              While you're here, did you know?
            </p>
            <p className="text-lg font-semibold text-gray-800 mt-2">
              Our users save an average of{" "}
              <span className="text-green-600">$245/month</span> by tracking
              their expenses!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
