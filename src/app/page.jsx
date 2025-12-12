"use client";

import React, { useEffect, useState } from 'react';
import { Button } from 'flowbite-react';
import { ArrowRight, BookOpen, Calendar, Lightbulb } from 'lucide-react';
import './styles/welcome.css'

const Welcome = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [buttonHover, setButtonHover] = useState(false);

  useEffect(() => {
    // Fade in effect
    setIsVisible(true);
  }, []);

  const handleDashboardRedirect = () => {
    // Button click effect
    const button = document.querySelector('.dashboard-btn');
    if (button) {
      button.classList.add('scale-95');
      setTimeout(() => button.classList.remove('scale-95'), 150);
    }
    
    // Redirect (implement your logic here)
    setTimeout(() => {
      window.location.href = '/login';
      // Or with react-router: navigate('/dashboard');
    }, 300);
  };

  const handleDemoClick = () => {
    // Visual feedback for demo button
    const demoBtn = document.querySelector('.demo-btn');
    if (demoBtn) {
      demoBtn.classList.add('ring-2', 'ring-blue-200', 'dark:ring-blue-800');
      setTimeout(() => demoBtn.classList.remove('ring-2', 'ring-blue-200', 'dark:ring-blue-800'), 300);
    }
    alert('Demo functionality coming soon');
  };

  // Background particles
  const BackgroundParticles = () => (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-900/20 dark:to-purple-900/20"
          style={{
            width: Math.random() * 80 + 30,
            height: Math.random() * 80 + 30,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 20 + 10}s infinite ease-in-out`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}
    </div>
  );

  // Features section
  const Features = () => {
    const features = [
      {
        icon: BookOpen,
        title: "Smart Notes",
        description: "Organize by categories and tags",
        color: "blue"
      },
      {
        icon: Calendar,
        title: "Date Management",
        description: "Important reminders",
        color: "purple"
      },
      {
        icon: Lightbulb,
        title: "Knowledge",
        description: "All your knowledge in one place",
        color: "green"
      }
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {features.map((feature, index) => (
          <div 
            key={feature.title}
            className={`flex flex-col items-center lg:items-start p-4 rounded-lg transition-all duration-500 delay-${300 + index * 100} hover:scale-105 hover:shadow-lg hover:bg-white/50 dark:hover:bg-gray-800/50 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
            style={{ transitionDelay: `${300 + index * 100}ms` }}
          >
            <div className={`p-2 rounded-lg bg-${feature.color}-50 dark:bg-${feature.color}-900/30 mb-2 group-hover:scale-110 transition-transform duration-300`}>
              <feature.icon className={`w-8 h-8 text-${feature.color}-600 dark:text-${feature.color}-400 group-hover:scale-110 transition-transform duration-300`} />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>
    );
  };

  // CTA Buttons
  const CTAButtons = () => (
    <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
      <Button 
        onClick={handleDashboardRedirect}
        onMouseEnter={() => setButtonHover(true)}
        onMouseLeave={() => setButtonHover(false)}
        size="xl"
        gradientduotone="purpleToBlue"
        className="dashboard-btn px-8 py-3 text-lg hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        <span className="flex items-center gap-2">
          Go to Dashboard
          <ArrowRight className={`ml-2 w-5 h-5 transition-transform duration-300 ${buttonHover ? 'translate-x-1' : ''}`} />
        </span>
      </Button>
      
      <Button 
        onClick={handleDemoClick}
        size="xl"
        color="light"
        className="demo-btn px-8 py-3 text-lg hover:shadow-lg transition-all duration-300"
      >
        View Demo
      </Button>
    </div>
  );

  // Dashboard Mockup
  const DashboardMockup = () => (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300 group">
      <div className="space-y-4">
        {/* Mockup header */}
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-lg animate-pulse-slow">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg animate-spin-slow"></div>
          <div>
            <div className="h-3 w-32 bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-600 dark:to-purple-600 rounded"></div>
            <div className="h-2 w-24 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 rounded mt-1"></div>
          </div>
        </div>
        
        {/* Notes preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-blue-200 dark:border-blue-800 rounded-lg hover:border-blue-400 dark:hover:border-blue-600 hover:scale-105 transition-all duration-300 cursor-pointer group/note">
            <div className="h-3 w-3/4 bg-gradient-to-r from-blue-300 to-blue-400 dark:from-blue-700 dark:to-blue-800 rounded mb-2 group-hover/note:animate-pulse"></div>
            <div className="h-2 w-full bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-950 rounded mb-1"></div>
            <div className="h-2 w-2/3 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-950 rounded"></div>
          </div>
          
          <div className="p-4 border border-purple-200 dark:border-purple-800 rounded-lg hover:border-purple-400 dark:hover:border-purple-600 hover:scale-105 transition-all duration-300 cursor-pointer group/note">
            <div className="h-3 w-3/4 bg-gradient-to-r from-purple-300 to-purple-400 dark:from-purple-700 dark:to-purple-800 rounded mb-2 group-hover/note:animate-pulse"></div>
            <div className="h-2 w-full bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-950 rounded mb-1"></div>
            <div className="h-2 w-2/3 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-950 rounded"></div>
          </div>
        </div>
        
        {/* Calendar preview */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-center mb-4">
            <div className="h-4 w-20 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 rounded animate-pulse"></div>
            <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full hover:rotate-180 transition-transform duration-500 cursor-pointer"></div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {[...Array(7)].map((_, i) => (
              <div 
                key={i}
                className="h-6 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded hover:from-blue-200 hover:to-blue-300 dark:hover:from-blue-700 dark:hover:to-blue-800 transition-all duration-300 cursor-pointer"
              ></div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-200 dark:bg-blue-900 rounded-full opacity-50 blur-xl animate-ping-slow"></div>
      <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-200 dark:bg-purple-900 rounded-full opacity-50 blur-xl animate-pulse-slow"></div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500 pointer-events-none"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <BackgroundParticles />
      
      {/* Hero Section */}
      <section className="py-12 px-4 mx-auto max-w-7xl lg:py-24 lg:px-6">
        <div className={`flex flex-col lg:flex-row items-center justify-between gap-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Text Content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className={`mb-6 inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}>
              <Lightbulb className="w-5 h-5 text-yellow-300 dark:text-yellow-300 animate-pulse" />
              <span className="text-blue-700 dark:text-blue-300 font-medium">
                Your personal knowledge space
              </span>
            </div>
            
            <h1 className={`mb-6 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl dark:text-white transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              Organize your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-gradient">
                ideas, notes, and dates
              </span>{' '}
              in one place
            </h1>
            
            <p className={`mb-8 text-lg font-normal text-gray-600 dark:text-gray-300 lg:text-xl transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              An intuitive platform to store all your important knowledge, 
              manage key dates, and keep your thoughts organized. 
              Everything synchronized and accessible from any device.
            </p>
            
            <Features />
            <CTAButtons />
          </div>
          
          {/* Image/Visual Content */}
          <div className={`lg:w-1/2 relative transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <DashboardMockup />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Welcome;