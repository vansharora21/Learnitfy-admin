import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import axios from "axios";

const CourseDetails = () => {
  const [showForm, setShowForm] = useState(false);
  const [courseDetails, setCourseDetails] = useState([]);
  const [formData, setFormData] = useState({
    categoryName: "",
    courseName: "",
    courseId: "",
    description: "",
    duration: "",
    numberOfModules: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedDetail, setExpandedDetail] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const API = import.meta.env.VITE_BASE_URL_API;

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}admin/get/category`);
        setCategoryData(res.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch categories");
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API}admin/get/courses`);
        setCourseData(response.data.data.coursesList);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  // Fetch Course Details from API
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`${API}add/activities`);
        console.log("Course Details API Response:", response.data);
        
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          setCourseDetails(response.data.data);
          console.log("Set course details from API:", response.data.data);
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
        setError("Failed to fetch course details");
      }
    };
    fetchCourseDetails();
  }, []);

  // Filter courses based on selected category
  useEffect(() => {
    if (formData.categoryName) {
      const filtered = courseData.filter(course => 
        course.categoryName === formData.categoryName
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses([]);
    }
  }, [formData.categoryName, courseData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: value,
      // Reset course when category changes
      ...(name === 'categoryName' && { courseName: '', courseId: '' }),
      // Set courseId when course is selected
      ...(name === 'courseName' && { 
        courseId: courseData.find(course => course.courseName === value)?.courseId || ''
      })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.categoryName || !formData.courseName || !formData.description || !formData.duration || !formData.numberOfModules) {
      alert("Please fill in all fields");
      return;
    }

    setSubmitting(true);

    try {
      const courseDetailData = {
        courseId: formData.courseId,
        categoryName: formData.categoryName,
        courseName: formData.courseName,
        description: formData.description,
        duration: formData.duration,
        numberOfModules: parseInt(formData.numberOfModules)
      };

      console.log("Sending course detail data:", courseDetailData);

      if (editIndex !== null) {
        // Update existing course detail
        const updateData = {
          ...courseDetailData,
          id: courseDetails[editIndex].id
        };

        const response = await axios.put(`${API}add/activities`, updateData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log("Course Details Update Response:", response.data);

        // Refresh data from API after update
        const refreshResponse = await axios.get(`${API}add/activities`);
        if (refreshResponse.data && refreshResponse.data.data) {
          setCourseDetails(refreshResponse.data.data);
        }

        alert("Course details updated successfully!");
      } else {
        // Add new course detail - POST API call
        const response = await axios.post(`${API}add/activities`, courseDetailData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log("Course Details Add Response:", response.data);

        // Refresh data from API after adding
        const refreshResponse = await axios.get(`${API}add/activities`);
        if (refreshResponse.data && refreshResponse.data.data) {
          setCourseDetails(refreshResponse.data.data);
        }

        alert("Course details added successfully!");
      }

      // Reset form
      setFormData({ 
        categoryName: "", 
        courseName: "", 
        courseId: "", 
        description: "", 
        duration: "", 
        numberOfModules: "" 
      });
      setEditIndex(null);
      setShowForm(false);

    } catch (error) {
      console.error("Error saving course details:", error);
      
      // Show specific error message
      if (error.response) {
        alert(`Error: ${error.response.data?.message || 'Failed to save course details'}`);
      } else if (error.request) {
        alert("Network error. Please check your connection and try again.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (index) => {
    const detail = courseDetails[index];
    setFormData({
      categoryName: detail.categoryName || "",
      courseName: detail.courseName || "",
      courseId: detail.courseId || "",
      description: detail.description || "",
      duration: detail.duration || "",
      numberOfModules: detail.numberOfModules?.toString() || ""
    });
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = async (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course detail?");
    
    if (!confirmDelete) return;

    try {
      const detailId = courseDetails[index].id;
      
      // API call to delete course detail
      const response = await axios.delete(`${API}add/activities`, { 
        data: { id: detailId },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Course Details Delete Response:", response.data);

      // Refresh data from API after deletion
      const refreshResponse = await axios.get(`${API}add/activities`);
      if (refreshResponse.data && refreshResponse.data.data) {
        setCourseDetails(refreshResponse.data.data);
      }
      
      alert("Course details deleted successfully!");

      if (editIndex === index) {
        setEditIndex(null);
        setFormData({ 
          categoryName: "", 
          courseName: "", 
          courseId: "", 
          description: "", 
          duration: "", 
          numberOfModules: "" 
        });
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error deleting course details:", error);
      
      if (error.response) {
        alert(`Error: ${error.response.data?.message || 'Failed to delete course details'}`);
      } else {
        alert("Failed to delete course details. Please try again.");
      }
    }
  };

  const filteredDetails = courseDetails.filter((detail) =>
    (detail.courseName && detail.courseName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (detail.categoryName && detail.categoryName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (detail.description && detail.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (detail.duration && detail.duration.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleDetail = (index) => {
    setExpandedDetail(expandedDetail === index ? null : index);
  };

  // Format description into bullet points
  const formatDescription = (description) => {
    if (!description) return [];
    return description.split('\n').filter(line => line.trim() !== '');
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Course Details Management" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">

        <div className="mb-6 flex justify-between items-center">
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditIndex(null);
                setFormData({ 
                  categoryName: "", 
                  courseName: "", 
                  courseId: "", 
                  description: "", 
                  duration: "", 
                  numberOfModules: "" 
                });
              }}
              className="flex items-center gap-2 px-5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
              disabled={submitting}
            >
              <Plus className="w-4 h-4" />
              {editIndex !== null ? "Edit Course Details" : "Add Course Details"}
            </button>
          </div>
          
          {courseDetails.length > 0 && (
            <div className="relative">
              <input
                type="text"
                placeholder="Search course details..."
                className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-600 bg-opacity-20 border border-red-600 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Loading Display */}
        {loading && (
          <div className="mb-4 p-4 bg-blue-600 bg-opacity-20 border border-blue-600 rounded-lg">
            <p className="text-blue-400">Loading...</p>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="grid gap-4 mb-8 bg-gray-800 bg-opacity-60 backdrop-blur-md text-white rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">
              {editIndex !== null ? "Edit Course Details" : "Add Course Details"}
            </h3>
            
            <form onSubmit={handleSubmit}>
              {/* Category Selection */}
              <select
                name="categoryName"
                value={formData.categoryName}
                onChange={handleChange}
                className="w-full mb-4 bg-gray-700 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                disabled={submitting}
              >
                <option value="" disabled>Select Category</option>
                {categoryData.map((cat, index) => (
                  <option key={index} value={cat.categoryName}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>

              {/* Course Selection */}
              <select
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                className="w-full mb-4 bg-gray-700 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                disabled={!formData.categoryName || submitting}
              >
                <option value="" disabled>
                  {formData.categoryName ? "Select Course" : "Select Category First"}
                </option>
                {filteredCourses.map((course, index) => (
                  <option key={index} value={course.courseName}>
                    {course.courseName}
                  </option>
                ))}
              </select>

              {/* Description */}
              <textarea
                name="description"
                placeholder="Course Description (Enter each point on a new line for bullet points)"
                value={formData.description}
                onChange={handleChange}
                className="w-full mb-4 bg-gray-700 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="6"
                required
                disabled={submitting}
              />

              {/* Duration */}
              <input
                type="text"
                name="duration"
                placeholder="Course Duration (e.g., 8 weeks, 3 months)"
                value={formData.duration}
                onChange={handleChange}
                className="w-full mb-4 bg-gray-700 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                disabled={submitting}
              />

              {/* Number of Modules */}
              <input
                type="number"
                name="numberOfModules"
                placeholder="Number of Modules"
                value={formData.numberOfModules}
                onChange={handleChange}
                className="w-full mb-4 bg-gray-700 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                min="1"
                required
                disabled={submitting}
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                      {editIndex !== null ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    editIndex !== null ? "Update Course Details" : "Add Course Details"
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditIndex(null);
                    setFormData({ 
                      categoryName: "", 
                      courseName: "", 
                      courseId: "", 
                      description: "", 
                      duration: "", 
                      numberOfModules: "" 
                    });
                  }}
                  className="px-5 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Course Details List */}
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-white mb-4">
            Course Details List ({courseDetails.length} total)
          </h2>
          
          {filteredDetails.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No course details found. Add your first course details to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDetails.map((detail, index) => (
                <motion.div
                  key={detail.id || index}
                  className="bg-gray-700 bg-opacity-50 rounded-lg border border-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex gap-2 mb-2">
                          <span className="px-2 py-1 bg-indigo-600 text-white text-xs rounded">
                            {detail.categoryName || 'No Category'}
                          </span>
                          <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">
                            {detail.courseName || 'No Course'}
                          </span>
                          <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                            {detail.duration}
                          </span>
                          <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded">
                            {detail.numberOfModules} Modules
                          </span>
                        </div>
                        <button
                          onClick={() => toggleDetail(index)}
                          className="flex items-center justify-between w-full text-left"
                        >
                          <h3 className="text-white font-medium text-lg pr-4">
                            {detail.courseName} - Course Details
                          </h3>
                          {expandedDetail === index ? (
                            <ChevronUp className="text-gray-400 flex-shrink-0" size={20} />
                          ) : (
                            <ChevronDown className="text-gray-400 flex-shrink-0" size={20} />
                          )}
                        </button>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(index)}
                          className="text-indigo-400 hover:text-indigo-300"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    {expandedDetail === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-gray-600"
                      >
                        <div className="text-gray-300">
                          <h4 className="font-medium mb-2">Course Description:</h4>
                          <ul className="list-disc list-inside space-y-1 mb-4">
                            {formatDescription(detail.description).map((point, idx) => (
                              <li key={idx} className="text-sm">{point}</li>
                            ))}
                          </ul>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Duration:</span> {detail.duration}
                            </div>
                            <div>
                              <span className="font-medium">Modules:</span> {detail.numberOfModules}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Course Details Table View */}
        <motion.div
          className="mt-8 bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-white mb-4">Course Details Management Table</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Modules
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredDetails.map((detail, index) => (
                  <motion.tr
                    key={detail.id || index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {detail.categoryName || 'No Category'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {detail.courseName || 'No Course'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {detail.duration}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {detail.numberOfModules}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300 max-w-md">
                      <div className="truncate" title={detail.description}>
                        {detail.description}
                      </div>
                    </td>
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
      </main>
    </div>
  );
};

export default CourseDetails;
