import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, addDoc, getDocs, doc, deleteDoc, setDoc, getDoc } from "firebase/firestore";
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
  const [isLoading, setIsLoading] = useState(false);
  
  // Services management
  const [services, setServices] = useState([]);
  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceTitleEn, setServiceTitleEn] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceDescriptionEn, setServiceDescriptionEn] = useState("");
  const [serviceIcon, setServiceIcon] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  
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
        createdAt: new Date().toISOString()
      });
      alert("تمت إضافة التصنيف بنجاح!");
      setNewCategory("");
      setNewCategoryEn("");
      fetchCategories();
    } catch (error) {
      console.error("خطأ في إضافة التصنيف: ", error);
      alert("حدث خطأ في إضافة التصنيف");
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

  // تحميل المشاريع من Firebase
  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const querySnapshot = await getDocs(collection(db, "projects"));
      const projectsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsList);
    } catch (error) {
      console.error("خطأ في تحميل المشاريع: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  // تحميل الخدمات من Firebase
  const fetchServices = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "services"));
      const servicesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setServices(servicesList);
    } catch (error) {
      console.error("خطأ في تحميل الخدمات: ", error);
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
          fetchProjects();
          fetchServices();
          fetchTeam();
          fetchClients();
          fetchContactInfo();
          fetchCategories();
          fetchHeroData(); // Fetch hero data on login
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
      fetchProjects();
      fetchServices();
      fetchTeam();
      fetchClients();
      fetchContactInfo();
      fetchHeroData(); // Fetch hero data on login
    }
  }, [isLoggedIn]);

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
      await addDoc(collection(db, "services"), {
        title: serviceTitle,
        title_en: serviceTitleEn || serviceTitle,
        description: serviceDescription,
        description_en: serviceDescriptionEn || serviceDescription,
        icon: serviceIcon,
        price: servicePrice || 0,
        createdAt: new Date().toISOString()
      });
      alert("تمت إضافة الخدمة بنجاح!");
      
      // إعادة تعيين النموذج
      setServiceTitle("");
      setServiceTitleEn("");
      setServiceDescription("");
      setServiceDescriptionEn("");
      setServiceIcon("");
      setServicePrice("");
      setIsAddingService(false);
      
      // إعادة تحميل الخدمات
      await fetchServices();
    } catch (error) {
      console.error("خطأ في إضافة الخدمة: ", error);
      alert("حدث خطأ في إضافة الخدمة");
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

  const getCategoryDisplayName = (category) => {
    const categories = {
      "exterior-design": "🏢 تصميم خارجي",
      "interior-design": "🏠 تصميم داخلي",
      "execution-plans": "📐 مخططات تنفيذية",
      "branding": "🎨 هوية بصرية"
    };
    return categories[category] || category;
  };

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
              
              {isLoading ? (
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
                          className="action-button view"
                          title="عرض المشروع"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="action-button edit"
                          title="تعديل المشروع"
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
                        <button
                          onClick={() => deleteMember(member.id)}
                          className="action-button delete"
                          title="حذف العضو"
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
                      <input
                        type="tel"
                        value={contactInfo.whatsapp}
                        onChange={(e) => setContactInfo({...contactInfo, whatsapp: e.target.value})}
                        placeholder="+966 50 123 4567"
                      />
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
      </div>
    </div>
  );
};

export default Dashboard;
