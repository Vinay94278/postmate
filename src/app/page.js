"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaLinkedin, FaTwitter, FaArrowRight, FaRocket, FaMagic, FaChartLine } from "react-icons/fa";

export default function LandingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if the user is already authenticated and redirect accordingly
    const user = localStorage.getItem("user");
    if (user) {
      router.push("/profile");
    }

    // Simulate loading for smoother animations
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [router]);

  // Sample post previews
  const samplePosts = [
    {
      platform: "linkedin",
      content: "Excited to share that our team has been leveraging AI to streamline our content creation process, saving us 15+ hours per week! The quality has improved and engagement is up 37%. Check out Postmate if you're looking to level up your social media game. #AITools #ContentCreation #ProductivityHack",
      stats: {
        likes: 234,
        comments: 42,
        shares: 18
      }
    },
    {
      platform: "twitter",
      content: "Finally found an AI tool that actually understands my brand voice! @PostmateAI helped me schedule an entire month of posts in under an hour. And it's completely FREE! 🤯",
      stats: {
        likes: 189,
        retweets: 56,
        views: "12.4K"
      }
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-hidden">
      {/* Hero Section */}
      <header className="relative pt-20 pb-32 px-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 right-20 w-64 h-64 rounded-full bg-blue-400 opacity-5"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 20, 0],
              y: [0, -30, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 15,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-40 left-10 w-96 h-96 rounded-full bg-indigo-500 opacity-5"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -20, 0],
              y: [0, 40, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 18,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Text Content */}
            <motion.div
              className="flex-1 text-center lg:text-left"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="inline-block px-4 py-1 mb-6 bg-blue-600 text-white rounded-full text-sm font-medium"
              >
                🚀 100% Free AI-powered social media assistant
              </motion.div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight text-gray-900">
                Create <span className="text-blue-600">engaging</span> posts in seconds
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
                Postmate is a completely <span className="font-bold">free</span> agentic AI tool that helps you build your LinkedIn and X daily content to engage your audience. No paywalls, no limits.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <motion.button
                  className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link href="/login" className="flex items-center">
                    Get Started Free
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.button>
                <motion.button
                  className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-full font-bold text-lg hover:bg-blue-50 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link href="https://www.linkedin.com/in/vinay-adatiya">
                    Watch Demo
                  </Link>
                </motion.button>
              </div>
              <div className="mt-8 flex items-center justify-center lg:justify-start gap-6">
                <div className="flex -space-x-2">
                  {["/user1.jpg", "/user2.jpg", "/user3.jpg", "/user4.jpg"].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="User Avatar"
                      className="w-13 h-13 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 pl-15">
                  Trusted by AI enthusiasts, creators, and professionals worldwide. Be among the first to revolutionize content creation!
                </p>
              </div>
            </motion.div>

            {/* Preview Cards */}
            <motion.div
              className="flex-1 flex flex-col items-center md:items-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="relative h-auto w-full flex flex-wrap gap-4 items-center justify-center md:justify-start">
                {/* LinkedIn Post Preview */}
                <motion.div
                  className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 
                 sm:relative md:relative lg:absolute lg:-left-4 lg:-top-4"
                  initial={{ rotate: -5 }}
                  whileHover={{ rotate: 0, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center gap-3">
                    <FaLinkedin className="text-white text-2xl" />
                    <span className="text-white font-bold">LinkedIn Post</span>
                  </div>
                  <div className="p-5 text-gray-800">
                    <p className="text-sm mb-4">{samplePosts[0].content}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>❤️ {samplePosts[0].stats.likes} Likes</span>
                      <span>💬 {samplePosts[0].stats.comments} Comments</span>
                      <span>🔄 {samplePosts[0].stats.shares} Shares</span>
                    </div>
                  </div>
                </motion.div>

                {/* Twitter Post Preview */}
                <motion.div
                  className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 
                 sm:relative md:relative lg:absolute lg:-right-4 lg:top-24"
                  initial={{ rotate: 5 }}
                  whileHover={{ rotate: 0, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  <div className="bg-black p-4 flex items-center gap-3">
                    <FaTwitter className="text-white text-2xl" />
                    <span className="text-white font-bold">X Post</span>
                  </div>
                  <div className="p-5 text-gray-800">
                    <p className="text-sm mb-4">{samplePosts[1].content}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>❤️ {samplePosts[1].stats.likes}</span>
                      <span>🔄 {samplePosts[1].stats.retweets}</span>
                      <span>👁️ {samplePosts[1].stats.views} Views</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Partner Logos */}
      <section className="py-12 border-t border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <p className="text-gray-600 font-medium">Powered by cutting-edge AI technology from</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12">
            <motion.div
              className="flex flex-col items-center"
              whileHover={{ scale: 1.05 }}
            >
              <img src="/GroqLogoSVG.svg" alt="Groq Logo" width={150} height={40} className="h-8 object-contain" />
              <span className="text-sm text-gray-500 mt-2">Groq</span>
            </motion.div>
            <motion.div
              className="flex flex-col items-center"
              whileHover={{ scale: 1.05 }}
            >
              <img src="/AgnoLogoSVG.svg" alt="Agno AI Logo" width={150} height={40} className="h-8 object-contain" />
              <span className="text-sm text-gray-500 mt-2">Agno AI</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-blue-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Why choose <span className="text-blue-600">Postmate</span>?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Generate platform-optimized content that engages your audience and drives real results - completely free.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaMagic className="text-3xl text-blue-600" />,
                title: "AI-Powered Content",
                description: "Generate engaging posts tailored to your brand voice and target audience in seconds."
              },
              {
                icon: <FaRocket className="text-3xl text-blue-600" />,
                title: "Multiple Platforms",
                description: "Optimize content for LinkedIn and X with platform-specific formatting and style."
              },
              {
                icon: <FaChartLine className="text-3xl text-blue-600" />,
                title: "Performance Analytics",
                description: "Track engagement and improve your content strategy with actionable insights."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div
          className="max-w-5xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-12 text-center shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to transform your social media presence?</h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are saving time and increasing engagement with Postmate - absolutely free.
          </p>
          <motion.button
            className="px-8 py-4 bg-white text-blue-700 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/signup" className="flex items-center justify-center gap-2">
              Get Started Free
              <FaArrowRight />
            </Link>
          </motion.button>
          <p className="mt-4 text-sm text-white opacity-75">No credit card required. No paid plans. Just pure AI-powered productivity.</p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="mb-6 md:mb-0">
              <p className="text-2xl font-bold text-gray-900">Post<span className="text-blue-600">mate</span></p>
              <p className="text-gray-600 text-sm">© 2025 Postmate. All rights reserved.</p>
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-gray-600 hover:text-blue-600">Privacy Policy</Link>
              <Link href="/terms" className="text-sm text-gray-600 hover:text-blue-600">Terms of Service</Link>
              <Link href="/contact" className="text-sm text-gray-600 hover:text-blue-600">Contact</Link>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 text-center text-gray-400 text-sm italic mt-8">
            <p>"Built with 10% coding, 90% Ctrl+C & Ctrl+V, and 100% late-night debugging."</p>
            <p className="mt-2 text-xs text-gray-500">Directed by Me(<a href="https://www.linkedin.com/in/vinay-adatiya">@Vinay_Adatiya</a>) & Implemented By Three Buddies ChatGPT , Claude and DeepSeek</p>
            <p className="mt-2 text-xs text-gray-500">🔗 <a href="https://github.com/Vinay94278" className="text-blue-400 hover:underline">GitHub</a> | <a href="https://www.linkedin.com/in/vinay-adatiya" className="text-blue-400 hover:underline">LinkedIn</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}