import React from "react";
import { Link } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import { TrendingUp, Target, DollarSign, BarChart } from "lucide-react";

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: "Expense Tracking",
      description: "Track all your expenses with detailed categorization",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Habit Building",
      description: "Build and maintain positive habits with daily tracking",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Progress Analytics",
      description: "Visualize your progress with interactive charts",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: <BarChart className="h-8 w-8" />,
      title: "Insights & Reports",
      description: "Get personalized insights and monthly reports",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <PageLayout>
      <div className="flex-1">
        <section className="bg-linear-to-r from-blue-600 to-indigo-600 text-white py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Take Control of Your Finances & Habits
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              A comprehensive tool to track your expenses, build positive
              habits, and achieve your financial and personal goals.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Free Trial
              </Link>
              <Link
                to="/login"
                className="bg-transparent border-2 border-white hover:bg-white/10 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300"
              >
                Already have an account? Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Everything You Need in One Place
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                >
                  <div
                    className={`${feature.bgColor} ${feature.color} w-16 h-16 rounded-full flex items-center justify-center mb-4`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - FIXED: bg-gradient-to-r */}
        <section className="bg-gray-50 py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Ready to Transform Your Financial Life?
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of users who have already taken control of their
              finances and built lasting habits with our platform.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/register"
                className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-10 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default HomePage;
