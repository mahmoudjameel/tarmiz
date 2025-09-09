import React, { useState, useEffect } from 'react';
import { ChevronDown, Play, Users, Award, Calendar, Sparkles, Phone, Mail, MapPin, Menu, X, Star, ArrowRight, ArrowLeft, Globe, Zap, Target, Heart } from 'lucide-react';

const TramuzWebsite = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    
    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const heroSlides = [
    {
      title: "نحن لا نُنظّم فعاليات، نصنع تجارب",
              subtitle: "خبرات سعودية عالمية في تنظيم الفعاليات والمعارض والمؤتمرات والتسويق الرقمي",
      image: "bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900",
      accent: "from-yellow-400 to-pink-500"
    },
    {
      title: "من الفكرة إلى لحظة الانبهار",
              subtitle: "نرافقكم في كل خطوة لتحقيق فعالية استثنائية ومشروع تسويقي ناجح",
      image: "bg-gradient-to-br from-rose-900 via-purple-900 to-indigo-900",
      accent: "from-emerald-400 to-cyan-500"
    },
    {
      title: "معايير عالمية، هوية سعودية",
              subtitle: "الجودة والابتكار والدقة في كل تفصيل من الفعاليات إلى التسويق الرقمي",
      image: "bg-gradient-to-br from-emerald-900 via-teal-900 to-blue-900",
      accent: "from-orange-400 to-rose-500"
    }
  ];

    const services = [
    { 
      title: "تنظيم الفعاليات والمعارض والمؤتمرات", 
      description: "خدمة شاملة ومتكاملة لتنظيم جميع أنواع الفعاليات والمعارض والمؤتمرات بمعايير عالمية وجودة استثنائية", 
      icon: <Sparkles size={28} />, 
      gradient: "from-purple-500 via-blue-500 to-cyan-500", 
      bgGradient: "from-purple-50 via-blue-50 to-cyan-50", 
      hoverGradient: "from-purple-600 via-blue-600 to-cyan-600",
      details: [
        "تخطيط وإدارة شاملة للفعاليات",
        "تصميم وتنفيذ إبداعي",
        "خدمات لوجستية متكاملة",
        "إدارة الحضور والضيوف",
        "تقارير شاملة وتقييم النجاح"
      ],
      fullDescription: "نقدم خدمة شاملة ومتكاملة لتنظيم جميع أنواع الفعاليات والمعارض والمؤتمرات بمعايير عالمية وجودة استثنائية. نبدأ بفهم متطلباتك وأهدافك، ثم نضع خطة استراتيجية شاملة تشمل كل التفاصيل من التصميم إلى التنفيذ، مع ضمان نجاح كل حدث من خلال تخطيط دقيق وتنفيذ متميز.",
      features: [
        "تخطيط استراتيجي شامل للفعالية/المعرض/المؤتمر",
        "تصميم إبداعي يحاكي الحواس ويجسد الهوية",
        "إدارة لوجستية متقدمة ومتكاملة",
        "تقنيات حديثة وتفاعلية",
        "إدارة الحضور والضيوف والمشاركين",
        "تصميم أجنحة ومساحات عرض إبداعية",
        "تغطية إعلامية شاملة",
        "تقارير مفصلة وتقييم النجاح"
      ],
      process: [
        "الاستماع لفكرتك وتحديد الأهداف",
        "وضع خطة استراتيجية شاملة",
        "تصميم وتطوير المفهوم الإبداعي والهوية البصرية",
        "تخطيط المساحات والأجنحة (للمعارض والمؤتمرات)",
        "التنفيذ والدعم الفني",
        "المتابعة والتقييم والتطوير المستمر"
      ],
      examples: [
        "الفعاليات الحكومية والرسمية",
        "المؤتمرات والمعارض الدولية",
        "معارض تجارية وصناعية",
        "مؤتمرات تقنية وتعليمية",
        "معارض عقارية واستثمارية",
        "مؤتمرات طبية وعلمية",
        "معارض سياحية وترفيهية",
        "افتتاحات الشركات والمؤسسات",
        "حفلات الشركات والمناسبات الخاصة",
        "المهرجانات والفعاليات الثقافية"
      ]
    },
    { 
      title: "التسويق الرقمي", 
      description: "حلول متكاملة للتسويق الرقمي تواكب السوق السعودي والخليجي", 
      icon: <Target size={28} />, 
      gradient: "from-emerald-500 via-teal-500 to-cyan-500", 
      bgGradient: "from-emerald-50 to-teal-50", 
      hoverGradient: "from-emerald-600 to-teal-600",
      details: [
        "إدارة حسابات التواصل الاجتماعي",
        "استراتيجية وخطط تسويقية",
        "إعلانات مدفوعة متقدمة",
        "محتوى إبداعي ملهم",
        "تعاون مع المؤثرين",
        "SEO & SEM متخصص"
      ],
      fullDescription: "نقدم حلول تسويق رقمي متكاملة ومتطورة تواكب أحدث التقنيات والاتجاهات العالمية. نركز على تحقيق نتائج ملموسة وزيادة المبيعات من خلال استراتيجيات تسويقية ذكية ومبتكرة.",
      features: [
        "إدارة حسابات التواصل الاجتماعي",
        "استراتيجية تسويقية شاملة",
        "إعلانات مدفوعة متقدمة (Google Ads, Facebook Ads)",
        "محتوى إبداعي ومؤثر",
        "تعاون مع المؤثرين والمشاهير",
        "تحسين محركات البحث (SEO)",
        "إعلانات محركات البحث (SEM)",
        "تحليل البيانات والتقارير"
      ],
      process: [
        "تحليل السوق والمنافسين",
        "وضع استراتيجية تسويقية شاملة",
        "إنشاء المحتوى والإعلانات",
        "إدارة الحملات الإعلانية",
        "المتابعة والتحسين المستمر"
      ],
      examples: [
        "إدارة حسابات الشركات على وسائل التواصل",
        "حملات إعلانية مدفوعة",
        "تسويق المحتوى والمدونات",
        "تسويق المؤثرين",
        "تحسين محركات البحث"
      ]
    },
    { 
      title: "الإنتاج الفني", 
      description: "خدمات إنتاج متكاملة لمختلف أشكال المحتوى المرئي والمسموع", 
      icon: <Zap size={28} />, 
      gradient: "from-orange-500 via-amber-500 to-yellow-500", 
      bgGradient: "from-orange-50 to-amber-50", 
      hoverGradient: "from-orange-600 to-amber-600",
      details: [
        "التصوير الإعلاني الاحترافي",
        "الأفلام القصيرة والدعائية",
        "المونتاج والإخراج البصري",
        "التصوير الجوي (Drone)",
        "التغطية الإعلامية الشاملة",
        "إنتاج المحتوى الرقمي"
      ],
      fullDescription: "نقدم خدمات إنتاج فني متكاملة ومتطورة تشمل التصوير والإنتاج المرئي والمسموع. نستخدم أحدث التقنيات والمعدات لضمان جودة عالية ومحتوى إبداعي يحقق أهدافك التسويقية.",
      features: [
        "التصوير الإعلاني الاحترافي",
        "إنتاج الأفلام القصيرة والدعائية",
        "المونتاج والإخراج البصري المتقدم",
        "التصوير الجوي باستخدام الطائرات المسيرة",
        "التغطية الإعلامية الشاملة للفعاليات",
        "إنتاج المحتوى الرقمي والتفاعلي",
        "تصميم الرسومات والمواد البصرية",
        "تسجيل وإنتاج الصوتيات"
      ],
      process: [
        "فهم متطلبات المشروع",
        "تطوير المفهوم الإبداعي",
        "التخطيط والإعداد",
        "التنفيذ والإنتاج",
        "المونتاج والمراجعة النهائية"
      ],
      examples: [
        "أفلام إعلانية للشركات",
        "مقاطع فيديو للمنتجات",
        "تغطية الفعاليات والمعارض",
        "محتوى وسائل التواصل الاجتماعي",
        "أفلام وثائقية وتقارير"
      ]
    }
  ];

  const stats = [
    { number: "500+", label: "فعالية ناجحة", icon: <Target size={32} />, color: "from-purple-500 to-pink-500" },
    { number: "200+", label: "عميل راضٍ", icon: <Heart size={32} />, color: "from-rose-500 to-pink-500" },
    { number: "8", label: "سنوات خبرة", icon: <Award size={32} />, color: "from-blue-500 to-cyan-500" },
    { number: "50+", label: "محترف", icon: <Users size={32} />, color: "from-emerald-500 to-teal-500" }
  ];

  // Removed auto-slide animation for better performance

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(sectionId);
    setIsMenuOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: <Globe size={18} /> },
    { id: 'about', label: 'من نحن', icon: <Heart size={18} /> },
    { id: 'services', label: 'خدماتنا المميزة', icon: <Sparkles size={18} /> },
    { id: 'clients', label: 'عملاؤنا', icon: <Users size={18} /> },
    { id: 'works', label: 'أعمالنا', icon: <Play size={18} /> },
    { id: 'stats', label: 'إنجازاتنا بالأرقام', icon: <Award size={18} /> },
    { id: 'contact', label: 'تواصل معنا', icon: <Phone size={18} /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-slate-800/95 backdrop-blur-xl shadow-2xl border-b border-slate-700/20' 
          : 'bg-slate-800/90 backdrop-blur-md shadow-lg'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-reverse space-x-4">
              <div className="relative">
                <img 
                  src={require('../images/logo.png')} 
                  alt="طوق - شركة الفعاليات المميزة" 
                  className="w-16 h-16 hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-slate-500 rounded-full"></div>
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-bold text-white">شركة الفعاليات المميزة</div>
                <div className="text-xs text-gray-200">معايير عالمية • هوية سعودية</div>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden lg:flex bg-gray-50/80 backdrop-blur-sm rounded-2xl p-2 shadow-inner border border-gray-200/50">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`group relative px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center space-x-reverse space-x-2 ${
                    activeSection === item.id 
                      ? 'bg-slate-700 text-white shadow-lg transform scale-105' 
                      : 'text-gray-700 hover:text-slate-600 hover:bg-white/80 hover:shadow-md'
                  }`}
                >
                  <span className={`transition-transform duration-300 ${activeSection === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm">{item.label}</span>
                  {activeSection === item.id && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-slate-500 rounded-full"></div>
                  )}
                </button>
              ))}

            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden relative p-3 rounded-xl bg-slate-700 text-white shadow-lg hover:shadow-xl hover:bg-slate-600 transition-all duration-300"
            >
              <div className="relative w-6 h-6">
                <span className={`absolute block h-0.5 w-full bg-current transform transition-all duration-300 ${
                  isMenuOpen ? 'rotate-45 translate-y-2.5' : 'translate-y-1'
                }`}></span>
                <span className={`absolute block h-0.5 w-full bg-current transform transition-all duration-300 translate-y-2.5 ${
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}></span>
                <span className={`absolute block h-0.5 w-full bg-current transform transition-all duration-300 ${
                  isMenuOpen ? '-rotate-45 translate-y-2.5' : 'translate-y-4'
                }`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-500 overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-[#16265B]/95 backdrop-blur-xl border-t border-[#16265B]/50 shadow-xl">
            <div className="px-4 py-6 space-y-3">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full flex items-center space-x-reverse space-x-3 px-4 py-4 rounded-xl font-bold transition-all duration-300 ${
                    activeSection === item.id 
                      ? 'bg-slate-700 text-white shadow-lg transform scale-105' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-slate-600'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}

            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
        <div className={`absolute inset-0 ${heroSlides[currentSlide].image} transition-all duration-1000`}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50"></div>
          {/* Simplified Background */}
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white z-10">
          <div className="max-w-5xl">
            {/* Title */}
            <div className="mb-8">
              <div className={`inline-block px-6 py-3 rounded-full bg-gradient-to-r ${heroSlides[currentSlide].accent} text-black font-bold text-sm mb-6`}>
                ✨ شركة طوق للفعاليات المتميزة
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                <span className="block bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                  {heroSlides[currentSlide].title}
                </span>
              </h1>
            </div>
            
            <p className="text-xl md:text-3xl mb-12 text-gray-200 leading-relaxed font-light max-w-4xl">
              {heroSlides[currentSlide].subtitle}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 mb-12">
              <button 
                onClick={() => scrollToSection('services')}
                className="group px-10 py-5 bg-slate-700 text-white font-bold text-lg rounded-2xl hover:shadow-lg hover:bg-slate-600 transform hover:scale-102 transition-all duration-150 flex items-center justify-center space-x-reverse space-x-3"
              >
                <Sparkles className="transition-transform duration-300" size={24} />
                <span>استكشف خدماتنا</span>
                <ArrowLeft className="group-hover:-translate-x-1 transition-transform duration-150" size={20} />
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white font-bold text-lg rounded-2xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-3"
              >
                <Phone size={20} />
                <span>تواصل معنا</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-8 text-gray-300">
              <div className="flex items-center space-x-reverse space-x-2">
                <Award size={16} className="text-blue-400" />
                <span className="text-sm">+500 فعالية ناجحة</span>
              </div>
              <div className="flex items-center space-x-reverse space-x-2">
                <Users size={16} className="text-emerald-400" />
                <span className="text-sm">+200 عميل راضٍ</span>
              </div>
              <div className="flex items-center space-x-reverse space-x-2">
                <Phone size={16} className="text-purple-400" />
                <span className="text-sm" dir="ltr">+966 55 144 8433</span>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-12 right-12 flex flex-col space-y-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`relative w-1 h-12 rounded-full transition-all duration-200 ${
                currentSlide === index ? 'bg-white shadow-lg' : 'bg-white/30 hover:bg-white/50'
              }`}
            >
              {currentSlide === index && (
                <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-slate-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-white/80 text-sm mb-2">اكتشف المزيد</div>
          <ChevronDown className="text-white mx-auto" size={32} />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-gradient-to-br from-white via-gray-50 to-blue-50/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 font-bold text-sm mb-6">
              🏢 تعرف علينا أكثر
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-slate-800 mb-8">
                من نحن
            </h2>
            <div className="w-32 h-2 bg-slate-600 rounded-full mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="text-lg text-gray-700 leading-relaxed space-y-8">
                <div className="p-8 bg-white rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-bl-3xl"></div>
                  <p className="relative z-10">
                    <strong className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">شركة "طوق"</strong> هي شركة سعودية متخصصة في تنظيم الفعاليات الكبرى، المعارض، المؤتمرات، التسويق الرقمي، والإنتاج الفني والتقني بمستويات عالمية.
                  </p>
                </div>
                
                <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-br-3xl"></div>
                  <p className="relative z-10">
                    نؤمن في "طوق" أن الفعالية ليست مجرد حدث يُقام وينتهي، بل <strong className="text-blue-600">تجربة متكاملة</strong> تحمل رسالة، وتحاكي الحواس، وتُجسّد هوية الجهة المنظمة، وتُعزز صورتها في أعين جمهورها.
                  </p>
                </div>

                <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200 relative overflow-hidden">
                  <div className="absolute bottom-0 right-0 w-28 h-28 bg-gradient-to-tl from-emerald-500/10 to-teal-500/10 rounded-tl-3xl"></div>
                  <p className="relative z-10">
                    نحن لا نكتفي بالإعداد والتنفيذ، بل نُرافق عملاءنا منذ الفكرة وحتى لحظة انبهار الحضور. نبتكر، نُخطّط، نُنفّذ، ونُبدع، لنمنح كل حدث توقيعًا خاصًا يحمل بصمة "طوق" الفريدة.
                  </p>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-12 shadow-2xl border border-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-cyan-500/5"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-3xl"></div>
                <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-tr-3xl"></div>
                
                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-slate-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                      <Globe className="text-white" size={32} />
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 mb-4">خبرات سعودية عالمية</h3>
                  </div>
                  
                  <div className="space-y-6">
                    {[
                      "فهم عميق للسوق المحلي",
                      "معايير عالمية في التنفيذ",
                      "الجودة والابتكار والدقة",
                      "تجارب لا تُنسى"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center group">
                        <div className="w-3 h-3 bg-slate-500 rounded-full ml-4 group-hover:scale-150 transition-transform duration-300"></div>
                        <span className="text-gray-700 font-medium group-hover:text-slate-600 transition-colors duration-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 bg-gradient-to-br from-gray-50 via-white to-purple-50/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-24">
            <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 font-bold text-sm mb-8">
              ✨ خدماتنا المتميزة
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-slate-800 mb-8">
                خدماتنا المميزة
            </h2>
            <div className="w-32 h-2 bg-slate-600 rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              نقدم مجموعة شاملة من الخدمات المتخصصة في تنظيم الفعاليات والمعارض والمؤتمرات، التسويق الرقمي، والإنتاج الفني بمعايير عالمية وجودة استثنائية
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl p-10 shadow-xl hover:shadow-lg transition-all duration-200 border border-gray-100 transform hover:-translate-y-1 overflow-hidden"
              >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                
                {/* Service Icon */}
                <div className="relative z-10 w-20 h-20 bg-slate-600 rounded-3xl flex items-center justify-center text-white mb-8 group-hover:scale-105 transition-all duration-200 shadow-lg">
                  {service.icon}
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-gray-900 mb-6 group-hover:text-slate-700 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700 transition-colors duration-300">
                    {service.description}
                  </p>
                  
                  {/* Service Details */}
                  <div className="mb-6">
                    <ul className="space-y-2">
                      {service.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                          <div className="w-2 h-2 bg-slate-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* CTA */}
                  <button 
                    onClick={() => {
                      setSelectedService(service);
                      setIsModalOpen(true);
                    }}
                    className="flex items-center text-slate-600 font-bold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-200 hover:text-slate-700"
                  >
                    <span>اعرض المزيد</span>
                    <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Success Stories CTA Section */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 rounded-3xl p-12 shadow-2xl max-w-4xl mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
              <div className="relative z-10">
                <div className="text-4xl mb-6">🏆</div>
                <h3 className="text-3xl font-black text-black mb-6">قصص نجاح عملائنا</h3>
                <p className="text-xl text-black/80 mb-10 max-w-2xl mx-auto">
                  اكتشف كيف ساعدنا عملاءنا في تحقيق أهدافهم من خلال خدماتنا المميزة في تنظيم الفعاليات والتسويق الرقمي
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => scrollToSection('works')}
                    className="px-10 py-5 bg-white/20 backdrop-blur-sm text-black font-bold text-lg rounded-2xl border border-black/30 hover:bg-white/30 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-3"
                  >
                    <Play size={20} />
                    <span>شاهد مشاريعنا</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Works Section */}
      <section id="works" className="py-32 bg-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-800">
          <div className="absolute inset-0 bg-gray-700/20"></div>
        </div>
        
        {/* Simplified Background */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
          <div className="text-center mb-24">
            <div className="inline-block px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm text-white font-bold text-sm mb-8 border border-white/20">
              🎬 أعمالنا المميزة
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-8 text-white">
                أعمالنا
            </h2>
            <div className="w-32 h-2 bg-white rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-gray-200 max-w-4xl mx-auto">
              شاهد مجموعة من أفضل أعمالنا في تنظيم الفعاليات والمعارض والملتقيات
            </p>
          </div>

          {/* Videos Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {[
              {
                title: "فعالية وزارة التجارة السنوية",
                description: "معرض تجاري ضخم بمعايير عالمية",
                thumbnail: "🏛️",
                videoId: "dQw4w9WgXcQ",
                category: "فعاليات حكومية"
              },
              {
                title: "ملتقى أرامكو للطاقة",
                description: "فعالية تقنية متطورة مع أحدث التقنيات",
                thumbnail: "🛢️",
                videoId: "9bZkp7q19f0",
                category: "فعاليات تقنية"
              },
              {
                title: "معرض سابك للصناعات",
                description: "معرض صناعي تفاعلي بمساحة 5000 متر",
                thumbnail: "🏭",
                videoId: "kJQP7kiw5Fk",
                category: "معارض صناعية"
              },
              {
                title: "فعالية البنك الأهلي",
                description: "افتتاح فرع جديد بتصميم عصري",
                thumbnail: "🏦",
                videoId: "y6120QOlsfU",
                category: "فعاليات مؤسسية"
              },
              {
                title: "ملتقى جامعة الملك سعود",
                description: "فعالية تعليمية تفاعلية للطلاب",
                thumbnail: "🎓",
                videoId: "dQw4w9WgXcQ",
                category: "فعاليات تعليمية"
              },
              {
                title: "مهرجان مدارس الرياض",
                description: "مهرجان سنوي للأطفال والعائلات",
                thumbnail: "🏫",
                videoId: "9bZkp7q19f0",
                category: "مهرجانات"
              }
            ].map((video, index) => (
              <div
                key={index}
                className="group bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/10 hover:border-white/30 transform hover:-translate-y-1 hover:scale-102 transition-all duration-200 relative overflow-hidden"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gray-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                
                <div className="relative z-10">
                  {/* Video Thumbnail */}
                  <div className="relative mb-6 group cursor-pointer">
                    <div className="w-full h-48 bg-gray-700 rounded-2xl flex items-center justify-center text-6xl mb-4 group-hover:scale-105 transition-transform duration-200">
                      {video.thumbnail}
                    </div>
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                        <Play className="text-white ml-1" size={32} />
                      </div>
                    </div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-gray-600 text-white text-xs font-bold rounded-full">
                        {video.category}
                      </span>
                    </div>
                  </div>
                  
                  {/* Video Info */}
                  <h3 className="text-xl font-black text-white mb-3 group-hover:text-gray-300 transition-colors duration-200">
                    {video.title}
                  </h3>
                  
                  <p className="text-gray-300 mb-4 group-hover:text-gray-200 transition-colors duration-200">
                    {video.description}
                  </p>
                  
                  {/* Watch Button */}
                  <button 
                    onClick={() => window.open(`https://www.youtube.com/watch?v=${video.videoId}`, '_blank')}
                    className="w-full px-6 py-3 bg-gray-600 text-white font-bold rounded-2xl hover:shadow-lg hover:bg-gray-500 transform hover:scale-102 transition-all duration-150 flex items-center justify-center space-x-reverse space-x-3"
                  >
                    <Play size={20} />
                    <span>شاهد الفيديو</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 max-w-4xl mx-auto border border-white/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gray-500/10"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <span className="text-2xl">🎬</span>
                </div>
                
                <h3 className="text-3xl font-black text-white mb-6">مستعد لرؤية المزيد؟</h3>
                
                <p className="mb-10 leading-relaxed text-lg text-gray-200">
                  اكتشف المزيد من أعمالنا المميزة في قناتنا على يوتيوب
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => window.open('https://www.youtube.com/@tawq-events', '_blank')}
                    className="px-10 py-5 bg-gray-600 text-white font-bold text-lg rounded-2xl hover:shadow-lg hover:bg-gray-500 transform hover:scale-102 transition-all duration-150 flex items-center justify-center space-x-reverse space-x-3"
                  >
                    <span className="text-2xl">📺</span>
                    <span>قناتنا على يوتيوب</span>
                  </button>
                  
                  <button 
                    onClick={() => scrollToSection('contact')}
                    className="px-10 py-5 bg-gray-700 text-white font-bold text-lg rounded-2xl border border-gray-600 hover:bg-gray-600 transition-all duration-200 flex items-center justify-center space-x-reverse space-x-3"
                  >
                    <Phone size={20} />
                    <span>اطلب عرض أسعار</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Clients Section */}
      <section id="clients" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-4">
                عملاؤنا
            </h2>
            <div className="w-24 h-1 bg-slate-600 rounded-full mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              نفتخر بخدمة عملائنا الكرام من مختلف القطاعات
            </p>
          </div>

          {/* Client Logos Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
                            {[
              { name: "شركة التقنية المتقدمة", logo: "💻" },
              { name: "مجموعة الاستثمار الذكي", logo: "📈" },
              { name: "مؤسسة التطوير المستدام", logo: "🌱" },
              { name: "شركة الحلول الإبداعية", logo: "💡" },
                  { name: "أرامكو", logo: "🛢️" },
                  { name: "سابك", logo: "🏭" },
                  { name: "البنك الأهلي", logo: "🏦" },
                  { name: "الراجحي", logo: "💳" },
                  { name: "جامعة الملك سعود", logo: "🎓" },
                  { name: "جامعة الملك فهد", logo: "🎓" },
                  { name: "مدارس الأنجال", logo: "🏫" },
                  { name: "مدارس الرياض", logo: "🏫" }
                ].map((client, index) => (
                  <div
                key={index}
                className="group bg-gray-50 rounded-2xl p-6 text-center hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="text-4xl mb-3">{client.logo}</div>
                <h4 className="text-sm font-bold text-gray-700 group-hover:text-slate-600 transition-colors duration-200">
                        {client.name}
                      </h4>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-800">
          <div className="absolute inset-0 bg-gray-700/20"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
          <div className="text-center mb-24">
            <div className="inline-block px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm text-white font-bold text-sm mb-8 border border-white/20">
              🏆 إنجازاتنا المميزة
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-8 text-white">
                إنجازاتنا بالأرقام
            </h2>
            <div className="w-32 h-2 bg-white rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              أرقام تتحدث عن جودتنا وتميزنا في صناعة الفعاليات
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group text-center"
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 group-hover:bg-white/20 transition-all duration-200 border border-white/10 hover:border-white/30 transform hover:-translate-y-1 hover:scale-102 relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gray-500 opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                  
                  {/* Icon */}
                  <div className="relative z-10 w-20 h-20 bg-gray-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-105 transition-all duration-200 shadow-xl">
                    {stat.icon}
                  </div>
                  
                  {/* Number */}
                  <div className="relative z-10 text-5xl md:text-6xl font-black mb-4 text-white">
                      {stat.number}
                  </div>
                  
                  {/* Label */}
                  <div className="relative z-10 text-lg font-bold text-gray-200 group-hover:text-white transition-colors duration-300">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-gradient-to-br from-white via-gray-50 to-blue-50/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 font-bold text-sm mb-8">
              📞 نحن هنا لمساعدتك
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-slate-800 mb-8">
                تواصل معنا
            </h2>
            <div className="w-32 h-2 bg-slate-600 rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              استعد لتجربة استثنائية مع فريق طوق المحترف - نحن هنا لتحويل أحلامك إلى واقع مذهل
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-20">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50"></div>
                <div className="relative z-10">
                  <h3 className="text-3xl font-black text-gray-900 mb-8 flex items-center">
                    <div className="w-10 h-10 bg-slate-600 rounded-2xl flex items-center justify-center ml-4">
                      <Phone className="text-white" size={20} />
                    </div>
                    معلومات التواصل
                  </h3>
                  
                  <div className="space-y-8">
                    {[
                      { 
                        icon: <Phone size={24} />, 
                        label: "الهاتف", 
                        value: "+966 55 144 8433", 
                        gradient: "from-emerald-500 to-teal-500",
                        dir: "ltr"
                      },
                      { 
                        icon: <Mail size={24} />, 
                        label: "البريد الإلكتروني", 
                        value: "Toq@toq-group.com", 
                        gradient: "from-blue-500 to-cyan-500",
                        dir: "ltr"
                      },
                      { 
                        icon: <MapPin size={24} />, 
                        label: "العنوان", 
                        value: "الرياض حي الملك سلمان مبنى الواحة سكوير الدور الاول مكتب 109", 
                        gradient: "from-purple-500 to-pink-500"
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center group">
                        <div className="w-16 h-16 bg-slate-600 rounded-2xl flex items-center justify-center text-white ml-6 group-hover:scale-105 transition-all duration-150 shadow-lg">
                          {item.icon}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-lg mb-1">{item.label}</div>
                          <div className="text-gray-600 text-lg" dir={item.dir || "rtl"}>{item.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-blue-50/30 to-cyan-50/30"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-10">
                  <div className="w-16 h-16 bg-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Mail className="text-white" size={24} />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-2">أرسل لنا رسالة</h3>
                  <p className="text-gray-600">سنتواصل معك خلال 24 ساعة</p>
                </div>

                <form className="space-y-8">
                  {[
                    { label: "الاسم الكامل", type: "text", placeholder: "أدخل اسمك الكامل" },
                    { label: "البريد الإلكتروني", type: "email", placeholder: "your@email.com", dir: "ltr" },
                    { label: "رقم الهاتف", type: "tel", placeholder: "+966 50 123 4567", dir: "ltr" }
                  ].map((field, index) => (
                    <div key={index} className="group">
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-slate-500/20 focus:border-slate-500 transition-all duration-150 text-lg group-hover:border-slate-300"
                        placeholder={field.placeholder}
                        dir={field.dir || "rtl"}
                      />
                    </div>
                  ))}
                  
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      نوع الفعالية
                    </label>
                    <select className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-slate-500/20 focus:border-slate-500 transition-all duration-150 text-lg group-hover:border-slate-300">
                      <option>اختر نوع الفعالية</option>
                      <option>فعالية كبرى</option>
                      <option>معرض أو ملتقى</option>
                      <option>فعالية مؤسسية</option>
                      <option>إنتاج فني وتقني</option>
                      <option>أخرى</option>
                    </select>
                  </div>
                  
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      تفاصيل المشروع
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-slate-500/20 focus:border-slate-500 transition-all duration-300 text-lg resize-none group-hover:border-slate-300"
                      placeholder="أخبرنا عن مشروعك وكيف يمكننا مساعدتك..."
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full px-10 py-5 bg-slate-700 text-white font-bold text-lg rounded-2xl hover:shadow-2xl hover:bg-slate-600 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-3"
                  >
                    <Sparkles size={20} />
                    <span>أرسل طلبك</span>
                    <ArrowRight size={20} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-32 bg-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-800"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gray-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gray-600/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
          <div className="text-center mb-20">
            <div className="inline-block px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm text-white font-bold text-sm mb-8 border border-white/20">
              🏆 قصص نجاح عملائنا
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-8 text-white">
                حالات النجاح
            </h2>
            <div className="w-32 h-2 bg-white rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
              شاهد كيف ساعدنا عملاءنا في تحقيق أهدافهم من خلال خدماتنا المميزة
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "وزارة التجارة",
                description: "معرض تجاري ضخم بمعايير عالمية",
                result: "نجحنا في تنظيم معرض تجاري ضخم استقطب أكثر من 50,000 زائر",
                icon: "🏛️",
                color: "from-blue-500 to-cyan-500"
              },
              {
                title: "أرامكو",
                description: "فعالية تقنية متطورة مع أحدث التقنيات",
                result: "فعالية تقنية متطورة استخدمت أحدث التقنيات التفاعلية",
                icon: "🛢️",
                color: "from-emerald-500 to-teal-500"
              },
              {
                title: "سابك",
                description: "معرض صناعي تفاعلي بمساحة 5000 متر",
                result: "معرض صناعي تفاعلي نجح في عرض منتجات الشركة بطرق مبتكرة",
                icon: "🏭",
                color: "from-purple-500 to-pink-500"
              },
              {
                title: "البنك الأهلي",
                description: "افتتاح فرع جديد بتصميم عصري",
                result: "افتتاح فرع جديد بتصميم عصري ومتطور",
                icon: "🏦",
                color: "from-orange-500 to-yellow-500"
              },
              {
                title: "جامعة الملك سعود",
                description: "فعالية تعليمية تفاعلية للطلاب",
                result: "فعالية تعليمية تفاعلية نجحت في جذب أكثر من 10,000 طالب",
                icon: "🎓",
                color: "from-red-500 to-pink-500"
              },
              {
                title: "مدارس الرياض",
                description: "مهرجان سنوي للأطفال والعائلات",
                result: "مهرجان سنوي للأطفال والعائلات حقق نجاحاً كبيراً",
                icon: "🏫",
                color: "from-indigo-500 to-purple-500"
              }
            ].map((story, index) => (
              <div
                key={index}
                className="group bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:border-white/30 transform hover:-translate-y-2 hover:scale-105 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gray-600 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    {story.icon}
                  </div>
                  
                  <h3 className="text-2xl font-black text-white mb-4 text-center group-hover:text-gray-300 transition-colors duration-300">
                    {story.title}
                  </h3>
                  
                  <p className="text-gray-300 mb-4 text-center group-hover:text-gray-200 transition-colors duration-300">
                    {story.description}
                  </p>
                  
                  <div className="text-center">
                    <div className="text-sm text-gray-300 font-medium">
                      {story.result}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 max-w-5xl mx-auto border border-white/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gray-500/10"></div>
              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-black mb-6 text-white">مستعد لتصبح قصة نجاح التالية؟</h3>
                <p className="text-xl text-gray-200 mb-10 max-w-3xl mx-auto">
                  دعنا نساعدك في تحقيق أهدافك من خلال خدماتنا المميزة في تنظيم الفعاليات والتسويق الرقمي
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <button 
                    onClick={() => scrollToSection('contact')}
                    className="px-12 py-6 bg-gray-700 text-white font-bold text-xl rounded-2xl hover:shadow-2xl hover:bg-gray-600 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-3"
                  >
                    <Sparkles size={24} />
                    <span>ابدأ مشروعك الآن</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-900/95"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <img 
                  src={require('../images/logo.png')} 
                  alt="طوق - شركة الفعاليات المميزة" 
                  className="w-20 h-20 ml-2"
                />
                <div className="w-3 h-3 bg-slate-500 rounded-full ml-2"></div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                شركة سعودية متخصصة في تنظيم الفعاليات والمعارض والمؤتمرات والتسويق الرقمي والإنتاج الفني والتقني بمعايير عالمية وجودة استثنائية. نرافق عملاءنا من الفكرة إلى لحظة الانبهار.
              </p>

            </div>
            
            <div>
              <h4 className="text-xl font-black mb-6 flex items-center">
                <Sparkles className="ml-2" size={20} />
                خدماتنا
              </h4>
              <ul className="space-y-4 text-gray-300">
                {[
                  "تنظيم الفعاليات والمعارض والمؤتمرات",
                  "التسويق الرقمي",
                  "الإنتاج الفني"
                ].map((service, index) => (
                  <li key={index} className="hover:text-white transition-colors duration-300 cursor-pointer flex items-center">
                    <div className="w-2 h-2 bg-slate-500 rounded-full ml-3"></div>
                    {service}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-black mb-6 flex items-center">
                <Phone className="ml-2" size={20} />
                تواصل معنا
              </h4>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-center hover:text-white transition-colors duration-300">
                  <Phone size={16} className="ml-3 text-emerald-400" />
                  <span dir="ltr">+966 55 144 8433</span>
                </li>
                <li className="flex items-center hover:text-white transition-colors duration-300">
                  <Mail size={16} className="ml-3 text-blue-400" />
                  <span dir="ltr">Toq@toq-group.com</span>
                </li>
                <li className="flex items-center hover:text-white transition-colors duration-300">
                  <MapPin size={16} className="ml-3 text-purple-400" />
                  <span>الرياض حي الملك سلمان مبنى الواحة سكوير الدور الاول مكتب 109</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="border-t border-gray-800 pt-12">
            <div className="flex flex-col lg:flex-row justify-between items-center">
              <div className="text-gray-400 mb-6 lg:mb-0 flex items-center">
                <div className="w-8 h-8 bg-slate-500 rounded-lg flex items-center justify-center ml-3">
                  <span className="text-white font-bold text-sm">©</span>
                </div>
                <span>2024 شركة طوق للفعاليات. جميع الحقوق محفوظة.</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Service Details Modal */}
      {isModalOpen && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            {/* Header */}
            <div className={`p-8 ${selectedService.bgGradient} rounded-t-3xl relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-reverse space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${selectedService.gradient} rounded-2xl flex items-center justify-center text-white shadow-xl`}>
                    {selectedService.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">{selectedService.title}</h2>
                    <p className="text-gray-700 text-lg">{selectedService.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-gray-700 hover:bg-white/30 transition-all duration-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-8 space-y-8">
              {/* Full Description */}
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-slate-500 rounded-xl flex items-center justify-center ml-3">
                    <span className="text-white font-bold text-sm">📝</span>
                  </div>
                  الوصف الشامل
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">{selectedService.fullDescription}</p>
              </div>
              
              {/* Features */}
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-slate-500 rounded-xl flex items-center justify-center ml-3">
                    <span className="text-white font-bold text-sm">✨</span>
                  </div>
                  المميزات والخدمات
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedService.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-reverse space-x-3 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-200">
                      <div className={`w-3 h-3 bg-gradient-to-r ${selectedService.gradient} rounded-full mt-2 flex-shrink-0`}></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Process */}
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-slate-500 rounded-xl flex items-center justify-center ml-3">
                    <span className="text-white font-bold text-sm">🔄</span>
                  </div>
                  خطوات العمل
                </h3>
                <div className="space-y-4">
                  {selectedService.process.map((step, index) => (
                    <div key={index} className="flex items-center space-x-reverse space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="w-8 h-8 bg-slate-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="text-gray-700 font-medium">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Examples */}
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-slate-500 rounded-xl flex items-center justify-center ml-3">
                    <span className="text-white font-bold text-sm">🎯</span>
                  </div>
                  أمثلة على المشاريع
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedService.examples.map((example, index) => (
                    <div key={index} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:bg-slate-100 transition-all duration-200">
                      <span className="text-gray-700">{example}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* CTA */}
              <div className="text-center pt-8">
                <button
                  onClick={() => scrollToSection('contact')}
                    className="px-10 py-5 bg-slate-700 text-white font-bold text-lg rounded-2xl hover:shadow-2xl hover:bg-slate-600 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-3 mx-auto"
                >
                  <Sparkles size={20} />
                  <span>اطلب عرض أسعار</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scroll to Top Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group w-14 h-14 bg-slate-700 text-white rounded-2xl shadow-lg hover:shadow-xl hover:bg-slate-600 transition-all duration-300 flex items-center justify-center transform hover:scale-110"
        >
          <ChevronDown className="rotate-180 group-hover:animate-bounce" size={20} />
        </button>
      </div>
    </div>
  );
};

export default TramuzWebsite;
