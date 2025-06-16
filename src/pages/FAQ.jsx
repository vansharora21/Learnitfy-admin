import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import axios from "axios";

const FAQPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [formData, setFormData] = useState({
    categoryName: "",
    courseName: "",
    question: "",
    answer: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState(null);

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

  // Fetch FAQs
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        // API call to fetch FAQs
        // const response = await axios.get(`${API}admin/get/faqs`);
        // setFaqs(response.data.data);
        
        // Placeholder for now
        setFaqs([]);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };
    fetchFAQs();
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
      ...(name === 'categoryName' && { courseName: '' })
    }));
  };

  const handleAddFAQ = async (e) => {
    e.preventDefault();
    if (!formData.categoryName || !formData.courseName || !formData.question || !formData.answer) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      // API call to add FAQ
      const faqData = {
        categoryName: formData.categoryName,
        courseName: formData.courseName,
        question: formData.question,
        answer: formData.answer
      };

      // const response = await axios.post(`${API}admin/add/faq`, faqData);
      
      // For now, add to local state
      const newFAQ = {
        id: Date.now(),
        ...faqData,
        createdAt: new Date().toISOString()
      };

      if (editIndex !== null) {
        const updatedFAQs = [...faqs];
        updatedFAQs[editIndex] = newFAQ;
        setFaqs(updatedFAQs);
        setEditIndex(null);
        alert("FAQ updated successfully!");
      } else {
        setFaqs(prev => [...prev, newFAQ]);
        alert("FAQ added successfully!");
      }

      setFormData({ categoryName: "", courseName: "", question: "", answer: "" });
      setShowForm(false);

    } catch (error) {
      console.error("Error adding FAQ:", error);
      alert("Failed to add FAQ. Please try again.");
    }
  };

  const handleEdit = (index) => {
    setFormData(faqs[index]);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = async (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this FAQ?");
    
    if (!confirmDelete) return;

    try {
      const faqId = faqs[index].id;
      // API call to delete FAQ
      // await axios.delete(`${API}admin/delete/faq`, { data: { faqId } });

      const updatedFAQs = faqs.filter((_, i) => i !== index);
      setFaqs(updatedFAQs);
      alert("FAQ deleted successfully!");

      if (editIndex === index) {
        setEditIndex(null);
        setFormData({ categoryName: "", courseName: "", question: "", answer: "" });
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      alert("Failed to delete FAQ. Please try again.");
    }
  };

  const filteredFAQs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="FAQ Management" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">

        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditIndex(null);
              setFormData({ categoryName: "", courseName: "", question: "", answer: "" });
            }}
            className="flex items-center gap-2 px-5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            <Plus className="w-4 h-4" />
            {editIndex !== null ? "Edit FAQ" : "Add FAQ"}
          </button>
          
          {faqs.length > 0 && (
            <div className="relative">
              <input
                type="text"
                placeholder="Search FAQs..."
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
            onSubmit={handleAddFAQ}
            className="grid gap-4 mb-8 bg-gray-800 bg-opacity-60 backdrop-blur-md text-white rounded-xl p-6 border border-gray-700"
          >
            <h3 className="text-lg font-semibold mb-2">
              {editIndex !== null ? "Edit FAQ" : "Add New FAQ"}
            </h3>
            
            {/* Category Selection */}
            <select
              name="categoryName"
              value={formData.categoryName}
              onChange={handleChange}
              className="bg-gray-700 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
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
              className="bg-gray-700 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              disabled={!formData.categoryName}
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

            {/* FAQ Question */}
            <textarea
              name="question"
              placeholder="FAQ Question"
              value={formData.question}
              onChange={handleChange}
              className="bg-gray-700 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="3"
              required
            />

            {/* FAQ Answer */}
            <textarea
              name="answer"
              placeholder="FAQ Answer"
              value={formData.answer}
              onChange={handleChange}
              className="bg-gray-700 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="4"
              required
            />

            <button
              type="submit"
              className="self-start px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              {editIndex !== null ? "Update FAQ" : "Add FAQ"}
            </button>
          </form>
        )}

        {/* FAQ List */}
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-white mb-4">FAQ List</h2>
          
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No FAQs found. Add your first FAQ to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id || index}
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
                            {faq.categoryName}
                          </span>
                          <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">
                            {faq.courseName}
                          </span>
                        </div>
                        <button
                          onClick={() => toggleFAQ(index)}
                          className="flex items-center justify-between w-full text-left"
                        >
                          <h3 className="text-white font-medium text-lg pr-4">
                            {faq.question}
                          </h3>
                          {expandedFAQ === index ? (
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
                    
                    {expandedFAQ === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-gray-600"
                      >
                        <p className="text-gray-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* FAQ Table View (Alternative) */}
        <motion.div
          className="mt-8 bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-white mb-4">FAQ Management Table</h2>
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
                    Question
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Answer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredFAQs.map((faq, index) => (
                  <motion.tr
                    key={faq.id || index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {faq.categoryName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {faq.courseName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-100 font-medium max-w-xs">
                      <div className="truncate" title={faq.question}>
                        {faq.question}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300 max-w-md">
                      <div className="truncate" title={faq.answer}>
                        {faq.answer}
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

export default FAQPage;
