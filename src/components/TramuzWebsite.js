import React, { useState, useEffect } from 'react';
import { ChevronDown, Play, Users, Award, Sparkles, Phone, Mail, MapPin, X, ArrowRight, ArrowLeft, Globe, Zap, Target, Heart, Star, ShoppingCart, Plus, Minus, Trash2, Languages, Settings } from 'lucide-react';
import arTranslations from '../locales/ar.json';
import enTranslations from '../locales/en.json';
import heroImg1 from '../images/hero/hero-1.jpg';
import heroImg2 from '../images/hero/hero-2.jpg';
import heroImg3 from '../images/hero/hero-3.jpg';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

const TramuzWebsite = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  // const [selectedService, setSelectedService] = useState(null);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [language, setLanguage] = useState('ar');
  const [isRTL, setIsRTL] = useState(true);
  // const [remoteContent, setRemoteContent] = useState(null);
  // const [remoteSections, setRemoteSections] = useState(null);
  const [firebaseProjects, setFirebaseProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [firebaseServices, setFirebaseServices] = useState([]);
  // const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [firebaseTestimonials, setFirebaseTestimonials] = useState([]);
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(false);
  const [firebaseTeam, setFirebaseTeam] = useState([]);
  const [isLoadingTeam, setIsLoadingTeam] = useState(false);
  const [firebaseContactInfo, setFirebaseContactInfo] = useState({
    phone: "",
    email: "",
    address: "",
    whatsapp: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    facebook: "",
    youtube: ""
  });
  const [isLoadingContact, setIsLoadingContact] = useState(false);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    projectDetails: ""
  });
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // دالة إرسال بيانات النموذج إلى WhatsApp
  const sendContactFormToWhatsApp = async (formData) => {
    if (!firebaseContactInfo.whatsapp) {
      alert(t('contact.form.whatsappUnavailableAlert'));
      return;
    }

    const whatsappNumber = firebaseContactInfo.whatsapp.replace(/[^0-9]/g, "");
    
    // تحضير الرسالة
    const message = `🔔 *طلب جديد من موقع ترامز*

👤 *الاسم:* ${formData.name}
📧 *البريد الإلكتروني:* ${formData.email}
📞 *رقم الهاتف:* ${formData.phone}
🎯 *نوع الخدمة:* ${formData.serviceType}
📝 *تفاصيل المشروع:*
${formData.projectDetails}

📅 *التاريخ:* ${new Date().toLocaleDateString('ar-SA')}
⏰ *الوقت:* ${new Date().toLocaleTimeString('ar-SA')}

_تم إرسال هذا الطلب من موقع ترامز الرسمي_`;

    // إنشاء رابط WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // فتح WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  // دالة معالجة إرسال النموذج
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    
    // التحقق من البيانات المطلوبة
    if (!contactForm.name || !contactForm.email || !contactForm.phone) {
      alert(t('contact.form.requiredFields'));
      return;
    }

    setIsSubmittingForm(true);
    
    try {
      await sendContactFormToWhatsApp(contactForm);
      
      // إعادة تعيين النموذج
      setContactForm({
        name: "",
        email: "",
        phone: "",
        serviceType: "",
        projectDetails: ""
      });
      
      alert(t('contact.form.formSuccess'));
    } catch (error) {
      console.error("خطأ في إرسال النموذج:", error);
      alert(t('contact.form.formError'));
    } finally {
      setIsSubmittingForm(false);
    }
  };
  const [firebaseCategories, setFirebaseCategories] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);
  const [clients, setClients] = useState([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [heroData, setHeroData] = useState(null);
  const [heroLoading, setHeroLoading] = useState(true);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  // Site visibility and CMS content
  const [siteVisibility, setSiteVisibility] = useState({
    hero: true,
    about: true,
    services: true,
    works: true,
    testimonials: true,
    team: true,
    clients: true,
    stats: true,
    contact: true,
    categories: true,
    why: true
  });
  const [aboutData, setAboutData] = useState(null);
  const [whyData, setWhyData] = useState(null);

  // Translation function
  const t = (key) => {
    const translations = language === 'ar' ? arTranslations : enTranslations;
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  // تحميل المشاريع من Firebase
  const fetchProjectsFromFirebase = async () => {
    try {
      setIsLoadingProjects(true);
      const querySnapshot = await getDocs(collection(db, "projects"));
      const projectsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFirebaseProjects(projectsList);
    } catch (error) {
      console.error("خطأ في تحميل المشاريع من Firebase: ", error);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  // تحميل الخدمات من Firebase
  const fetchServicesFromFirebase = async () => {
    try {
      // setIsLoadingServices(true);
      const querySnapshot = await getDocs(collection(db, "services"));
      const servicesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFirebaseServices(servicesList);
    } catch (error) {
      console.error("خطأ في تحميل الخدمات من Firebase: ", error);
    } finally {
      // setIsLoadingServices(false);
    }
  };

  // تحميل الفريق من Firebase
  const fetchTeamFromFirebase = async () => {
    try {
      setIsLoadingTeam(true);
      const querySnapshot = await getDocs(collection(db, "team"));
      const teamList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFirebaseTeam(teamList);
    } catch (error) {
      console.error("خطأ في تحميل الفريق من Firebase: ", error);
    } finally {
      setIsLoadingTeam(false);
    }
  };

  // تحميل معلومات التواصل من Firebase
  const fetchContactInfoFromFirebase = async () => {
    try {
      setIsLoadingContact(true);
      const querySnapshot = await getDocs(collection(db, "contactInfo"));
      if (!querySnapshot.empty) {
        const contactData = querySnapshot.docs[0].data();
        setFirebaseContactInfo(contactData);
      }
    } catch (error) {
      console.error("خطأ في تحميل معلومات التواصل من Firebase: ", error);
    } finally {
      setIsLoadingContact(false);
    }
  };

  // تحميل التصنيفات من Firebase
  const fetchCategoriesFromFirebase = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const categoriesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFirebaseCategories(categoriesList);
    } catch (error) {
      console.error("خطأ في تحميل التصنيفات من Firebase: ", error);
    }
  };

  // تحميل العملاء من Firebase
  const fetchClientsFromFirebase = async () => {
    setIsLoadingClients(true);
    try {
      const querySnapshot = await getDocs(collection(db, "clients"));
      const clientsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setClients(clientsList);
    } catch (error) {
      console.error("خطأ في تحميل العملاء: ", error);
    } finally {
      setIsLoadingClients(false);
    }
  };

  // تحميل آراء العملاء من Firebase
  const fetchTestimonialsFromFirebase = async () => {
    setIsLoadingTestimonials(true);
    try {
      const querySnapshot = await getDocs(collection(db, "testimonials"));
      const testimonialsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFirebaseTestimonials(testimonialsList);
    } catch (error) {
      console.error("خطأ في تحميل آراء العملاء من Firebase: ", error);
    } finally {
      setIsLoadingTestimonials(false);
    }
  };

  // تحميل إعدادات الظهور من Firebase
  const fetchVisibilitySettings = async () => {
    try {
      const docRef = doc(db, 'settings', 'visibility');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSiteVisibility(docSnap.data());
      }
    } catch (error) {
      console.error('خطأ في تحميل إعدادات الظهور:', error);
    }
  };

  // دالة لتحويل آراء العملاء من Firebase إلى تنسيق مناسب للعرض
  const getDisplayTestimonials = () => {
    if (firebaseTestimonials.length === 0) return [];
    
    return firebaseTestimonials.map(testimonial => ({
      id: testimonial.id,
      name: testimonial.name || testimonial.nameAr,
      company: testimonial.company || testimonial.companyAr,
      position: testimonial.position || testimonial.positionAr,
      image: testimonial.image || testimonial.imageUrl,
      comment: testimonial.comment || testimonial.commentAr,
      project: testimonial.project || testimonial.projectAr,
      gradient: testimonial.gradient || "from-emerald-500 to-teal-500",
      rating: testimonial.rating || 5,
      isVisible: testimonial.isVisible !== false
    })).filter(testimonial => testimonial.isVisible);
  };

  // دالة لتحويل بيانات Firebase إلى تنسيق مناسب للعرض
  const getDisplayProjects = () => {
    // تحويل بيانات Firebase إلى التنسيق المطلوب
    const convertedProjects = firebaseProjects.map(project => {
      let categoryDisplay = "";
      let tabId = "";
      
      // العثور على التصنيف من التصنيفات المحملة
      const categoryData = firebaseCategories.find(cat => cat.id === project.category);
      
      if (categoryData) {
        categoryDisplay = language === 'en' ? (categoryData.name_en || categoryData.name) : categoryData.name;
        tabId = project.category;
      } else {
        // fallback للتصنيفات القديمة
        switch(project.category) {
          case "exterior-design":
            categoryDisplay = t('works.tabs.1');
            tabId = "exterior";
            break;
          case "interior-design":
            categoryDisplay = t('works.tabs.2');
            tabId = "interior";
            break;
          case "execution-plans":
            categoryDisplay = t('works.tabs.3');
            tabId = "plans";
            break;
          case "branding":
            categoryDisplay = t('works.tabs.4');
            tabId = "branding";
            break;
          default:
            categoryDisplay = project.category;
            tabId = "all";
        }
      }

      // العثور على الصورة الرئيسية
      const primaryImage = project.images && project.images.length > 0 ? 
        project.images.find(img => img.isPrimary) || project.images[0] : 
        null;

      return {
        id: project.id,
        title: language === 'en' ? (project.title_en || project.title) : project.title,
        description: language === 'en' ? (project.description_en || project.description) : project.description,
        image: primaryImage ? primaryImage.url : (project.thumbnail && project.thumbnail.startsWith('http') ? project.thumbnail : null),
        emoji: !primaryImage && project.thumbnail && !project.thumbnail.startsWith('http') ? project.thumbnail : null,
        category: categoryDisplay,
        categoryId: tabId,
        year: project.year,
        images: project.images || [] // حفظ جميع الصور
      };
    });

    // تصفية المشاريع حسب التبويب النشط
    return convertedProjects.filter(project => {
      if (activeTab === 'all') return true;
      return project.categoryId === activeTab || project.category === activeTab;
    });
  };

  // دالة لتحويل خدمات Firebase إلى تنسيق مناسب للعرض
  const getDisplayServices = () => {
    // استخدام الخدمات من Firebase فقط (إلغاء الخدمات الثابتة)
    const mapped = firebaseServices.map(service => ({
      id: `firebase-${service.id}`,
      title: language === 'en' ? (service.title_en || service.title) : service.title,
      description: language === 'en' ? (service.description_en || service.description) : service.description,
      price: service.price || 0,
      icon: <span style={{fontSize: '28px'}}>{service.icon}</span>,
      gradient: "from-emerald-600 via-emerald-700 to-emerald-800",
      bgGradient: "from-emerald-50 to-emerald-100",
      hoverGradient: "from-emerald-700 via-emerald-800 to-emerald-900",
      details: [language === 'en' ? (service.description_en || service.description) : service.description], // تحويل إلى مصفوفة
      fullDescription: language === 'en' ? (service.description_en || service.description) : service.description,
      features: [language === 'en' ? (service.description_en || service.description) : service.description], // تحويل إلى مصفوفة
      process: [language === 'en' ? (service.description_en || service.description) : service.description], // تحويل إلى مصفوفة
      examples: [language === 'en' ? (service.description_en || service.description) : service.description], // تحويل إلى مصفوفة
      isFirebase: true,
      featured: !!service.featured,
      order: service.order ?? 0
    }));
    // ترتيب: المميزة أولاً ثم حسب order ثم بالعنوان
    return mapped.sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      if (a.order !== b.order) return a.order - b.order;
      return (a.title || '').localeCompare(b.title || '');
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // تحميل البيانات من Firebase عند تحميل الصفحة
  useEffect(() => {
    fetchProjectsFromFirebase();
    fetchServicesFromFirebase();
    fetchTeamFromFirebase();
    fetchContactInfoFromFirebase();
    fetchCategoriesFromFirebase();
    fetchClientsFromFirebase();
    fetchTestimonialsFromFirebase();
    // Visibility & CMS content
    fetchVisibilitySettings();
    // CMS content
    (async () => {
      try {
        const aboutRef = doc(db, 'settings', 'about');
        const aboutSnap = await getDoc(aboutRef);
        if (aboutSnap.exists()) setAboutData(aboutSnap.data());
      } catch (e) {
        console.error('خطأ في تحميل من نحن:', e);
      }
      try {
        const whyRef = doc(db, 'settings', 'whyChoose');
        const whySnap = await getDoc(whyRef);
        if (whySnap.exists()) setWhyData(whySnap.data());
      } catch (e) {
        console.error('خطأ في تحميل لماذا تختارنا:', e);
      }
    })();
  }, []);

  // تحميل بيانات البانر من Firestore
  useEffect(() => {
    const fetchHero = async () => {
      setHeroLoading(true);
      try {
        const docRef = doc(db, 'settings', 'hero');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHeroData(docSnap.data());
          console.log('heroData:', docSnap.data());
        } else {
          setHeroData(null);
          console.log('heroData: null');
        }
      } catch (e) {
        setHeroData(null);
        console.log('heroData: error', e);
      } finally {
        setHeroLoading(false);
      }
    };
    fetchHero();
  }, []);

  // منطق السلايدر
  useEffect(() => {
    if (!heroData || !heroData.images || heroData.images.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroData.images.length);
    }, (heroData?.timer || 5) * 1000);
    return () => clearInterval(timer);
  }, [heroData]);

  // تم حذف useEffect للمودال


  const heroSlides = [
    {
      title: t('hero.title'),
      subtitle: t('hero.subtitle'),
      description: t('hero.description'),
      image: heroImg1,
      accent: 'from-emerald-100 to-teal-100',
    },
    {
      title: t('hero.slides.1.title'),
      subtitle: t('hero.slides.1.subtitle'),
      description: t('hero.slides.1.description'),
      image: heroImg2,
      accent: 'from-teal-100 to-cyan-100',
    },
    {
      title: t('hero.slides.2.title'),
      subtitle: t('hero.slides.2.subtitle'),
      description: t('hero.slides.2.description'),
      image: heroImg3,
      accent: 'from-emerald-200 to-teal-200',
    },
  ];

  // const sectionTitle = (key, fallbackKey) => remoteSections?.[key]?.[language]?.title || t(fallbackKey);

  // تم حذف الخدمات الثابتة - الآن الخدمات تُعرض من Firebase فقط

  const stats = [
    { 
      number: "150+", 
      label: t('stats.completedProjects'), 
      description: t('stats.items.0.description'),
      icon: <Target size={40} />, 
      color: "from-slate-600 to-slate-800",
      bgColor: "from-slate-100 to-slate-200"
    },
    { 
      number: "98%", 
      label: t('stats.satisfiedClients'), 
      description: t('stats.items.1.description'),
      icon: <Heart size={40} />, 
      color: "from-emerald-600 to-emerald-800",
      bgColor: "from-emerald-100 to-emerald-200"
    },
    { 
      number: "8+", 
      label: t('stats.yearsExperience'), 
      description: t('stats.items.2.description'),
      icon: <Award size={40} />, 
      color: "from-amber-600 to-amber-800",
      bgColor: "from-amber-100 to-amber-200"
    },
    { 
      number: "24/7", 
      label: t('stats.items.3.label'), 
      description: t('stats.items.3.description'),
      icon: <Zap size={40} />, 
      color: "from-teal-600 to-teal-800",
      bgColor: "from-teal-100 to-teal-200"
    }
  ];

  // Removed auto-slide animation for better performance

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(sectionId);
    setIsMenuOpen(false);
  };

  // Cart functions
  const addToCart = (service) => {
    const existingItem = cart.find(item => item.id === service.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === service.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...service, quantity: 1 }]);
    }
  };

  const removeFromCart = (serviceId) => {
    setCart(cart.filter(item => item.id !== serviceId));
  };

  const updateQuantity = (serviceId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(serviceId);
    } else {
      setCart(cart.map(item => 
        item.id === serviceId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const sendToWhatsApp = () => {
    const message = language === 'ar' 
      ? `${t('contact.whatsappMessageHeader')}

${cart.map(item => `• ${item.title} - ${t('cart.quantity')}: ${item.quantity} - ${t('services.price')}: ${item.price} ${t('services.sar')}`).join('\n')}

${t('cart.total')}: ${getCartTotal()} ${t('services.sar')}

${t('contact.whatsappThanks')}`
      : `${t('contact.whatsappMessageHeader')}

${cart.map(item => `• ${item.title} - ${t('cart.quantity')}: ${item.quantity} - ${t('services.price')}: ${item.price} ${t('services.sar')}`).join('\n')}

${t('cart.total')}: ${getCartTotal()} ${t('services.sar')}

${t('contact.whatsappThanks')}`;

    const whatsappUrl = `https://wa.me/966551448433?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLanguage);
    setIsRTL(newLanguage === 'ar');
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLanguage;
  };

  const navItems = [
    { id: 'home', label: t('navigation.home'), icon: <Globe size={18} /> },
    { id: 'about', label: t('navigation.about'), icon: <Heart size={18} /> },
    { id: 'services', label: t('navigation.services'), icon: <Sparkles size={18} /> },
    { id: 'works', label: t('navigation.works'), icon: <Play size={18} /> },
    { id: 'team', label: t('navigation.clients'), icon: <Users size={18} /> },
    { id: 'testimonials', label: t('success.badge'), icon: <Award size={18} /> },
    { id: 'contact', label: t('navigation.contact'), icon: <Phone size={18} /> }
  ];



  return (
    <div className="min-h-screen bg-slate-50" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-slate-900/95 backdrop-blur-xl shadow-lg border-b border-slate-700' 
          : 'bg-slate-900/90 backdrop-blur-lg shadow-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo Section */}
            <div className="flex items-center">
              <div className="relative group cursor-pointer">
                <img 
                  src={require('../images/logo.png')} 
                  alt="TARMUZ - شركة التصميم والاستشارات" 
                  className="h-12 w-auto group-hover:scale-105 transition-transform duration-300 object-contain"
                  style={{ 
                    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>
            
            {/* Desktop Navigation Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`group relative px-4 py-2 font-medium transition-all duration-300 ${
                    activeSection === item.id 
                      ? 'text-emerald-400 border-b-2 border-emerald-400' 
                      : 'text-slate-300 hover:text-emerald-400 hover:border-b-2 hover:border-emerald-500'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                  <span className="text-sm">{item.label}</span>
                  </span>
                </button>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors duration-200"
                title={t('navigation.language')}
              >
                <Languages size={18} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-300 hidden sm:block">
                  {language === 'ar' ? 'EN' : 'ع'}
                </span>
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-200"
              >
                <ShoppingCart size={20} />
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {getCartItemsCount()}
                  </span>
                )}
              </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                  <span className={`block h-0.5 w-full bg-gray-600 transform transition-all duration-300 ${
                    isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}></span>
                  <span className={`block h-0.5 w-full bg-gray-600 transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}></span>
                  <span className={`block h-0.5 w-full bg-gray-600 transform transition-all duration-300 ${
                    isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}></span>
              </div>
            </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-slate-900 border-t border-slate-700 shadow-lg">
            <div className="px-4 py-4 space-y-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeSection === item.id 
                      ? 'bg-emerald-900/30 text-emerald-400 border-l-4 border-emerald-400' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-emerald-400'
                  }`}
                >
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {heroLoading ? (
        <div className="h-96 flex items-center justify-center text-xl">جاري تحميل البانر...</div>
      ) : heroData && heroData.images && heroData.images.length > 0 ? (
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0 transition-all duration-1000">
            <img
              src={heroData.images[currentSlide]}
              alt="Hero Background"
              className="w-full h-full object-cover"
              onError={e => { e.target.style.display = 'none'; }}
            />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white z-10">
          <div className="max-w-5xl">
            {/* Title */}
            <div className="mb-8">
                <div className={`inline-block px-6 py-3 rounded-full bg-gradient-to-r ${heroSlides[currentSlide].accent} text-slate-800 font-bold text-sm mb-6`}>
                  ✨ {t('hero.badge')}
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                <span className="block bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                    {heroData[language]?.title || ''}
                </span>
              </h1>
            </div>
            
              <h2 className="text-3xl md:text-5xl mb-8 text-slate-200 leading-relaxed font-bold">
                {heroData[language]?.subtitle || ''}
              </h2>
              
              <p className="text-xl md:text-2xl mb-12 text-slate-300 leading-relaxed font-medium max-w-4xl">
                {heroData[language]?.description || ''}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 mb-12">
                {heroData[language]?.buttons?.map((btn, i) => btn.label && btn.link && (
                  <a key={i} href={btn.link} className="group px-10 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg rounded-2xl hover:shadow-xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-3"
              >
                    <span>{btn.label}</span>
                <ArrowLeft className="group-hover:-translate-x-1 transition-transform duration-150" size={20} />
                  </a>
                ))}
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
            <div className="text-white/80 text-sm mb-2">{t('cta.discoverMore')}</div>
          <ChevronDown className="text-white mx-auto" size={32} />
        </div>
      </section>
      ) : heroData && (!heroData.images || heroData.images.length === 0) ? (
        // لا توجد صور للبانر - عرض رسالة واضحة
        <section className="h-96 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
          <div className="text-center">
            <div className="text-6xl mb-4">🖼️</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">لا توجد صور للبانر</h2>
            <p className="text-gray-500 mb-4">يرجى إضافة صور للبانر من لوحة التحكم</p>
            <a 
              href="/admin" 
              className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Settings size={20} className="ml-2" />
              الذهاب للوحة التحكم
            </a>
          </div>
        </section>
      ) : (
        // fallback أو لا توجد بيانات
        <section className="h-96 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center">
            <div className="text-6xl mb-4">⚙️</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">لا توجد بيانات للبانر</h2>
            <p className="text-gray-500 mb-4">يرجى إعداد البانر من لوحة التحكم</p>
            <a 
              href="/admin" 
              className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Settings size={20} className="ml-2" />
              الذهاب للوحة التحكم
            </a>
          </div>
        </section>
      )}

      {/* About Section */}
      {siteVisibility.about && (
      <section id="about" className="py-32 bg-gradient-to-br from-stone-50 via-white to-emerald-50/20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 font-bold text-sm mb-8 border border-emerald-200">
              🏢 {t('about.badge')}
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-slate-800 mb-8">
                {aboutData ? (language === 'en' ? (aboutData.en?.title || t('about.title')) : (aboutData.ar?.title || t('about.title'))) : t('about.title')}
            </h2>
            <div className="w-32 h-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              {aboutData ? (language === 'en' ? (aboutData.en?.content || t('about.description')) : (aboutData.ar?.content || t('about.description'))) : t('about.description')}
                  </p>
                </div>
                
          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Company Story */}
            <div className="space-y-8">
              <div className="bg-slate-50/90 backdrop-blur-lg rounded-3xl p-10 shadow-xl border border-slate-200/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-2xl ml-4">
                      {aboutData ? (language === 'en' ? (aboutData.en?.story?.icon || '🏢') : (aboutData.ar?.story?.icon || '🏢')) : '🏢'}
                    </div>
                    <h3 className="text-2xl font-black text-slate-800">{aboutData ? (language === 'en' ? (aboutData.en?.story?.title || t('about.story.title')) : (aboutData.ar?.story?.title || t('about.story.title'))) : t('about.story.title')}</h3>
                  </div>
                  <p className="text-lg text-slate-700 leading-relaxed">
                    {aboutData ? (language === 'en' ? (aboutData.en?.story?.description || t('about.story.description')) : (aboutData.ar?.story?.description || t('about.story.description'))) : t('about.story.description')}
                  </p>
                </div>
                </div>

              <div className="bg-slate-50/90 backdrop-blur-lg rounded-3xl p-10 shadow-xl border border-slate-200/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-cyan-50/50"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center text-2xl ml-4">
                      {aboutData ? (language === 'en' ? (aboutData.en?.visionMission?.icon || '🎯') : (aboutData.ar?.visionMission?.icon || '🎯')) : '🎯'}
                </div>
                    <h3 className="text-2xl font-black text-slate-800">{aboutData ? (language === 'en' ? (aboutData.en?.visionMission?.title || t('about.visionMission.title')) : (aboutData.ar?.visionMission?.title || t('about.visionMission.title'))) : t('about.visionMission.title')}</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-bold text-emerald-600 mb-2">{aboutData ? (language === 'en' ? (aboutData.en?.visionMission?.vision?.title || t('about.visionMission.vision.title')) : (aboutData.ar?.visionMission?.vision?.title || t('about.visionMission.vision.title'))) : t('about.visionMission.vision.title')}</h4>
                      <p className="text-slate-700">{aboutData ? (language === 'en' ? (aboutData.en?.visionMission?.vision?.description || t('about.visionMission.vision.description')) : (aboutData.ar?.visionMission?.vision?.description || t('about.visionMission.vision.description'))) : t('about.visionMission.vision.description')}</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-teal-600 mb-2">{aboutData ? (language === 'en' ? (aboutData.en?.visionMission?.mission?.title || t('about.visionMission.mission.title')) : (aboutData.ar?.visionMission?.mission?.title || t('about.visionMission.mission.title'))) : t('about.visionMission.mission.title')}</h4>
                      <p className="text-slate-700">{aboutData ? (language === 'en' ? (aboutData.en?.visionMission?.mission?.description || t('about.visionMission.mission.description')) : (aboutData.ar?.visionMission?.mission?.description || t('about.visionMission.mission.description'))) : t('about.visionMission.mission.description')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Values & Stats */}
            <div className="space-y-8">
              <div className="bg-slate-50/90 backdrop-blur-lg rounded-3xl p-10 shadow-xl border border-slate-200/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-stone-50/50 to-emerald-50/50"></div>
                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-stone-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Heart className="text-white" size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mb-4">{t('about.values.title')}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {(aboutData ? (language === 'en' ? (aboutData.en?.values || []) : (aboutData.ar?.values || [])) : t('about.values.items')).map((value, index) => (
                      <div key={index} className="flex items-center space-x-reverse space-x-4 p-4 bg-slate-100/60 rounded-2xl hover:bg-slate-100/80 transition-all duration-300">
                        <div className="text-2xl">{value.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800 text-sm">{value.title}</h4>
                          <p className="text-slate-600 text-xs">{value.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-center text-white">
                  <div className="text-3xl font-black mb-2">{aboutData ? (language === 'en' ? (aboutData.en?.stats?.years || '15+') : (aboutData.ar?.stats?.years || '15+')) : '15+'}</div>
                  <div className="text-sm font-medium">{language === 'en' ? 'Years of Experience' : 'سنة خبرة'}</div>
                </div>
                <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-6 text-center text-white">
                  <div className="text-3xl font-black mb-2">{aboutData ? (language === 'en' ? (aboutData.en?.stats?.projects || '100+') : (aboutData.ar?.stats?.projects || '100+')) : '100+'}</div>
                  <div className="text-sm font-medium">{language === 'en' ? 'Completed Projects' : 'مشروع مكتمل'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          {siteVisibility.why !== false && (
          <div className="text-center">
              <h3 className="text-3xl font-black text-slate-800 mb-12">{whyData ? (language === 'en' ? (whyData.en?.title || t('about.whyChooseUs.title')) : (whyData.ar?.title || t('about.whyChooseUs.title'))) : t('about.whyChooseUs.title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(whyData ? (language === 'en' ? (whyData.en?.items || []) : (whyData.ar?.items || [])) : [
                  { icon: '🎨', title: t('about.whyChooseUs.features.0.title'), description: t('about.whyChooseUs.features.0.description') },
                  { icon: '⚡', title: t('about.whyChooseUs.features.1.title'), description: t('about.whyChooseUs.features.1.description') },
                  { icon: '🤝', title: t('about.whyChooseUs.features.2.title'), description: t('about.whyChooseUs.features.2.description') },
                ]).map((feature, index) => (
                <div
                  key={index}
                  className="group bg-slate-50/80 backdrop-blur-lg rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-slate-200/50 hover:border-slate-300/50 transform hover:-translate-y-2 hover:scale-105"
                >
                  <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon || '✨'}
                  </div>
                  <h4 className="text-xl font-black text-slate-800 mb-4 group-hover:text-emerald-700 transition-colors duration-300">
                    {feature.title}
                  </h4>
                  <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>
      </section>
      )}

      {/* Services Section */}
      {siteVisibility.services && (
        <section id="services" className="py-16 md:py-20 bg-gradient-to-br from-stone-50 via-white to-emerald-50/20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 font-bold text-xs md:text-sm mb-4 md:mb-6">
              ✨ {t('services.title')}
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 mb-4 md:mb-6">
                {t('services.title')}
            </h2>
            <div className="w-24 h-1 bg-emerald-600 rounded-full mx-auto mb-4 md:mb-6"></div>
            <p className="text-base md:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed px-4">
              {t('services.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-12">
            {getDisplayServices().map((service, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 transform hover:-translate-y-2 overflow-hidden"
              >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Service Icon */}
                <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-all duration-300 shadow-md">
                  <div className="scale-75">{service.icon}</div>
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors duration-300 line-clamp-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4 group-hover:text-slate-700 transition-colors duration-300 line-clamp-3">
                    {service.description}
                  </p>
                  
                  {/* Service Details */}
                  <div className="mb-4">
                    <ul className="space-y-1">
                      {service.details.slice(0, 3).map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start text-xs text-slate-600 group-hover:text-slate-700 transition-colors duration-300">
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-1.5 ml-2 flex-shrink-0"></div>
                          <span className="line-clamp-1">{detail}</span>
                        </li>
                      ))}
                      {service.details.length > 3 && (
                        <li className="text-xs text-slate-500 italic">
                          +{service.details.length - 3} المزيد...
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  {/* Price */}
                  {service.price > 0 && (
                  <div className="mb-4">
                    <span className="text-lg font-bold text-emerald-600">{service.price} {t('services.sar')}</span>
                  </div>
                  )}

                  {/* CTA Button */}
                  <button 
                      onClick={() => addToCart(service)}
                    className="w-full flex items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-2.5 px-4 rounded-xl opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:from-emerald-600 hover:to-teal-700 shadow-md hover:shadow-lg text-sm"
                    >
                    <ShoppingCart size={14} className="ml-1 group-hover:scale-110 transition-transform duration-300" />
                      <span>{t('services.addToCart')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Success Stories CTA Section */}
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 rounded-2xl p-8 md:p-12 shadow-xl max-w-4xl mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
              <div className="relative z-10">
                <div className="text-3xl md:text-4xl mb-4 md:mb-6">🏆</div>
                <h3 className="text-2xl md:text-3xl font-black text-black mb-4 md:mb-6">{t('works.badge')}</h3>
                <p className="text-base md:text-lg text-black/80 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
                  {t('works.subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => scrollToSection('works')}
                    className="px-8 md:px-10 py-3 md:py-5 bg-white/20 backdrop-blur-sm text-black font-bold text-base md:text-lg rounded-xl md:rounded-2xl border border-black/30 hover:bg-white/30 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-3"
                  >
                    <Play size={16} className="md:w-5 md:h-5" />
                    <span>{t('works.viewAll')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Our Works Section */}
      {siteVisibility.works && (
      <section id="works" className="py-32 bg-gradient-to-br from-stone-50 via-white to-emerald-50/20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 font-bold text-sm mb-8 border border-emerald-200">
              🎨 {t('works.badge')}
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-slate-800 mb-8">
              {t('works.title')}
            </h2>
            <div className="w-32 h-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              {t('works.subtitle')}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {[
              { id: 'all', label: t('works.tabs.0'), icon: '🎯' },
              ...firebaseCategories.map(cat => ({
                id: cat.id,
                label: language === 'en' ? (cat.name_en || cat.name) : cat.name,
                icon: '🏗️'
              }))
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center space-x-reverse space-x-3 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl transform scale-105'
                    : 'bg-white/80 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 border border-emerald-200/50 hover:border-emerald-300/50'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
            </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {isLoadingProjects ? (
              <div className="col-span-full text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                <p className="mt-4 text-slate-600">{t('states.loadingProjects')}</p>
              </div>
            ) : getDisplayProjects().length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">📂</div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">{t('states.noProjects')}</h3>
                <p className="text-slate-500">{t('states.addProjectsFromDashboard')}</p>
              </div>
            ) : (
              getDisplayProjects().map((project, index) => (
              <div
                key={project.id}
                className="group bg-white/90 backdrop-blur-lg rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-emerald-100/50 hover:border-emerald-300/50 transform hover:-translate-y-2 hover:scale-105 cursor-pointer"
                onClick={() => {
                  setSelectedProject(project);
                  setCurrentImageIndex(0);
                  setIsProjectModalOpen(true);
                }}
              >
                <div className="relative overflow-hidden">
                  {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-64 object-cover md:h-56 lg:h-56 object-center group-hover:scale-105 transition-transform duration-500"
                    style={{ imageRendering: 'auto' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                      <span className="text-8xl">{project.emoji || '🏗️'}</span>
                    </div>
                  )}
                  
                  {/* Fallback display for broken images */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center" style={{display: 'none'}}>
                    <span className="text-8xl">{project.emoji || '🏗️'}</span>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <Play className="text-white" size={24} />
                    </div>
                      <p className="text-sm font-bold">{t('works.viewProject')}</p>
                      </div>
                    </div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full">
                      {project.category}
                    </span>
                  </div>
                  
                  {/* Year Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-slate-100/90 text-slate-800 text-xs font-bold rounded-full">
                      {project.year}
                      </span>
                    </div>
                  </div>
                  
                <div className="p-5">
                  <h3 className="text-lg font-black text-slate-800 mb-2 group-hover:text-emerald-700 transition-colors duration-300 line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed group-hover:text-slate-700 transition-colors duration-300 line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </div>
              ))
            )}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-3xl p-12 max-w-4xl mx-auto border border-emerald-200/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Play className="text-white" size={32} />
                </div>
                <h3 className="text-3xl md:text-4xl font-black mb-6 text-slate-800">{t('works.cta.title')}</h3>
                <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                  {t('works.cta.description')}
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <button 
                    onClick={() => scrollToSection('contact')}
                    className="px-12 py-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xl rounded-2xl hover:shadow-2xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-3"
                  >
                    <Play size={24} />
                    <span>{t('works.cta.button')}</span>
                  </button>
                </div>
              </div>
          </div>
          </div>
        </div>
      </section>
      )}

      {/* Our Clients Section */}
      {siteVisibility.clients && (
      <section id="clients" className="py-32 bg-gradient-to-br from-stone-50 via-white to-emerald-50/20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 font-bold text-sm mb-8 border border-emerald-200">
              🤝 {t('clients.badge')}
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-slate-800 mb-8">
              {t('clients.title')}
            </h2>
            <div className="w-32 h-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              {t('clients.subtitle')}
            </p>
          </div>

          {/* Dynamic Clients from Firebase */}
          {isLoadingClients ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              <p className="mt-4 text-gray-600">جاري تحميل العملاء...</p>
            </div>
          ) : clients.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="group bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100/50 hover:border-emerald-200/50 transform hover:-translate-y-2"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl overflow-hidden shadow-md bg-gray-100">
                      {client.logo ? (
                        <img
                          src={client.logo}
                          alt={client.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className="w-full h-full flex items-center justify-center text-gray-400"
                        style={{ display: client.logo ? 'none' : 'flex' }}
                      >
                        <Users size={32} />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {language === 'ar' ? client.name : (client.name_en || client.name)}
                    </h3>
                    
                    {client.description && (
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        {language === 'ar' ? client.description : (client.description_en || client.description)}
                      </p>
                    )}
                    
                    {client.website && (
                      <a
                        href={client.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
                      >
                        <Globe size={16} className="ml-1" />
                        زيارة الموقع
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users size={32} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">لا يوجد عملاء حالياً</h3>
              <p className="text-gray-500">سيتم إضافة العملاء قريباً</p>
            </div>
          )}

          {/* Static Client Categories - Fallback */}
          <div className="hidden grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                category: "القطاع العقاري",
                clients: [
                  { 
                    name: "شركة التطوير العقاري", 
                    logo: require('../images/clients/real-estate-1.jpg'),
                    description: "مشاريع سكنية وتجارية"
                  },
                  { 
                    name: "مجمع تجاري راقي", 
                    logo: require('../images/clients/real-estate-2.jpg'),
                    description: "مراكز تسوق متكاملة"
                  },
                  { 
                    name: "مؤسسة استثمارية", 
                    logo: require('../images/clients/real-estate-3.jpg'),
                    description: "استثمارات عقارية"
                  }
                ],
                gradient: "from-emerald-500 to-teal-500",
                icon: "🏢"
              },
              {
                category: "القطاع التجاري",
                clients: [
                  { 
                    name: "مطعم راقي", 
                    logo: require('../images/clients/commercial-1.jpg'),
                    description: "مطاعم ومقاهي راقية"
                  },
                  { 
                    name: "مقهى عصري", 
                    logo: require('../images/clients/commercial-2.jpg'),
                    description: "مقاهي عصرية"
                  },
                  { 
                    name: "فندق فاخر", 
                    logo: require('../images/clients/commercial-3.jpg'),
                    description: "فنادق ومنتجعات"
                  }
                ],
                gradient: "from-teal-500 to-cyan-500",
                icon: "🛍️"
              },
              {
                category: "القطاع الخدمي",
                clients: [
                  { 
                    name: "مؤسسة تعليمية", 
                    logo: require('../images/clients/service-1.jpg'),
                    description: "جامعات ومدارس"
                  },
                  { 
                    name: "مستشفى متخصص", 
                    logo: require('../images/clients/service-2.jpg'),
                    description: "مراكز طبية"
                  },
                  { 
                    name: "مؤسسة حكومية", 
                    logo: require('../images/clients/service-3.jpg'),
                    description: "جهات حكومية"
                  }
                ],
                gradient: "from-stone-400 to-emerald-500",
                icon: "🎓"
              }
            ].map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                className="group bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-emerald-100/50 hover:border-emerald-300/50 transform hover:-translate-y-2 hover:scale-102 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${category.gradient} rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {category.icon}
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 group-hover:text-emerald-700 transition-colors duration-300">
                      {category.category}
                    </h3>
                    </div>
                    
                  <div className="space-y-4">
                    {category.clients.map((client, clientIndex) => (
                      <div
                        key={clientIndex}
                        className="flex items-center space-x-reverse space-x-4 p-4 bg-gray-50/50 rounded-2xl group-hover:bg-white/90 transition-all duration-300"
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                          <img
                            src={client.logo}
                            alt={client.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className={`w-full h-full bg-gradient-to-r ${category.gradient} flex items-center justify-center text-white font-bold text-lg hidden`}>
                            {client.name.charAt(0)}
                    </div>
                  </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-gray-700 group-hover:text-gray-800 transition-colors duration-300 truncate">
                            {client.name}
                          </h4>
                          <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300 truncate">
                            {client.description}
                          </p>
                        </div>
                        <div className={`w-2 h-2 bg-gradient-to-r ${category.gradient} rounded-full group-hover:scale-150 transition-transform duration-300 flex-shrink-0`}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

              
          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-3xl p-12 max-w-4xl mx-auto border border-emerald-200/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Users className="text-white" size={32} />
                </div>
                <h3 className="text-3xl md:text-4xl font-black mb-6 text-gray-800">{t('clients.joinClientsTitle')}</h3>
                <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                  {t('clients.joinClientsDescription')}
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <button 
                    onClick={() => scrollToSection('contact')}
                    className="px-12 py-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xl rounded-2xl hover:shadow-2xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-3"
                  >
                    <Users size={24} />
                    <span>{t('clients.joinClientsButton')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Team Section */}
      {siteVisibility.team && (
      <section id="team" className="py-32 bg-gradient-to-br from-stone-50 via-white to-emerald-50/30 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-stone-400/5 rounded-full blur-2xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 font-bold text-sm mb-8 border border-emerald-200">
              👥 {t('about.team.title')}
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-slate-800 mb-8">
              {t('about.team.title')}
            </h2>
            <div className="w-32 h-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              {t('about.team.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
            {isLoadingTeam ? (
              <div className="col-span-full flex justify-center items-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                  <p className="text-slate-600">{t('states.loadingTeam')}</p>
                </div>
              </div>
            ) : firebaseTeam.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="text-slate-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">{t('states.noTeam')}</h3>
                <p className="text-slate-500">{t('states.teamComingSoon')}</p>
              </div>
            ) : firebaseTeam.map((member, index) => (
                  <div
                key={index}
                className="group relative bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-emerald-100/50 hover:border-emerald-300/50 transform hover:-translate-y-2 hover:scale-102 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${member.gradient} opacity-0 group-hover:opacity-3 transition-opacity duration-500`}></div>
                
                <div className="relative z-10 text-center">
                  <div className="mb-8">
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg border-4 border-white">
                      {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      ) : null}
                      <div className="w-full h-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-4xl" style={{ display: member.image ? 'none' : 'flex' }}>
                        👤
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-gray-800 mb-3 group-hover:text-emerald-700 transition-colors duration-300">
                    {language === 'en' ? (member.name_en || member.name) : member.name}
                  </h3>
                  
                  <p className="text-lg font-bold text-emerald-600 mb-3 group-hover:text-emerald-700 transition-colors duration-300">
                    {language === 'en' ? (member.position_en || member.position) : member.position}
                  </p>
                  
                  {member.bio && (
                    <p className="text-sm text-gray-500 mb-4 group-hover:text-gray-600 transition-colors duration-300 leading-relaxed">
                      {language === 'en' ? (member.bio_en || member.bio) : member.bio}
                  </p>
                  )}
                  
                  <div className="inline-block px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full text-white font-bold text-sm mb-6 group-hover:scale-105 transition-transform duration-300 shadow-md">
                    {t('team.memberRole')}
                  </div>
                </div>
                  </div>
                ))}
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-xl rounded-3xl p-12 max-w-5xl mx-auto border border-emerald-400/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Users className="text-white" size={32} />
                </div>
                <h3 className="text-3xl md:text-4xl font-black mb-6 text-gray-800">{t('team.joinTeamTitle')}</h3>
                <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                  {t('team.joinTeamDescription')}
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <button 
                    onClick={() => scrollToSection('contact')}
                    className="px-12 py-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xl rounded-2xl hover:shadow-2xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-3"
                  >
                    <Users size={24} />
                    <span>{t('team.joinTeamButton')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Stats Section */}
      {siteVisibility.stats && (
      <section id="stats" className="py-32 bg-gradient-to-br from-stone-50 via-white to-emerald-50/20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-stone-400/5 rounded-full blur-2xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 font-bold text-sm mb-8 border border-emerald-200">
              🏆 {t('stats.badge')}
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-800 mb-8">
                {t('stats.badge')}
            </h2>
            <div className="w-32 h-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('stats.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group text-center"
              >
                <div className={`bg-gradient-to-br ${stat.bgColor} backdrop-blur-lg rounded-3xl p-8 group-hover:shadow-2xl transition-all duration-500 border border-white/50 hover:border-white/80 transform hover:-translate-y-3 hover:scale-105 relative overflow-hidden`}>
                  {/* Background Pattern */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  
                  {/* Icon */}
                  <div className={`relative z-10 w-20 h-20 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-xl`}>
                    {stat.icon}
                  </div>
                  
                  {/* Number */}
                  <div className="relative z-10 text-4xl md:text-5xl font-black mb-3 text-gray-800 group-hover:text-emerald-700 transition-colors duration-300">
                      {stat.number}
                  </div>
                  
                  {/* Label */}
                  <div className="relative z-10 text-lg font-bold text-gray-700 group-hover:text-gray-800 transition-colors duration-300 mb-2">
                    {stat.label}
                  </div>
                  
                  {/* Description */}
                  <div className="relative z-10 text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300 leading-relaxed">
                    {stat.description}
                  </div>
                  
                  {/* Decorative Element */}
                  <div className={`absolute top-4 right-4 w-3 h-3 bg-gradient-to-r ${stat.color} rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-300`}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-3xl p-12 max-w-4xl mx-auto border border-emerald-200/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Award className="text-white" size={32} />
                </div>
                <h3 className="text-3xl md:text-4xl font-black mb-6 text-gray-800">{t('success.joinSuccessTitle')}</h3>
                <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                  {t('success.joinSuccessDescription')}
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <button 
                    onClick={() => scrollToSection('contact')}
                    className="px-12 py-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xl rounded-2xl hover:shadow-2xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-3"
                  >
                    <Award size={24} />
                    <span>{t('success.joinSuccessButton')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Testimonials Section */}
      {siteVisibility.testimonials && (
      <section id="testimonials" className="py-32 bg-gradient-to-br from-stone-50 via-white to-emerald-50/30 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-stone-400/5 rounded-full blur-2xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 font-bold text-sm mb-8 border border-emerald-200">
              💬 {t('success.badge')}
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-slate-800 mb-8">
              {t('success.badge')}
            </h2>
            <div className="w-32 h-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              {t('success.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
            {isLoadingTestimonials ? (
              <div className="col-span-full text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                <p className="mt-4 text-gray-600">جاري تحميل آراء العملاء...</p>
              </div>
            ) : getDisplayTestimonials().length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد آراء عملاء متاحة</h3>
                <p className="text-gray-500">سيتم عرض آراء العملاء هنا عند إضافتها من لوحة التحكم</p>
              </div>
            ) : getDisplayTestimonials().map((testimonial, index) => (
              <div
                key={index}
                className="group relative bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-100/50 hover:border-emerald-200/50 transform hover:-translate-y-2 hover:scale-102 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-3 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  {/* Client Info */}
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      {testimonial.image ? (
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      ) : null}
                      <div className={`w-full h-full bg-gradient-to-r ${testimonial.gradient} flex items-center justify-center text-white font-bold text-xl ${testimonial.image ? 'hidden' : 'flex'}`}>
                        {testimonial.name ? testimonial.name.charAt(0) : '?'}
                      </div>
                    </div>
                    <div className="mr-4 flex-1">
                      <h4 className="text-lg font-bold text-gray-800 group-hover:text-emerald-700 transition-colors duration-300">
                        {testimonial.name || 'عميل'}
                      </h4>
                      {testimonial.position && (
                      <p className="text-emerald-600 font-medium text-sm">
                        {testimonial.position}
                      </p>
                      )}
                      {testimonial.company && (
                      <p className="text-gray-500 text-xs">
                        {testimonial.company}
                      </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Stars */}
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  {/* Comment */}
                  <div className="relative mb-6">
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 text-sm">
                      {testimonial.comment || 'لا يوجد تعليق متاح'}
                    </p>
                  </div>
                  
                  {/* Project Badge */}
                  {testimonial.project && (
                  <div className={`inline-block px-3 py-2 bg-gradient-to-r ${testimonial.gradient} rounded-full text-white font-medium text-xs group-hover:scale-105 transition-transform duration-300`}>
                    {testimonial.project}
                  </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-xl rounded-3xl p-12 max-w-5xl mx-auto border border-emerald-400/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Heart className="text-white" size={32} />
                </div>
                <h3 className="text-3xl md:text-4xl font-black mb-6 text-gray-800">{t('success.shareOpinion.title')}</h3>
                <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                  {t('success.shareOpinion.description')}
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <button 
                    onClick={() => scrollToSection('contact')}
                    className="px-12 py-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xl rounded-2xl hover:shadow-2xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-3"
                  >
                    <Heart size={24} />
                    <span>شارك رأيك</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Contact Section */}
      {siteVisibility.contact && (
      <section id="contact" className="py-32 bg-gradient-to-br from-stone-50 via-white to-emerald-50/30 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-stone-400/5 rounded-full blur-2xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 font-bold text-sm mb-8 border border-emerald-200">
              📞 {t('contact.badge')}
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-slate-800 mb-8">
                {t('contact.title')}
            </h2>
            <div className="w-32 h-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              {t('contact.experienceText')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-20">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-10 shadow-xl border border-emerald-200/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50"></div>
                <div className="relative z-10">
                  <h3 className="text-3xl font-black text-gray-800 mb-8 flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center ml-4">
                      <Phone className="text-white" size={24} />
                    </div>
                    {t('contact.info.title')}
                  </h3>
                  
                  <div className="space-y-8">
                    {isLoadingContact ? (
                      <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                        <span className="mr-3 text-slate-600">{t('states.loadingContact')}</span>
                      </div>
                    ) : [
                      { 
                        icon: <Phone size={24} />, 
                        label: t('contact.phone'), 
                        value: firebaseContactInfo.phone || "+966 50 123 4567", 
                        gradient: "from-emerald-500 to-teal-500",
                        dir: "ltr"
                      },
                      { 
                        icon: <Mail size={24} />, 
                        label: t('contact.email'), 
                        value: firebaseContactInfo.email || "info@tramuz-design.com", 
                        gradient: "from-teal-500 to-cyan-500",
                        dir: "ltr"
                      },
                      { 
                        icon: <MapPin size={24} />, 
                        label: t('contact.address'), 
                        value: language === 'en' ? (firebaseContactInfo.address_en || firebaseContactInfo.address || "Riyadh, Saudi Arabia") : (firebaseContactInfo.address || "الرياض حي النرجس شارع الملك فهد مبنى التصميم الحديث - الطابق الثالث"), 
                        gradient: "from-emerald-600 to-teal-600"
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center group">
                        <div className={`w-16 h-16 bg-gradient-to-r ${item.gradient} rounded-2xl flex items-center justify-center text-white ml-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                          {item.icon}
                        </div>
                        <div>
                          <div className="font-bold text-gray-800 text-lg mb-1 group-hover:text-emerald-700 transition-colors duration-300">{item.label}</div>
                          <div className="text-gray-600 text-lg group-hover:text-gray-700 transition-colors duration-300" dir={item.dir || "rtl"}>{item.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-12 border border-emerald-200/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-teal-50/30 to-cyan-50/30"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-10">
                  <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Mail className="text-white" size={32} />
                  </div>
                  <h3 className="text-3xl font-black text-gray-800 mb-2">{t('contact.form.title')}</h3>
                  <p className="text-gray-600 text-lg">{t('contact.form.subtitle')}</p>
                </div>

                <form onSubmit={handleSubmitForm} className="space-y-8">
                  <div className="group">
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                      {t('contact.form.name')}
                      </label>
                      <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                        className="w-full px-6 py-4 border-2 border-emerald-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 text-lg group-hover:border-emerald-300"
                      placeholder={t('contact.form.namePlaceholder')}
                      required
                      />
                    </div>
                  
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      {t('contact.form.email')}
                    </label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      className="w-full px-6 py-4 border-2 border-emerald-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 text-lg group-hover:border-emerald-300"
                      placeholder="your@email.com"
                      dir="ltr"
                      required
                    />
                  </div>
                  
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      {t('contact.form.phone')}
                    </label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                      className="w-full px-6 py-4 border-2 border-emerald-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 text-lg group-hover:border-emerald-300"
                      placeholder="+966 50 123 4567"
                      dir="ltr"
                      required
                    />
                  </div>
                  
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      {t('contact.form.serviceType')}
                    </label>
                    <select 
                      value={contactForm.serviceType}
                      onChange={(e) => setContactForm({...contactForm, serviceType: e.target.value})}
                      className="w-full px-6 py-4 border-2 border-emerald-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 text-lg group-hover:border-emerald-300"
                    >
                      <option value="">{t('contact.form.selectService')}</option>
                      <option value={t('services.interiorDesign.title')}>{t('services.interiorDesign.title')}</option>
                      <option value={t('services.exteriorDesign.title')}>{t('services.exteriorDesign.title')}</option>
                      <option value={t('services.urbanPlanning.title')}>{t('services.urbanPlanning.title')}</option>
                      <option value={t('services.landscapeDesign.title')}>{t('services.landscapeDesign.title')}</option>
                      <option value={t('services.brandDevelopment.title')}>{t('services.brandDevelopment.title')}</option>
                      <option value={t('services.marketingConsulting.title')}>{t('services.marketingConsulting.title')}</option>
                      <option value={t('contact.form.operationalConsulting')}>{t('contact.form.operationalConsulting')}</option>
                      <option value={t('contact.form.technicalConsulting')}>{t('contact.form.technicalConsulting')}</option>
                      <option value={t('contact.form.recruitmentTraining')}>{t('contact.form.recruitmentTraining')}</option>
                      <option value={t('contact.form.contractManagement')}>{t('contact.form.contractManagement')}</option>
                      <option value={t('contact.form.feasibilityStudy')}>{t('contact.form.feasibilityStudy')}</option>
                      <option value={t('contact.form.corporateRelations')}>{t('contact.form.corporateRelations')}</option>
                      <option value={t('contact.form.other')}>{t('contact.form.other')}</option>
                    </select>
                  </div>
                  
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      {t('contact.form.projectDetails')}
                    </label>
                    <textarea
                      rows={4}
                      value={contactForm.projectDetails}
                      onChange={(e) => setContactForm({...contactForm, projectDetails: e.target.value})}
                      className="w-full px-6 py-4 border-2 border-emerald-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 text-lg resize-none group-hover:border-emerald-300"
                      placeholder={t('contact.form.projectDetailsPlaceholder')}
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmittingForm}
                    className={`w-full px-12 py-6 text-white font-bold text-xl rounded-2xl transition-all duration-300 flex items-center justify-center space-x-reverse space-x-3 ${
                      isSubmittingForm 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-2xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105'
                    }`}
                  >
                    {isSubmittingForm ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <span>{t('contact.form.sending')}</span>
                      </>
                    ) : (
                      <>
                    <Sparkles size={24} />
                        <span>{t('contact.form.sendViaWhatsApp')}</span>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                        </svg>
                      </>
                    )}
                  </button>
                </form>
                
                {/* WhatsApp Notice */}
                {firebaseContactInfo.whatsapp && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#25D366] rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-emerald-800">
                          {t('contact.form.whatsappNotice.title')}
                        </p>
                        <p className="text-xs text-emerald-600 mt-1">
                          {t('contact.form.whatsappNotice.description')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {!firebaseContactInfo.whatsapp && (
                  <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-yellow-800">
                          {t('contact.form.whatsappUnavailable.title')}
                        </p>
                        <p className="text-xs text-yellow-600 mt-1">
                          {t('contact.form.whatsappUnavailable.description')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Success Stories Section */}
      <section className="py-16 bg-gradient-to-br from-stone-50 via-white to-emerald-50/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 mb-4">
              <span className="text-lg mr-2">🏆</span>
              <span className="text-emerald-700 font-medium text-sm">{t('success.stories.title')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('success.stories.title')}
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 mx-auto rounded-full mb-4"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('success.stories.description')}
            </p>
          </div>

          {/* Success Stories Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "مطعم راقي في الرياض",
                description: "تصميم داخلي وخارجي متكامل لمطعم راقي",
                result: "زيادة في المبيعات بنسبة 40%",
                icon: "🍽️",
                gradient: "from-emerald-500 to-teal-500",
                bgGradient: "from-emerald-500/10 to-teal-500/10"
              },
              {
                title: "مقهى عصري في جدة",
                description: "تصميم مقهى عصري مع هوية بصرية مميزة",
                result: "زيادة في عدد العملاء بنسبة 60%",
                icon: "☕",
                gradient: "from-teal-500 to-cyan-500",
                bgGradient: "from-teal-500/10 to-cyan-500/10"
              },
              {
                title: "مجمع تجاري متكامل",
                description: "تخطيط حضري وتصميم مجمع تجاري كبير",
                result: "جذب أكثر من 100 متجر",
                icon: "🏢",
                gradient: "from-stone-400 to-emerald-500",
                bgGradient: "from-stone-400/10 to-emerald-500/10"
              },
              {
                title: "حديقة عامة ملهمة",
                description: "تصميم مناظر طبيعية لحديقة عامة",
                result: "زيادة كبيرة في الزوار",
                icon: "🌳",
                gradient: "from-emerald-600 to-teal-600",
                bgGradient: "from-emerald-600/10 to-teal-600/10"
              },
              {
                title: "هوية بصرية لسلسلة مطاعم",
                description: "تطوير علامة تجارية متكاملة لسلسلة مطاعم",
                result: "زيادة الوعي بالعلامة التجارية بنسبة 80%",
                icon: "🎨",
                gradient: "from-teal-600 to-emerald-600",
                bgGradient: "from-teal-600/10 to-emerald-600/10"
              },
              {
                title: "استشارات تسويقية لمشروع جديد",
                description: "استراتيجية تسويقية شاملة لمشروع مطعم",
                result: "زيادة المبيعات بنسبة 120%",
                icon: "📈",
                gradient: "from-emerald-700 to-teal-700",
                bgGradient: "from-emerald-700/10 to-teal-700/10"
              }
            ].map((story, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${story.bgGradient} flex items-center justify-center mr-4 flex-shrink-0`}>
                    <span className="text-xl">{story.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{story.title}</h3>
                    <p className="text-gray-500 text-sm">{story.description}</p>
                  </div>
                  </div>
                  
                <div className="mt-4">
                  <div className={`inline-block px-3 py-1 bg-gradient-to-r ${story.gradient} rounded-lg text-white font-medium text-sm`}>
                      {story.result}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('success.joinSuccessTitle')}</h3>
              <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                {t('success.joinSuccessDescription')}
              </p>
                  <button 
                    onClick={() => scrollToSection('contact')}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
                  >
                {t('success.joinSuccessButton')}
                  </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-emerald-900/20 to-teal-900/20 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/95"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Main Footer Content */}
          <div className="py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              
              {/* Company Info */}
              <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <img 
                  src={require('../images/logo.png')} 
                    alt="TARMUZ - شركة التصميم والاستشارات" 
                    className="w-20 h-20 ml-3 object-contain"
                    style={{ 
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                      maxWidth: '100%',
                      height: 'auto'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full ml-2 shadow-lg"></div>
              </div>
                <h3 className="text-2xl font-black mb-4 text-white">{t('footer.company.name')}</h3>
                <p className="text-gray-300 leading-relaxed mb-6 text-base">
                  {t('footer.company.description')}
                </p>
                
                {/* Social Media Links */}
                <div className="flex items-center space-x-reverse space-x-4">
                  <span className="text-gray-400 text-sm font-medium">{t('footer.socialMediaFollow')}</span>
                  <div className="flex items-center space-x-reverse space-x-3">
                    {firebaseContactInfo.facebook && (
                      <a href={firebaseContactInfo.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898v-2.89h2.54V9.845c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12z"/></svg>
                    </a>
                    )}
                    {firebaseContactInfo.twitter && (
                      <a href={firebaseContactInfo.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white"><path d="M22.162 5.656c-.77.342-1.597.572-2.465.676a4.302 4.302 0 0 0 1.887-2.377 8.61 8.61 0 0 1-2.727 1.042 4.292 4.292 0 0 0-7.311 3.915 12.175 12.175 0 0 1-8.84-4.48 4.292 4.292 0 0 0 1.328 5.729 4.27 4.27 0 0 1-1.944-.537v.054a4.293 4.293 0 0 0 3.444 4.207 4.302 4.302 0 0 1-1.939.074 4.294 4.294 0 0 0 4.007 2.978 8.606 8.606 0 0 1-5.327 1.838c-.346 0-.688-.02-1.025-.06a12.145 12.145 0 0 0 6.574 1.927c7.889 0 12.206-6.538 12.206-12.206 0-.186-.004-.372-.012-.556a8.717 8.717 0 0 0 2.14-2.223z"/></svg>
                    </a>
                    )}
                    {firebaseContactInfo.instagram && (
                      <a href={firebaseContactInfo.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.056 1.97.24 2.427.403a4.92 4.92 0 0 1 1.78 1.153 4.92 4.92 0 0 1 1.153 1.78c.163.457.347 1.257.403 2.427.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.24 1.97-.403 2.427a4.92 4.92 0 0 1-1.153 1.78 4.92 4.92 0 0 1-1.78 1.153c-.457.163-1.257.347-2.427.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.97-.24-2.427-.403a4.92 4.92 0 0 1-1.78-1.153 4.92 4.92 0 0 1-1.153-1.78c-.163-.457-.347-1.257-.403-2.427-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.056-1.17.24-1.97.403-2.427a4.92 4.92 0 0 1 1.153-1.78 4.92 4.92 0 0 1 1.78-1.153c.457-.163 1.257-.347 2.427-.403 1.266-.058 1.646-.07 4.85-.07zm0 1.62c-3.145 0-3.512.012-4.747.068-.98.045-1.51.208-1.862.346-.469.182-.804.4-1.156.752s-.57.687-.752 1.156c-.138.352-.301.882-.346 1.862-.056 1.235-.068 1.602-.068 4.747s.012 3.512.068 4.747c.045.98.208 1.51.346 1.862.182.469.4.804.752 1.156s.687.57 1.156.752c.352.138.882.301 1.862.346 1.235.056 1.602.068 4.747.068s3.512-.012 4.747-.068c.98-.045 1.51-.208 1.862-.346.469-.182.804-.4 1.156-.752s.57-.687.752-1.156c.138-.352.301-.882.346-1.862.056-1.235.068-1.602.068-4.747s-.012-3.512-.068-4.747c-.045-.98-.208-1.51-.346-1.862-.182-.469-.4-.804-.752-1.156s-.687-.57-1.156-.752c-.352-.138-.882-.301-1.862-.346-1.235-.056-1.602-.068-4.747-.068zm0 3.89a5.327 5.327 0 1 1 0 10.654 5.327 5.327 0 0 1 0-10.654zm6.406-2.93a1.24 1.24 0 1 1 0 2.48 1.24 1.24 0 0 1 0-2.48z"/></svg>
                    </a>
                    )}
                    {firebaseContactInfo.linkedin && (
                      <a href={firebaseContactInfo.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.784 1.764-1.75 1.764zm13.5 11.268h-3v-5.604c0-1.336-.027-3.055-1.862-3.055-1.862 0-2.147 1.454-2.147 2.956v5.703h-3v-10h2.879v1.367h.041c.401-.76 1.379-1.56 2.837-1.56 3.035 0 3.596 2.001 3.596 4.605v5.588z"/></svg>
                    </a>
                    )}
                    {firebaseContactInfo.youtube && (
                      <a href={firebaseContactInfo.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white"><path d="M23.498 6.186a2.999 2.999 0 0 0-2.113-2.12C19.276 3.5 12 3.5 12 3.5s-7.276 0-9.385.566A2.999 2.999 0 0 0 .502 6.186C0 8.297 0 12 0 12s0 3.703.502 5.814a2.999 2.999 0 0 0 2.113 2.12C4.724 20.5 12 20.5 12 20.5s7.276 0 9.385-.566a2.999 2.999 0 0 0 2.113-2.12C24 15.703 24 12 24 12s0-3.703-.502-5.814zM9.75 15.5v-7l6 3.5-6 3.5z"/></svg>
                      </a>
                    )}
                    {firebaseContactInfo.whatsapp && (
                      <a href={firebaseContactInfo.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white"><path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .2 5.3.2 11.86c0 2.087.55 4.1 1.6 5.9L0 24l6.4-1.66a11.6 11.6 0 0 0 5.66 1.44h.01c6.55 0 11.86-5.3 11.86-11.86a11.84 11.84 0 0 0-3.38-8.44zM12.06 21.2h-.01a9.32 9.32 0 0 1-4.75-1.3l-.34-.2-3.8.99 1.02-3.7-.22-.38a9.35 9.35 0 0 1-1.42-4.95c0-5.15 4.19-9.33 9.35-9.33a9.27 9.27 0 0 1 6.62 2.73 9.27 9.27 0 0 1 2.73 6.6c0 5.16-4.19 9.35-9.36 9.35zm5.33-6.93c-.29-.15-1.7-.84-1.96-.93-.26-.1-.45-.15-.64.15-.19.29-.74.92-.91 1.11-.17.19-.34.22-.63.07-.29-.15-1.24-.46-2.36-1.46-.87-.77-1.46-1.72-1.63-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.52.15-.17.19-.29.29-.48.1-.19.05-.37-.02-.52-.07-.15-.64-1.55-.88-2.13-.23-.55-.47-.48-.64-.49l-.55-.01c-.19 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.19 2.1 3.2 5.09 4.49.71.31 1.26.5 1.69.64.71.23 1.36.2 1.88.12.57-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34z"/></svg>
                      </a>
                    )}
                    {!firebaseContactInfo.facebook && !firebaseContactInfo.twitter && !firebaseContactInfo.instagram && !firebaseContactInfo.linkedin && !firebaseContactInfo.youtube && !firebaseContactInfo.whatsapp && (
                      <span className="text-gray-500 text-sm">{t('footer.socialLinksComingSoon')}</span>
                    )}
                  </div>
                </div>
            </div>
            
              {/* Services */}
            <div>
              <h4 className="text-xl font-black mb-6 flex items-center">
                  <Sparkles className="ml-2 text-emerald-400" size={20} />
                {t('footer.ourServices')}
              </h4>
                <div className="grid grid-cols-1 gap-3">
                {t('footer.services').map((service, index) => (
                    <a 
                      key={index} 
                      href="#services" 
                      className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 text-sm flex items-center group"
                    >
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full ml-3 group-hover:scale-150 transition-transform duration-300"></div>
                    {service}
                    </a>
                ))}
                </div>
            </div>
            
              {/* Contact Info */}
            <div>
              <h4 className="text-xl font-black mb-6 flex items-center">
                  <Phone className="ml-2 text-emerald-400" size={20} />
                {t('navigation.contact')}
              </h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-reverse space-x-3">
                    <Phone size={18} className="text-emerald-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-300 text-sm font-medium">{t('footer.phone')}</p>
                      <a href={`tel:${firebaseContactInfo.phone || '+966550500410'}`} className="text-white hover:text-emerald-400 transition-colors duration-300" dir="ltr">
                        {firebaseContactInfo.phone || '+966 55 050 0410'}
                      </a>
            </div>
          </div>
          
                  <div className="flex items-start space-x-reverse space-x-3">
                    <Mail size={18} className="text-emerald-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-300 text-sm font-medium">{t('footer.email')}</p>
                      <a href={`mailto:${firebaseContactInfo.email || 'info@tramuz-design.com'}`} className="text-white hover:text-emerald-400 transition-colors duration-300 text-sm" dir="ltr">
                        {firebaseContactInfo.email || 'info@tramuz-design.com'}
                      </a>
                </div>
                  </div>
                  
                  <div className="flex items-start space-x-reverse space-x-3">
                    <MapPin size={18} className="text-emerald-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-300 text-sm font-medium">{t('footer.address')}</p>
                      <p className="text-white text-sm leading-relaxed">
                        {language === 'en' ? (firebaseContactInfo.address_en || firebaseContactInfo.address || 'Riyadh, Saudi Arabia') : (firebaseContactInfo.address || 'الرياض حي النرجس\nشارع الملك فهد\nمبنى التصميم الحديث - الطابق الثالث')}
                      </p>
                    </div>
                  </div>
                  
                  {firebaseContactInfo.whatsapp && (
                    <div className="flex items-start space-x-reverse space-x-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full mt-1 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white text-xs">💬</span>
                </div>
                      <div>
                        <p className="text-gray-300 text-sm font-medium">{t('footer.whatsapp')}</p>
                        <a href={`https://wa.me/${firebaseContactInfo.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-white hover:text-emerald-400 transition-colors duration-300" dir="ltr">
                          {firebaseContactInfo.whatsapp}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-gray-700 py-6">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <div className="flex items-center text-gray-400 text-sm">
                <div className="w-6 h-6 bg-emerald-600 rounded flex items-center justify-center ml-3">
                  <span className="text-white font-bold text-xs">©</span>
                </div>
                <span>2024 شركة ترمُز للتصميم والاستشارات. جميع الحقوق محفوظة.</span>
              </div>
              
              <div className="flex items-center space-x-reverse space-x-6 text-sm">
                <button className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                  سياسة الخصوصية
                </button>
                <button className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                  شروط الاستخدام
                </button>
                <button className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                  خريطة الموقع
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* تم حذف مودال تفاصيل الخدمة */}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          ></div>
          
          {/* Cart Content */}
          <div className="relative bg-slate-50 w-full max-w-md h-full shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-reverse space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
                    <ShoppingCart size={20} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900">سلة التسوق</h2>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            {/* Cart Items */}
            <div className="p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">{t('cart.empty')}</p>
                  <p className="text-gray-400 text-sm mt-2">{t('cart.addServices')}</p>
                  </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-4 border border-slate-100 shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-black text-gray-900 mb-1">{item.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                          <p className="text-lg font-black text-slate-700">{item.price} ريال</p>
              </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
                        >
                          <Trash2 size={18} />
                        </button>
              </div>
              
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-reverse space-x-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-full flex items-center justify-center hover:from-slate-700 hover:to-slate-800 transition-all duration-200 shadow-md hover:shadow-lg"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-black text-gray-900 w-8 text-center bg-slate-100 rounded-lg py-1">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-full flex items-center justify-center hover:from-slate-700 hover:to-slate-800 transition-all duration-200 shadow-md hover:shadow-lg"
                          >
                            <Plus size={16} />
                          </button>
                  </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">{t('cart.total')}</p>
                          <p className="font-black text-slate-700">{item.price * item.quantity} ريال</p>
                      </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              </div>
              
            {/* Footer */}
            {cart.length > 0 && (
              <div className="sticky bottom-0 bg-gradient-to-r from-slate-50 to-gray-50 border-t border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-black text-gray-900">{t('cart.total')}:</span>
                  <span className="text-2xl font-black text-slate-700">{getCartTotal()} ريال</span>
              </div>
              
                <button
                  onClick={sendToWhatsApp}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black py-4 px-6 rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>{t('cart.completeOrder')}</span>
                  <span className="text-xl">📱</span>
                </button>
              </div>
            )}
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

      {/* Project Details Modal */}
      {isProjectModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedProject.title}</h2>
                <p className="text-gray-600 mt-1">{selectedProject.category} • {selectedProject.year}</p>
              </div>
              <button
                onClick={() => {
                  setIsProjectModalOpen(false);
                  setSelectedProject(null);
                }}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Project Images Slider */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">صور المشروع</h3>
                
                {/* Main Image Display */}
                <div className="relative mb-4">
                  <div className="relative overflow-hidden rounded-2xl bg-gray-100">
                    <img
                      src={selectedProject.images[currentImageIndex]?.url}
                      alt={`${selectedProject.title} - صورة ${currentImageIndex + 1}`}
                      className="w-full h-96 object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                      onClick={() => setIsFullscreenImage(true)}
                    />
                    
                    {/* Navigation Arrows */}
                    {selectedProject.images.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImageIndex((prev) => 
                            prev === 0 ? selectedProject.images.length - 1 : prev - 1
                          )}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300"
                        >
                          <ArrowLeft size={20} />
                        </button>
                        <button
                          onClick={() => setCurrentImageIndex((prev) => 
                            prev === selectedProject.images.length - 1 ? 0 : prev + 1
                          )}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300"
                        >
                          <ArrowRight size={20} />
                        </button>
                      </>
                    )}
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {selectedProject.images.length}
                    </div>
                    
                    {/* Primary Badge */}
                    {selectedProject.images[currentImageIndex]?.isPrimary && (
                      <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        صورة رئيسية
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Thumbnail Navigation */}
                {selectedProject.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {selectedProject.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                          index === currentImageIndex 
                            ? 'border-emerald-500 ring-2 ring-emerald-200' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Project Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">وصف المشروع</h3>
                <p className="text-gray-700 leading-relaxed">{selectedProject.description}</p>
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">التصنيف</h4>
                  <p className="text-gray-700">{selectedProject.category}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">السنة</h4>
                  <p className="text-gray-700">{selectedProject.year}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Modal */}
      {isFullscreenImage && selectedProject && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full">
            {/* Close Button */}
            <button
              onClick={() => setIsFullscreenImage(false)}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300"
            >
              <X size={24} />
            </button>
            
            {/* Navigation Arrows */}
            {selectedProject.images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((prev) => 
                    prev === 0 ? selectedProject.images.length - 1 : prev - 1
                  )}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-16 h-16 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 z-10"
                >
                  <ArrowLeft size={24} />
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => 
                    prev === selectedProject.images.length - 1 ? 0 : prev + 1
                  )}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-16 h-16 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 z-10"
                >
                  <ArrowRight size={24} />
                </button>
              </>
            )}
            
            {/* Fullscreen Image */}
            <img
              src={selectedProject.images[currentImageIndex]?.url}
              alt={`${selectedProject.title} - صورة ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            
            {/* Image Info */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {currentImageIndex + 1} / {selectedProject.images.length}
            </div>
          </div>
        </div>
      )}

      {isEditProjectModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <h2 className="text-xl font-bold mb-4">تعديل المشروع</h2>
            {/* هنا يمكنك وضع حقول التعديل لاحقاً */}
            <div className="flex gap-4 justify-end mt-6">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg"
                onClick={() => setIsEditProjectModalOpen(false)}
              >إلغاء</button>
              <button
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
                onClick={() => setIsEditProjectModalOpen(false)}
              >حفظ</button>
            </div>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      {firebaseContactInfo.whatsapp && (
        <a
          href={`https://wa.me/${firebaseContactInfo.whatsapp.replace(/[^0-9]/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 left-6 z-50 group"
          aria-label="تواصل معنا عبر WhatsApp"
        >
          <div className="relative">
            {/* Pulse Animation */}
            <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-75"></div>
            <div className="absolute inset-0 bg-[#25D366] rounded-full animate-pulse"></div>
            
            {/* Main Button */}
            <div className="relative w-14 h-14 bg-[#25D366] hover:bg-[#1ebe5a] rounded-full shadow-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl">
              <svg 
                className="w-8 h-8 text-white" 
                fill="currentColor" 
                viewBox="0 0 24 24" 
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                تواصل معنا عبر WhatsApp
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            </div>
          </div>
        </a>
      )}
    </div>
  );
};

export default TramuzWebsite;
