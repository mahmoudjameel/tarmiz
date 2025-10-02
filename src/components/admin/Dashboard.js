import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";
import { Plus, Trash2, Edit, Save, X, Eye, BarChart3, Settings, FolderOpen, Star, Award, Sparkles, LogOut } from 'lucide-react';
import Login from './Login';
import "./Dashboard.css";

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
          fetchContactInfo();
          fetchCategories();
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
      fetchContactInfo();
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
