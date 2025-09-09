import React, { useState, useEffect } from 'react';
import { ChevronDown, Play, Users, Award, Sparkles, Phone, Mail, MapPin, X, ArrowRight, ArrowLeft, Globe, Zap, Target, Heart, Star } from 'lucide-react';

const TramuzWebsite = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

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
      title: "مرحبًا بكم في شركة ترمُز",
      subtitle: "هندسة وإبداع بصري",
      description: "رحلتك من التخطيط إلى التميز",
      image: require('../images/hero/hero-1.jpg'),
      accent: "from-stone-300 to-stone-100"
    },
    {
      title: "مرحبًا بكم في شركة ترمُز",
      subtitle: "هندسة وإبداع بصري",
      description: "رحلتك من التخطيط إلى التميز",
      image: require('../images/hero/hero-2.jpg'),
      accent: "from-stone-200 to-stone-50"
    },
    {
      title: "مرحبًا بكم في شركة ترمُز",
      subtitle: "هندسة وإبداع بصري",
      description: "رحلتك من التخطيط إلى التميز",
      image: require('../images/hero/hero-3.jpg'),
      accent: "from-stone-300 to-stone-100"
    }
  ];

    const services = [
    { 
      title: "التصميم الداخلي", 
      description: "نحول فن التصميم الداخلي إلى واقع ملموس يضيف قيمة وجمال لكل مساحة", 
      icon: <Sparkles size={28} />, 
      gradient: "from-purple-500 via-blue-500 to-cyan-500", 
      bgGradient: "from-purple-50 via-blue-50 to-cyan-50", 
      hoverGradient: "from-purple-600 via-blue-600 to-cyan-600",
      details: [
        "تصاميم عملية وأنيقة تعكس هوية العملاء",
        "اختيار الألوان والإضاءة بعناية",
        "توزيع الأثاث لتحقيق الانسجام والراحة",
        "تحويل الأفكار إلى تجارب معيشية ملهمة",
        "اهتمام بأدق التفاصيل"
      ],
      fullDescription: "في شركتنا، نحول فن التصميم الداخلي إلى واقع ملموس يضيف قيمة وجمال لكل مساحة. نبتكر تصاميم عملية وأنيقة تعكس هوية عملائنا وتلبي احتياجاتهم بدقة. نهتم بأدق التفاصيل من اختيار الألوان والإضاءة إلى توزيع الأثاث لتحقيق الانسجام والراحة. هدفنا هو تحويل كل فكرة إلى تجربة معيشية ملهمة ومتكاملة.",
      features: [
        "تصميم مساحات داخلية مبتكرة",
        "اختيار الألوان والإضاءة المناسبة",
        "توزيع الأثاث والديكورات",
        "تصميم مطابخ ومطاعم متخصصة",
        "تصميم مقاهي ومساحات تجارية",
        "استخدام مواد عالية الجودة",
        "تطبيق أحدث الاتجاهات في التصميم",
        "ضمان الوظيفية والجمالية"
      ],
      process: [
        "دراسة المساحة والمتطلبات",
        "تطوير المفهوم التصميمي",
        "اختيار المواد والألوان",
        "إعداد المخططات التنفيذية",
        "متابعة التنفيذ والجودة"
      ],
      examples: [
        "تصميم مطاعم ومقاهي",
        "تصميم مساحات تجارية",
        "تصميم منازل وفلل",
        "تصميم مكاتب وشركات",
        "تصميم فنادق ومنتجعات"
      ]
    },
    { 
      title: "التصميم الخارجي", 
      description: "نحول التصميم الخارجي إلى بصمة معمارية مميزة تجمع بين الجمال والوظيفة", 
      icon: <Target size={28} />, 
      gradient: "from-emerald-500 via-teal-500 to-cyan-500", 
      bgGradient: "from-emerald-50 to-teal-50", 
      hoverGradient: "from-emerald-600 to-teal-600",
      details: [
        "تصميم واجهات مميزة",
        "تخطيط المناظر الخارجية",
        "مزج الحداثة والأصالة",
        "إبراز هوية المشروع",
        "تصميمات خالدة عبر الزمن"
      ],
      fullDescription: "نحول التصميم الخارجي إلى بصمة معمارية مميزة تجمع بين الجمال والوظيفة. نهتم بكل تفاصيل الواجهات والمناظر الخارجية لنخلق انسجامًا مع المحيط وإبراز هوية المشروع. نمزج بين الحداثة والأصالة لنصمم مبانٍ تعكس شخصية العملاء وتبقى خالدة عبر الزمن. هدفنا هو أن يكون كل تصميم خارجي علامة فارقة تُلهم وتلفت الأنظار.",
      features: [
        "تصميم واجهات المباني",
        "تخطيط المناظر الخارجية",
        "تصميم مداخل ومساحات مفتوحة",
        "استخدام مواد مستدامة",
        "دمج العناصر الطبيعية",
        "تصميم إضاءة خارجية",
        "تخطيط مواقف السيارات",
        "تصميم حدائق ومساحات خضراء"
      ],
      process: [
        "دراسة الموقع والبيئة المحيطة",
        "تطوير المفهوم المعماري",
        "تصميم الواجهات والمناظر",
        "اختيار المواد والإنشاءات",
        "متابعة التنفيذ والجودة"
      ],
      examples: [
        "تصميم واجهات المطاعم",
        "تصميم مباني تجارية",
        "تصميم مجمعات سكنية",
        "تصميم مشاريع سياحية",
        "تصميم مؤسسات تعليمية"
      ]
    },
    { 
      title: "التخطيط الحضري", 
      description: "بناء تجارب حضرية تتمحور حول الإنسان", 
      icon: <Zap size={28} />, 
      gradient: "from-orange-500 via-amber-500 to-yellow-500", 
      bgGradient: "from-orange-50 to-amber-50", 
      hoverGradient: "from-orange-600 to-amber-600",
      details: [
        "تخطيط مساحات حضرية متكاملة",
        "تصميم تجارب إنسانية متميزة",
        "دمج الطبيعة مع البيئة الحضرية",
        "تطوير حلول مستدامة",
        "تحسين جودة الحياة"
      ],
      fullDescription: "نركز على بناء تجارب حضرية تتمحور حول الإنسان، حيث نضع احتياجات المجتمع في المقدمة ونصمم مساحات تعزز التفاعل الاجتماعي والرفاهية. نعمل على تطوير حلول تخطيطية ذكية ومستدامة تحقق التوازن بين التطور الحضري والحفاظ على البيئة.",
      features: [
        "تخطيط المجمعات السكنية",
        "تصميم الأحياء التجارية",
        "تطوير المساحات العامة",
        "تخطيط النقل والمواصلات",
        "تصميم الحدائق والمساحات الخضراء",
        "تطوير البنية التحتية",
        "تخطيط المرافق العامة",
        "تصميم حلول مستدامة"
      ],
      process: [
        "دراسة المجتمع والاحتياجات",
        "تحليل الموقع والبيئة",
        "تطوير المفهوم التخطيطي",
        "تصميم الحلول المقترحة",
        "متابعة التنفيذ والتطوير"
      ],
      examples: [
        "تخطيط المجمعات السكنية",
        "تصميم الأحياء التجارية",
        "تطوير المساحات العامة",
        "تخطيط النقل والمواصلات",
        "تصميم الحدائق والمساحات الخضراء"
      ]
    },
    { 
      title: "تصميم المناظر الطبيعية", 
      description: "إنشاء مساحات خضراء ملهمة", 
      icon: <Globe size={28} />, 
      gradient: "from-green-500 via-emerald-500 to-teal-500", 
      bgGradient: "from-green-50 to-emerald-50", 
      hoverGradient: "from-green-600 to-emerald-600",
      details: [
        "تصميم حدائق ومساحات خضراء",
        "دمج الطبيعة مع البيئة المبنية",
        "تطوير حلول مستدامة",
        "تحسين جودة الهواء والبيئة",
        "إنشاء مساحات ترفيهية طبيعية"
      ],
      fullDescription: "نركز على إنشاء مساحات خضراء ملهمة تجمع بين الجمال الطبيعي والوظيفية العملية. نعمل على تطوير حلول تصميمية مستدامة تحسن جودة الحياة وتوفر بيئة صحية ومريحة للجميع.",
      features: [
        "تصميم الحدائق العامة",
        "تخطيط المساحات الخضراء",
        "تصميم المتنزهات والحدائق",
        "تطوير الحلول المستدامة",
        "تصميم المساحات الترفيهية",
        "تخطيط النظم البيئية",
        "تصميم الحدائق المنزلية",
        "تطوير المساحات الخضراء الحضرية"
      ],
      process: [
        "دراسة الموقع والبيئة",
        "تطوير المفهوم التصميمي",
        "اختيار النباتات والمواد",
        "تصميم النظام البيئي",
        "متابعة التنفيذ والصيانة"
      ],
      examples: [
        "تصميم الحدائق العامة",
        "تخطيط المساحات الخضراء",
        "تصميم المتنزهات والحدائق",
        "تطوير الحلول المستدامة",
        "تصميم المساحات الترفيهية"
      ]
    },
    { 
      title: "تطوير العلامات التجارية", 
      description: "بناء وتطوير العلامات التجارية اعتمادًا على هوية واضحة وقيم أساسية", 
      icon: <Heart size={28} />, 
      gradient: "from-pink-500 via-rose-500 to-red-500", 
      bgGradient: "from-pink-50 to-rose-50", 
      hoverGradient: "from-pink-600 to-rose-600",
      details: [
        "تطوير هوية بصرية متكاملة",
        "استراتيجية علامة تجارية واضحة",
        "تصميم شعارات مميزة",
        "تطوير تجربة عميل متكاملة",
        "بناء قيم أساسية للعلامة"
      ],
      fullDescription: "نقدم خدمات تطوير العلامات التجارية الشاملة التي تشمل بناء هوية بصرية قوية، تطوير استراتيجية تسويقية واضحة، وتصميم تجربة عميل متكاملة. نعمل على إبراز شخصية العلامة التجارية وتمييزها في السوق.",
      features: [
        "تطوير الهوية البصرية",
        "تصميم الشعارات والرموز",
        "تطوير دليل الهوية التجارية",
        "تصميم المواد التسويقية",
        "تطوير استراتيجية العلامة التجارية",
        "تصميم مواقع إلكترونية",
        "تطوير تجربة العميل",
        "إدارة سمعة العلامة التجارية"
      ],
      process: [
        "دراسة السوق والمنافسين",
        "تطوير استراتيجية العلامة التجارية",
        "تصميم الهوية البصرية",
        "تطوير المواد التسويقية",
        "تنفيذ الاستراتيجية ومتابعتها"
      ],
      examples: [
        "تطوير علامات تجارية للمطاعم",
        "تطوير هوية بصرية للشركات",
        "تصميم شعارات مبتكرة",
        "تطوير تجربة العملاء",
        "إدارة سمعة العلامات التجارية"
      ]
    },
    { 
      title: "استشارات تسويقية", 
      description: "إجراء مراجعات شاملة لاستراتيجيات التسويق الحالية وتطوير خطط إبداعية وعملية", 
      icon: <Users size={28} />, 
      gradient: "from-blue-500 via-indigo-500 to-purple-500", 
      bgGradient: "from-blue-50 to-indigo-50", 
      hoverGradient: "from-blue-600 to-indigo-600",
      details: [
        "مراجعة استراتيجيات التسويق الحالية",
        "تطوير خطط تسويقية إبداعية",
        "تحليل السوق والمنافسين",
        "تطوير استراتيجيات المبيعات",
        "تحسين تجربة العملاء"
      ],
      fullDescription: "نقدم استشارات تسويقية شاملة تساعد الشركات على تحسين أدائها التسويقي وزيادة المبيعات. نعمل على تطوير استراتيجيات تسويقية إبداعية وعملية تعزز المبيعات والإيرادات والرضا العام.",
      features: [
        "تحليل السوق والمنافسين",
        "تطوير استراتيجيات التسويق",
        "تصميم الحملات الإعلانية",
        "تحسين تجربة العملاء",
        "تطوير استراتيجيات المبيعات",
        "تحليل البيانات والتقارير",
        "تطوير المحتوى التسويقي",
        "إدارة العلاقات العامة"
      ],
      process: [
        "تحليل الوضع الحالي",
        "تطوير الاستراتيجية",
        "تنفيذ الخطة",
        "متابعة النتائج",
        "التطوير المستمر"
      ],
      examples: [
        "استشارات تسويقية للمطاعم",
        "تطوير استراتيجيات المبيعات",
        "تحسين تجربة العملاء",
        "تطوير الحملات الإعلانية",
        "إدارة العلاقات العامة"
      ]
    },
    { 
      title: "استشارات تشغيلية", 
      description: "تقديم توصيات عملية لتحسين الإدارة التشغيلية وجودة المنتجات ورضا العملاء", 
      icon: <Award size={28} />, 
      gradient: "from-indigo-500 via-purple-500 to-pink-500", 
      bgGradient: "from-indigo-50 to-purple-50", 
      hoverGradient: "from-indigo-600 to-purple-600",
      details: [
        "تحسين الإدارة التشغيلية",
        "رفع جودة المنتجات والخدمات",
        "زيادة رضا العملاء",
        "تحسين الكفاءة التشغيلية",
        "زيادة المبيعات والأرباح"
      ],
      fullDescription: "نقدم استشارات تشغيلية متخصصة تساعد الشركات على تحسين أدائها التشغيلي وزيادة الكفاءة. نعمل على تطوير حلول عملية لتحسين الإدارة التشغيلية وجودة المنتجات ورضا العملاء مما يزيد من المبيعات والأرباح.",
      features: [
        "تحليل العمليات التشغيلية",
        "تطوير استراتيجيات تحسين الجودة",
        "تحسين تجربة العملاء",
        "تطوير أنظمة إدارة متقدمة",
        "تحليل الأداء والمؤشرات",
        "تطوير برامج تدريب الموظفين",
        "تحسين سلاسل التوريد",
        "تطوير معايير الجودة"
      ],
      process: [
        "تحليل الوضع التشغيلي الحالي",
        "تحديد نقاط التحسين",
        "تطوير خطة التحسين",
        "تنفيذ الحلول المقترحة",
        "متابعة النتائج والتطوير"
      ],
      examples: [
        "تحسين عمليات المطاعم",
        "تطوير أنظمة الجودة",
        "تحسين تجربة العملاء",
        "تطوير برامج التدريب",
        "تحسين الكفاءة التشغيلية"
      ]
    },
    { 
      title: "استشارات تقنية", 
      description: "تصميم وتنفيذ حلول تقنية متكاملة وفعالة من حيث التكلفة لتبسيط العمليات", 
      icon: <Zap size={28} />, 
      gradient: "from-cyan-500 via-blue-500 to-indigo-500", 
      bgGradient: "from-cyan-50 to-blue-50", 
      hoverGradient: "from-cyan-600 to-blue-600",
      details: [
        "تصميم حلول تقنية متكاملة",
        "تحسين العمليات التقنية",
        "تطوير أنظمة ذكية",
        "تحسين تجربة العملاء",
        "تقليل التكاليف التشغيلية"
      ],
      fullDescription: "نقدم استشارات تقنية متخصصة تساعد الشركات على تطوير وتنفيذ حلول تقنية متكاملة وفعالة من حيث التكلفة. نعمل على تبسيط العمليات وتحسين تجربة العملاء من خلال التكنولوجيا الحديثة.",
      features: [
        "تطوير أنظمة إدارة متقدمة",
        "تصميم تطبيقات مخصصة",
        "تحسين البنية التحتية التقنية",
        "تطوير حلول الذكاء الاصطناعي",
        "تحسين الأمان السيبراني",
        "تطوير أنظمة الدفع الإلكتروني",
        "تحسين تجربة المستخدم",
        "تطوير حلول إدارة البيانات"
      ],
      process: [
        "تحليل الاحتياجات التقنية",
        "تطوير الحلول المقترحة",
        "تصميم النظام التقني",
        "تنفيذ الحلول",
        "اختبار وتطوير النظام"
      ],
      examples: [
        "تطوير أنظمة إدارة المطاعم",
        "تصميم تطبيقات الهاتف المحمول",
        "تحسين الأنظمة التقنية",
        "تطوير حلول الدفع الإلكتروني",
        "تحسين تجربة العملاء التقنية"
      ]
    },
    { 
      title: "توظيف وتدريب", 
      description: "تطوير وإدارة برامج تدريب حديثة ترفع من كفاءة الموظفين وتزيد من رضا العملاء", 
      icon: <Users size={28} />, 
      gradient: "from-teal-500 via-green-500 to-emerald-500", 
      bgGradient: "from-teal-50 to-green-50", 
      hoverGradient: "from-teal-600 to-green-600",
      details: [
        "تطوير برامج تدريب متخصصة",
        "رفع كفاءة الموظفين",
        "زيادة رضا العملاء",
        "تطوير المهارات المهنية",
        "تحسين الأداء المؤسسي"
      ],
      fullDescription: "نقدم خدمات توظيف وتدريب متخصصة تساعد الشركات على تطوير كوادرها البشرية ورفع كفاءتها. نعمل على تطوير وإدارة برامج تدريب حديثة ترفع من كفاءة الموظفين وتزيد من رضا العملاء.",
      features: [
        "تطوير برامج تدريب متخصصة",
        "تدريب الموظفين على المهارات الجديدة",
        "تطوير برامج التطوير المهني",
        "تدريب فرق العمل على أفضل الممارسات",
        "تطوير برامج القيادة والإدارة",
        "تدريب الموظفين على خدمة العملاء",
        "تطوير برامج التطوير المستمر",
        "تقييم وتطوير الأداء"
      ],
      process: [
        "تحليل احتياجات التدريب",
        "تطوير برامج التدريب",
        "تنفيذ برامج التدريب",
        "تقييم نتائج التدريب",
        "تطوير وتحسين البرامج"
      ],
      examples: [
        "تدريب موظفي المطاعم",
        "تطوير برامج خدمة العملاء",
        "تدريب فرق الإدارة",
        "تطوير برامج المبيعات",
        "تدريب فرق التطوير"
      ]
    },
    { 
      title: "إدارة العقود", 
      description: "إدارة العقود من صياغتها حتى تدقيقها بما يضمن الأمان القانوني والمالي للمشاريع", 
      icon: <Award size={28} />, 
      gradient: "from-amber-500 via-orange-500 to-red-500", 
      bgGradient: "from-amber-50 to-orange-50", 
      hoverGradient: "from-amber-600 to-orange-600",
      details: [
        "صياغة العقود القانونية",
        "مراجعة وتدقيق العقود",
        "ضمان الأمان القانوني",
        "حماية المصالح المالية",
        "إدارة العلاقات التعاقدية"
      ],
      fullDescription: "نقدم خدمات إدارة العقود المتخصصة التي تشمل صياغة العقود القانونية ومراجعتها وتدقيقها. نعمل على ضمان الأمان القانوني والمالي للمشاريع من خلال إدارة شاملة للعقود.",
      features: [
        "صياغة العقود القانونية",
        "مراجعة العقود الموجودة",
        "تدقيق العقود المالية",
        "تطوير نماذج العقود",
        "إدارة تنفيذ العقود",
        "حل النزاعات التعاقدية",
        "تطوير سياسات العقود",
        "تدريب فرق العمل على العقود"
      ],
      process: [
        "تحليل متطلبات العقد",
        "صياغة مسودة العقد",
        "مراجعة العقد قانونياً",
        "التفاوض على شروط العقد",
        "التوقيع ومتابعة التنفيذ"
      ],
      examples: [
        "عقود المطاعم والمقاهي",
        "عقود التصميم والاستشارات",
        "عقود التوريد والخدمات",
        "عقود الإدارة والتشغيل",
        "عقود التطوير والاستثمار"
      ]
    },
    { 
      title: "دراسة الجدوى والتخطيط الاستراتيجي", 
      description: "إعداد دراسات جدوى اقتصادية متكاملة تشمل السوق والمنافسين والعوائد المتوقعة", 
      icon: <Target size={28} />, 
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500", 
      bgGradient: "from-violet-50 to-purple-50", 
      hoverGradient: "from-violet-600 to-purple-600",
      details: [
        "دراسات جدوى اقتصادية شاملة",
        "تحليل السوق والمنافسين",
        "تقييم العوائد المتوقعة",
        "تطوير الخطط الاستراتيجية",
        "تحديد الفرص الاستثمارية"
      ],
      fullDescription: "نقدم خدمات دراسة الجدوى والتخطيط الاستراتيجي المتخصصة التي تساعد الشركات على اتخاذ قرارات استثمارية مدروسة. نعمل على إعداد دراسات جدوى اقتصادية متكاملة تشمل السوق والمنافسين والعوائد المتوقعة.",
      features: [
        "دراسات جدوى اقتصادية",
        "تحليل السوق والمنافسين",
        "تقييم الجدوى المالية",
        "تطوير الخطط الاستراتيجية",
        "تحليل المخاطر والفرص",
        "تطوير نماذج الأعمال",
        "تقييم العوائد الاستثمارية",
        "تطوير استراتيجيات النمو"
      ],
      process: [
        "تحليل السوق والبيئة",
        "تطوير نموذج الأعمال",
        "تقييم الجدوى المالية",
        "تحليل المخاطر",
        "تطوير التوصيات الاستراتيجية"
      ],
      examples: [
        "دراسات جدوى المطاعم",
        "تخطيط استراتيجي للشركات",
        "تقييم المشاريع الاستثمارية",
        "تطوير استراتيجيات النمو",
        "تحليل الفرص السوقية"
      ]
    },
    { 
      title: "إدارة علاقات الشركات", 
      description: "تطوير استراتيجيات لبناء روابط قوية مع العملاء والشركاء والمستثمرين", 
      icon: <Heart size={28} />, 
      gradient: "from-rose-500 via-pink-500 to-red-500", 
      bgGradient: "from-rose-50 to-pink-50", 
      hoverGradient: "from-rose-600 to-pink-600",
      details: [
        "بناء علاقات قوية مع العملاء",
        "تطوير شراكات استراتيجية",
        "إدارة علاقات المستثمرين",
        "تطوير شبكات الأعمال",
        "تحسين سمعة الشركة"
      ],
      fullDescription: "نقدم خدمات إدارة علاقات الشركات المتخصصة التي تساعد الشركات على بناء وتطوير علاقات قوية مع العملاء والشركاء والمستثمرين. نعمل على تطوير استراتيجيات شاملة لتحسين سمعة الشركة وزيادة فرص النمو.",
      features: [
        "تطوير استراتيجيات العلاقات العامة",
        "بناء شراكات استراتيجية",
        "إدارة علاقات العملاء",
        "تطوير برامج الولاء",
        "إدارة الأحداث والفعاليات",
        "تطوير المحتوى التسويقي",
        "إدارة الأزمات والسمعة",
        "تطوير شبكات الأعمال"
      ],
      process: [
        "تحليل العلاقات الحالية",
        "تطوير استراتيجية العلاقات",
        "تنفيذ برامج العلاقات",
        "متابعة وتقييم النتائج",
        "تطوير وتحسين الاستراتيجيات"
      ],
      examples: [
        "إدارة علاقات عملاء المطاعم",
        "تطوير شراكات تجارية",
        "إدارة علاقات المستثمرين",
        "تطوير برامج الولاء",
        "إدارة الأحداث والفعاليات"
      ]
    }
  ];

  const stats = [
    { 
      number: "150+", 
      label: "مشروع مكتمل", 
      description: "مشاريع متنوعة في التصميم والاستشارات",
      icon: <Target size={40} />, 
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-500/10 to-teal-500/10"
    },
    { 
      number: "98%", 
      label: "رضا العملاء", 
      description: "نسبة رضا عالية من عملائنا الكرام",
      icon: <Heart size={40} />, 
      color: "from-rose-500 to-pink-500",
      bgColor: "from-rose-500/10 to-pink-500/10"
    },
    { 
      number: "8+", 
      label: "سنوات خبرة", 
      description: "خبرة واسعة في التصميم والاستشارات",
      icon: <Award size={40} />, 
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-500/10 to-cyan-500/10"
    },
    { 
      number: "24/7", 
      label: "دعم فني", 
      description: "دعم مستمر لجميع عملائنا",
      icon: <Zap size={40} />, 
      color: "from-amber-500 to-orange-500",
      bgColor: "from-amber-500/10 to-orange-500/10"
    }
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
    { id: 'services', label: 'خدماتنا', icon: <Sparkles size={18} /> },
    { id: 'works', label: 'معرض الأعمال', icon: <Play size={18} /> },
    { id: 'team', label: 'الفريق', icon: <Users size={18} /> },
    { id: 'testimonials', label: 'آراء العملاء', icon: <Award size={18} /> },
    { id: 'contact', label: 'اتصل بنا', icon: <Phone size={18} /> }
  ];

  return (
    <div className="min-h-screen bg-stone-50" dir="rtl">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-gradient-to-r from-white via-emerald-50/90 to-teal-50/90 backdrop-blur-xl shadow-2xl border-b border-emerald-400/60' 
          : 'bg-gradient-to-r from-white/95 via-emerald-50/80 to-teal-50/80 backdrop-blur-lg shadow-xl'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            {/* Logo */}
            <div className="flex items-center">
              <div className="relative group">
                <img 
                  src={require('../images/logo.png')} 
                  alt="TARMUZ - شركة التصميم والاستشارات" 
                  className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 group-hover:scale-110 transition-transform duration-300 object-contain"
                  style={{ 
                    filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.15))',
                    maxWidth: '100%',
                    height: 'auto'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full shadow-lg group-hover:scale-125 transition-transform duration-300"></div>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-reverse space-x-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`group relative px-6 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center space-x-reverse space-x-3 ${
                    activeSection === item.id 
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl transform scale-105' 
                      : 'text-gray-800 hover:text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-100/80 hover:to-teal-100/80 hover:shadow-lg'
                  }`}
                >
                  <span className={`transition-all duration-300 ${activeSection === item.id ? 'scale-110 text-white' : 'group-hover:scale-110 group-hover:text-emerald-600'}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm font-semibold">{item.label}</span>
                  {activeSection === item.id && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full shadow-lg"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden relative p-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300"
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
          <div className="bg-gradient-to-r from-white via-emerald-50/95 to-teal-50/95 backdrop-blur-xl border-t border-emerald-300/60 shadow-2xl">
            <div className="px-4 py-6 space-y-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full flex items-center space-x-reverse space-x-3 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${
                    activeSection === item.id 
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl transform scale-105' 
                      : 'text-gray-800 hover:bg-gradient-to-r hover:from-emerald-100/80 hover:to-teal-100/80 hover:text-emerald-700 hover:shadow-lg'
                  }`}
                >
                  <span className={`transition-transform duration-300 ${activeSection === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm font-semibold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 transition-all duration-1000">
          <img
            src={heroSlides[currentSlide].image}
            alt="Hero Background"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div className="hidden w-full h-full bg-gradient-to-br from-emerald-900 via-teal-800 to-gray-800"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white z-10">
          <div className="max-w-5xl">
            {/* Title */}
            <div className="mb-8">
              <div className={`inline-block px-6 py-3 rounded-full bg-gradient-to-r ${heroSlides[currentSlide].accent} text-black font-bold text-sm mb-6`}>
                ✨ شركة ترمُز للتصميم والاستشارات
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                <span className="block bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                  {heroSlides[currentSlide].title}
                </span>
              </h1>
            </div>
            
            <h2 className="text-3xl md:text-5xl mb-8 text-gray-200 leading-relaxed font-bold">
              {heroSlides[currentSlide].subtitle}
            </h2>
            
            <p className="text-xl md:text-2xl mb-12 text-gray-300 leading-relaxed font-medium max-w-4xl">
              {heroSlides[currentSlide].description}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 mb-12">
              <button 
                onClick={() => scrollToSection('contact')}
                className="group px-10 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg rounded-2xl hover:shadow-xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-3"
              >
                <Phone className="transition-transform duration-300" size={24} />
                <span>اتصل بنا</span>
                <ArrowLeft className="group-hover:-translate-x-1 transition-transform duration-150" size={20} />
              </button>
              <button 
                onClick={() => scrollToSection('works')}
                className="px-10 py-5 bg-stone-200/20 backdrop-blur-sm text-white font-bold text-lg rounded-2xl border-2 border-stone-300/40 hover:bg-stone-200/30 hover:border-stone-300/60 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-3"
              >
                <Play size={20} />
                <span>عرض الأعمال</span>
              </button>
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
      <section id="about" className="py-32 bg-gradient-to-br from-stone-50 via-white to-emerald-50/20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 font-bold text-sm mb-8 border border-emerald-200">
              🏢 تعرف علينا أكثر
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-800 mb-8">
                من نحن
            </h2>
            <div className="w-32 h-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              شركة رائدة في قطاع التصميم والاستشارات، نبتكر حلولاً متميزة تلهم وتحول المجتمعات
                  </p>
                </div>
                
          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Company Story */}
            <div className="space-y-8">
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-10 shadow-xl border border-emerald-100/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-2xl ml-4">
                      🏢
                    </div>
                    <h3 className="text-2xl font-black text-gray-800">قصتنا</h3>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    <strong className="text-emerald-600">شركة "ترمُز"</strong> هي شركة رائدة وطموحة في قطاع التصميم والاستشارات، متخصصة في التصميم الداخلي والخارجي، التخطيط الحضري، تصميم المناظر الطبيعية، وتطوير العلامات التجارية. انطلقت ترمُز من الرياض وذاع صيتها في مناطق المملكة حتى تمكنت من تحقيق نجاحات وبناء علاقات مميزة مع عملائها.
                  </p>
                </div>
                </div>

              <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-10 shadow-xl border border-emerald-100/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-cyan-50/50"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center text-2xl ml-4">
                      🎯
                </div>
                    <h3 className="text-2xl font-black text-gray-800">رؤيتنا ورسالتنا</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-bold text-emerald-600 mb-2">الرؤية</h4>
                      <p className="text-gray-700">إنشاء مساحات مبتكرة تُلهم وتحوّل المجتمعات</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-teal-600 mb-2">الرسالة</h4>
                      <p className="text-gray-700">الاستفادة من العقول والأفكار والخطط الفريدة لتقديم حلول خلاقة تقودنا وعملائنا إلى النجاح</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Values & Stats */}
            <div className="space-y-8">
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-10 shadow-xl border border-emerald-100/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-stone-50/50 to-emerald-50/50"></div>
                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-stone-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Heart className="text-white" size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-800 mb-4">قيمنا الأساسية</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {[
                      { icon: "⏰", title: "الالتزام", desc: "بالوقت والوعود والأمانة" },
                      { icon: "⭐", title: "الجودة", desc: "ثقافة عامة في أعلى مستوى" },
                      { icon: "💡", title: "الإبداع", desc: "والابتكار لترك بصمة مميزة" },
                      { icon: "🚀", title: "التميز", desc: "حلول مبتكرة وذكية" }
                    ].map((value, index) => (
                      <div key={index} className="flex items-center space-x-reverse space-x-4 p-4 bg-white/60 rounded-2xl hover:bg-white/80 transition-all duration-300">
                        <div className="text-2xl">{value.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 text-sm">{value.title}</h4>
                          <p className="text-gray-600 text-xs">{value.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-center text-white">
                  <div className="text-3xl font-black mb-2">15+</div>
                  <div className="text-sm font-medium">سنة خبرة</div>
                </div>
                <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-6 text-center text-white">
                  <div className="text-3xl font-black mb-2">100+</div>
                  <div className="text-sm font-medium">مشروع مكتمل</div>
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="text-center">
            <h3 className="text-3xl font-black text-gray-800 mb-12">لماذا تختارنا؟</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "🎨",
                  title: "إبداع لا حدود له",
                  description: "فريق مبدع يجمع بين الفن والوظيفة لإنشاء تصاميم استثنائية"
                },
                {
                  icon: "⚡",
                  title: "سرعة في التنفيذ",
                  description: "نلتزم بالمواعيد المحددة ونقدم مشاريع عالية الجودة في الوقت المطلوب"
                },
                {
                  icon: "🤝",
                  title: "شراكة حقيقية",
                  description: "نعمل كشريك حقيقي مع عملائنا لتحقيق أهدافهم ورؤيتهم"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-emerald-100/50 hover:border-emerald-300/50 transform hover:-translate-y-2 hover:scale-105"
                >
                  <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-black text-gray-800 mb-4 group-hover:text-emerald-700 transition-colors duration-300">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 bg-gradient-to-br from-stone-50 via-white to-emerald-50/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-24">
            <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 font-bold text-sm mb-8">
              ✨ خدماتنا المتميزة
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-slate-800 mb-8">
                خدماتنا المميزة
            </h2>
            <div className="w-32 h-2 bg-emerald-600 rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              نقدم مجموعة شاملة من الخدمات المتخصصة في التصميم الداخلي والخارجي، التخطيط الحضري، تصميم المناظر الطبيعية، تطوير العلامات التجارية، والاستشارات المتخصصة في مختلف المجالات بمعايير عالمية وجودة استثنائية
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
                    <span>اعرف المزيد</span>
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
                <h3 className="text-3xl font-black text-black mb-6">معرض أعمالنا</h3>
                <p className="text-xl text-black/80 mb-10 max-w-2xl mx-auto">
                  اكتشف كيف ساعدنا عملاءنا في تحقيق أهدافهم من خلال خدماتنا المميزة في التصميم والاستشارات
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => scrollToSection('works')}
                    className="px-10 py-5 bg-white/20 backdrop-blur-sm text-black font-bold text-lg rounded-2xl border border-black/30 hover:bg-white/30 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-3"
                  >
                    <Play size={20} />
                    <span>شاهد أعمالنا</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Works Section */}
      <section id="works" className="py-32 bg-gradient-to-br from-stone-50 via-white to-emerald-50/20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 font-bold text-sm mb-8 border border-emerald-200">
              🎨 معرض أعمالنا
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-800 mb-8">
              معرض أعمالنا
            </h2>
            <div className="w-32 h-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              نعرض أفضل أعمالنا في مجال العمارة والتصميم والهوية التجارية
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {[
              { id: 'all', label: 'جميع المشاريع', icon: '🎯' },
              { id: 'exterior', label: 'تصميم خارجي', icon: '🏢' },
              { id: 'interior', label: 'تصميم داخلي', icon: '🏠' },
              { id: 'plans', label: 'مخططات تنفيذية', icon: '📐' },
              { id: 'branding', label: 'هوية بصرية', icon: '🎨' }
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
            {[
              // جميع المشاريع
              ...(activeTab === 'all' || activeTab === 'exterior' ? [
                {
                  id: 1,
                  title: "مبنى تجاري راقي",
                  description: "تصميم خارجي لمبنى تجاري في الرياض",
                  image: require('../images/gallery/exterior-1.jpg'),
                  category: "تصميم خارجي",
                  year: "2024"
                },
                {
                  id: 2,
                  title: "مجمع سكني فاخر",
                  description: "تصميم خارجي لمجمع سكني متكامل",
                  image: require('../images/gallery/exterior-2.jpg'),
                  category: "تصميم خارجي",
                  year: "2024"
                },
                {
                  id: 3,
                  title: "مبنى إداري عصري",
                  description: "تصميم خارجي لمبنى إداري حديث",
                  image: require('../images/gallery/exterior-3.jpg'),
                  category: "تصميم خارجي",
                  year: "2023"
                }
              ] : []),
              
              // التصميم الداخلي
              ...(activeTab === 'all' || activeTab === 'interior' ? [
                {
                  id: 4,
                  title: "مطعم راقي",
                  description: "تصميم داخلي لمطعم راقي في الرياض",
                  image: require('../images/gallery/interior-1.jpg'),
                  category: "تصميم داخلي",
                  year: "2024"
                },
                {
                  id: 5,
                  title: "مقهى عصري",
                  description: "تصميم داخلي لمقهى عصري في جدة",
                  image: require('../images/gallery/interior-2.jpg'),
                  category: "تصميم داخلي",
                  year: "2024"
                },
                {
                  id: 6,
                  title: "فندق فاخر",
                  description: "تصميم داخلي لفندق فاخر في الدمام",
                  image: require('../images/gallery/interior-3.jpg'),
                  category: "تصميم داخلي",
                  year: "2023"
                }
              ] : []),
              
              // المخططات التنفيذية
              ...(activeTab === 'all' || activeTab === 'plans' ? [
                {
                  id: 7,
                  title: "مخطط مجمع تجاري",
                  description: "مخططات تنفيذية لمجمع تجاري كبير",
                  image: require('../images/gallery/plans-1.jpg'),
                  category: "مخططات تنفيذية",
                  year: "2024"
                },
                {
                  id: 8,
                  title: "مخطط مجمع سكني",
                  description: "مخططات تنفيذية لمجمع سكني متكامل",
                  image: require('../images/gallery/plans-2.jpg'),
                  category: "مخططات تنفيذية",
                  year: "2024"
                },
                {
                  id: 9,
                  title: "مخطط مبنى إداري",
                  description: "مخططات تنفيذية لمبنى إداري حديث",
                  image: require('../images/gallery/plans-3.jpg'),
                  category: "مخططات تنفيذية",
                  year: "2023"
                }
              ] : []),
              
              // الهوية البصرية
              ...(activeTab === 'all' || activeTab === 'branding' ? [
                {
                  id: 10,
                  title: "هوية مطعم راقي",
                  description: "هوية بصرية متكاملة لمطعم راقي",
                  image: require('../images/gallery/branding-1.jpg'),
                  category: "هوية بصرية",
                  year: "2024"
                },
                {
                  id: 11,
                  title: "هوية شركة تقنية",
                  description: "هوية بصرية لشركة تقنية ناشئة",
                  image: require('../images/gallery/branding-2.jpg'),
                  category: "هوية بصرية",
                  year: "2024"
                },
                {
                  id: 12,
                  title: "هوية مؤسسة تعليمية",
                  description: "هوية بصرية لمؤسسة تعليمية",
                  image: require('../images/gallery/branding-3.jpg'),
                  category: "هوية بصرية",
                  year: "2023"
                }
              ] : [])
            ].map((project, index) => (
              <div
                key={project.id}
                className="group bg-white/90 backdrop-blur-lg rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-emerald-100/50 hover:border-emerald-300/50 transform hover:-translate-y-2 hover:scale-105"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <Play className="text-white" size={24} />
                    </div>
                      <p className="text-sm font-bold">عرض المشروع</p>
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
                    <span className="px-3 py-1 bg-white/90 text-gray-800 text-xs font-bold rounded-full">
                      {project.year}
                      </span>
                    </div>
                  </div>
                  
                <div className="p-6">
                  <h3 className="text-xl font-black text-gray-800 mb-2 group-hover:text-emerald-700 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {project.description}
                  </p>
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
                  <Play className="text-white" size={32} />
                </div>
                <h3 className="text-3xl md:text-4xl font-black mb-6 text-gray-800">ابدأ مشروعك معنا</h3>
                <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                  دعنا نساعدك في تحويل رؤيتك إلى واقع مذهل من خلال خدماتنا المميزة
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <button 
                    onClick={() => scrollToSection('contact')}
                    className="px-12 py-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xl rounded-2xl hover:shadow-2xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-3"
                  >
                    <Play size={24} />
                    <span>ابدأ مشروعك</span>
                  </button>
                </div>
              </div>
          </div>
          </div>
        </div>
      </section>

      {/* Our Clients Section */}
      <section id="clients" className="py-32 bg-gradient-to-br from-stone-50 via-white to-emerald-50/20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 font-bold text-sm mb-8 border border-emerald-200">
              🤝 شركاء النجاح
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-800 mb-8">
              عملاؤنا
            </h2>
            <div className="w-32 h-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              نفتخر بخدمة عملائنا الكرام من مختلف القطاعات والصناعات
            </p>
                </div>
                
          {/* Client Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
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
                    <h3 className="text-2xl font-black text-gray-800 group-hover:text-emerald-700 transition-colors duration-300">
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
                <h3 className="text-3xl md:text-4xl font-black mb-6 text-gray-800">انضم إلى عملائنا</h3>
                <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                  كن جزءاً من قصة نجاحنا واسمح لنا بمساعدتك في تحقيق أهدافك
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <button 
                    onClick={() => scrollToSection('contact')}
                    className="px-12 py-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xl rounded-2xl hover:shadow-2xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-3"
                  >
                    <Users size={24} />
                    <span>ابدأ مشروعك معنا</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-32 bg-gradient-to-br from-stone-50 via-white to-emerald-50/30 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-stone-400/5 rounded-full blur-2xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 font-bold text-sm mb-8 border border-emerald-200">
              👥 فريقنا المتميز
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-800 mb-8">
              الفريق
            </h2>
            <div className="w-32 h-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              فريق من الخبراء والمختصين في مختلف مجالات التصميم والاستشارات
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
            {[
              {
                name: "أحمد محمد",
                position: "المدير التنفيذي",
                specialization: "التصميم المعماري",
                experience: "15+ سنة خبرة",
                image: require('../images/team/ahmed-mohamed.jpg'),
                description: "خبير في التصميم المعماري والتخطيط الحضري مع خبرة واسعة في المشاريع الكبرى",
                gradient: "from-emerald-500 to-teal-500"
              },
              {
                name: "فاطمة السعيد",
                position: "مديرة التصميم الداخلي",
                specialization: "التصميم الداخلي",
                experience: "12+ سنة خبرة",
                image: require('../images/team/fatima-saeed.jpg'),
                description: "مصممة داخلية مبدعة متخصصة في تصميم المساحات التجارية والسكنية",
                gradient: "from-teal-500 to-cyan-500"
              },
              {
                name: "محمد العلي",
                position: "مدير تطوير العلامات التجارية",
                specialization: "الهوية البصرية",
                experience: "10+ سنة خبرة",
                image: require('../images/team/mohammed-ali.jpg'),
                description: "خبير في تطوير العلامات التجارية والهوية البصرية للشركات والمؤسسات",
                gradient: "from-stone-400 to-emerald-500"
              },
              {
                name: "نورا أحمد",
                position: "مديرة الاستشارات",
                specialization: "الاستشارات الإدارية",
                experience: "8+ سنة خبرة",
                image: require('../images/team/nora-ahmed.jpg'),
                description: "مستشارة متخصصة في الاستشارات الإدارية والتشغيلية للشركات",
                gradient: "from-emerald-600 to-teal-600"
              },
              {
                name: "خالد المطيري",
                position: "مدير التخطيط الحضري",
                specialization: "التخطيط الحضري",
                experience: "13+ سنة خبرة",
                image: require('../images/team/khalid-mutairi.jpg'),
                description: "مهندس تخطيط حضري متخصص في تطوير المدن والمجمعات السكنية",
                gradient: "from-teal-600 to-emerald-600"
              },
              {
                name: "سارة النعيمي",
                position: "مديرة التصميم التقني",
                specialization: "التصميم التقني",
                experience: "7+ سنة خبرة",
                image: require('../images/team/sara-naimi.jpg'),
                description: "مصممة تقنية متخصصة في تطوير الحلول التقنية والأنظمة الذكية",
                gradient: "from-emerald-700 to-teal-700"
              }
            ].map((member, index) => (
                  <div
                key={index}
                className="group relative bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-emerald-100/50 hover:border-emerald-300/50 transform hover:-translate-y-2 hover:scale-102 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${member.gradient} opacity-0 group-hover:opacity-3 transition-opacity duration-500`}></div>
                
                <div className="relative z-10 text-center">
                  <div className="mb-8">
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg border-4 border-white">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className={`w-full h-full bg-gradient-to-r ${member.gradient} flex items-center justify-center text-4xl hidden`}>
                        👤
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-gray-800 mb-3 group-hover:text-emerald-700 transition-colors duration-300">
                    {member.name}
                  </h3>
                  
                  <p className="text-lg font-bold text-emerald-600 mb-3 group-hover:text-emerald-700 transition-colors duration-300">
                    {member.position}
                  </p>
                  
                  <p className="text-sm text-gray-500 mb-4 group-hover:text-gray-600 transition-colors duration-300">
                    {member.specialization}
                  </p>
                  
                  <div className={`inline-block px-5 py-2 bg-gradient-to-r ${member.gradient} rounded-full text-white font-bold text-sm mb-6 group-hover:scale-105 transition-transform duration-300 shadow-md`}>
                    {member.experience}
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {member.description}
                  </p>
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
                <h3 className="text-3xl md:text-4xl font-black mb-6 text-gray-800">انضم إلى فريقنا</h3>
                <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                  نحن نبحث عن المواهب المبدعة للانضمام إلى فريقنا المتميز
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <button 
                    onClick={() => scrollToSection('contact')}
                    className="px-12 py-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xl rounded-2xl hover:shadow-2xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-3"
                  >
                    <Users size={24} />
                    <span>انضم إلينا</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-32 bg-gradient-to-br from-stone-50 via-white to-emerald-50/20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-stone-400/5 rounded-full blur-2xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 font-bold text-sm mb-8 border border-emerald-200">
              🏆 إنجازاتنا المميزة
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-800 mb-8">
                إنجازاتنا بالأرقام
            </h2>
            <div className="w-32 h-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              أرقام تتحدث عن جودتنا وتميزنا في التصميم والاستشارات
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
                <h3 className="text-3xl md:text-4xl font-black mb-6 text-gray-800">انضم إلى قصة نجاحنا</h3>
                <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                  دعنا نساعدك في تحقيق أهدافك ونضيف إنجازاً جديداً إلى سجلنا المتميز
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <button 
                    onClick={() => scrollToSection('contact')}
                    className="px-12 py-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xl rounded-2xl hover:shadow-2xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-3"
                  >
                    <Award size={24} />
                    <span>ابدأ مشروعك معنا</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-32 bg-gradient-to-br from-stone-50 via-white to-emerald-50/30 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-stone-400/5 rounded-full blur-2xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 font-bold text-sm mb-8 border border-emerald-200">
              💬 آراء عملائنا
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-800 mb-8">
              آراء العملاء
            </h2>
            <div className="w-32 h-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              ما يقوله عملاؤنا عن خدماتنا المميزة في التصميم والاستشارات
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
            {[
              {
                name: "أحمد السعيد",
                company: "شركة التطوير العقاري",
                position: "المدير التنفيذي",
                image: require('../images/testimonials/ahmed-saeed.jpg'),
                comment: "خدمة استثنائية في التصميم المعماري. فريق محترف ومبدع ساعدنا في تحقيق رؤيتنا للمشروع. أنصح بالتعامل معهم بشدة.",
                project: "تصميم مجمع سكني راقي",
                gradient: "from-emerald-500 to-teal-500"
              },
              {
                name: "فاطمة النعيمي",
                company: "مطعم الشرق الأوسط",
                position: "المديرة العامة",
                image: require('../images/testimonials/fatima-naimi.jpg'),
                comment: "تصميم داخلي وخارجي مذهل لمطعمنا. زاد من عدد العملاء بنسبة 60% وأصبح مطعمنا وجهة مفضلة للعائلات.",
                project: "تصميم مطعم راقي",
                gradient: "from-teal-500 to-cyan-500"
              },
              {
                name: "محمد العلي",
                company: "شركة الاستثمار التقني",
                position: "رئيس مجلس الإدارة",
                image: require('../images/testimonials/mohammed-ali.jpg'),
                comment: "استشارات تقنية ممتازة ساعدتنا في تطوير أنظمتنا وتحسين كفاءة العمليات. فريق متخصص ومتفاني في العمل.",
                project: "استشارات تقنية شاملة",
                gradient: "from-stone-400 to-emerald-500"
              },
              {
                name: "نورا المطيري",
                company: "مؤسسة تعليمية",
                position: "مديرة التطوير",
                image: require('../images/testimonials/nora-mutairi.jpg'),
                comment: "تخطيط حضري رائع لمؤسستنا التعليمية. صمموا مساحات تعزز التعلم والتفاعل بين الطلاب والمعلمين.",
                project: "تخطيط حضري لمؤسسة تعليمية",
                gradient: "from-emerald-600 to-teal-600"
              },
              {
                name: "خالد الأحمد",
                company: "سلسلة مقاهي",
                position: "المدير العام",
                image: require('../images/testimonials/khalid-ahmed.jpg'),
                comment: "تطوير علامة تجارية مميزة ساعدتنا في التميز في السوق. هوية بصرية قوية تعكس شخصية علامتنا التجارية.",
                project: "تطوير العلامة التجارية",
                gradient: "from-teal-600 to-emerald-600"
              },
              {
                name: "سارة القحطاني",
                company: "مستشفى متخصص",
                position: "مديرة التطوير",
                image: require('../images/testimonials/sara-qhtani.jpg'),
                comment: "تصميم مناظر طبيعية مريحة للمستشفى. ساعد في تحسين تجربة المرضى والزوار وجعل البيئة أكثر راحة.",
                project: "تصميم المناظر الطبيعية",
                gradient: "from-emerald-700 to-teal-700"
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="group relative bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-100/50 hover:border-emerald-200/50 transform hover:-translate-y-2 hover:scale-102 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-3 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  {/* Client Info */}
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className={`w-full h-full bg-gradient-to-r ${testimonial.gradient} flex items-center justify-center text-white font-bold text-xl hidden`}>
                        {testimonial.name.charAt(0)}
                      </div>
                    </div>
                    <div className="mr-4 flex-1">
                      <h4 className="text-lg font-bold text-gray-800 group-hover:text-emerald-700 transition-colors duration-300">
                        {testimonial.name}
                      </h4>
                      <p className="text-emerald-600 font-medium text-sm">
                        {testimonial.position}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>
                  
                  {/* Stars */}
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  {/* Comment */}
                  <div className="relative mb-6">
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 text-sm">
                      {testimonial.comment}
                    </p>
                  </div>
                  
                  {/* Project Badge */}
                  <div className={`inline-block px-3 py-2 bg-gradient-to-r ${testimonial.gradient} rounded-full text-white font-medium text-xs group-hover:scale-105 transition-transform duration-300`}>
                    {testimonial.project}
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
                  <Heart className="text-white" size={32} />
                </div>
                <h3 className="text-3xl md:text-4xl font-black mb-6 text-gray-800">شاركنا رأيك</h3>
                <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                  نحن نقدر آراء عملائنا ونعمل باستمرار على تحسين خدماتنا
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

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-gradient-to-br from-stone-50 via-white to-emerald-50/30 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-stone-400/5 rounded-full blur-2xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 font-bold text-sm mb-8 border border-emerald-200">
              📞 نحن هنا لمساعدتك
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-800 mb-8">
                تواصل معنا
            </h2>
            <div className="w-32 h-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              استعد لتجربة استثنائية مع فريق ترمُز المحترف - نحن هنا لتحويل أحلامك إلى واقع مذهل
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
                    معلومات التواصل
                  </h3>
                  
                  <div className="space-y-8">
                    {[
                      { 
                        icon: <Phone size={24} />, 
                        label: "الهاتف", 
                        value: "+966 50 123 4567", 
                        gradient: "from-emerald-500 to-teal-500",
                        dir: "ltr"
                      },
                      { 
                        icon: <Mail size={24} />, 
                        label: "البريد الإلكتروني", 
                        value: "info@tramuz-design.com", 
                        gradient: "from-teal-500 to-cyan-500",
                        dir: "ltr"
                      },
                      { 
                        icon: <MapPin size={24} />, 
                        label: "العنوان", 
                        value: "الرياض حي النرجس شارع الملك فهد مبنى التصميم الحديث - الطابق الثالث", 
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
                  <h3 className="text-3xl font-black text-gray-800 mb-2">أرسل لنا رسالة</h3>
                  <p className="text-gray-600 text-lg">سنتواصل معك خلال 24 ساعة</p>
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
                        className="w-full px-6 py-4 border-2 border-emerald-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 text-lg group-hover:border-emerald-300"
                        placeholder={field.placeholder}
                        dir={field.dir || "rtl"}
                      />
                    </div>
                  ))}
                  
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      نوع الخدمة المطلوبة
                    </label>
                    <select className="w-full px-6 py-4 border-2 border-emerald-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 text-lg group-hover:border-emerald-300">
                      <option>اختر نوع الخدمة</option>
                      <option>التصميم الداخلي</option>
                      <option>التصميم الخارجي</option>
                      <option>التخطيط الحضري</option>
                      <option>تصميم المناظر الطبيعية</option>
                      <option>تطوير العلامات التجارية</option>
                      <option>استشارات تسويقية</option>
                      <option>استشارات تشغيلية</option>
                      <option>استشارات تقنية</option>
                      <option>توظيف وتدريب</option>
                      <option>إدارة العقود</option>
                      <option>دراسة الجدوى والتخطيط الاستراتيجي</option>
                      <option>إدارة علاقات الشركات</option>
                      <option>أخرى</option>
                    </select>
                  </div>
                  
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      تفاصيل المشروع
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-6 py-4 border-2 border-emerald-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 text-lg resize-none group-hover:border-emerald-300"
                      placeholder="أخبرنا عن مشروعك وكيف يمكننا مساعدتك..."
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full px-12 py-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xl rounded-2xl hover:shadow-2xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-3"
                  >
                    <Sparkles size={24} />
                    <span>أرسل استشارتك</span>
                    <ArrowRight size={24} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 bg-gradient-to-br from-stone-50 via-white to-emerald-50/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 mb-4">
              <span className="text-lg mr-2">🏆</span>
              <span className="text-emerald-700 font-medium text-sm">قصص نجاح عملائنا</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                حالات النجاح
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 mx-auto rounded-full mb-4"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              نفتخر بنجاحات عملائنا ونشارككم قصص إنجازاتهم المميزة
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
              <h3 className="text-2xl font-bold text-gray-900 mb-3">كن التالي في قائمة نجاحاتنا</h3>
              <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                ابدأ رحلتك نحو النجاح مع فريقنا المتميز
              </p>
                  <button 
                    onClick={() => scrollToSection('contact')}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
                  >
                ابدأ مشروعك الآن
                  </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-emerald-900/20 to-teal-900/20 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-900/95"></div>
        
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
                <h3 className="text-2xl font-black mb-4 text-white">شركة ترمُز</h3>
                <p className="text-gray-300 leading-relaxed mb-6 text-base">
                  شركة رائدة في قطاع التصميم والاستشارات، متخصصة في التصميم الداخلي والخارجي، التخطيط الحضري، تصميم المناظر الطبيعية، وتطوير العلامات التجارية.
                </p>
                
                {/* Social Media Links */}
                <div className="flex items-center space-x-reverse space-x-4">
                  <span className="text-gray-400 text-sm font-medium">تابعنا على:</span>
                  <div className="flex items-center space-x-reverse space-x-3">
                    <a href="#" className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors duration-300">
                      <span className="text-white text-sm">f</span>
                    </a>
                    <a href="#" className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors duration-300">
                      <span className="text-white text-sm">t</span>
                    </a>
                    <a href="#" className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors duration-300">
                      <span className="text-white text-sm">i</span>
                    </a>
                    <a href="#" className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors duration-300">
                      <span className="text-white text-sm">l</span>
                    </a>
                  </div>
                </div>
            </div>
            
              {/* Services */}
            <div>
              <h4 className="text-xl font-black mb-6 flex items-center">
                  <Sparkles className="ml-2 text-emerald-400" size={20} />
                خدماتنا
              </h4>
                <div className="grid grid-cols-1 gap-3">
                {[
                  "التصميم الداخلي",
                  "التصميم الخارجي",
                  "التخطيط الحضري",
                  "تصميم المناظر الطبيعية",
                  "تطوير العلامات التجارية",
                  "استشارات تسويقية"
                ].map((service, index) => (
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
                تواصل معنا
              </h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-reverse space-x-3">
                    <Phone size={18} className="text-emerald-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-300 text-sm font-medium">الهاتف</p>
                      <a href="tel:+966501234567" className="text-white hover:text-emerald-400 transition-colors duration-300" dir="ltr">
                        +966 50 123 4567
                      </a>
            </div>
          </div>
          
                  <div className="flex items-start space-x-reverse space-x-3">
                    <Mail size={18} className="text-emerald-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-300 text-sm font-medium">البريد الإلكتروني</p>
                      <a href="mailto:info@tramuz-design.com" className="text-white hover:text-emerald-400 transition-colors duration-300 text-sm" dir="ltr">
                        info@tramuz-design.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-reverse space-x-3">
                    <MapPin size={18} className="text-emerald-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-300 text-sm font-medium">العنوان</p>
                      <p className="text-white text-sm leading-relaxed">
                        الرياض حي النرجس<br />
                        شارع الملك فهد<br />
                        مبنى التصميم الحديث - الطابق الثالث
                      </p>
                    </div>
                  </div>
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
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                  سياسة الخصوصية
                </a>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                  شروط الاستخدام
                </a>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                  خريطة الموقع
                </a>
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
                    <span>اطلب استشارة</span>
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
