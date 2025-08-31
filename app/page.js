"use client"

import React, { useState, useEffect } from 'react';
import { ArrowRight, BarChart3, Target, Users, Zap, CheckCircle, TrendingUp, Eye, UserCheck, Clock, Star, ChevronRight, Play, X, MapPin, Briefcase, GraduationCap, TrendingUp as Growth } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Career4MeEmployerLanding() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);

  useEffect(() => {
    setIsVisible(true);
    
    // Only run the interval if no popup is open
    if (!selectedStage) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % 3);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedStage]); // Add selectedStage as dependency

  const careerStages = [
    {
      name: "Pathfinder",
      description: "Early-career professionals seeking direction",
      icon: "🧭",
      color: "from-emerald-400 to-teal-500",
      detailedInfo: {
        overview: "Pathfinders are early-career professionals (0-3 years experience) who are eager to learn, adapt, and find their professional direction. They bring fresh perspectives, enthusiasm, and a willingness to grow.",
        characteristics: [
          "Recent graduates or entry-level professionals",
          "High motivation and eagerness to learn",
          "Looking for mentorship and career guidance",
          "Flexible and adaptable to new challenges",
          "Strong foundational skills with room to specialize"
        ],
        idealRoles: [
          "Junior Developer/Analyst positions",
          "Associate roles across various departments",
          "Trainee programs and rotational positions",
          "Entry-level sales and marketing roles",
          "Research assistant positions"
        ],
        benefits: [
          "Cost-effective hiring with high growth potential",
          "Fresh ideas and innovative thinking",
          "Strong digital native skills",
          "Long-term loyalty when properly developed",
          "Enthusiasm for company culture adoption"
        ],
        hiringTips: [
          "Focus on potential rather than extensive experience",
          "Emphasize learning opportunities in job descriptions",
          "Highlight mentorship and career development programs",
          "Look for academic achievements and personal projects",
          "Consider cultural fit and growth mindset"
        ]
      }
    },
    {
      name: "Trailblazer", 
      description: "Mid-career experts ready to learn and grow",
      icon: "🚀",
      color: "from-purple-400 to-pink-500",
      detailedInfo: {
        overview: "Trailblazers are mid-career professionals (4-10 years experience) who have established expertise but are ready to take on new challenges, lead initiatives, and drive innovation within organizations.",
        characteristics: [
          "Proven track record in their field",
          "Strong technical and leadership skills",
          "Ready to take on more responsibility",
          "Excellent problem-solving abilities",
          "Balance of experience and growth mindset"
        ],
        idealRoles: [
          "Senior developer and technical lead positions",
          "Project managers and team leads",
          "Subject matter expert roles",
          "Business development managers",
          "Operations and strategy roles"
        ],
        benefits: [
          "Immediate impact with proven skills",
          "Leadership potential and mentoring abilities",
          "Industry knowledge and best practices",
          "Network of professional connections",
          "Balance of stability and innovation"
        ],
        hiringTips: [
          "Highlight advancement opportunities and challenging projects",
          "Emphasize leadership development programs",
          "Show clear career progression paths",
          "Focus on impact and meaningful work",
          "Offer competitive compensation and benefits"
        ]
      }
    },
    {
      name: "Horizon Changer",
      description: "Professionals ready to enter new fields or roles",
      icon: "🌅",
      color: "from-orange-400 to-red-500",
      detailedInfo: {
        overview: "Horizon Changers are experienced professionals seeking new directions, whether switching industries, functions, or taking on transformational roles. They bring diverse perspectives and transferable skills.",
        characteristics: [
          "Extensive experience in previous roles/industries",
          "Strong transferable skills and adaptability",
          "Motivated by new challenges and growth",
          "Mature decision-making and strategic thinking",
          "Diverse professional network and perspectives"
        ],
        idealRoles: [
          "Career transition and cross-functional roles",
          "Consultant and advisory positions",
          "Change management and transformation roles",
          "Executive and C-suite positions",
          "Entrepreneurial and startup opportunities"
        ],
        benefits: [
          "Rich experience from multiple industries/functions",
          "Proven ability to adapt and learn quickly",
          "Strategic thinking and mature judgment",
          "Extensive professional networks",
          "Fresh perspectives on industry challenges"
        ],
        hiringTips: [
          "Focus on transferable skills and adaptability",
          "Highlight the opportunity for meaningful change",
          "Emphasize the value of diverse experience",
          "Show openness to non-traditional backgrounds",
          "Offer flexible onboarding and integration support"
        ]
      }
    }
  ];

  const features = [
    {
      icon: Target,
      title: "Career Stage Targeting",
      description: "Reach candidates at exactly the right career level with precision targeting",
      benefit: "3x higher match quality"
    },
    {
      icon: Zap,
      title: "Smart Job Distribution", 
      description: "Intelligent job matching automatically connects your jobs to relevant candidates",
      benefit: "50% faster hiring"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track performance, engagement metrics, and ROI in real-time",
      benefit: "Complete visibility"
    },
    {
      icon: UserCheck,
      title: "Click-to-Apply Tracking",
      description: "Monitor application conversions and optimize your job postings",
      benefit: "Higher conversion rates"
    }
  ];

  const howItWorksSteps = [
    {
      title: "Create Your Job",
      description: "Post detailed job requirements with our intuitive builder",
      icon: "📝"
    },
    {
      title: "Intelligent Matching",
      description: "Our platform smartly distributes to relevant candidates",
      icon: "🤖"
    },
    {
      title: "Track Results",
      description: "Monitor applications and engagement in real-time",
      icon: "📊"
    }
  ];

  const CareerStagePopup = ({ stage, onClose }) => {
    if (!stage) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative animate-in fade-in duration-300">
          {/* Header */}
          <div className={`bg-gradient-to-r ${stage.color} p-8 text-white relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-6xl">{stage.icon}</div>
              <div>
                <h2 className="text-4xl font-bold">{stage.name}</h2>
                <p className="text-xl opacity-90">{stage.description}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Overview */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Eye className="w-6 h-6 mr-3 text-blue-500" />
                Overview
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">{stage.detailedInfo.overview}</p>
            </div>

            {/* Characteristics */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Users className="w-6 h-6 mr-3 text-green-500" />
                Key Characteristics
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {stage.detailedInfo.characteristics.map((char, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{char}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ideal Roles */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Briefcase className="w-6 h-6 mr-3 text-purple-500" />
                Ideal Roles
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {stage.detailedInfo.idealRoles.map((role, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <MapPin className="w-4 h-4 text-purple-500 flex-shrink-0" />
                    <span className="text-gray-700">{role}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Growth className="w-6 h-6 mr-3 text-orange-500" />
                Benefits of Hiring
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {stage.detailedInfo.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                    <Star className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hiring Tips */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <GraduationCap className="w-6 h-6 mr-3 text-blue-500" />
                Hiring Tips
              </h3>
              <div className="space-y-3">
                {stage.detailedInfo.hiringTips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-[#5badec]/10 to-purple-500/10 rounded-2xl p-6 text-center">
              <h4 className="text-xl font-bold text-gray-800 mb-3">Ready to Target {stage.name}s?</h4>
              <p className="text-gray-600 mb-4">Start posting jobs specifically designed for {stage.name} candidates</p>
              <Link href="/signup">
                <button className="px-6 py-3 bg-gradient-to-r from-[#5badec] to-[#4a9ad4] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                  Post a Job for {stage.name}s
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Prevent background scroll when popup is open
  useEffect(() => {
    if (selectedStage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedStage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br  rounded-xl flex items-center justify-center shadow-lg">
               <Image 
                src="/icons/logo.png" 
                alt="Career4Me Logo"
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#5badec] to-[#4a9ad4] bg-clip-text text-transparent">
              Career4Me Employer
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href={"/signin"} className="text-gray-700 hover:text-[#5badec] transition-colors">
            <button className="px-6 py-2 text-[#5badec] font-medium hover:bg-[#5badec]/10 rounded-lg transition-all duration-300">
              Sign In
            </button>
            </Link>
            <Link href={"/signup"} className="text-white hover:text-[#4a9ad4] transition-colors">
            <button className="px-6 py-2 bg-gradient-to-r from-[#5badec] to-[#4a9ad4] text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
              Get Started
            </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-r from-[#5badec]/5 to-purple-500/5"></div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#5badec]/10 to-purple-500/10 rounded-full border border-[#5badec]/20 mb-8">
              <Star className="w-4 h-4 text-[#5badec] mr-2" />
              <span className="text-sm font-medium text-gray-700">Career Stage-Based Recruiting Platform</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              Hire at Every
              <span className="block bg-gradient-to-r from-[#5badec] via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Career Stage
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
              Connect with talents through our revolutionary career stage targeting system. Find the perfect match for every role.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
              <Link href={"/signup"} className="text-white hover:text-[#4a9ad4] transition-colors">
              <button className="group px-8 py-4 bg-gradient-to-r from-[#5badec] to-[#4a9ad4] text-white font-semibold rounded-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 flex items-center">
                Start Hiring Today
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              </Link>
            </div>
          </div>

          {/* Career Stages Showcase */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {careerStages.map((stage, index) => (
              <div key={stage.name} 
                   className={`group p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                   style={{ transitionDelay: `${index * 200}ms` }}
                   onClick={() => setSelectedStage(stage)}>
                <div className={`w-16 h-16 bg-gradient-to-br ${stage.color} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {stage.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{stage.name}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{stage.description}</p>
                <div className="flex items-center text-[#5badec] font-medium group-hover:translate-x-1 transition-transform duration-300">
                  <span>Learn More</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              Powerful Features for
              <span className="text-[#5badec]"> Smart Hiring</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines advanced targeting with intelligent analytics to revolutionize how you find and hire talent.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={feature.title}
                   className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-gray-100"
                   onMouseEnter={() => setHoveredFeature(index)}
                   onMouseLeave={() => setHoveredFeature(null)}>
                <div className={`w-16 h-16 bg-gradient-to-br from-[#5badec] to-[#4a9ad4] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 ${hoveredFeature === index ? 'shadow-lg' : ''}`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                <div className="flex items-center text-[#5badec] font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {feature.benefit}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-r from-[#5badec]/5 to-purple-500/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes with our streamlined process designed for efficiency and results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {howItWorksSteps.map((step, index) => (
              <div key={step.title} className="relative">
                <div className={`text-center p-8 bg-white rounded-2xl shadow-lg transform transition-all duration-500 hover:-translate-y-2 ${activeStep === index ? 'ring-4 ring-[#5badec]/30 shadow-2xl' : ''}`}>
                  <div className={`w-20 h-20 bg-gradient-to-br from-[#5badec] to-[#4a9ad4] rounded-full flex items-center justify-center text-3xl mx-auto mb-6 transition-all duration-300 ${activeStep === index ? 'scale-110 shadow-lg' : ''}`}>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-full w-8 h-0.5 bg-gradient-to-r from-[#5badec] to-transparent transform translate-x-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#5badec] to-[#4a9ad4] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-xl text-blue-100 mb-12 leading-relaxed">
            Join the future of recruitment with career stage-based targeting. Start connecting with the right candidates today.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href={"/signup"} className="text-white hover:text-[#4a9ad4] transition-colors">
            <button className="group px-10 py-4 bg-white text-[#5badec] font-bold rounded-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 flex items-center">
              Get Started Now
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            </Link>
            <Link href={"/signin"} className="text-white hover:text-[#4a9ad4] transition-colors">
            <button className="px-10 py-4 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-300">
              Sign In
            </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br  rounded-xl flex items-center justify-center">
                 <Image 
                src="/icons/logo.png" 
                alt="Career4Me Logo"
                width={24}
                height={24}
                className="object-contain"
              />
              </div>
              <span className="text-2xl font-bold">Career4Me Employer</span>
            </div>
            
            <div className="flex items-center space-x-8">
              <a href="#" className="text-gray-300 hover:text-[#5badec] transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2025 Career4Me. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Career Stage Popup */}
      {selectedStage && (
        <CareerStagePopup 
          stage={selectedStage} 
          onClose={() => setSelectedStage(null)} 
        />
      )}
    </div>
  );
}