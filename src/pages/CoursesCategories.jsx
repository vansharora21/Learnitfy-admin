import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, Flag } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import axios from "axios";
import { ADD_CONTENT, ADD_COURSES, ADMIN_GET_CATEGORY, ADMIN_GET_COURSES, DELETE_COURSES, UPDATE_COURSES, UPLOAD_PDF } from "../constants";
import { toast } from "react-toastify";

const CourseCategories = () => {
  const [showForm, setShowForm] = useState(false);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    categoryName: "",
    name: "",
    image: null,
    description: "",
    price: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showModuleUpdateForm, setShowModuleUpdateForm] = useState(false);
  const [modules, setModules] = useState([]);
  
  // Updated module data structure with points array
  const [moduleData, setModuleData] = useState({
    name: "",
    points: [""],
    pdf: null
  });
  
  const [updateModuleData, setUpdateModuleData] = useState({
    name: "",
    points: [""],
    pdf: null
  });

  // Enhanced module editing state variables
  const [allModulesData, setAllModulesData] = useState([]);
  console.log("allModulesData------", allModulesData);
  const [currentEditingModuleIndex, setCurrentEditingModuleIndex] = useState(null);
  const [existingModules, setExistingModules] = useState([]);

  const [currentCourseIndex, setCurrentCourseIndex] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  // console.log("categoryData------", categoryData);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState([]);
  const [courseID, setCourseID] = useState("");
  const [sendPdf, setSentPdf] = useState(false);
  const [count, setCount] = useState(0);
  const [getCourseData, setGetCourseData] = useState([]);
  const [broturePdf, setBrochurePdf] = useState(null);
  const [showPdfForm, setShowPdfForm] = useState(false);
  const [showUpdatePdfForm, setShowUpdatePdfForm] = useState(false);
  const [updateBrochurePdf, setUpdateBrochurePdf] = useState(null);

  const API = import.meta.env.VITE_BASE_URL_API;

  // Helper functions for dynamic points management
  const addPoint = (isUpdate = false) => {
    if (isUpdate) {
      setUpdateModuleData(prev => ({
        ...prev,
        points: [...prev.points, ""]
      }));
    } else {
      setModuleData(prev => ({
        ...prev,
        points: [...prev.points, ""]
      }));
    }
  };

  const removePoint = (index, isUpdate = false) => {
    if (isUpdate) {
      setUpdateModuleData(prev => ({
        ...prev,
        points: prev.points.filter((_, i) => i !== index)
      }));
    } else {
      setModuleData(prev => ({
        ...prev,
        points: prev.points.filter((_, i) => i !== index)
      }));
    }
  };

  const updatePoint = (index, value, isUpdate = false) => {
    if (isUpdate) {
      setUpdateModuleData(prev => ({
        ...prev,
        points: prev.points.map((point, i) => i === index ? value : point)
      }));
    } else {
      setModuleData(prev => ({
        ...prev,
        points: prev.points.map((point, i) => i === index ? value : point)
      }));
    }
  };

  useEffect(() => {
    const responseGetCourse = async () => {
      const response = await axios.get(`${API}${ADMIN_GET_COURSES}`);
      const course_data = response.data.data.coursesList;
      setGetCourseData(course_data);
    };
    responseGetCourse();
  }, []);

  const handlebroturePDF = (e) => {
    const file = e.target.files[0];
    setBrochurePdf(file);
  };

  const handleUpdateBrochurePDF = (e) => {
    const file = e.target.files[0];
    setUpdateBrochurePdf(file);
  };

  const handleAddBrochurePdf = async (e) => {
    e.preventDefault();
    if (!broturePdf) return console.warn('No PDF selected');
    if (!courseID) return console.warn('No course ID');

    const formData = new FormData();
    formData.append('pdf', broturePdf);
    formData.append('courseId', courseID);

    try {
      const response = await axios.post(`${API}admin/upload/pdf`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Brochure upload response:', response.data);
      setSentPdf(false);
      setShowModuleForm(false);
      setShowPdfForm(false);
      setBrochurePdf(null);
    } catch (error) {
      console.error('Upload error:', error.response || error.message);
    }
  };

  const handleUpdateBrochurePdf = async (e) => {
    e.preventDefault();
    
    // Only update PDF if a new file is selected
    if (!updateBrochurePdf) {
      console.log('No new PDF selected, keeping existing PDF');
      setShowModuleUpdateForm(false);
      setShowUpdatePdfForm(false);
      setUpdateBrochurePdf(null);
      return;
    }
    
    if (!courseID) return console.warn('No course ID');

    const formData = new FormData();
    formData.append('pdf', updateBrochurePdf);
    formData.append('courseId', courseID);

    try {
      const response = await axios.post(`${API}admin/upload/pdf`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Brochure update response:', response.data);
      setShowModuleUpdateForm(false);
      setShowUpdatePdfForm(false);
      setUpdateBrochurePdf(null);
    } catch (error) {
      console.error('Update error:', error.response || error.message);
    }
  };

  const DeleteCourse = async (courseId) => {
    try {
      await axios.delete(`${API}${DELETE_COURSES}`, {
        data: { courseId },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      });
      const updatedCourseData = getCourseData.filter(course => course.courseId !== courseId);
      setGetCourseData(updatedCourseData);
      console.log("Course deleted successfully");
    } catch (error) {
      console.error("Error deleting course:", error.message);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}${ADMIN_GET_CATEGORY}`);
        setCategoryData(res.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.categoryName) return;

    const data = new FormData();
    data.append("categoryName", formData.categoryName);
    data.append("courseName", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price || "1000");
    data.append("metaTag", formData.metaTag);
    data.append("metaDescription", formData.metaDescription);
    data.append("url", formData.url);

    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const isEditing = editIndex !== null;

      if (isEditing) {
        data.append("courseId", courseID);

        const response = await axios.patch(`${API}${UPDATE_COURSES}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const updatedCourse = response.data.data;
        const updatedCourses = [...getCourseData];
        updatedCourses[editIndex] = { ...updatedCourses[editIndex], ...updatedCourse };
        setGetCourseData(updatedCourses);

        setShowModuleUpdateForm(true);
      } else {
        const response = await axios.post(`${API}${ADD_COURSES}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const newCourse = response.data.data;
        setCourseData(newCourse);
        setCourseID(newCourse.courseId);
        setGetCourseData(prev => [...prev, newCourse]);
        setSentPdf(true);

        setCourses(prev => [...prev, { ...formData, modules: [] }]);
        setCurrentCourseIndex(courses.length);
        setShowModuleForm(true);
      }

      setFormData({ categoryName: "", name: "", image: "", description: "", price: "" });
      setShowForm(false);
      setEditIndex(null);

    } catch (error) {
      console.error("Error adding/updating course:", error.message);
      setError("Failed to save course");
    }
  };

  const handleAddModule = (e) => {
    e.preventDefault();
    if (!moduleData.name || moduleData.points.filter(p => p.trim()).length === 0) return;
    setModules((prev) => [...prev, moduleData]);
    setModuleData({
      name: "",
      points: [""],
      pdf: null
    });
  };

  const handleFinishModules = async () => {
    setCount(0);
    setShowPdfForm(prev => !prev);
  };

  const handleFinishUpdateModules = async () => {
    // Skip PDF form and directly complete the update
    setShowModuleUpdateForm(false);
    console.log("Course updated successfully without PDF change");
  };

  // Updated handleEdit function to load modules with points arrays
  const handleEdit = (courseId) => {
    const course = getCourseData.find((c) => c.courseId === courseId);
    const index = getCourseData.findIndex((c) => c.courseId === courseId);
    if (!course) return;

    setFormData({
      categoryName: course.categoryName || "",
      name: course.courseName || "",
      metaTag: course.metaTag || "",
      metaDescription: course.metaDescription || "",
      url: course.url || "",
      image: course.image || "",
      description: course.description || "",
      price: course.price || "",
    });

    // Load all existing modules with points array
    if (course.courseContent && course.courseContent.length > 0) {
      setExistingModules(course.courseContent);
      setAllModulesData(course.courseContent.map(module => ({
        courseId: course.courseId,
        _id: module._id,  
        name: module.moduleTitle || "",
        points: module.points || [""],
        pdf: null
      })));
    }

    setEditIndex(index);
    setCourseID(course.courseId);
    setShowForm(true);
  };

  // Updated function to handle editing specific module
  // const handleEditModule = () =>{
  //   axios.patch(http://localhost:4000/api/admin/update/course)
  // };


  const handleDeleteModule = async (moduleId, courseID) =>{
    const data={
      "_id":moduleId,
      "courseId":courseID
  }
  console.log("data------", data);
    try {
      const response = axios.delete(`${API}admin/delete/course/module`, {data});
      toast.success("Module deleted successfully");
      console.log("response------", response);
    } catch (error) {
      console.log("error------", error);
    }
  };

  const handleDelete = (index) => {
    const updated = courses.filter((_, i) => i !== index);
    setCourses(updated);
    if (editIndex === index) {
      setEditIndex(null);
      setFormData({ categoryName: "", name: "", image: "", description: "", price: "" });
      setShowForm(false);
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Updated API function for adding modules
  const hadleAddModule = async () => {
    try {
      const response = await axios.post(`${API}${ADD_CONTENT}`, {
        courseId: courseID,
        courseContent: [{
          moduleTitle: moduleData.name,
          points: moduleData.points.filter(point => point.trim() !== '')
        }]
      });
      
      setModuleData({ 
        name: "", 
        points: [""],
        pdf: null
      });
      setCount(count + 1);
    } catch (error) {
      console.error("Error adding module:", error.message);
    }
  };

  // Updated handleUpdateModule function
  const handleUpdateModule = async () => {
    try {
      if (currentEditingModuleIndex !== null) {
        const updatedModules = [...allModulesData];
        updatedModules[currentEditingModuleIndex] = {
          name: updateModuleData.name,
          points: updateModuleData.points.filter(point => point.trim() !== ''),
          pdf: updateModuleData.pdf
        };
        setAllModulesData(updatedModules);
      }

      const response = await axios.post(`${API}${ADD_CONTENT}`, {
        courseId: courseID,
        courseContent: [{
          moduleTitle: updateModuleData.name,
          points: updateModuleData.points.filter(point => point.trim() !== '')
        }]
      });

      console.log("Module updated successfully");
      setCurrentEditingModuleIndex(null);

      setUpdateModuleData({
        name: "",
        points: [""],
        pdf: null
      });
    } catch (error) {
      console.error("Error updating module:", error.message);
    }
  };

  // Updated function to add more modules during editing
  const handleAddNewModuleToExisting = async () => {
    try {
      const response = await axios.post(`${API}${ADD_CONTENT}`, {
        courseId: courseID,
        courseContent: [{
          moduleTitle: updateModuleData.name,
          points: updateModuleData.points.filter(point => point.trim() !== '')
        }]
      });

      setAllModulesData(prev => [...prev, {
        name: updateModuleData.name,
        points: updateModuleData.points.filter(point => point.trim() !== ''),
        pdf: updateModuleData.pdf
      }]);

      setUpdateModuleData({
        name: "",
        points: [""],
        pdf: null
      });

      console.log("New module added successfully");
    } catch (error) {
      console.error("Error adding new module:", error.message);
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Course Categories" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">

        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => {
              if (categoryData.length === 0) {
                alert("No category is available. Please add a category first.");
                return;
              }
              setShowForm(!showForm);
              setEditIndex(null);
              setFormData({ categoryName: "", name: "", image: "", description: "", price: "" });
            }}
            className="flex items-center gap-2 px-5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            <Plus className="w-4 h-4" />
            {editIndex !== null ? "Edit Course" : "Add Course"}
          </button>
          {courses.length > 0 && (
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          )}
        </div>

        {showForm && (
          <form
            onSubmit={handleAddCourse}
            className="grid gap-4 mb-8 bg-gray-800 bg-opacity-60 backdrop-blur-md text-white rounded-xl p-6 border border-gray-700"
          >
            <select
              name="categoryName"
              value={formData.categoryName}
              onChange={handleChange}
              className="bg-gray-700 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="" disabled>Select course category</option>
              {categoryData.map((cat, index) => (
                <option key={index} value={cat.categoryName}>{cat.categoryName}</option>
              ))}
            </select>

            <input
              type="text"
              name="name"
              placeholder="Course Name"
              value={formData.name}
              onChange={handleChange}
              className="bg-gray-700 border px-4 py-2 rounded-md"
              required
            />
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="bg-gray-700 border px-4 py-2 rounded-md text-white"
            />
            {formData.image instanceof File && (
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Preview"
                className="mt-2 w-24 h-24 object-cover rounded-md border"
              />
            )}

            <input
              type="text"
              name="metaTag"
              placeholder="Add meta tag"
              value={formData.metaTag}
              onChange={handleChange}
              className="bg-gray-700 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="metaDescription"
              placeholder="Add meta description"
              value={formData.metaDescription}
              onChange={handleChange}
              className="bg-gray-700 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="url"
              placeholder="Add meta url"
              value={formData.url}
              onChange={handleChange}
              className="bg-gray-700 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="bg-gray-700 border px-4 py-2 rounded-md"
              rows="3"
              required
            />
            <button
              type="submit"
              className="self-start px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              {editIndex !== null ? "Update Course" : "Save Course"}
            </button>
          </form>
        )}

        {showModuleForm && (
          <form
            onSubmit={handleAddModule}
            className="grid gap-4 mb-8 bg-gray-800 bg-opacity-60 backdrop-blur-md text-white rounded-xl p-6 border border-gray-700"
          >
            <h3 className="text-lg font-semibold mb-2">Add Modules for this Course</h3>
            
            <input
              type="text"
              name="name"
              placeholder="Module Name"
              value={moduleData.name}
              onChange={e => setModuleData({ ...moduleData, name: e.target.value })}
              className="bg-gray-700 border px-4 py-2 rounded-md"
              required
            />

            {/* Dynamic Points Section */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-300">Module Points</label>
                <button
                  type="button"
                  onClick={() => addPoint(false)}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
                >
                  <Plus className="w-3 h-3" />
                  Add Point
                </button>
              </div>
              
              {moduleData.points.map((point, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder={`Point ${index + 1}`}
                    value={point}
                    onChange={e => updatePoint(index, e.target.value, false)}
                    className="bg-gray-700 border px-4 py-2 rounded-md flex-1"
                    required={index === 0}
                  />
                  {moduleData.points.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePoint(index, false)}
                      className="px-2 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button 
              type="button"
              onClick={hadleAddModule} 
              className="self-start px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Add Module {count}
            </button>
            
            <button 
              type="button" 
              onClick={handleFinishModules} 
              className="self-start px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition mt-2"
            >
              Finish & Save Course
            </button>

            {showPdfForm && (
              <div className="mt-4">
                <input
                  type="file"
                  name="pdf"
                  accept="application/pdf"
                  className="bg-gray-700 border px-4 py-2 rounded-md text-white"
                  onChange={handlebroturePDF}
                  required
                />
                <button
                  onClick={handleAddBrochurePdf}
                  className="flex items-center gap-2 px-5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition mt-2"
                >
                  Send PDF
                </button>
              </div>
            )}

            <ul className="mt-2">
              {modules.map((mod, idx) => (
                <li key={idx} className="text-sm text-gray-300">
                  {mod.name} - Points: {mod.points?.join(', ')} ({mod.pdf && mod.pdf.name})
                </li>
              ))}
            </ul>
          </form>
        )}

        {showModuleUpdateForm && (
          <div className="grid gap-4 mb-8 bg-gray-800 bg-opacity-60 backdrop-blur-md text-white rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Update Modules for this Course</h3>

            {/* Display all existing modules */}
            <div className="mb-4">
              <h4 className="text-md font-medium mb-2">Existing Modules:</h4>
              {allModulesData.map((module, index) => (
                <div key={index} className="bg-gray-700 p-3 rounded-md mb-2 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{module.name}</p>
                    <p className="text-sm text-gray-300">
                      Points: {module.points?.join(', ') || 'No points'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteModule(module._id, module.courseId)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
                  >
                    delete
                  </button>
                  <button
                    onClick={() => handleEditModule(index)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>

            {/* Module editing form */}
            <form className="grid gap-4">
              <input
                type="text"
                name="name"
                placeholder="Module Name"
                value={updateModuleData.name}
                onChange={e => setUpdateModuleData({ ...updateModuleData, name: e.target.value })}
                className="bg-gray-700 border px-4 py-2 rounded-md"
                required
              />

              {/* Dynamic Points Section for Update */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-300">Module Points</label>
                  <button
                    type="button"
                    onClick={() => addPoint(true)}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
                  >
                    <Plus className="w-3 h-3" />
                    Add Point
                  </button>
                </div>
                
                {updateModuleData.points.map((point, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder={`Point ${index + 1}`}
                      value={point}
                      onChange={e => updatePoint(index, e.target.value, true)}
                      className="bg-gray-700 border px-4 py-2 rounded-md flex-1"
                      required={index === 0}
                    />
                    {updateModuleData.points.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePoint(index, true)}
                        className="px-2 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                {currentEditingModuleIndex !== null ? (
                  <button
                    type="button"
                    onClick={handleUpdateModule}
                    className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                  >
                    Update Module
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddNewModuleToExisting}
                    className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                  >
                    Add New Module
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setCurrentEditingModuleIndex(null);
                    setUpdateModuleData({
                      name: "",
                      points: [""],
                      pdf: null
                    });
                  }}
                  className="px-5 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                >
                  Clear Form
                </button>
              </div>
            </form>

            {/* Updated finish section with optional PDF */}
            <div className="border-t border-gray-600 pt-4 mt-4">
              <div className="flex gap-2 items-center mb-4">
                <button
                  type="button"
                  onClick={handleFinishUpdateModules}
                  className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Finish Update (Keep Current PDF)
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowUpdatePdfForm(!showUpdatePdfForm)}
                  className="px-5 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition"
                >
                  {showUpdatePdfForm ? 'Cancel PDF Update' : 'Update PDF'}
                </button>
              </div>

              {showUpdatePdfForm && (
                <div className="bg-gray-700 p-4 rounded-md">
                  <p className="text-sm text-gray-300 mb-2">Upload a new PDF to replace the current one:</p>
                  <input
                    type="file"
                    name="pdf"
                    accept="application/pdf"
                    className="bg-gray-600 border px-4 py-2 rounded-md text-white mb-2 w-full"
                    onChange={handleUpdateBrochurePDF}
                  />
                  <button
                    onClick={handleUpdateBrochurePdf}
                    className="flex items-center gap-2 px-5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
                  >
                    Update PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Course Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Course Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {getCourseData.map((course, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4">
                      <img
                        src={course.image}
                        alt={course.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{course.categoryName}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{course.courseName}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{course.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <button
                        onClick={() => handleEdit(course.courseId)}
                        className="text-indigo-400 hover:text-indigo-300 mr-2"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => DeleteCourse(course.courseId)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

      </main>
    </div>
  );
};

export default CourseCategories;
