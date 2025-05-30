import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import axios from "axios";
import { ADMIN_GET_CATEGORY } from "../constants";


//add : /add/course    
//update: /update/course     courseId
//delete: /delete/course
//get: /get/courses

const CourseCategories = () => {
  const [showForm, setShowForm] = useState(false);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({ name: "", image: "", description: "", type: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [modules, setModules] = useState([]);
  const [moduleData, setModuleData] = useState({ name: "", description: "", pdf: null });
  const [currentCourseIndex, setCurrentCourseIndex] = useState(null);
  const [categoryData, setCategoryData] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_BASE_URL_API

    useEffect(() => {
    const AddCategoriesName = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${API}${ADMIN_GET_CATEGORY}`);
        const CategoryData = res.data.data;
        setCategoryData(CategoryData);
        console.log("CategoryData--------", CategoryData)
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
        setLoading(false);
        console.log("error---------", err.message)
      }
    };
    AddCategoriesName();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.image || !formData.description || !formData.type) return;

    if (editIndex !== null) {
      const updated = [...courses];
      updated[editIndex] = { ...formData, modules: modules };
      setCourses(updated);
      setEditIndex(null);
    } else {
      setCourses((prev) => [...prev, { ...formData, modules: [] }]);
      setCurrentCourseIndex(courses.length); // index of the new course
      setShowModuleForm(true);
    }
    setFormData({ name: "", image: "", description: "", type: "" });
    setShowForm(false);
  };

  const handleModuleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "pdf" && files.length > 0) {
      setModuleData((prev) => ({ ...prev, pdf: files[0] }));
    } else {
      setModuleData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddModule = (e) => {
    e.preventDefault();
    if (!moduleData.name || !moduleData.description || !moduleData.pdf) return;
    setModules((prev) => [...prev, moduleData]);
    setModuleData({ name: "", description: "", pdf: null });
  };

  const handleFinishModules = () => {
    if (currentCourseIndex !== null) {
      const updated = [...courses];
      updated[currentCourseIndex].modules = modules;
      setCourses(updated);
      setModules([]);
      setCurrentCourseIndex(null);
      setShowModuleForm(false);
    }
  };

  const handle26Edit = (index) => {
    // Corrected: should be handleEdit, not handle26Edit
    // For production, use handleEdit
    setFormData(courses[index]);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    const updated = courses.filter((_, i) => i !== index);
    setCourses(updated);
    if (editIndex === index) {
      setEditIndex(null);
      setFormData({ name: "", image: "", description: "", type: "" });
      setShowForm(false);
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (index) => {
    setFormData(courses[index]);
    setEditIndex(index);
    setShowForm(true);
  };



  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Course Categories" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* ADD/EDIT FORM */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditIndex(null);
              setFormData({ name: "", image: "", description: "", type: "" });
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

        {/* FORM UI */}
        {showForm && (
          <form
            onSubmit={handleAddCourse}
            className="grid gap-4 mb-8 bg-gray-800 bg-opacity-60 backdrop-blur-md text-white rounded-xl p-6 border border-gray-700"
          >
            <select
              placeholder="select course category"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="bg-gray-700 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              
              {categoryData.map((catData, id, index) => {
              return (
                <>
                <option value="" disabled hidden>
                  Select course category
                </option>
                <option key={id}>{catData.categoryName}</option>
                </>
              )
            })}

            </select>
            
            <input
              type="text"
              name="name"
              placeholder="Course Name"
              value={formData.name}
              onChange={handleChange}
              className="bg-gray-700 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="bg-gray-700 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
            />
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="mt-2 w-24 h-24 object-cover rounded-md border"
              />
            )}
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="bg-gray-700 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="3"
            />
            <button
              type="submit"
              className="self-start px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              {editIndex !== null ? "Update Course" : "Save Course"}
            </button>
          </form>
        )}

        {/* COURSES TABLE */}
        {filteredCourses.length > 0 ? (
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredCourses.map((course, index) => (
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
                      <td className="px-6 py-4 text-sm text-gray-100 font-semibold">{course.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{course.type}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{course.description}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        <button
                          onClick={() => handleEdit(index)}
                          className="text-indigo-400 hover:text-indigo-300 mr-2"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
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
        ) : (
          <p className="text-center text-gray-400 mt-8">No courses found.</p>
        )}

        {/* MODULE FORM */}
        {showModuleForm && (
          <form onSubmit={handleAddModule} className="grid gap-4 mb-8 bg-gray-800 bg-opacity-60 backdrop-blur-md text-white rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Add Modules for this Course</h3>
            <input type="text" name="name" placeholder="Module Name" value={moduleData.name} onChange={handleModuleChange} className="bg-gray-700 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <textarea name="description" placeholder="Module Description" value={moduleData.description} onChange={handleModuleChange} className="bg-gray-700 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" rows="2" />
            <input type="file" name="pdf" accept="application/pdf" onChange={handleModuleChange} className="bg-gray-700 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white" />
            <button type="submit" className="self-start px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">Add Module</button>
            <button type="button" onClick={handleFinishModules} className="self-start px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition mt-2">Finish & Save Course</button>
            <ul className="mt-2">
              {modules.map((mod, idx) => (
                <li key={idx} className="text-sm text-gray-300">{mod.name} - {mod.description} ({mod.pdf && mod.pdf.name})</li>
              ))}
            </ul>
          </form>
        )}
      </main>
    </div>
  );
};

export default CourseCategories;
