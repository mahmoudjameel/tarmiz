import React, { useState, useEffect, useCallback } from "react";
import { db } from "../../firebase";
import { collection, addDoc, getDocs, doc, deleteDoc, setDoc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { Plus, Trash2, Edit, Save, X, Eye, BarChart3, Settings, FolderOpen, Star, Award, Sparkles, LogOut, Users } from 'lucide-react';
import Login from './Login';
import "./Dashboard.css";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [images, setImages] = useState([{url: "", isPrimary: false}]);
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");
  const [projects, setProjects] = useState([]);
  
  // Categories management
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryEn, setNewCategoryEn] = useState("");
  const [newCategoryEmoji, setNewCategoryEmoji] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  
  // Services management
  const [services, setServices] = useState([]);
  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceTitleEn, setServiceTitleEn] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceDescriptionEn, setServiceDescriptionEn] = useState("");
  const [serviceIcon, setServiceIcon] = useState("");

  // Testimonials management
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialName, setTestimonialName] = useState("");
  const [testimonialNameEn, setTestimonialNameEn] = useState("");
  const [testimonialCompany, setTestimonialCompany] = useState("");
  const [testimonialCompanyEn, setTestimonialCompanyEn] = useState("");
  const [testimonialPosition, setTestimonialPosition] = useState("");
  const [testimonialPositionEn, setTestimonialPositionEn] = useState("");
  const [testimonialComment, setTestimonialComment] = useState("");
  const [testimonialCommentEn, setTestimonialCommentEn] = useState("");
  const [testimonialProject, setTestimonialProject] = useState("");
  const [testimonialProjectEn, setTestimonialProjectEn] = useState("");
  const [testimonialImage, setTestimonialImage] = useState("");
  const [testimonialRating, setTestimonialRating] = useState(5);
  const [testimonialGradient, setTestimonialGradient] = useState("from-emerald-500 to-teal-500");
  const [isAddingTestimonial, setIsAddingTestimonial] = useState(false);
  const [servicePrice, setServicePrice] = useState("");
  const [serviceFeatured, setServiceFeatured] = useState(false);
  const [serviceOrder, setServiceOrder] = useState(0);
  
  // Team management
  const [team, setTeam] = useState([]);
  const [memberName, setMemberName] = useState("");
  const [memberNameEn, setMemberNameEn] = useState("");
  const [memberPosition, setMemberPosition] = useState("");
  const [memberPositionEn, setMemberPositionEn] = useState("");
  const [memberImage, setMemberImage] = useState("");
  const [memberBio, setMemberBio] = useState("");
  const [memberBioEn, setMemberBioEn] = useState("");
  
  // Clients management
  const [clients, setClients] = useState([]);
  const [clientName, setClientName] = useState("");
  const [clientNameEn, setClientNameEn] = useState("");
  const [clientLogo, setClientLogo] = useState("");
  const [clientWebsite, setClientWebsite] = useState("");
  const [clientDescription, setClientDescription] = useState("");
  const [clientDescriptionEn, setClientDescriptionEn] = useState("");
  
  // Contact management
  const [contactInfo, setContactInfo] = useState({
    phone: "",
    email: "",
    address: "",
    address_en: "",
    whatsapp: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    facebook: "",
    youtube: ""
  });
  const [isEditingContact, setIsEditingContact] = useState(false);
  
  // UI state
  const [activeTab, setActiveTab] = useState('projects');
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isAddingService, setIsAddingService] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isAddingClient, setIsAddingClient] = useState(false);

  // Edit states (Projects/Services/Testimonials)
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editProjectData, setEditProjectData] = useState(null);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editServiceData, setEditServiceData] = useState(null);
  const [editingTestimonialId, setEditingTestimonialId] = useState(null);
  const [editTestimonialData, setEditTestimonialData] = useState(null);
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editTeamData, setEditTeamData] = useState(null);
  
  // Preview modal states
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewProject, setPreviewProject] = useState(null);
  
  // Image preview in edit modal
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Visibility settings
  const [visibility, setVisibility] = useState({
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
  const [savingVisibility, setSavingVisibility] = useState(false);

  // Hero Section State & Functions
  const [heroData, setHeroData] = useState({
    ar: {
      title: '',
      subtitle: '',
      description: '',
      buttons: [
        { label: '', link: '' },
        { label: '', link: '' }
      ]
    },
    en: {
      title: '',
      subtitle: '',
      description: '',
      buttons: [
        { label: '', link: '' },
        { label: '', link: '' }
      ]
    },
    images: [], // array of image URLs
    timer: 5
  });
  const [heroLoading, setHeroLoading] = useState(false);
  const [heroSaving, setHeroSaving] = useState(false);

  // About & Why Choose Us
  const [aboutData, setAboutData] = useState({
    ar: { 
      title: '', 
      content: '',
      story: { icon: '🏢', title: 'قصتنا', description: '' },
      visionMission: { 
        icon: '🎯',
        title: 'رؤيتنا ورسالتنا',
        vision: { title: 'الرؤية', description: '' },
        mission: { title: 'الرسالة', description: '' }
      },
      values: [
        { icon: '⏰', title: 'الالتزام', description: '' },
        { icon: '⭐', title: 'الجودة', description: '' },
        { icon: '💡', title: 'الإبداع', description: '' },
        { icon: '🚀', title: 'التميز', description: '' }
      ],
      stats: { years: '15+', projects: '100+' }
    },
    en: { 
      title: '', 
      content: '',
      story: { icon: '🏢', title: 'Our Story', description: '' },
      visionMission: { 
        icon: '🎯',
        title: 'Vision & Mission',
        vision: { title: 'Vision', description: '' },
        mission: { title: 'Mission', description: '' }
      },
      values: [
        { icon: '⏰', title: 'Commitment', description: '' },
        { icon: '⭐', title: 'Quality', description: '' },
        { icon: '💡', title: 'Creativity', description: '' },
        { icon: '🚀', title: 'Excellence', description: '' }
      ],
      stats: { years: '15+', projects: '100+' }
    }
  });
  const [aboutLoading, setAboutLoading] = useState(false);
  const [aboutSaving, setAboutSaving] = useState(false);

  const [whyData, setWhyData] = useState({
    ar: { title: '', items: [{ icon: '✅', title: '', description: '' }] },
    en: { title: '', items: [{ icon: '✅', title: '', description: '' }] }
  });
  const [whyLoading, setWhyLoading] = useState(false);
  const [whySaving, setWhySaving] = useState(false);

  // تحميل التصنيفات من Firebase
  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const categoriesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesList);
    } catch (error) {
      console.error("خطأ في تحميل التصنيفات: ", error);
    }
  };

  // إضافة تصنيف جديد
  const addCategory = async () => {
    if (!newCategory || !newCategoryEn) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      await addDoc(collection(db, "categories"), {
        name: newCategory,
        name_en: newCategoryEn,
        emoji: newCategoryEmoji || "",
        createdAt: new Date().toISOString()
      });
      alert("تمت إضافة التصنيف بنجاح!");
      setNewCategory("");
      setNewCategoryEn("");
      setNewCategoryEmoji("");
      fetchCategories();
    } catch (error) {
      console.error("خطأ في إضافة التصنيف: ", error);
      alert("حدث خطأ في إضافة التصنيف");
    }
  };

  // Project editing handlers
  const openEditProject = (project) => {
    setEditingProjectId(project.id);
    setEditProjectData({
      title: project.title || "",
      title_en: project.title_en || project.title || "",
      description: project.description || "",
      description_en: project.description_en || project.description || "",
      category: project.category || "",
      year: project.year || "",
      images: Array.isArray(project.images) ? [...project.images] : []
    });
  };

  const cancelProjectEdit = () => {
    setEditingProjectId(null);
    setEditProjectData(null);
  };

  const saveProjectEdit = async () => {
    if (!editingProjectId || !editProjectData) return;
    try {
      setIsLoading(true);
      const ref = doc(db, "projects", editingProjectId);
      await updateDoc(ref, {
        title: editProjectData.title,
        title_en: editProjectData.title_en || editProjectData.title,
        description: editProjectData.description,
        description_en: editProjectData.description_en || editProjectData.description,
        category: editProjectData.category,
        year: editProjectData.year,
        images: (editProjectData.images || []).filter(img => img && img.url)
      });
      await fetchProjects();
      cancelProjectEdit();
      alert("تم حفظ التعديلات بنجاح!");
    } catch (error) {
      console.error("خطأ في حفظ تعديل المشروع: ", error);
      alert("حدث خطأ أثناء حفظ التعديلات");
    } finally {
      setIsLoading(false);
    }
  };

  // Service editing handlers
  const openEditService = (service) => {
    setEditingServiceId(service.id);
    setEditServiceData({
      title: service.title || "",
      title_en: service.title_en || service.title || "",
      description: service.description || "",
      description_en: service.description_en || service.description || "",
      icon: service.icon || "",
      price: service.price || 0,
      featured: !!service.featured,
      order: service.order ?? 0
    });
  };

  const cancelServiceEdit = () => {
    setEditingServiceId(null);
    setEditServiceData(null);
  };

  const saveServiceEdit = async () => {
    if (!editingServiceId || !editServiceData) return;
    try {
      setIsLoading(true);
      const ref = doc(db, "services", editingServiceId);
      await updateDoc(ref, {
        title: editServiceData.title,
        title_en: editServiceData.title_en || editServiceData.title,
        description: editServiceData.description,
        description_en: editServiceData.description_en || editServiceData.description,
        icon: editServiceData.icon,
        price: Number(editServiceData.price) || 0,
        featured: !!editServiceData.featured,
        order: Number(editServiceData.order) || 0
      });
      await fetchServices();
      cancelServiceEdit();
      alert("تم حفظ تعديل الخدمة بنجاح!");
    } catch (error) {
      console.error("خطأ في حفظ تعديل الخدمة: ", error);
      alert("حدث خطأ أثناء حفظ التعديلات");
    } finally {
      setIsLoading(false);
    }
  };

  // حذف تصنيف
  const deleteCategory = async (categoryId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا التصنيف؟")) {
      try {
        await deleteDoc(doc(db, "categories", categoryId));
        alert("تم حذف التصنيف بنجاح!");
        fetchCategories();
      } catch (error) {
        console.error("خطأ في حذف التصنيف: ", error);
        alert("حدث خطأ في حذف التصنيف");
      }
    }
  };

  // إضافة صورة جديدة
  const addImage = () => {
    setImages([...images, {url: "", isPrimary: false}]);
  };

  // حذف صورة
  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    // إذا كانت الصورة المحذوفة هي الرئيسية، اجعل الصورة الأولى رئيسية
    if (images[index].isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }
    setImages(newImages);
  };

  // تحديد الصورة الرئيسية
  const setPrimaryImage = (index) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index
    }));
    setImages(newImages);
  };

  // تحديث رابط الصورة
  const updateImageUrl = (index, url) => {
    const newImages = [...images];
    newImages[index].url = url;
    setImages(newImages);
  };

  // Editing project images helpers
  const setEditProjectImageUrl = (index, url) => {
    if (!editProjectData) return;
    const updated = { ...editProjectData, images: [...(editProjectData.images || [])] };
    updated.images[index] = { ...(updated.images[index] || { isPrimary: false }), url };
    setEditProjectData(updated);
  };

  const setEditProjectPrimary = (index) => {
    if (!editProjectData) return;
    const updatedImages = (editProjectData.images || []).map((img, i) => ({
      ...img,
      isPrimary: i === index
    }));
    setEditProjectData({ ...editProjectData, images: updatedImages });
  };

  const addEditProjectImage = () => {
    if (!editProjectData) return;
    setEditProjectData({ ...editProjectData, images: [...(editProjectData.images || []), { url: "", isPrimary: false }] });
  };

  const removeEditProjectImage = (index) => {
    if (!editProjectData) return;
    const updated = [...(editProjectData.images || [])].filter((_, i) => i !== index);
    // Ensure at least one primary remains if any images exist
    if (updated.length > 0 && !updated.some(img => img.isPrimary)) {
      updated[0].isPrimary = true;
    }
    setEditProjectData({ ...editProjectData, images: updated });
  };

  // تحميل المشاريع من Firebase
  const fetchProjects = async () => {
    try {
      setIsLoadingProjects(true);
      const querySnapshot = await getDocs(collection(db, "projects"));
      const projectsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsList);
    } catch (error) {
      console.error("خطأ في تحميل المشاريع: ", error);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  // تحميل الخدمات من Firebase
  const fetchServices = async () => {
    try {
      console.log("بدء تحميل الخدمات من Firebase...");
      const querySnapshot = await getDocs(collection(db, "services"));
      const servicesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`تم تحميل ${servicesList.length} خدمة من Firebase:`, servicesList);
      
      // تسجيل الخدمات المتميزة
      const featuredServices = servicesList.filter(service => service.featured);
      console.log(`الخدمات المتميزة: ${featuredServices.length}`, featuredServices);
      
      setServices(servicesList);
    } catch (error) {
      console.error("خطأ في تحميل الخدمات: ", error);
      console.error("تفاصيل الخطأ:", {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
    }
  };

  // تحميل آراء العملاء من Firebase
  const fetchTestimonials = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "testimonials"));
      const testimonialsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTestimonials(testimonialsList);
    } catch (error) {
      console.error("خطأ في تحميل آراء العملاء: ", error);
    }
  };

  // تحميل الفريق من Firebase
  const fetchTeam = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "team"));
      const teamList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTeam(teamList);
    } catch (error) {
      console.error("خطأ في تحميل الفريق: ", error);
    }
  };

  // تحميل العملاء من Firebase
  const fetchClients = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "clients"));
      const clientsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setClients(clientsList);
    } catch (error) {
      console.error("خطأ في تحميل العملاء: ", error);
    }
  };

  // تحميل معلومات التواصل من Firebase
  const fetchContactInfo = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "contactInfo"));
      if (!querySnapshot.empty) {
        const contactData = querySnapshot.docs[0].data();
        setContactInfo(contactData);
      }
    } catch (error) {
      console.error("خطأ في تحميل معلومات التواصل: ", error);
    }
  };

  // تحميل بيانات البانر من Firestore
  const fetchHeroData = async () => {
    setHeroLoading(true);
    try {
      const docRef = doc(db, 'settings', 'hero');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setHeroData(docSnap.data());
      }
    } catch (error) {
      console.error('خطأ في تحميل بيانات البانر:', error);
    } finally {
      setHeroLoading(false);
    }
  };

  // About fetch/save
  const fetchAboutData = async () => {
    setAboutLoading(true);
    try {
      const docRef = doc(db, 'settings', 'about');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setAboutData(docSnap.data());
    } catch (e) {
      console.error('خطأ في تحميل من نحن:', e);
    } finally {
      setAboutLoading(false);
    }
  };

  const saveAboutData = async () => {
    setAboutSaving(true);
    try {
      const docRef = doc(db, 'settings', 'about');
      await setDoc(docRef, aboutData, { merge: true });
      alert('تم حفظ قسم من نحن');
    } catch (e) {
      console.error('خطأ في حفظ من نحن:', e);
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setAboutSaving(false);
    }
  };

  // Why Choose Us fetch/save
  const fetchWhyData = async () => {
    setWhyLoading(true);
    try {
      const docRef = doc(db, 'settings', 'whyChoose');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setWhyData(docSnap.data());
    } catch (e) {
      console.error('خطأ في تحميل لماذا تختارنا:', e);
    } finally {
      setWhyLoading(false);
    }
  };

  const saveWhyData = async () => {
    setWhySaving(true);
    try {
      const docRef = doc(db, 'settings', 'whyChoose');
      await setDoc(docRef, whyData, { merge: true });
      alert('تم حفظ قسم لماذا تختارنا');
    } catch (e) {
      console.error('خطأ في حفظ لماذا تختارنا:', e);
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setWhySaving(false);
    }
  };

  // تحميل إعدادات الظهور من Firestore
  const fetchVisibility = useCallback(async () => {
    try {
      const docRef = doc(db, 'settings', 'visibility');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setVisibility(docSnap.data());
      }
    } catch (error) {
      console.error('خطأ في تحميل إعدادات الظهور:', error);
    }
  }, []);

  // حفظ إعدادات الظهور
  const saveVisibility = async () => {
    try {
      setSavingVisibility(true);
      const docRef = doc(db, 'settings', 'visibility');
      await setDoc(docRef, visibility, { merge: true });
      alert('تم حفظ إعدادات الظهور');
    } catch (error) {
      console.error('خطأ في حفظ إعدادات الظهور:', error);
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setSavingVisibility(false);
    }
  };

  // حفظ بيانات البانر في Firestore
  const saveHeroData = async () => {
    setHeroSaving(true);
    try {
      const docRef = doc(db, 'settings', 'hero');
      await setDoc(docRef, heroData);
      alert('تم حفظ بيانات البانر بنجاح!');
    } catch (error) {
      console.error('خطأ في حفظ بيانات البانر:', error);
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setHeroSaving(false);
    }
  };

  // رفع صورة إلى Firebase Storage
  const storage = getStorage();
  const uploadHeroImage = async (file) => {
    if (!file) return null;
    const fileRef = storageRef(storage, `hero/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  };

  // إضافة عضو فريق جديد
  const addMember = async (e) => {
    e.preventDefault();
    if (!memberName || !memberPosition) return;

    try {
      await addDoc(collection(db, "team"), {
        name: memberName,
        name_en: memberNameEn || memberName,
        position: memberPosition,
        position_en: memberPositionEn || memberPosition,
        image: memberImage,
        bio: memberBio,
        bio_en: memberBioEn || memberBio,
        createdAt: new Date().toISOString()
      });
      
      setMemberName("");
      setMemberNameEn("");
      setMemberPosition("");
      setMemberPositionEn("");
      setMemberImage("");
      setMemberBio("");
      setMemberBioEn("");
      setIsAddingMember(false);
      fetchTeam();
    } catch (error) {
      console.error("خطأ في إضافة عضو الفريق: ", error);
    }
  };

  // حذف عضو فريق
  const deleteMember = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا العضو؟")) {
      try {
        await deleteDoc(doc(db, "team", id));
        fetchTeam();
      } catch (error) {
        console.error("خطأ في حذف عضو الفريق: ", error);
      }
    }
  };

  // إضافة عميل جديد
  const addClient = async (e) => {
    e.preventDefault();
    if (!clientName || !clientLogo) return;

    try {
      await addDoc(collection(db, "clients"), {
        name: clientName,
        name_en: clientNameEn || clientName,
        logo: clientLogo,
        website: clientWebsite,
        description: clientDescription,
        description_en: clientDescriptionEn || clientDescription,
        createdAt: new Date().toISOString()
      });
      
      setClientName("");
      setClientNameEn("");
      setClientLogo("");
      setClientWebsite("");
      setClientDescription("");
      setClientDescriptionEn("");
      setIsAddingClient(false);
      fetchClients();
    } catch (error) {
      console.error("خطأ في إضافة العميل: ", error);
    }
  };

  // حذف عميل
  const deleteClient = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا العميل؟")) {
      try {
        await deleteDoc(doc(db, "clients", id));
        fetchClients();
      } catch (error) {
        console.error("خطأ في حذف العميل: ", error);
      }
    }
  };

  // حفظ معلومات التواصل
  const saveContactInfo = async (e) => {
    e.preventDefault();
    try {
      // حذف البيانات القديمة أولاً
      const querySnapshot = await getDocs(collection(db, "contactInfo"));
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      // إضافة البيانات الجديدة
      await addDoc(collection(db, "contactInfo"), {
        ...contactInfo,
        updatedAt: new Date().toISOString()
      });
      
      setIsEditingContact(false);
      alert("تم حفظ معلومات التواصل بنجاح!");
    } catch (error) {
      console.error("خطأ في حفظ معلومات التواصل: ", error);
      alert("حدث خطأ في حفظ المعلومات");
    }
  };

  // التحقق من حالة تسجيل الدخول
  useEffect(() => {
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem('isLoggedIn');
      const loginTime = localStorage.getItem('loginTime');
      
      if (loginStatus === 'true' && loginTime) {
        // التحقق من انتهاء صلاحية الجلسة (24 ساعة)
        const now = new Date();
        const loginDate = new Date(loginTime);
        const hoursDiff = (now - loginDate) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          setIsLoggedIn(true);
        } else {
          // انتهت صلاحية الجلسة
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('loginTime');
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  // تحميل البيانات عند تسجيل الدخول
  useEffect(() => {
    if (isLoggedIn) {
      const loadAllData = async () => {
        try {
          await Promise.all([
            fetchProjects(),
            fetchServices(),
            fetchTestimonials(),
            fetchTeam(),
            fetchClients(),
            fetchContactInfo(),
            fetchHeroData(),
            fetchAboutData(),
            fetchWhyData(),
            fetchVisibility()
          ]);
        } catch (error) {
          console.error('خطأ في تحميل البيانات:', error);
        }
      };
      
      loadAllData();
    }
  }, [isLoggedIn]);

  // مراقبة التغييرات في الخدمات
  useEffect(() => {
    if (!isLoggedIn) return;
    
    console.log("بدء مراقبة التغييرات في الخدمات...");
    
    const unsubscribe = onSnapshot(collection(db, "services"), (snapshot) => {
      console.log("تغيير في الخدمات تم اكتشافه!");
      
      const changes = snapshot.docChanges();
      changes.forEach((change) => {
        if (change.type === "added") {
          console.log("تمت إضافة خدمة جديدة:", change.doc.data());
        } else if (change.type === "modified") {
          console.log("تم تعديل خدمة:", change.doc.data());
        } else if (change.type === "removed") {
          console.log("تم حذف خدمة:", change.doc.id, change.doc.data());
          alert(`تحذير: تم حذف خدمة تلقائياً! ID: ${change.doc.id}`);
        }
      });
      
      // تحديث قائمة الخدمات
      const servicesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setServices(servicesList);
    }, (error) => {
      console.error("خطأ في مراقبة الخدمات:", error);
    });

    return () => {
      console.log("إيقاف مراقبة الخدمات");
      unsubscribe();
    };
  }, [isLoggedIn]);

  // دالة مساعدة لتنسيق التاريخ
  const formatDate = (date) => {
    if (!date) return 'غير محدد';
    
    // إذا كان Firebase Timestamp
    if (date.seconds) {
      return new Date(date.seconds * 1000).toLocaleDateString('ar-SA');
    }
    
    // إذا كان Date object
    if (date instanceof Date) {
      return date.toLocaleDateString('ar-SA');
    }
    
    // إذا كان string
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString('ar-SA');
    }
    
    return 'غير محدد';
  };

  // دالة تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loginTime');
    setIsLoggedIn(false);
  };

  const addProject = async () => {
    if (!title || !description || !category || !year || images.length === 0 || !images[0].url) {
      alert("يرجى ملء جميع الحقول المطلوبة وتأكد من إضافة صورة واحدة على الأقل");
      return;
    }

    // التأكد من وجود صورة رئيسية
    const hasPrimary = images.some(img => img.isPrimary);
    if (!hasPrimary) {
      const newImages = [...images];
      newImages[0].isPrimary = true;
      setImages(newImages);
    }

    try {
      setIsLoading(true);
      await addDoc(collection(db, "projects"), {
        title,
        title_en: titleEn || title,
        description,
        description_en: descriptionEn || description,
        images: images.filter(img => img.url), // حفظ الصور فقط التي لها روابط
        category,
        year,
        createdAt: new Date().toISOString()
      });
      alert("تمت إضافة المشروع بنجاح!");
      
      // إعادة تعيين النموذج
      setTitle("");
      setTitleEn("");
      setDescription("");
      setDescriptionEn("");
      setImages([{url: "", isPrimary: false}]);
      setCategory("");
      setYear("");
      
      // إعادة تحميل المشاريع
      await fetchProjects();
    } catch (error) {
      console.error("خطأ في إضافة المشروع: ", error);
      alert("حدث خطأ في إضافة المشروع");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async (projectId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المشروع؟")) {
      try {
        await deleteDoc(doc(db, "projects", projectId));
        alert("تم حذف المشروع بنجاح!");
        await fetchProjects();
      } catch (error) {
        console.error("خطأ في حذف المشروع: ", error);
        alert("حدث خطأ في حذف المشروع");
      }
    }
  };

  // إضافة خدمة جديدة
  const addService = async () => {
    if (!serviceTitle || !serviceDescription || !serviceIcon) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      setIsLoading(true);
      
      // تسجيل البيانات قبل الإرسال
      const serviceData = {
        title: serviceTitle,
        title_en: serviceTitleEn || serviceTitle,
        description: serviceDescription,
        description_en: serviceDescriptionEn || serviceDescription,
        icon: serviceIcon,
        price: servicePrice || 0,
        featured: !!serviceFeatured,
        order: Number(serviceOrder) || 0,
        createdAt: new Date(),
        lastModified: new Date()
      };
      
      console.log("إضافة خدمة جديدة:", serviceData);
      
      const docRef = await addDoc(collection(db, "services"), serviceData);
      console.log("تم إنشاء الخدمة بنجاح مع ID:", docRef.id);
      
      alert("تمت إضافة الخدمة بنجاح!");
      
      // إعادة تعيين النموذج
      setServiceTitle("");
      setServiceTitleEn("");
      setServiceDescription("");
      setServiceDescriptionEn("");
      setServiceIcon("");
      setServicePrice("");
      setServiceFeatured(false);
      setServiceOrder(0);
      setIsAddingService(false);
      
      // إعادة تحميل الخدمات
      await fetchServices();
      
      // التحقق من وجود الخدمة بعد الإضافة
      setTimeout(async () => {
        try {
          const docSnap = await getDoc(doc(db, "services", docRef.id));
          if (docSnap.exists()) {
            const serviceData = docSnap.data();
            console.log("الخدمة موجودة بعد الإضافة:", serviceData);
            
            // التحقق من البيانات المهمة
            if (!serviceData.title) {
              console.error("تحذير: عنوان الخدمة مفقود!");
            }
            if (serviceData.featured === undefined) {
              console.error("تحذير: حالة التميز غير محددة!");
            }
            
            // إعادة تحميل الخدمات للتأكد
            await fetchServices();
          } else {
            console.error("الخدمة غير موجودة بعد الإضافة!");
            alert("تحذير: الخدمة لم تُحفظ بشكل صحيح");
          }
        } catch (error) {
          console.error("خطأ في التحقق من الخدمة:", error);
        }
      }, 3000);
      
    } catch (error) {
      console.error("خطأ في إضافة الخدمة: ", error);
      console.error("تفاصيل الخطأ:", {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      alert(`حدث خطأ في إضافة الخدمة: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // حذف خدمة
  const deleteService = async (serviceId) => {
    if (window.confirm("هل أنت متأكد من حذف هذه الخدمة؟")) {
      try {
        await deleteDoc(doc(db, "services", serviceId));
        alert("تم حذف الخدمة بنجاح!");
        await fetchServices();
      } catch (error) {
        console.error("خطأ في حذف الخدمة: ", error);
        alert("حدث خطأ في حذف الخدمة");
      }
    }
  };

  // إضافة رأي عميل جديد
  const addTestimonial = async () => {
    if (!testimonialName || !testimonialComment) {
      alert("يرجى ملء الاسم والتعليق على الأقل");
      return;
    }

    try {
      setIsLoading(true);
      await addDoc(collection(db, "testimonials"), {
        name: testimonialName,
        nameEn: testimonialNameEn,
        company: testimonialCompany,
        companyEn: testimonialCompanyEn,
        position: testimonialPosition,
        positionEn: testimonialPositionEn,
        comment: testimonialComment,
        commentEn: testimonialCommentEn,
        project: testimonialProject,
        projectEn: testimonialProjectEn,
        image: testimonialImage,
        rating: testimonialRating,
        gradient: testimonialGradient,
        isVisible: true,
        createdAt: new Date()
      });

      // إعادة تعيين الحقول
      setTestimonialName("");
      setTestimonialNameEn("");
      setTestimonialCompany("");
      setTestimonialCompanyEn("");
      setTestimonialPosition("");
      setTestimonialPositionEn("");
      setTestimonialComment("");
      setTestimonialCommentEn("");
      setTestimonialProject("");
      setTestimonialProjectEn("");
      setTestimonialImage("");
      setTestimonialRating(5);
      setTestimonialGradient("from-emerald-500 to-teal-500");
      
      // إعادة تحميل آراء العملاء
      await fetchTestimonials();
      alert("تم إضافة رأي العميل بنجاح!");
    } catch (error) {
      console.error("خطأ في إضافة رأي العميل: ", error);
      alert("حدث خطأ في إضافة رأي العميل");
    } finally {
      setIsLoading(false);
    }
  };

  // حذف رأي عميل
  const deleteTestimonial = async (testimonialId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الرأي؟")) {
      try {
        await deleteDoc(doc(db, "testimonials", testimonialId));
        alert("تم حذف رأي العميل بنجاح!");
        await fetchTestimonials();
      } catch (error) {
        console.error("خطأ في حذف رأي العميل: ", error);
        alert("حدث خطأ في حذف رأي العميل");
      }
    }
  };

  // فتح معاينة المشروع
  const openProjectPreview = (project) => {
    setPreviewProject(project);
    setPreviewModalOpen(true);
  };

  // إغلاق معاينة المشروع
  const closeProjectPreview = () => {
    setPreviewModalOpen(false);
    setPreviewProject(null);
  };

  // فتح معاينة الصورة في التعديل
  const openImagePreview = (image) => {
    setPreviewImage(image);
    setImagePreviewOpen(true);
  };

  // إغلاق معاينة الصورة
  const closeImagePreview = () => {
    setImagePreviewOpen(false);
    setPreviewImage(null);
  };

  const getCategoryDisplayName = (category) => {
    // Try to resolve from Firestore categories first
    const cat = categories.find((c) => c.id === category);
    if (cat) return `${cat.emoji ? cat.emoji + " " : ""}${cat.name}`;
    // Fallback to defaults
    const defaultMap = {
      "exterior-design": "🏢 تصميم خارجي",
      "interior-design": "🏠 تصميم داخلي",
      "execution-plans": "📐 مخططات تنفيذية",
      "branding": "🎨 هوية بصرية"
    };
    return defaultMap[category] || category;
  };

  const [projectDetailsId, setProjectDetailsId] = useState(null);

  // عرض شاشة الدخول إذا لم يكن المستخدم مسجل الدخول
  if (!isLoggedIn) {
    return <Login onLogin={setIsLoggedIn} />;
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon">
              <Settings size={32} />
            </div>
            <div className="header-text">
      <h1 className="dashboard-title">لوحة تحكم الإدارة</h1>
              <p className="dashboard-subtitle">إدارة المشاريع والخدمات</p>
            </div>
          </div>
          <div className="header-right">
            <button onClick={handleLogout} className="logout-button">
              <LogOut size={18} />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <FolderOpen size={20} />
            <span>المشاريع ({projects.length})</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            <Star size={20} />
            <span>الخدمات ({services.length})</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'works' ? 'active' : ''}`}
            onClick={() => setActiveTab('works')}
          >
            <FolderOpen size={20} />
            <span>المشاريع ({projects.length})</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'testimonials' ? 'active' : ''}`}
            onClick={() => setActiveTab('testimonials')}
          >
            <Award size={20} />
            <span>آراء العملاء ({testimonials.length})</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            <Award size={20} />
            <span>الفريق ({team.length})</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'clients' ? 'active' : ''}`}
            onClick={() => setActiveTab('clients')}
          >
            <Users size={20} />
            <span>العملاء ({clients.length})</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            <Settings size={20} />
            <span>التواصل</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <Settings size={20} />
            <span>التصنيفات</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'hero' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('hero');
              fetchHeroData();
            }}
          >
            <Star size={20} />
            <span>البانر</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <BarChart3 size={20} />
            <span>الإحصائيات</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            <Sparkles size={20} />
            <span>من نحن</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'why' ? 'active' : ''}`}
            onClick={() => setActiveTab('why')}
          >
            <Star size={20} />
            <span>لماذا تختارنا؟</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'visibility' ? 'active' : ''}`}
            onClick={() => setActiveTab('visibility')}
          >
            <Eye size={20} />
            <span>الظهور</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="tab-content">
            {/* Add Project Section */}
            <div className="content-card">
              <div className="card-header">
                <div className="card-title">
                  <Plus size={24} />
                  <span>إضافة مشروع جديد</span>
                </div>
                <button
                  className={`toggle-button ${isAddingProject ? 'active' : ''}`}
                  onClick={() => setIsAddingProject(!isAddingProject)}
                >
                  {isAddingProject ? <X size={20} /> : <Plus size={20} />}
                </button>
              </div>
              
              {isAddingProject && (
      <div className="form-container">
                  <div className="form-grid">
        <input
          type="text"
          className="input-field"
          placeholder="عنوان المشروع (AR)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          className="input-field"
          placeholder="Project Title (EN)"
          value={titleEn}
          onChange={(e) => setTitleEn(e.target.value)}
        />
        <select
          className="input-field"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">اختر التصنيف</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          className="input-field"
          placeholder="السنة"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
                    {/* إدارة الصور */}
                    <div className="input-field full-width">
                      <label className="block text-sm font-medium text-gray-700 mb-2">صور المشروع</label>
                      {images.map((image, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                          <input
                            type="url"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="رابط الصورة"
                            value={image.url}
                            onChange={(e) => updateImageUrl(index, e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => setPrimaryImage(index)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium ${
                              image.isPrimary 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            رئيسية
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            حذف
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addImage}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm"
                      >
                        + إضافة صورة
                      </button>
                    </div>
                  </div>
                  <textarea
                    className="textarea-field"
                    placeholder="وصف المشروع (AR)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                  />
                  <textarea
                    className="textarea-field"
                    placeholder="Project Description (EN)"
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    rows="3"
                  />
                  <div className="form-actions">
                    <button 
                      className="submit-button primary" 
                      onClick={addProject}
                      disabled={isLoading}
                    >
                      <Save size={20} />
                      {isLoading ? "جاري الإضافة..." : "إضافة مشروع"}
                    </button>
                    <button 
  className="submit-button secondary" 
  onClick={() => {
    setIsAddingProject(false);
    setTitle("");
    setTitleEn("");
    setDescription("");
    setDescriptionEn("");
    setImages([{url: "", isPrimary: false}]);
    setCategory("");
    setYear("");
  }}
>
  <X size={20} />
  إلغاء
</button>
                  </div>
                </div>
              )}
            </div>

            {/* Projects List */}
            <div className="content-card">
              <div className="card-header">
                <div className="card-title">
                  <FolderOpen size={24} />
                  <span>المشاريع الحالية</span>
                </div>
              </div>
              
              {isLoadingProjects ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>جاري تحميل المشاريع...</p>
                </div>
              ) : projects.length === 0 ? (
                <div className="empty-state">
                  <FolderOpen size={48} />
                  <h3>لا توجد مشاريع حالياً</h3>
                  <p>ابدأ بإضافة مشروع جديد</p>
                </div>
              ) : (
                <div className="projects-grid">
                  {projects.map((project) => (
                    <div key={project.id} className="project-card">
                      <div className="project-thumbnail">
                        {project.thumbnail && (
                          <span className="thumbnail-emoji">{project.thumbnail}</span>
                        )}
                      </div>
                      {editingProjectId === project.id ? (
                        <div className="project-info">
                          <input
                            type="text"
                            className="input-field mb-2"
                            value={editProjectData?.title || ''}
                            onChange={(e) => setEditProjectData({ ...editProjectData, title: e.target.value })}
                            placeholder="عنوان المشروع (AR)"
                          />
                          <input
                            type="text"
                            className="input-field mb-2"
                            value={editProjectData?.title_en || ''}
                            onChange={(e) => setEditProjectData({ ...editProjectData, title_en: e.target.value })}
                            placeholder="Project Title (EN)"
                          />
                          <select
                            className="input-field mb-2"
                            value={editProjectData?.category || ''}
                            onChange={(e) => setEditProjectData({ ...editProjectData, category: e.target.value })}
                          >
                            <option value="">اختر التصنيف</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.emoji ? cat.emoji + ' ' : ''}{cat.name}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            className="input-field mb-2"
                            value={editProjectData?.year || ''}
                            onChange={(e) => setEditProjectData({ ...editProjectData, year: e.target.value })}
                            placeholder="السنة"
                          />
                          <textarea
                            className="textarea-field mb-2"
                            value={editProjectData?.description || ''}
                            onChange={(e) => setEditProjectData({ ...editProjectData, description: e.target.value })}
                            placeholder="وصف المشروع (AR)"
                            rows="3"
                          />
                          <textarea
                            className="textarea-field mb-2"
                            value={editProjectData?.description_en || ''}
                            onChange={(e) => setEditProjectData({ ...editProjectData, description_en: e.target.value })}
                            placeholder="Project Description (EN)"
                            rows="3"
                          />
                          <div className="input-field full-width">
                            <label className="block text-sm font-medium text-gray-700 mb-2">صور المشروع</label>
                            {(editProjectData?.images || []).map((image, index) => (
                              <div key={index} className="flex items-center gap-2 mb-2">
                                <input
                                  type="url"
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                  placeholder="رابط الصورة"
                                  value={image.url || ''}
                                  onChange={(e) => setEditProjectImageUrl(index, e.target.value)}
                                />
                                {image.url && (
                                  <button
                                    type="button"
                                    onClick={() => openImagePreview(image)}
                                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    title="عرض الصورة"
                                  >
                                    <Eye size={16} />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => setEditProjectPrimary(index)}
                                  className={`px-3 py-2 rounded-lg text-sm font-medium ${image.isPrimary ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                >
                                  رئيسية
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeEditProjectImage(index)}
                                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                  حذف
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={addEditProjectImage}
                              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm"
                            >
                              + إضافة صورة
                            </button>
                          </div>
                          <div className="project-actions mt-3">
                            <button className="submit-button primary" onClick={saveProjectEdit} disabled={isLoading}>
                              <Save size={16} />
                              حفظ
                            </button>
                            <button className="submit-button secondary" onClick={cancelProjectEdit}>
                              <X size={16} />
                              إلغاء
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                      <div className="project-info">
                        <h3 className="project-title">{project.title}</h3>
                        <p className="project-description">{project.description}</p>
                        <div className="project-meta">
                          <span className="category-badge">{getCategoryDisplayName(project.category)}</span>
                          <span className="year-badge">{project.year}</span>
                        </div>
                      </div>
                      <div className="project-actions">
                        <button 
                          className="action-button preview"
                          title="معاينة سريعة"
                          onClick={() => openProjectPreview(project)}
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="action-button view"
                          title="عرض المشروع"
                              onClick={() => setProjectDetailsId(project.id)}
                        >
                          <BarChart3 size={16} />
                        </button>
                        <button 
                          className="action-button edit"
                          title="تعديل المشروع"
                              onClick={() => openEditProject(project)}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="action-button delete"
                          onClick={() => deleteProject(project.id)}
                          title="حذف المشروع"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="tab-content">
            {/* Add Service Section */}
            <div className="content-card">
              <div className="card-header">
                <div className="card-title">
                  <Star size={24} />
                  <span>إضافة خدمة جديدة</span>
                </div>
                <button
                  className={`toggle-button ${isAddingService ? 'active' : ''}`}
                  onClick={() => setIsAddingService(!isAddingService)}
                >
                  {isAddingService ? <X size={20} /> : <Plus size={20} />}
                </button>
              </div>
              
              {isAddingService && (
                <div className="form-container">
                  <div className="form-grid">
                    <input
                      type="text"
                      className="input-field"
                      placeholder="عنوان الخدمة (AR)"
                      value={serviceTitle}
                      onChange={(e) => setServiceTitle(e.target.value)}
                    />
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Service Title (EN)"
                      value={serviceTitleEn}
                      onChange={(e) => setServiceTitleEn(e.target.value)}
                    />
                    <input
                      type="text"
                      className="input-field"
                      placeholder="رمز الخدمة (مثل: 🏗️)"
                      value={serviceIcon}
                      onChange={(e) => setServiceIcon(e.target.value)}
                    />
                    <input
                      type="number"
                      className="input-field"
                      placeholder="سعر الخدمة (بالريال)"
                      value={servicePrice}
                      onChange={(e) => setServicePrice(e.target.value)}
                    />
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={serviceFeatured} onChange={(e)=> setServiceFeatured(e.target.checked)} />
                      <span>مميزة</span>
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="ترتيب العرض (رقم)"
                      value={serviceOrder}
                      onChange={(e) => setServiceOrder(e.target.value)}
                    />
                  </div>
                  <textarea
                    className="textarea-field"
                    placeholder="وصف الخدمة (AR)"
                    value={serviceDescription}
                    onChange={(e) => setServiceDescription(e.target.value)}
                    rows="3"
                  />
                  <textarea
                    className="textarea-field"
                    placeholder="Service Description (EN)"
                    value={serviceDescriptionEn}
                    onChange={(e) => setServiceDescriptionEn(e.target.value)}
                    rows="3"
                  />
                  <div className="form-actions">
                    <button 
                      className="submit-button primary" 
                      onClick={addService}
                      disabled={isLoading}
                    >
                      <Save size={20} />
                      {isLoading ? "جاري الإضافة..." : "إضافة خدمة"}
                    </button>
                    <button 
                      className="submit-button secondary" 
                      onClick={() => {
                        setIsAddingService(false);
                        setServiceTitle("");
                        setServiceDescription("");
                        setServiceIcon("");
                        setServicePrice("");
                      }}
                    >
                      <X size={20} />
                      إلغاء
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Services List */}
            <div className="content-card">
              <div className="card-header">
                <div className="card-title">
                  <Star size={24} />
                  <span>الخدمات المتميزة</span>
                </div>
              </div>
              
              {services.length === 0 ? (
                <div className="empty-state">
                  <Star size={48} />
                  <h3>لا توجد خدمات حالياً</h3>
                  <p>ابدأ بإضافة خدمة جديدة</p>
                </div>
              ) : (
                <div className="services-grid">
                  {services.map((service) => (
                    <div key={service.id} className="service-card">
                      {editingServiceId === service.id ? (
                        <div className="service-info w-full">
                          <input
                            type="text"
                            className="input-field mb-2"
                            value={editServiceData?.title || ''}
                            onChange={(e) => setEditServiceData({ ...editServiceData, title: e.target.value })}
                            placeholder="عنوان الخدمة (AR)"
                          />
                          <input
                            type="text"
                            className="input-field mb-2"
                            value={editServiceData?.title_en || ''}
                            onChange={(e) => setEditServiceData({ ...editServiceData, title_en: e.target.value })}
                            placeholder="Service Title (EN)"
                          />
                          <input
                            type="text"
                            className="input-field mb-2"
                            value={editServiceData?.icon || ''}
                            onChange={(e) => setEditServiceData({ ...editServiceData, icon: e.target.value })}
                            placeholder="رمز الخدمة (مثل: 🏗️)"
                          />
                          <input
                            type="number"
                            className="input-field mb-2"
                            value={editServiceData?.price || 0}
                            onChange={(e) => setEditServiceData({ ...editServiceData, price: e.target.value })}
                            placeholder="سعر الخدمة (بالريال)"
                          />
                          <textarea
                            className="textarea-field mb-2"
                            value={editServiceData?.description || ''}
                            onChange={(e) => setEditServiceData({ ...editServiceData, description: e.target.value })}
                            placeholder="وصف الخدمة (AR)"
                            rows="3"
                          />
                          <textarea
                            className="textarea-field mb-2"
                            value={editServiceData?.description_en || ''}
                            onChange={(e) => setEditServiceData({ ...editServiceData, description_en: e.target.value })}
                            placeholder="Service Description (EN)"
                            rows="3"
                          />
                      <label className="flex items-center gap-2 mb-2">
                        <input type="checkbox" checked={!!editServiceData?.featured} onChange={(e)=> setEditServiceData({ ...editServiceData, featured: e.target.checked })} />
                        <span>مميزة</span>
                      </label>
                      <input
                        type="number"
                        className="input-field mb-2"
                        value={editServiceData?.order ?? 0}
                        onChange={(e) => setEditServiceData({ ...editServiceData, order: e.target.value })}
                        placeholder="ترتيب العرض (رقم)"
                      />
                          <div className="service-actions mt-2">
                            <button className="submit-button primary" onClick={saveServiceEdit} disabled={isLoading}>
                              <Save size={16} />
                              حفظ
                            </button>
                            <button className="submit-button secondary" onClick={cancelServiceEdit}>
                              <X size={16} />
                              إلغاء
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                      <div className="service-icon">
                        <span className="icon-emoji">{service.icon}</span>
                      </div>
                      <div className="service-info">
                        <h3 className="service-title">{service.title}</h3>
                        <p className="service-description">{service.description}</p>
                        {service.price > 0 && (
                          <div className="service-price">
                            <span className="price-label">السعر:</span>
                            <span className="price-value">{service.price} ريال</span>
                          </div>
                        )}
                      </div>
                      <div className="service-actions">
                        <button 
                          className="action-button edit"
                          title="تعديل الخدمة"
                              onClick={() => openEditService(service)}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="action-button delete"
                          onClick={() => deleteService(service.id)}
                          title="حذف الخدمة"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Works Tab */}
        {activeTab === 'works' && (
          <div className="tab-content">
            <div className="content-card">
              <div className="card-header">
                <div className="card-title">
                  <FolderOpen size={24} />
                  <span>إدارة المشاريع</span>
                </div>
              </div>
              
              <div className="info-section">
                <h3>المشاريع المعروضة في قسم "أعمالنا"</h3>
                <p>هذا التبويب يعرض جميع المشاريع التي تم إضافتها في تبويب "المشاريع". يمكنك إدارة المشاريع من هناك.</p>
                
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FolderOpen size={24} />
                    </div>
                    <div className="stat-content">
                      <h4>إجمالي المشاريع</h4>
                      <p className="stat-number">{projects.length}</p>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">
                      <Eye size={24} />
                    </div>
                    <div className="stat-content">
                      <h4>المشاريع المرئية</h4>
                      <p className="stat-number">{projects.filter(p => p.isVisible !== false).length}</p>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">
                      <Award size={24} />
                    </div>
                    <div className="stat-content">
                      <h4>المشاريع المميزة</h4>
                      <p className="stat-number">{projects.filter(p => p.featured).length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="action-buttons">
                  <button 
                    className="submit-button primary"
                    onClick={() => setActiveTab('projects')}
                  >
                    <FolderOpen size={20} />
                    إدارة المشاريع
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <div className="tab-content">
            {/* Add Testimonial Section */}
            <div className="content-card">
              <div className="card-header">
                <div className="card-title">
                  <Award size={24} />
                  <span>إضافة رأي عميل جديد</span>
                </div>
                <button
                  className={`toggle-button ${isAddingTestimonial ? 'active' : ''}`}
                  onClick={() => setIsAddingTestimonial(!isAddingTestimonial)}
                >
                  {isAddingTestimonial ? <X size={20} /> : <Plus size={20} />}
                </button>
              </div>
              
              {isAddingTestimonial && (
                <div className="form-container">
                  <div className="form-grid">
                    <input
                      type="text"
                      className="input-field"
                      placeholder="اسم العميل (AR)"
                      value={testimonialName}
                      onChange={(e) => setTestimonialName(e.target.value)}
                    />
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Client Name (EN)"
                      value={testimonialNameEn}
                      onChange={(e) => setTestimonialNameEn(e.target.value)}
                    />
                    <input
                      type="text"
                      className="input-field"
                      placeholder="الشركة (AR)"
                      value={testimonialCompany}
                      onChange={(e) => setTestimonialCompany(e.target.value)}
                    />
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Company (EN)"
                      value={testimonialCompanyEn}
                      onChange={(e) => setTestimonialCompanyEn(e.target.value)}
                    />
                    <input
                      type="text"
                      className="input-field"
                      placeholder="المنصب (AR)"
                      value={testimonialPosition}
                      onChange={(e) => setTestimonialPosition(e.target.value)}
                    />
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Position (EN)"
                      value={testimonialPositionEn}
                      onChange={(e) => setTestimonialPositionEn(e.target.value)}
                    />
                    <input
                      type="text"
                      className="input-field"
                      placeholder="المشروع (AR)"
                      value={testimonialProject}
                      onChange={(e) => setTestimonialProject(e.target.value)}
                    />
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Project (EN)"
                      value={testimonialProjectEn}
                      onChange={(e) => setTestimonialProjectEn(e.target.value)}
                    />
                    <input
                      type="text"
                      className="input-field"
                      placeholder="رابط الصورة"
                      value={testimonialImage}
                      onChange={(e) => setTestimonialImage(e.target.value)}
                    />
                    <select
                      className="input-field"
                      value={testimonialRating}
                      onChange={(e) => setTestimonialRating(parseInt(e.target.value))}
                    >
                      <option value={1}>⭐ (1)</option>
                      <option value={2}>⭐⭐ (2)</option>
                      <option value={3}>⭐⭐⭐ (3)</option>
                      <option value={4}>⭐⭐⭐⭐ (4)</option>
                      <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                    </select>
                    <select
                      className="input-field"
                      value={testimonialGradient}
                      onChange={(e) => setTestimonialGradient(e.target.value)}
                    >
                      <option value="from-emerald-500 to-teal-500">أخضر</option>
                      <option value="from-teal-500 to-cyan-500">تركوازي</option>
                      <option value="from-stone-400 to-emerald-500">رمادي-أخضر</option>
                      <option value="from-emerald-600 to-teal-600">أخضر داكن</option>
                      <option value="from-teal-600 to-emerald-600">تركوازي داكن</option>
                      <option value="from-emerald-700 to-teal-700">أخضر جداً</option>
                    </select>
                  </div>
                  <textarea
                    className="textarea-field"
                    placeholder="تعليق العميل (AR)"
                    value={testimonialComment}
                    onChange={(e) => setTestimonialComment(e.target.value)}
                    rows="4"
                  />
                  <textarea
                    className="textarea-field"
                    placeholder="Client Comment (EN)"
                    value={testimonialCommentEn}
                    onChange={(e) => setTestimonialCommentEn(e.target.value)}
                    rows="4"
                  />
                  <div className="form-actions">
                    <button 
                      className="submit-button primary" 
                      onClick={addTestimonial}
                      disabled={isLoading}
                    >
                      <Save size={20} />
                      {isLoading ? "جاري الإضافة..." : "إضافة رأي عميل"}
                    </button>
                    <button 
                      className="submit-button secondary" 
                      onClick={() => {
                        setIsAddingTestimonial(false);
                        setTestimonialName("");
                        setTestimonialNameEn("");
                        setTestimonialCompany("");
                        setTestimonialCompanyEn("");
                        setTestimonialPosition("");
                        setTestimonialPositionEn("");
                        setTestimonialComment("");
                        setTestimonialCommentEn("");
                        setTestimonialProject("");
                        setTestimonialProjectEn("");
                        setTestimonialImage("");
                        setTestimonialRating(5);
                        setTestimonialGradient("from-emerald-500 to-teal-500");
                      }}
                    >
                      <X size={20} />
                      إلغاء
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Testimonials List */}
            <div className="content-card">
              <div className="card-header">
                <div className="card-title">
                  <Award size={24} />
                  <span>آراء العملاء</span>
                </div>
              </div>
              
              {testimonials.length === 0 ? (
                <div className="empty-state">
                  <Award size={48} />
                  <h3>لا توجد آراء عملاء حالياً</h3>
                  <p>ابدأ بإضافة رأي عميل جديد</p>
                </div>
              ) : (
                <div className="testimonials-grid">
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="testimonial-card">
                      <div className="testimonial-header">
                        <div className="testimonial-avatar">
                          {testimonial.image ? (
                            <img src={testimonial.image} alt={testimonial.name} />
                          ) : (
                            <div className={`avatar-placeholder bg-gradient-to-r ${testimonial.gradient}`}>
                              {testimonial.name ? testimonial.name.charAt(0) : '?'}
                            </div>
                          )}
                        </div>
                        <div className="testimonial-info">
                          <h4>{testimonial.name || testimonial.nameEn || 'عميل'}</h4>
                          {testimonial.position && <p className="position">{testimonial.position}</p>}
                          {testimonial.company && <p className="company">{testimonial.company}</p>}
                        </div>
                        <div className="testimonial-actions">
                          <button 
                            className="action-button delete"
                            onClick={() => deleteTestimonial(testimonial.id)}
                            title="حذف"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="testimonial-rating">
                        {[...Array(testimonial.rating || 5)].map((_, i) => (
                          <Star key={i} size={14} className="text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <div className="testimonial-comment">
                        <p>{testimonial.comment || testimonial.commentEn || 'لا يوجد تعليق'}</p>
                      </div>
                      {testimonial.project && (
                        <div className="testimonial-project">
                          <span className={`project-badge bg-gradient-to-r ${testimonial.gradient}`}>
                            {testimonial.project}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <div className="tab-content">
            {/* Add Member Form */}
            <div className="content-card">
              <div className="card-header">
                <h2>إضافة عضو فريق جديد</h2>
                <button
                  onClick={() => setIsAddingMember(!isAddingMember)}
                  className="add-button"
                >
                  <Plus size={20} />
                  {isAddingMember ? 'إلغاء' : 'إضافة عضو'}
                </button>
              </div>
              
              {isAddingMember && (
                <form onSubmit={addMember} className="form-container">
                  <div className="form-grid">
                    <div className="input-field">
                      <label>اسم العضو (AR) *</label>
                      <input
                        type="text"
                        value={memberName}
                        onChange={(e) => setMemberName(e.target.value)}
                        placeholder="مثال: أحمد محمد"
                        required
                      />
                    </div>
                    
                    <div className="input-field">
                      <label>Member Name (EN)</label>
                      <input
                        type="text"
                        value={memberNameEn}
                        onChange={(e) => setMemberNameEn(e.target.value)}
                        placeholder="Example: Ahmed Mohamed"
                      />
                    </div>
                    
                    <div className="input-field">
                      <label>المنصب (AR) *</label>
                      <input
                        type="text"
                        value={memberPosition}
                        onChange={(e) => setMemberPosition(e.target.value)}
                        placeholder="مثال: مصمم داخلي"
                        required
                      />
                    </div>
                    
                    <div className="input-field">
                      <label>Position (EN)</label>
                      <input
                        type="text"
                        value={memberPositionEn}
                        onChange={(e) => setMemberPositionEn(e.target.value)}
                        placeholder="Example: Interior Designer"
                      />
                    </div>
                    
                    <div className="input-field">
                      <label>رابط الصورة</label>
                      <input
                        type="url"
                        value={memberImage}
                        onChange={(e) => setMemberImage(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    
                    <div className="input-field full-width">
                      <label>نبذة عن العضو (AR)</label>
                      <textarea
                        value={memberBio}
                        onChange={(e) => setMemberBio(e.target.value)}
                        placeholder="نبذة مختصرة عن العضو وخبراته..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="input-field full-width">
                      <label>Member Bio (EN)</label>
                      <textarea
                        value={memberBioEn}
                        onChange={(e) => setMemberBioEn(e.target.value)}
                        placeholder="Brief description about the member and their experience..."
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <button type="submit" className="submit-button">
                    <Save size={18} />
                    إضافة العضو
                  </button>
                </form>
              )}
            </div>

            {/* Team Members List */}
            <div className="content-card">
              <div className="card-header">
                <h2>أعضاء الفريق الحاليين</h2>
                <span className="count-badge">{team.length} عضو</span>
              </div>
              
              {isLoading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>جاري تحميل أعضاء الفريق...</p>
                </div>
              ) : team.length === 0 ? (
                <div className="empty-state">
                  <Award size={48} />
                  <h3>لا يوجد أعضاء في الفريق</h3>
                  <p>ابدأ بإضافة أول عضو في فريقك</p>
                </div>
              ) : (
                <div className="projects-grid">
                  {team.map((member) => (
                    <div key={member.id} className="project-card">
                      <div className="project-image">
                        {member.image ? (
                          <img 
                            src={member.image} 
                            alt={member.name}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className="default-image"
                          style={{ display: member.image ? 'none' : 'flex' }}
                        >
                          <Award size={32} />
                        </div>
                      </div>
                      {editingTeamId === member.id ? (
                        <div className="project-content">
                          <input className="input-field mb-2" type="text" value={editTeamData?.name || ''} onChange={(e)=> setEditTeamData({...editTeamData, name: e.target.value})} placeholder="اسم العضو (AR)" />
                          <input className="input-field mb-2" type="text" value={editTeamData?.name_en || ''} onChange={(e)=> setEditTeamData({...editTeamData, name_en: e.target.value})} placeholder="Member Name (EN)" />
                          <input className="input-field mb-2" type="text" value={editTeamData?.position || ''} onChange={(e)=> setEditTeamData({...editTeamData, position: e.target.value})} placeholder="المنصب (AR)" />
                          <input className="input-field mb-2" type="text" value={editTeamData?.position_en || ''} onChange={(e)=> setEditTeamData({...editTeamData, position_en: e.target.value})} placeholder="Position (EN)" />
                          <input className="input-field mb-2" type="url" value={editTeamData?.image || ''} onChange={(e)=> setEditTeamData({...editTeamData, image: e.target.value})} placeholder="رابط الصورة" />
                          <textarea className="textarea-field mb-2" rows="3" value={editTeamData?.bio || ''} onChange={(e)=> setEditTeamData({...editTeamData, bio: e.target.value})} placeholder="نبذة (AR)" />
                          <textarea className="textarea-field mb-2" rows="3" value={editTeamData?.bio_en || ''} onChange={(e)=> setEditTeamData({...editTeamData, bio_en: e.target.value})} placeholder="Bio (EN)" />
                          <div className="project-actions mt-2">
                            <button className="submit-button primary" onClick={async ()=>{
                              try {
                                setIsLoading(true);
                                const ref = doc(db, 'team', editingTeamId);
                                await updateDoc(ref, {
                                  name: editTeamData.name,
                                  name_en: editTeamData.name_en || editTeamData.name,
                                  position: editTeamData.position,
                                  position_en: editTeamData.position_en || editTeamData.position,
                                  image: editTeamData.image,
                                  bio: editTeamData.bio,
                                  bio_en: editTeamData.bio_en || editTeamData.bio,
                                });
                                setEditingTeamId(null);
                                setEditTeamData(null);
                                fetchTeam();
                              } catch(err) {
                                alert('حدث خطأ أثناء حفظ العضو');
                              } finally { setIsLoading(false); }
                            }}>
                              <Save size={16} /> حفظ
                            </button>
                            <button className="submit-button secondary" onClick={()=>{ setEditingTeamId(null); setEditTeamData(null); }}>
                              <X size={16} /> إلغاء
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                      <div className="project-content">
                        <h3 className="project-title">{member.name}</h3>
                        <p className="project-description">{member.position}</p>
                        {member.bio && (
                          <p className="project-bio">{member.bio}</p>
                        )}
                        <div className="project-meta">
                          <span className="category-badge">عضو فريق</span>
                        </div>
                      </div>
                      <div className="project-actions">
                            <button className="action-button edit" title="تعديل العضو" onClick={()=> { setEditingTeamId(member.id); setEditTeamData({
                              name: member.name || '',
                              name_en: member.name_en || member.name || '',
                              position: member.position || '',
                              position_en: member.position_en || member.position || '',
                              image: member.image || '',
                              bio: member.bio || '',
                              bio_en: member.bio_en || member.bio || ''
                            }); }}>
                              <Edit size={16} />
                            </button>
                        <button
                          onClick={() => deleteMember(member.id)}
                          className="action-button delete"
                          title="حذف العضو"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Clients Tab */}
        {activeTab === 'clients' && (
          <div className="tab-content">
            {/* Add Client Form */}
            <div className="content-card">
              <div className="card-header">
                <h2>إضافة عميل جديد</h2>
                <button
                  onClick={() => setIsAddingClient(!isAddingClient)}
                  className="add-button"
                >
                  <Plus size={20} />
                  {isAddingClient ? 'إلغاء' : 'إضافة عميل'}
                </button>
              </div>
              
              {isAddingClient && (
                <form onSubmit={addClient} className="form-container">
                  <div className="form-grid">
                    <div className="input-field">
                      <label>اسم العميل (AR) *</label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="مثال: شركة النجاح"
                        required
                      />
                    </div>
                    
                    <div className="input-field">
                      <label>Client Name (EN)</label>
                      <input
                        type="text"
                        value={clientNameEn}
                        onChange={(e) => setClientNameEn(e.target.value)}
                        placeholder="Example: Success Company"
                      />
                    </div>
                    
                    <div className="input-field">
                      <label>رابط الشعار *</label>
                      <input
                        type="url"
                        value={clientLogo}
                        onChange={(e) => setClientLogo(e.target.value)}
                        placeholder="https://example.com/logo.png"
                        required
                      />
                    </div>
                    
                    <div className="input-field">
                      <label>الموقع الإلكتروني</label>
                      <input
                        type="url"
                        value={clientWebsite}
                        onChange={(e) => setClientWebsite(e.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>
                    
                    <div className="input-field full-width">
                      <label>وصف العميل (AR)</label>
                      <textarea
                        value={clientDescription}
                        onChange={(e) => setClientDescription(e.target.value)}
                        placeholder="وصف مختصر عن العميل..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="input-field full-width">
                      <label>Client Description (EN)</label>
                      <textarea
                        value={clientDescriptionEn}
                        onChange={(e) => setClientDescriptionEn(e.target.value)}
                        placeholder="Brief description about the client..."
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <button type="submit" className="submit-button">
                    <Save size={18} />
                    إضافة العميل
                  </button>
                </form>
              )}
            </div>

            {/* Clients List */}
            <div className="content-card">
              <div className="card-header">
                <h2>العملاء الحاليين</h2>
                <span className="count-badge">{clients.length} عميل</span>
              </div>
              
              {isLoading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>جاري تحميل العملاء...</p>
                </div>
              ) : clients.length === 0 ? (
                <div className="empty-state">
                  <Users size={48} />
                  <h3>لا يوجد عملاء حالياً</h3>
                  <p>ابدأ بإضافة أول عميل</p>
                </div>
              ) : (
                <div className="projects-grid">
                  {clients.map((client) => (
                    <div key={client.id} className="project-card">
                      <div className="project-image">
                        {client.logo ? (
                          <img 
                            src={client.logo} 
                            alt={client.name}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className="default-image"
                          style={{ display: client.logo ? 'none' : 'flex' }}
                        >
                          <Users size={32} />
                        </div>
                      </div>
                      
                      <div className="project-content">
                        <h3 className="project-title">{client.name}</h3>
                        {client.description && (
                          <p className="project-description">{client.description}</p>
                        )}
                        {client.website && (
                          <a 
                            href={client.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:text-emerald-700 text-sm"
                          >
                            زيارة الموقع
                          </a>
                        )}
                        
                        <div className="project-meta">
                          <span className="category-badge">عميل</span>
                        </div>
                      </div>
                      
                      <div className="project-actions">
                        <button
                          onClick={() => deleteClient(client.id)}
                          className="action-button delete"
                          title="حذف العميل"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="tab-content">
            {/* Contact Info Form */}
            <div className="content-card">
              <div className="card-header">
                <h2>معلومات التواصل</h2>
                <button
                  onClick={() => setIsEditingContact(!isEditingContact)}
                  className="add-button"
                >
                  <Edit size={20} />
                  {isEditingContact ? 'إلغاء التعديل' : 'تعديل المعلومات'}
                </button>
              </div>
              
              {isEditingContact ? (
                <form onSubmit={saveContactInfo} className="form-container">
                  <div className="form-grid">
                    <div className="input-field">
                      <label>رقم الهاتف</label>
                      <input
                        type="tel"
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                        placeholder="+966 50 123 4567"
                      />
                    </div>
                    
                    <div className="input-field">
                      <label>البريد الإلكتروني</label>
                      <input
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                        placeholder="info@tramuz.com"
                      />
                    </div>
                    
                    <div className="input-field full-width">
                      <label>العنوان (AR)</label>
                      <input
                        type="text"
                        value={contactInfo.address}
                        onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
                        placeholder="الرياض، المملكة العربية السعودية"
                      />
                    </div>
                    
                    <div className="input-field full-width">
                      <label>Address (EN)</label>
                      <input
                        type="text"
                        value={contactInfo.address_en}
                        onChange={(e) => setContactInfo({...contactInfo, address_en: e.target.value})}
                        placeholder="Riyadh, Saudi Arabia"
                      />
                    </div>
                    
                    <div className="input-field">
                      <label>رقم الواتساب</label>
                      <div className="flex gap-2">
                      <input
                        type="tel"
                        value={contactInfo.whatsapp}
                        onChange={(e) => setContactInfo({...contactInfo, whatsapp: e.target.value})}
                        placeholder="+966 50 123 4567"
                          className="flex-1"
                        />
                        {contactInfo.whatsapp && (
                          <a
                            href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#1ebe5a] transition-colors flex items-center gap-1 text-sm"
                            title="اختبار الرابط"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                            </svg>
                            اختبار
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        سيظهر زر WhatsApp العائم في الموقع عند إضافة رقم صحيح
                      </p>
                    </div>
                    
                    <div className="input-field">
                      <label>إنستغرام</label>
                      <input
                        type="url"
                        value={contactInfo.instagram}
                        onChange={(e) => setContactInfo({...contactInfo, instagram: e.target.value})}
                        placeholder="https://instagram.com/tramuz"
                      />
                    </div>
                    
                    <div className="input-field">
                      <label>تويتر</label>
                      <input
                        type="url"
                        value={contactInfo.twitter}
                        onChange={(e) => setContactInfo({...contactInfo, twitter: e.target.value})}
                        placeholder="https://twitter.com/tramuz"
                      />
                    </div>
                    
                    <div className="input-field">
                      <label>لينكد إن</label>
                      <input
                        type="url"
                        value={contactInfo.linkedin}
                        onChange={(e) => setContactInfo({...contactInfo, linkedin: e.target.value})}
                        placeholder="https://linkedin.com/company/tramuz"
                      />
                    </div>
                    
                    <div className="input-field">
                      <label>فيسبوك</label>
                      <input
                        type="url"
                        value={contactInfo.facebook}
                        onChange={(e) => setContactInfo({...contactInfo, facebook: e.target.value})}
                        placeholder="https://facebook.com/tramuz"
                      />
                    </div>
                    
                    <div className="input-field">
                      <label>يوتيوب</label>
                      <input
                        type="url"
                        value={contactInfo.youtube}
                        onChange={(e) => setContactInfo({...contactInfo, youtube: e.target.value})}
                        placeholder="https://youtube.com/@tramuz"
                      />
                    </div>
                  </div>
                  
                  <button type="submit" className="submit-button">
                    <Save size={18} />
                    حفظ المعلومات
                  </button>
                </form>
              ) : (
                <div className="contact-display">
                  <div className="contact-grid">
                    <div className="contact-item">
                      <div className="contact-icon">📞</div>
                      <div className="contact-details">
                        <h4>الهاتف</h4>
                        <p>{contactInfo.phone || 'غير محدد'}</p>
                      </div>
                    </div>
                    
                    <div className="contact-item">
                      <div className="contact-icon">✉️</div>
                      <div className="contact-details">
                        <h4>البريد الإلكتروني</h4>
                        <p>{contactInfo.email || 'غير محدد'}</p>
                      </div>
                    </div>
                    
                    <div className="contact-item">
                      <div className="contact-icon">📍</div>
                      <div className="contact-details">
                        <h4>العنوان</h4>
                        <p>{contactInfo.address || 'غير محدد'}</p>
                      </div>
                    </div>
                    
                    <div className="contact-item">
                      <div className="contact-icon">💬</div>
                      <div className="contact-details">
                        <h4>الواتساب</h4>
                        <p>{contactInfo.whatsapp || 'غير محدد'}</p>
                        {contactInfo.whatsapp && (
                          <a
                            href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#25D366] hover:text-[#1ebe5a] transition-colors text-sm mt-1"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                            </svg>
                            اختبار الرابط
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <div className="contact-item">
                      <div className="contact-icon">💬</div>
                      <div className="contact-details">
                        <h4>الواتساب</h4>
                        <p>{contactInfo.whatsapp || 'غير محدد'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="social-media-section">
                    <h3>وسائل التواصل الاجتماعي</h3>
                    <div className="social-grid">
                      <div className="social-item">
                        <div className="social-icon">📷</div>
                        <div className="social-details">
                          <h4>إنستغرام</h4>
                          <p>{contactInfo.instagram || 'غير محدد'}</p>
                        </div>
                      </div>
                      
                      <div className="social-item">
                        <div className="social-icon">🐦</div>
                        <div className="social-details">
                          <h4>تويتر</h4>
                          <p>{contactInfo.twitter || 'غير محدد'}</p>
                        </div>
                      </div>
                      
                      <div className="social-item">
                        <div className="social-icon">💼</div>
                        <div className="social-details">
                          <h4>لينكد إن</h4>
                          <p>{contactInfo.linkedin || 'غير محدد'}</p>
                        </div>
                      </div>
                      
                      <div className="social-item">
                        <div className="social-icon">👥</div>
                        <div className="social-details">
                          <h4>فيسبوك</h4>
                          <p>{contactInfo.facebook || 'غير محدد'}</p>
                        </div>
                      </div>
                      
                      <div className="social-item">
                        <div className="social-icon">📺</div>
                        <div className="social-details">
                          <h4>يوتيوب</h4>
                          <p>{contactInfo.youtube || 'غير محدد'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="tab-content">
            {/* Add Category Section */}
            <div className="content-card">
              <div className="card-header">
                <div className="card-title">
                  <Plus size={24} />
                  <span>إضافة تصنيف جديد</span>
                </div>
              </div>
              
              <div className="form-container">
                <div className="form-grid">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="اسم التصنيف (AR)"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Category Name (EN)"
                    value={newCategoryEn}
                    onChange={(e) => setNewCategoryEn(e.target.value)}
                  />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="الرمز/الإيموجي (اختياري مثل: 🏢)"
                    value={newCategoryEmoji}
                    onChange={(e) => setNewCategoryEmoji(e.target.value)}
                  />
                </div>
                <div className="form-actions">
                  <button 
                    className="submit-button primary" 
                    onClick={addCategory}
                    disabled={isLoading}
                  >
                    <Save size={20} />
                    {isLoading ? "جاري الإضافة..." : "إضافة تصنيف"}
                  </button>
                </div>
              </div>
            </div>

            {/* Categories List */}
            <div className="content-card">
              <div className="card-header">
                <div className="card-title">
                  <Settings size={24} />
                  <span>التصنيفات الحالية</span>
                </div>
              </div>
              
              {categories.length === 0 ? (
                <div className="empty-state">
                  <Settings size={48} />
                  <h3>لا توجد تصنيفات حالياً</h3>
                  <p>ابدأ بإضافة تصنيف جديد</p>
                </div>
              ) : (
                <div className="projects-grid">
                  {categories.map((cat) => (
                    <div key={cat.id} className="project-card">
                      <div className="project-info">
                        <h3 className="project-title">{cat.name}</h3>
                        <p className="project-description">{cat.name_en}</p>
                      </div>
                      <div className="project-actions">
                        <button 
                          className="action-button delete"
                          onClick={() => deleteCategory(cat.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hero Tab */}
        {activeTab === 'hero' && (
          <div className="tab-content">
            <div className="content-card">
              <div className="card-header">
                <div className="card-title">
                  <Star size={24} />
                  <span>إدارة البانر الرئيسي</span>
                </div>
              </div>
              
              {heroLoading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>جاري تحميل بيانات البانر...</p>
                </div>
              ) : (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    saveHeroData();
                  }}
                  className="form-container"
                >
                  {/* النصوص العربية */}
                  <div className="form-section">
                    <h3 className="section-title">النصوص (عربي)</h3>
                    <div className="form-grid">
                      <div className="input-field">
                        <label>العنوان الرئيسي</label>
                        <input 
                          type="text" 
                          value={heroData.ar.title} 
                          onChange={e => setHeroData(h => ({...h, ar: {...h.ar, title: e.target.value}}))} 
                          className="input-field" 
                          placeholder="أدخل العنوان الرئيسي"
                        />
                      </div>
                      <div className="input-field">
                        <label>العنوان الفرعي</label>
                        <input 
                          type="text" 
                          value={heroData.ar.subtitle} 
                          onChange={e => setHeroData(h => ({...h, ar: {...h.ar, subtitle: e.target.value}}))} 
                          className="input-field" 
                          placeholder="أدخل العنوان الفرعي"
                        />
                      </div>
                    </div>
                    <div className="input-field full-width">
                      <label>الوصف</label>
                      <textarea 
                        value={heroData.ar.description} 
                        onChange={e => setHeroData(h => ({...h, ar: {...h.ar, description: e.target.value}}))} 
                        className="textarea-field" 
                        placeholder="أدخل وصف البانر"
                        rows="3"
                      />
                    </div>
                    <div className="input-field full-width">
                      <label>الأزرار</label>
                      {heroData.ar.buttons.map((btn, i) => (
                        <div key={i} className="flex gap-2 mb-2 items-center">
                          <input 
                            type="text" 
                            placeholder="نص الزر" 
                            value={btn.label} 
                            onChange={e => {
                              const newBtns = [...heroData.ar.buttons];
                              newBtns[i].label = e.target.value;
                              setHeroData(h => ({...h, ar: {...h.ar, buttons: newBtns}}));
                            }} 
                            className="input-field flex-1" 
                          />
                          <input 
                            type="text" 
                            placeholder="رابط الزر" 
                            value={btn.link} 
                            onChange={e => {
                              const newBtns = [...heroData.ar.buttons];
                              newBtns[i].link = e.target.value;
                              setHeroData(h => ({...h, ar: {...h.ar, buttons: newBtns}}));
                            }} 
                            className="input-field flex-1" 
                          />
                          <button 
                            type="button" 
                            className="action-button delete" 
                            onClick={() => {
                              setHeroData(h => ({...h, ar: {...h.ar, buttons: h.ar.buttons.filter((_, idx) => idx !== i)}}));
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      <button 
                        type="button" 
                        className="submit-button secondary" 
                        onClick={() => {
                          setHeroData(h => ({...h, ar: {...h.ar, buttons: [...h.ar.buttons, {label: '', link: ''}]}}));
                        }}
                      >
                        <Plus size={16} />
                        إضافة زر جديد
                      </button>
                    </div>
                  </div>
                  {/* النصوص الإنجليزية */}
                  <div className="form-section">
                    <h3 className="section-title">النصوص (English)</h3>
                    <div className="form-grid">
                      <div className="input-field">
                        <label>Title</label>
                        <input 
                          type="text" 
                          value={heroData.en.title} 
                          onChange={e => setHeroData(h => ({...h, en: {...h.en, title: e.target.value}}))} 
                          className="input-field" 
                          placeholder="Enter main title"
                        />
                      </div>
                      <div className="input-field">
                        <label>Subtitle</label>
                        <input 
                          type="text" 
                          value={heroData.en.subtitle} 
                          onChange={e => setHeroData(h => ({...h, en: {...h.en, subtitle: e.target.value}}))} 
                          className="input-field" 
                          placeholder="Enter subtitle"
                        />
                      </div>
                    </div>
                    <div className="input-field full-width">
                      <label>Description</label>
                      <textarea 
                        value={heroData.en.description} 
                        onChange={e => setHeroData(h => ({...h, en: {...h.en, description: e.target.value}}))} 
                        className="textarea-field" 
                        placeholder="Enter banner description"
                        rows="3"
                      />
                    </div>
                    <div className="input-field full-width">
                      <label>Buttons</label>
                      {heroData.en.buttons.map((btn, i) => (
                        <div key={i} className="flex gap-2 mb-2 items-center">
                          <input 
                            type="text" 
                            placeholder="Button text" 
                            value={btn.label} 
                            onChange={e => {
                              const newBtns = [...heroData.en.buttons];
                              newBtns[i].label = e.target.value;
                              setHeroData(h => ({...h, en: {...h.en, buttons: newBtns}}));
                            }} 
                            className="input-field flex-1" 
                          />
                          <input 
                            type="text" 
                            placeholder="Button link" 
                            value={btn.link} 
                            onChange={e => {
                              const newBtns = [...heroData.en.buttons];
                              newBtns[i].link = e.target.value;
                              setHeroData(h => ({...h, en: {...h.en, buttons: newBtns}}));
                            }} 
                            className="input-field flex-1" 
                          />
                          <button 
                            type="button" 
                            className="action-button delete" 
                            onClick={() => {
                              setHeroData(h => ({...h, en: {...h.en, buttons: h.en.buttons.filter((_, idx) => idx !== i)}}));
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      <button 
                        type="button" 
                        className="submit-button secondary" 
                        onClick={() => {
                          setHeroData(h => ({...h, en: {...h.en, buttons: [...h.en.buttons, {label: '', link: ''}]}}));
                        }}
                      >
                        <Plus size={16} />
                        Add Button
                      </button>
                    </div>
                  </div>
                  {/* الصور */}
                  <div className="form-section">
                    <h3 className="section-title">صور البانر</h3>
                    
                    {/* عرض الصور المضافة */}
                    {heroData.images && heroData.images.length > 0 && (
                      <div className="images-preview mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">الصور المضافة ({heroData.images.length})</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {heroData.images.map((img, i) => (
                            <div key={i} className="relative group">
                              <img 
                                src={img} 
                                alt={`Banner ${i + 1}`} 
                                className="w-full h-24 object-cover rounded-lg shadow border border-gray-200" 
                                onError={e => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div 
                                className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm"
                                style={{ display: 'none' }}
                              >
                                خطأ في الصورة
                              </div>
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  type="button" 
                                  className="action-button delete" 
                                  onClick={() => {
                                    setHeroData(h => ({...h, images: h.images.filter((_, idx) => idx !== i)}));
                                  }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* إضافة صورة جديدة */}
                    <div className="add-image-section">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">إضافة صورة جديدة</h4>
                      <div className="form-grid">
                        <div className="input-field">
                          <label>رابط الصورة (URL)</label>
                          <input 
                            type="url" 
                            className="input-field" 
                            placeholder="https://example.com/image.jpg" 
                            value={heroData.newImageUrl || ''} 
                            onChange={e => setHeroData(h => ({...h, newImageUrl: e.target.value}))} 
                          />
                        </div>
                        <div className="input-field">
                          <label>أو ارفع من جهازك</label>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="input-field" 
                            onChange={async e => {
                              const file = e.target.files[0];
                              if (file) {
                                try {
                                  const url = await uploadHeroImage(file);
                                  setHeroData(h => ({...h, images: [...h.images, url]}));
                                } catch (error) {
                                  alert('خطأ في رفع الصورة');
                                }
                              }
                            }} 
                          />
                        </div>
                      </div>
                      <button 
                        type="button" 
                        className="submit-button secondary" 
                        onClick={() => {
                          if (heroData.newImageUrl && heroData.newImageUrl.startsWith('http')) {
                            setHeroData(h => ({...h, images: [...h.images, h.newImageUrl], newImageUrl: ''}));
                          } else {
                            alert('يرجى إدخال رابط صحيح للصورة');
                          }
                        }}
                      >
                        <Plus size={16} />
                        إضافة الصورة
                      </button>
                    </div>
                  </div>
                  {/* التايمر */}
                  <div className="form-section">
                    <div className="input-field">
                      <label>مدة التبديل بين الصور (بالثواني)</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="30"
                        value={heroData.timer} 
                        onChange={e => setHeroData(h => ({...h, timer: Number(e.target.value)}))} 
                        className="input-field w-32" 
                        placeholder="5"
                      />
                    </div>
                  </div>
                  
                  {/* أزرار الحفظ */}
                  <div className="form-actions">
                    <button 
                      type="submit" 
                      className="submit-button primary" 
                      disabled={heroSaving}
                    >
                      <Save size={20} />
                      {heroSaving ? 'جاري الحفظ...' : 'حفظ البانر'}
                    </button>
                    <button 
                      type="button" 
                      className="submit-button secondary" 
                      onClick={() => fetchHeroData()}
                    >
                      <X size={20} />
                      إلغاء
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="tab-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <FolderOpen size={24} />
                </div>
                <div className="stat-content">
                  <h3 className="stat-number">{projects.length}</h3>
                  <p className="stat-label">إجمالي المشاريع</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <Star size={24} />
                </div>
                <div className="stat-content">
                  <h3 className="stat-number">{services.length}</h3>
                  <p className="stat-label">إجمالي الخدمات</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <Award size={24} />
                </div>
                <div className="stat-content">
                  <h3 className="stat-number">{team.length}</h3>
                  <p className="stat-label">أعضاء الفريق</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <Settings size={24} />
                </div>
                <div className="stat-content">
                  <h3 className="stat-number">{projects.filter(p => p.year === new Date().getFullYear().toString()).length}</h3>
                  <p className="stat-label">مشاريع هذا العام</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <Sparkles size={24} />
                </div>
                <div className="stat-content">
                  <h3 className="stat-number">{projects.filter(p => p.category === 'branding').length}</h3>
                  <p className="stat-label">مشاريع الهوية البصرية</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="tab-content">
            <div className="content-card">
              <div className="card-header">
                <div className="card-title">
                  <Sparkles size={24} />
                  <span>قسم من نحن</span>
      </div>
              </div>
              {aboutLoading ? (
                <div className="loading-state"><div className="spinner"></div><p>جاري التحميل...</p></div>
              ) : (
                <form
                  onSubmit={(e)=>{e.preventDefault(); saveAboutData();}}
                  className="form-container"
                >
                  <div className="form-section">
                    <h3 className="section-title">عربي</h3>
                    <div className="form-grid">
                      <input className="input-field" type="text" placeholder="العنوان" value={aboutData.ar.title}
                        onChange={(e)=>setAboutData(d=>({...d, ar:{...d.ar, title:e.target.value}}))} />
                    </div>
                    <div className="input-field full-width">
                      <label>المحتوى</label>
                      <textarea className="textarea-field" rows="4" placeholder="النص" value={aboutData.ar.content}
                        onChange={(e)=>setAboutData(d=>({...d, ar:{...d.ar, content:e.target.value}}))} />
                    </div>
                    {/* Story */}
                    <div className="form-grid">
                      <input className="input-field w-24" type="text" placeholder="أيقونة" value={aboutData.ar.story.icon}
                        onChange={(e)=>setAboutData(d=>({...d, ar:{...d.ar, story:{...d.ar.story, icon:e.target.value}}}))} />
                      <input className="input-field" type="text" placeholder="قصتنا" value={aboutData.ar.story.title}
                        onChange={(e)=>setAboutData(d=>({...d, ar:{...d.ar, story:{...d.ar.story, title:e.target.value}}}))} />
                    </div>
                    <div className="input-field full-width">
                      <textarea className="textarea-field" rows="3" placeholder="وصف القصة" value={aboutData.ar.story.description}
                        onChange={(e)=>setAboutData(d=>({...d, ar:{...d.ar, story:{...d.ar.story, description:e.target.value}}}))} />
                    </div>
                    {/* Vision & Mission */}
                    <div className="form-grid">
                      <input className="input-field w-24" type="text" placeholder="🎯" value={aboutData.ar.visionMission.icon}
                        onChange={(e)=>setAboutData(d=>({...d, ar:{...d.ar, visionMission:{...d.ar.visionMission, icon:e.target.value}}}))} />
                      <input className="input-field" type="text" placeholder="رؤيتنا ورسالتنا" value={aboutData.ar.visionMission.title}
                        onChange={(e)=>setAboutData(d=>({...d, ar:{...d.ar, visionMission:{...d.ar.visionMission, title:e.target.value}}}))} />
                    </div>
                    <div className="form-grid">
                      <input className="input-field" type="text" placeholder="الرؤية" value={aboutData.ar.visionMission.vision.title}
                        onChange={(e)=>setAboutData(d=>({...d, ar:{...d.ar, visionMission:{...d.ar.visionMission, vision:{...d.ar.visionMission.vision, title:e.target.value}}}}))} />
                      <textarea className="input-field" rows="2" placeholder="نص الرؤية" value={aboutData.ar.visionMission.vision.description}
                        onChange={(e)=>setAboutData(d=>({...d, ar:{...d.ar, visionMission:{...d.ar.visionMission, vision:{...d.ar.visionMission.vision, description:e.target.value}}}}))} />
                    </div>
                    <div className="form-grid">
                      <input className="input-field" type="text" placeholder="الرسالة" value={aboutData.ar.visionMission.mission.title}
                        onChange={(e)=>setAboutData(d=>({...d, ar:{...d.ar, visionMission:{...d.ar.visionMission, mission:{...d.ar.visionMission.mission, title:e.target.value}}}}))} />
                      <textarea className="input-field" rows="2" placeholder="نص الرسالة" value={aboutData.ar.visionMission.mission.description}
                        onChange={(e)=>setAboutData(d=>({...d, ar:{...d.ar, visionMission:{...d.ar.visionMission, mission:{...d.ar.visionMission.mission, description:e.target.value}}}}))} />
                    </div>
                    {/* Values */}
                    <div className="input-field full-width">
                      <label>قيمنا الأساسية</label>
                      {aboutData.ar.values.map((val, i)=> (
                        <div key={i} className="flex items-center gap-2 mb-2">
                          <input className="input-field w-20" type="text" value={val.icon} onChange={(e)=>{
                            const values=[...aboutData.ar.values]; values[i]={...values[i], icon:e.target.value};
                            setAboutData(d=>({...d, ar:{...d.ar, values}}));
                          }} />
                          <input className="input-field" type="text" value={val.title} placeholder="العنوان" onChange={(e)=>{
                            const values=[...aboutData.ar.values]; values[i]={...values[i], title:e.target.value};
                            setAboutData(d=>({...d, ar:{...d.ar, values}}));
                          }} />
                          <input className="input-field" type="text" value={val.description} placeholder="الوصف" onChange={(e)=>{
                            const values=[...aboutData.ar.values]; values[i]={...values[i], description:e.target.value};
                            setAboutData(d=>({...d, ar:{...d.ar, values}}));
                          }} />
                          <button type="button" className="action-button delete" onClick={()=>{
                            setAboutData(d=>({...d, ar:{...d.ar, values:d.ar.values.filter((_,idx)=> idx!==i)}}));
                          }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      <button type="button" className="submit-button secondary" onClick={()=>{
                        setAboutData(d=>({...d, ar:{...d.ar, values:[...d.ar.values, { icon:'✨', title:'', description:''}]}}));
                      }}>
                        <Plus size={16} /> إضافة قيمة
                      </button>
                    </div>
                    {/* Stats */}
                    <div className="form-grid">
                      <div className="input-field">
                        <label>عدد السنوات</label>
                        <input className="input-field" type="text" value={aboutData.ar.stats.years} onChange={(e)=>setAboutData(d=>({...d, ar:{...d.ar, stats:{...d.ar.stats, years:e.target.value}}}))} />
                      </div>
                      <div className="input-field">
                        <label>عدد المشاريع</label>
                        <input className="input-field" type="text" value={aboutData.ar.stats.projects} onChange={(e)=>setAboutData(d=>({...d, ar:{...d.ar, stats:{...d.ar.stats, projects:e.target.value}}}))} />
                      </div>
                    </div>
                  </div>
                  <div className="form-section">
                    <h3 className="section-title">English</h3>
                    <div className="form-grid">
                      <input className="input-field" type="text" placeholder="Title" value={aboutData.en.title}
                        onChange={(e)=>setAboutData(d=>({...d, en:{...d.en, title:e.target.value}}))} />
                    </div>
                    <div className="input-field full-width">
                      <label>Content</label>
                      <textarea className="textarea-field" rows="4" placeholder="Content" value={aboutData.en.content}
                        onChange={(e)=>setAboutData(d=>({...d, en:{...d.en, content:e.target.value}}))} />
                    </div>
                    {/* Story */}
                    <div className="form-grid">
                      <input className="input-field w-24" type="text" placeholder="Icon" value={aboutData.en.story.icon}
                        onChange={(e)=>setAboutData(d=>({...d, en:{...d.en, story:{...d.en.story, icon:e.target.value}}}))} />
                      <input className="input-field" type="text" placeholder="Our Story" value={aboutData.en.story.title}
                        onChange={(e)=>setAboutData(d=>({...d, en:{...d.en, story:{...d.en.story, title:e.target.value}}}))} />
                    </div>
                    <div className="input-field full-width">
                      <textarea className="textarea-field" rows="3" placeholder="Story description" value={aboutData.en.story.description}
                        onChange={(e)=>setAboutData(d=>({...d, en:{...d.en, story:{...d.en.story, description:e.target.value}}}))} />
                    </div>
                    {/* Vision & Mission */}
                    <div className="form-grid">
                      <input className="input-field w-24" type="text" placeholder="🎯" value={aboutData.en.visionMission.icon}
                        onChange={(e)=>setAboutData(d=>({...d, en:{...d.en, visionMission:{...d.en.visionMission, icon:e.target.value}}}))} />
                      <input className="input-field" type="text" placeholder="Vision & Mission" value={aboutData.en.visionMission.title}
                        onChange={(e)=>setAboutData(d=>({...d, en:{...d.en, visionMission:{...d.en.visionMission, title:e.target.value}}}))} />
                    </div>
                    <div className="form-grid">
                      <input className="input-field" type="text" placeholder="Vision" value={aboutData.en.visionMission.vision.title}
                        onChange={(e)=>setAboutData(d=>({...d, en:{...d.en, visionMission:{...d.en.visionMission, vision:{...d.en.visionMission.vision, title:e.target.value}}}}))} />
                      <textarea className="input-field" rows="2" placeholder="Vision text" value={aboutData.en.visionMission.vision.description}
                        onChange={(e)=>setAboutData(d=>({...d, en:{...d.en, visionMission:{...d.en.visionMission, vision:{...d.en.visionMission.vision, description:e.target.value}}}}))} />
                    </div>
                    <div className="form-grid">
                      <input className="input-field" type="text" placeholder="Mission" value={aboutData.en.visionMission.mission.title}
                        onChange={(e)=>setAboutData(d=>({...d, en:{...d.en, visionMission:{...d.en.visionMission, mission:{...d.en.visionMission.mission, title:e.target.value}}}}))} />
                      <textarea className="input-field" rows="2" placeholder="Mission text" value={aboutData.en.visionMission.mission.description}
                        onChange={(e)=>setAboutData(d=>({...d, en:{...d.en, visionMission:{...d.en.visionMission, mission:{...d.en.visionMission.mission, description:e.target.value}}}}))} />
                    </div>
                    {/* Values */}
                    <div className="input-field full-width">
                      <label>Core Values</label>
                      {aboutData.en.values.map((val, i)=> (
                        <div key={i} className="flex items-center gap-2 mb-2">
                          <input className="input-field w-20" type="text" value={val.icon} onChange={(e)=>{
                            const values=[...aboutData.en.values]; values[i]={...values[i], icon:e.target.value};
                            setAboutData(d=>({...d, en:{...d.en, values}}));
                          }} />
                          <input className="input-field" type="text" value={val.title} placeholder="Title" onChange={(e)=>{
                            const values=[...aboutData.en.values]; values[i]={...values[i], title:e.target.value};
                            setAboutData(d=>({...d, en:{...d.en, values}}));
                          }} />
                          <input className="input-field" type="text" value={val.description} placeholder="Description" onChange={(e)=>{
                            const values=[...aboutData.en.values]; values[i]={...values[i], description:e.target.value};
                            setAboutData(d=>({...d, en:{...d.en, values}}));
                          }} />
                          <button type="button" className="action-button delete" onClick={()=>{
                            setAboutData(d=>({...d, en:{...d.en, values:d.en.values.filter((_,idx)=> idx!==i)}}));
                          }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      <button type="button" className="submit-button secondary" onClick={()=>{
                        setAboutData(d=>({...d, en:{...d.en, values:[...d.en.values, { icon:'✨', title:'', description:''}]}}));
                      }}>
                        <Plus size={16} /> Add Value
                      </button>
                    </div>
                    {/* Stats */}
                    <div className="form-grid">
                      <div className="input-field">
                        <label>Years</label>
                        <input className="input-field" type="text" value={aboutData.en.stats.years} onChange={(e)=>setAboutData(d=>({...d, en:{...d.en, stats:{...d.en.stats, years:e.target.value}}}))} />
                      </div>
                      <div className="input-field">
                        <label>Projects</label>
                        <input className="input-field" type="text" value={aboutData.en.stats.projects} onChange={(e)=>setAboutData(d=>({...d, en:{...d.en, stats:{...d.en.stats, projects:e.target.value}}}))} />
                      </div>
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="submit-button primary" disabled={aboutSaving}>
                      <Save size={18} />
                      {aboutSaving ? 'جاري الحفظ...' : 'حفظ من نحن'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Why Choose Us Tab */}
        {activeTab === 'why' && (
          <div className="tab-content">
            <div className="content-card">
              <div className="card-header">
                <div className="card-title">
                  <Star size={24} />
                  <span>قسم لماذا تختارنا؟</span>
                </div>
              </div>
              {whyLoading ? (
                <div className="loading-state"><div className="spinner"></div><p>جاري التحميل...</p></div>
              ) : (
                <form
                  onSubmit={(e)=>{e.preventDefault(); saveWhyData();}}
                  className="form-container"
                >
                  <div className="form-section">
                    <h3 className="section-title">عربي</h3>
                    <div className="form-grid">
                      <input className="input-field" type="text" placeholder="العنوان" value={whyData.ar.title}
                        onChange={(e)=>setWhyData(d=>({...d, ar:{...d.ar, title:e.target.value}}))} />
                    </div>
                    <div className="input-field full-width">
                      <label>العناصر</label>
                      {whyData.ar.items.map((it, i)=> (
                        <div key={i} className="flex items-center gap-2 mb-2">
                          <input className="input-field w-20" type="text" placeholder="Icon" value={it.icon}
                            onChange={(e)=>{
                              const items=[...whyData.ar.items]; items[i]={...items[i], icon:e.target.value};
                              setWhyData(d=>({...d, ar:{...d.ar, items}}));
                            }} />
                          <input className="input-field" type="text" placeholder="العنوان" value={it.title}
                            onChange={(e)=>{
                              const items=[...whyData.ar.items]; items[i]={...items[i], title:e.target.value};
                              setWhyData(d=>({...d, ar:{...d.ar, items}}));
                            }} />
                          <input className="input-field" type="text" placeholder="الوصف" value={it.description}
                            onChange={(e)=>{
                              const items=[...whyData.ar.items]; items[i]={...items[i], description:e.target.value};
                              setWhyData(d=>({...d, ar:{...d.ar, items}}));
                            }} />
                          <button type="button" className="action-button delete" onClick={()=>{
                            setWhyData(d=>({...d, ar:{...d.ar, items:d.ar.items.filter((_,idx)=> idx!==i)}}));
                          }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      <button type="button" className="submit-button secondary" onClick={()=>{
                        setWhyData(d=>({...d, ar:{...d.ar, items:[...d.ar.items, { icon:'✅', title:'', description:''}]}}));
                      }}>
                        <Plus size={16} /> إضافة عنصر
                      </button>
                    </div>
                  </div>
                  <div className="form-section">
                    <h3 className="section-title">English</h3>
                    <div className="form-grid">
                      <input className="input-field" type="text" placeholder="Title" value={whyData.en.title}
                        onChange={(e)=>setWhyData(d=>({...d, en:{...d.en, title:e.target.value}}))} />
                    </div>
                    <div className="input-field full-width">
                      <label>Items</label>
                      {whyData.en.items.map((it, i)=> (
                        <div key={i} className="flex items-center gap-2 mb-2">
                          <input className="input-field w-20" type="text" placeholder="Icon" value={it.icon}
                            onChange={(e)=>{
                              const items=[...whyData.en.items]; items[i]={...items[i], icon:e.target.value};
                              setWhyData(d=>({...d, en:{...d.en, items}}));
                            }} />
                          <input className="input-field" type="text" placeholder="Title" value={it.title}
                            onChange={(e)=>{
                              const items=[...whyData.en.items]; items[i]={...items[i], title:e.target.value};
                              setWhyData(d=>({...d, en:{...d.en, items}}));
                            }} />
                          <input className="input-field" type="text" placeholder="Description" value={it.description}
                            onChange={(e)=>{
                              const items=[...whyData.en.items]; items[i]={...items[i], description:e.target.value};
                              setWhyData(d=>({...d, en:{...d.en, items}}));
                            }} />
                          <button type="button" className="action-button delete" onClick={()=>{
                            setWhyData(d=>({...d, en:{...d.en, items:d.en.items.filter((_,idx)=> idx!==i)}}));
                          }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      <button type="button" className="submit-button secondary" onClick={()=>{
                        setWhyData(d=>({...d, en:{...d.en, items:[...d.en.items, { icon:'✅', title:'', description:''}]}}));
                      }}>
                        <Plus size={16} /> Add Item
                      </button>
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="submit-button primary" disabled={whySaving}>
                      <Save size={18} />
                      {whySaving ? 'جاري الحفظ...' : 'حفظ لماذا تختارنا'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Visibility Tab */}
        {activeTab === 'visibility' && (
          <div className="tab-content">
            <div className="content-card">
              <div className="card-header">
                <div className="card-title">
                  <Eye size={24} />
                  <span>إعدادات ظهور الأقسام</span>
                </div>
              </div>
              <div className="form-container">
                {/* Quick Stats */}
                <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">إحصائيات الأقسام</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">
                        {Object.values(visibility).filter(Boolean).length}
                      </div>
                      <div className="text-sm text-gray-600">أقسام مرئية</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-400">
                        {Object.values(visibility).filter(v => !v).length}
                      </div>
                      <div className="text-sm text-gray-600">أقسام مخفية</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {Object.keys(visibility).length}
                      </div>
                      <div className="text-sm text-gray-600">إجمالي الأقسام</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'hero', label: 'البانر الرئيسي', icon: '🏠' },
                    { key: 'about', label: 'من نحن', icon: '👥' },
                    { key: 'services', label: 'الخدمات', icon: '⭐' },
                    { key: 'works', label: 'أعمالنا', icon: '🎨' },
                    { key: 'testimonials', label: 'آراء العملاء', icon: '💬' },
                    { key: 'team', label: 'فريق العمل', icon: '👨‍💼' },
                    { key: 'clients', label: 'عملاؤنا', icon: '🤝' },
                    { key: 'stats', label: 'الإحصائيات', icon: '📊' },
                    { key: 'contact', label: 'تواصل معنا', icon: '📞' },
                    { key: 'categories', label: 'التصنيفات', icon: '🏷️' },
                    { key: 'why', label: 'لماذا نحن', icon: '❓' }
                  ].map(item => (
                    <label key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <span className="font-medium text-gray-800">{item.label}</span>
                      </div>
                      <div className="relative">
                      <input
                        type="checkbox"
                        checked={!!visibility[item.key]}
                        onChange={(e) => setVisibility(v => ({ ...v, [item.key]: e.target.checked }))}
                          className="w-5 h-5 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                      />
                      </div>
                    </label>
                  ))}
                </div>
                
                {/* Quick Actions */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">تحكم سريع</h4>
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => {
                        const allVisible = Object.keys(visibility).reduce((acc, key) => {
                          acc[key] = true;
                          return acc;
                        }, {});
                        setVisibility(allVisible);
                      }}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                    >
                      ✅ إظهار جميع الأقسام
                    </button>
                    <button 
                      onClick={() => {
                        const allHidden = Object.keys(visibility).reduce((acc, key) => {
                          acc[key] = false;
                          return acc;
                        }, {});
                        setVisibility(allHidden);
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                      ❌ إخفاء جميع الأقسام
                    </button>
                    <button 
                      onClick={() => {
                        const defaultVisibility = {
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
                        };
                        setVisibility(defaultVisibility);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      🔄 إعادة تعيين للافتراضي
                    </button>
                  </div>
                </div>

                <div className="form-actions mt-6">
                  <button className="submit-button primary" onClick={saveVisibility} disabled={savingVisibility}>
                    <Save size={18} />
                    {savingVisibility ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Modal for project details */}
      {projectDetailsId && (() => {
  const p = projects.find(pr => pr.id === projectDetailsId);
  if (!p) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setProjectDetailsId(null)}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              {p.title ? p.title.charAt(0) : '?'}
            </div>
            <div>
              <h2 className="text-lg md:text-2xl font-bold text-gray-800">{p.title}</h2>
              <div className="text-sm md:text-base text-gray-600">{p.title_en}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-block px-2 py-1 bg-emerald-500 text-xs text-white rounded-full">{getCategoryDisplayName(p.category)}</span>
                <span className="text-xs text-gray-500">({p.year})</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setProjectDetailsId(null)} 
            className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X size={16} className="md:w-5 md:h-5" />
        </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Description */}
          {(p.description || p.description_en) && (
            <div className="mb-6">
              <h3 className="text-base md:text-lg font-semibold mb-2 text-gray-800">الوصف</h3>
              {p.description && (
                <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-2">{p.description}</p>
              )}
              {p.description_en && (
                <p className="text-sm md:text-base text-gray-500 leading-relaxed italic">{p.description_en}</p>
              )}
            </div>
          )}

          {/* Images Slider */}
          {p.images && p.images.length > 0 && (
            <div className="mb-6">
              <h3 className="text-base md:text-lg font-semibold mb-4 text-gray-800">صور المشروع ({p.images.length})</h3>
              <div className="relative">
                <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                  {p.images.filter(img => img && img.url).map((img, i) => (
                    <div key={i} className="flex-shrink-0 w-64 md:w-80">
                      <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                        <img 
                          src={img.url} 
                          alt={`${p.title} - صورة ${i + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 hidden">
                          <div className="text-center">
                            <div className="text-3xl mb-2">🖼️</div>
                            <p className="text-sm">فشل في تحميل الصورة</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-center">
                        <span className="text-xs text-gray-500">
                          {img.isPrimary ? '⭐ رئيسية' : `صورة ${i + 1}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Project Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold mb-3 text-gray-800">معلومات المشروع</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">التصنيف:</span>
                  <span className="font-medium">{getCategoryDisplayName(p.category)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">السنة:</span>
                  <span className="font-medium">{p.year || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">مميز:</span>
                  <span className="font-medium">{p.featured ? 'نعم' : 'لا'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">مرئي:</span>
                  <span className="font-medium">{p.isVisible !== false ? 'نعم' : 'لا'}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold mb-3 text-gray-800">إحصائيات</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">عدد الصور:</span>
                  <span className="font-medium">{p.images ? p.images.length : 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">تاريخ الإنشاء:</span>
                  <span className="font-medium">
                    {p.createdAt ? new Date(p.createdAt.seconds * 1000).toLocaleDateString('ar-SA') : 'غير محدد'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">آخر تحديث:</span>
                  <span className="font-medium">
                    {p.updatedAt ? new Date(p.updatedAt.seconds * 1000).toLocaleDateString('ar-SA') : 'غير محدد'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 md:p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-xs md:text-sm text-gray-500">
            تفاصيل المشروع - اضغط خارج النافذة للإغلاق
          </div>
          <button 
            onClick={() => setProjectDetailsId(null)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm md:text-base"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
})()}
      
      {/* Preview Modal */}
      {previewModalOpen && previewProject && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {previewProject.title ? previewProject.title.charAt(0) : '?'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{previewProject.title || 'بدون عنوان'}</h2>
                  {previewProject.title_en && (
                    <p className="text-gray-600">{previewProject.title_en}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                      {getCategoryDisplayName(previewProject.category)}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {previewProject.year || 'بدون سنة'}
                    </span>
                    {previewProject.featured && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                        ⭐ مميز
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={closeProjectPreview}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Description */}
              {previewProject.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">الوصف</h3>
                  <p className="text-gray-600 leading-relaxed">{previewProject.description}</p>
                  {previewProject.description_en && (
                    <p className="text-gray-600 leading-relaxed mt-2 italic">{previewProject.description_en}</p>
                  )}
                </div>
              )}

              {/* Images Slider */}
              {previewProject.images && previewProject.images.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">صور المشروع ({previewProject.images.length})</h3>
                  <div className="relative">
                    <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                      {previewProject.images.map((image, index) => (
                        <div key={index} className="flex-shrink-0 w-64 md:w-80">
                          <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                            <img 
                              src={image.url} 
                              alt={`${previewProject.title} - صورة ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 hidden">
                              <div className="text-center">
                                <div className="text-3xl mb-2">🖼️</div>
                                <p className="text-sm">فشل في تحميل الصورة</p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 text-center">
                            <span className="text-xs text-gray-500">
                              {image.isPrimary ? '⭐ رئيسية' : `صورة ${index + 1}`}
                            </span>
                            {image.alt && (
                              <p className="text-xs text-gray-400 mt-1">{image.alt}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold mb-3 text-gray-800">معلومات أساسية</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">التصنيف:</span>
                      <span className="font-medium">{getCategoryDisplayName(previewProject.category)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">السنة:</span>
                      <span className="font-medium">{previewProject.year || 'غير محدد'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">مميز:</span>
                      <span className="font-medium">{previewProject.featured ? 'نعم' : 'لا'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">مرئي:</span>
                      <span className="font-medium">{previewProject.isVisible !== false ? 'نعم' : 'لا'}</span>
                    </div>
                  </div>
                </div>

                {/* Technical Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold mb-3 text-gray-800">معلومات تقنية</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">عدد الصور:</span>
                      <span className="font-medium">{previewProject.images ? previewProject.images.length : 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">تاريخ الإنشاء:</span>
                      <span className="font-medium">
                        {previewProject.createdAt ? new Date(previewProject.createdAt.seconds * 1000).toLocaleDateString('ar-SA') : 'غير محدد'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">آخر تحديث:</span>
                      <span className="font-medium">
                        {previewProject.updatedAt ? new Date(previewProject.updatedAt.seconds * 1000).toLocaleDateString('ar-SA') : 'غير محدد'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-500">
                معاينة المشروع - يمكنك تعديل المشروع من قائمة المشاريع
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    closeProjectPreview();
                    setActiveTab('projects');
                    openEditProject(previewProject);
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Edit size={16} className="inline ml-1" />
                  تعديل
                </button>
                <button 
                  onClick={closeProjectPreview}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {imagePreviewOpen && previewImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={closeImagePreview}>
          <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button 
              onClick={closeImagePreview}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Image Container */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              {/* Image */}
              <div className="relative">
                <img 
                  src={previewImage.url} 
                  alt="معاينة الصورة"
                  className="w-full h-auto max-h-[70vh] object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500 hidden">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🖼️</div>
                    <p className="text-lg">فشل في تحميل الصورة</p>
                    <p className="text-sm text-gray-400 mt-2">تأكد من صحة رابط الصورة</p>
                  </div>
                </div>
              </div>

              {/* Image Info */}
              <div className="p-6 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">معلومات الصورة</h3>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">الرابط:</span>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded truncate max-w-xs">
                          {previewImage.url}
                        </span>
                      </div>
                      {previewImage.isPrimary && (
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                            ⭐ صورة رئيسية
                          </span>
                        </div>
                      )}
                      {previewImage.alt && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">الوصف:</span>
                          <span>{previewImage.alt}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(previewImage.url);
                        alert('تم نسخ رابط الصورة');
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                      نسخ الرابط
                    </button>
                    <button 
                      onClick={closeImagePreview}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                    >
                      إغلاق
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Hint */}
            <div className="text-center mt-4 text-white/70 text-sm">
              اضغط خارج النافذة أو على زر الإغلاق لإغلاق المعاينة
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
