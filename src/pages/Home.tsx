// src/pages/Home.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  Target,
  BarChart,
  ArrowRight,
  Shield,
  Zap,
  Users,
  Sparkles,
  CheckCircle,
  Clock,
  Award,
  LineChart,
} from "lucide-react";
import FeatureCard from "../components/ui/FeatureCard";
import Card from "../components/ui/Card";

const HomePage: React.FC = () => {
  const [animatedNumbers, setAnimatedNumbers] = useState({
    users: 0,
    savings: 0,
    habits: 0,
  });

  const stats = [
    { icon: Users, label: "Active Users", value: "10,000+", color: "blue" },
    {
      icon: DollarSign,
      label: "Avg Monthly Savings",
      value: "$245",
      color: "green",
    },
    {
      icon: Target,
      label: "Habits Tracked",
      value: "50,000+",
      color: "purple",
    },
    { icon: Award, label: "Success Rate", value: "94%", color: "orange" },
  ];

  const features = [
    {
      icon: DollarSign,
      title: "Smart Expense Tracking",
      description:
        "Automatically categorize transactions, set budgets, and get real-time spending insights with AI-powered analysis.",
      badge: "Most Popular",
      color: "blue",
      stats: [
        { label: "Categories", value: "25+" },
        { label: "Auto-detect", value: "95% accuracy" },
      ],
      highlights: ["Receipt scanning", "Budget alerts", "Multi-currency"],
      height: "h-auto", // Variable height for masonry
    },
    {
      icon: Target,
      title: "Habit Building System",
      description:
        "Build lasting routines with streak tracking, daily reminders, and motivational rewards. Visualize your progress.",
      badge: "Game-Changer",
      color: "green",
      stats: [
        { label: "Streak days", value: "Unlimited" },
        { label: "Reminders", value: "Customizable" },
      ],
      highlights: ["Habit chains", "Community challenges", "Progress photos"],
      height: "h-auto", // Variable height for masonry
    },
    {
      icon: LineChart,
      title: "Advanced Analytics",
      description:
        "Beautiful interactive charts, predictive insights, and detailed reports to understand your financial patterns.",
      badge: "Pro Feature",
      color: "purple",
      stats: [
        { label: "Chart types", value: "12+" },
        { label: "Forecasts", value: "AI-powered" },
      ],
      highlights: ["Year-over-year", "Spending trends", "Goal tracking"],
      height: "h-auto", // Variable height for masonry
    },
    {
      icon: BarChart,
      title: "Financial Insights",
      description:
        "Get personalized recommendations, identify saving opportunities, and receive monthly financial health reports.",
      badge: "Intelligent",
      color: "indigo",
      stats: [
        { label: "Reports", value: "PDF/Email" },
        { label: "AI Insights", value: "Daily" },
      ],
      highlights: ["Tax planning", "Investment tips", "Debt reduction"],
      height: "h-auto", // Variable height for masonry
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Freelance Designer",
      content:
        "Saved over $3,000 in 6 months! The habit tracker helped me build consistent saving routines.",
      avatarColor: "from-pink-500 to-rose-500",
    },
    {
      name: "Michael Chen",
      role: "Software Engineer",
      content:
        "Finally found an app that makes expense tracking actually enjoyable. The analytics are incredible.",
      avatarColor: "from-blue-500 to-cyan-500",
    },
    {
      name: "Elena Rodriguez",
      role: "Teacher",
      content:
        "Built 5 healthy habits that stuck. The daily reminders and progress visualization kept me motivated.",
      avatarColor: "from-purple-500 to-violet-500",
    },
  ];

  useEffect(() => {
    // Animate numbers
    const animate = (
      start: number,
      end: number,
      duration: number,
      setter: (val: number) => void,
    ) => {
      let startTime: number;
      const step = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        setter(Math.floor(progress * (end - start) + start));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    };

    animate(0, 10000, 2000, (val) =>
      setAnimatedNumbers((prev) => ({ ...prev, users: val })),
    );
    animate(0, 245, 1500, (val) =>
      setAnimatedNumbers((prev) => ({ ...prev, savings: val })),
    );
    animate(0, 50000, 2500, (val) =>
      setAnimatedNumbers((prev) => ({ ...prev, habits: val })),
    );
  }, []);

  return (
    <div className="flex-1 min-h-screen bg-linear-to-b from-gray-50 via-white to-blue-50/30">
      {/* Hero Section with animated background */}
      <section className="relative overflow-hidden bg-linear-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-24 md:py-32 px-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          {/* Animated badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">
              Trusted by 10,000+ users worldwide
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
            Master Your
            <span className="block bg-linear-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
              Money & Habits
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-12 opacity-95 leading-relaxed">
            The all-in-one platform that transforms your financial life while
            building lasting positive habits. Beautiful, powerful, and
            surprisingly simple.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-16">
            <Link
              to="/register"
              className="group relative px-12 py-5 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <span className="relative flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              to="/login"
              className="group px-12 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white font-bold text-lg rounded-2xl transition-all duration-300 hover:border-white/50"
            >
              <span className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Already have an account? Sign In
              </span>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-blue-200">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span>Bank-level security</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>Setup in 2 minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="relative group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-linear-to-br from-white to-blue-50 rounded-2xl shadow-xl transform group-hover:-translate-y-2 transition-all duration-300"></div>
                <div className="relative bg-white p-8 rounded-2xl border border-gray-100 shadow-lg group-hover:shadow-2xl transition-all duration-300">
                  <div
                    className={`p-3 rounded-xl bg-linear-to-br from-${stat.color}-100 to-${stat.color}-50 w-fit mb-6`}
                  >
                    <stat.icon className={`h-8 w-8 text-${stat.color}-600`} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.label === "Active Users" &&
                      `${animatedNumbers.users.toLocaleString()}+`}
                    {stat.label === "Avg Monthly Savings" &&
                      `$${animatedNumbers.savings}`}
                    {stat.label === "Habits Tracked" &&
                      `${animatedNumbers.habits.toLocaleString()}+`}
                    {stat.label === "Success Rate" && stat.value}
                  </div>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with Masonry-style Grid */}
      <section className="py-24 px-4 bg-linear-to-b from-white via-blue-50/30 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-linear-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full font-medium mb-4">
              ✨ Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need,
              <span className="block text-transparent bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text">
                Nothing You Don't
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've carefully designed each feature to work perfectly together,
              creating an experience that's both powerful and delightful to use.
            </p>
          </div>

          {/* Masonry-style Grid */}
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-6 md:gap-8
             *:mb-6 md:*:mb-8
              columns-1 md:columns-2
            "
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="break-inside-avoid transform transition-all duration-500 hover:-translate-y-2"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <FeatureCard
                  featureIcon={feature.icon}
                  featureTitle={feature.title}
                  featureDescription={feature.description}
                  badge={feature.badge}
                  stats={feature.stats}
                  color={feature.color as any}
                  size="lg"
                  className="h-full bg-linear-to-br from-white to-gray-50/50 border border-gray-100/50 shadow-lg hover:shadow-2xl"
                >
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Highlights:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {feature.highlights.map((highlight, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 text-xs font-medium bg-linear-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                </FeatureCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials with Masonry-style Grid */}
      <section className="py-24 px-4 bg-linear-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Loved by Thousands
              <span className="block text-transparent bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text">
                Real Stories, Real Results
              </span>
            </h2>
          </div>

          {/* Masonry-style Grid for Testimonials */}
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              lg:grid-cols-3
              gap-6 md:gap-8
              *:mb-6 md:*:mb-8
              columns-1 md:columns-2 lg:columns-3
            "
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="break-inside-avoid">
                <Card className="h-full bg-linear-to-br from-white to-gray-50/50 border border-gray-100/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="flex items-start space-x-4 mb-6">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-linear-to-br ${testimonial.avatarColor} flex items-center justify-center`}
                    >
                      <span className="text-xl font-bold text-white">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="mt-6 flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-sm font-medium text-gray-600">
                      5.0
                    </span>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative overflow-hidden py-24 px-4">
        <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-indigo-50"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-block mb-8">
            <div className="px-6 py-3 bg-linear-to-r from-blue-500 to-indigo-500 rounded-full text-white font-bold text-lg shadow-lg">
              🚀 Limited Time Offer
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            Start Your Journey
            <span className="block text-transparent bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text">
              Today For Free
            </span>
          </h2>

          <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 mb-10 border border-blue-100/50 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  icon: CheckCircle,
                  text: "No credit card required",
                  color: "text-green-600",
                },
                {
                  icon: Zap,
                  text: "Full access for 30 days",
                  color: "text-yellow-600",
                },
                {
                  icon: Shield,
                  text: "Cancel anytime",
                  color: "text-blue-600",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center gap-3"
                >
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                  <span className="font-medium text-gray-800">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link
                to="/register"
                className="group relative px-16 py-6 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <span className="relative flex items-center justify-center gap-3">
                  Get Started Free
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </span>
              </Link>
              <Link
                to="/login"
                className="group px-12 py-6 bg-white border-2 border-blue-600 hover:border-blue-700 text-blue-600 hover:text-blue-700 font-bold text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Sign In to Existing Account
              </Link>
            </div>
          </div>

          <p className="text-gray-600">
            Join <span className="font-bold text-blue-600">10,000+</span> users
            already transforming their financial lives
          </p>
        </div>
      </section>

      {/* Footer Note */}
      <footer className="py-12 px-4 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p className="mb-4">
            © {new Date().getFullYear()} ExpenseTracker. All rights reserved.
          </p>
          <p className="text-sm opacity-75">
            Beautifully designed to help you live a better financial life. Made
            with ❤️ for people who want more from their money.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
