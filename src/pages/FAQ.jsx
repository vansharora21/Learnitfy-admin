import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import axios from "axios";
import { toast } from "react-toastify";

const FAQPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [formData, setFormData] = useState({ categoryName: "", courseName: "", courseId: "", question: "", answer: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [getFaq, setGetFaq] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [faqList, setFaqList] = useState([{ question: "", answer: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const API = import.meta.env.VITE_BASE_URL_API;

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

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await axios.get(`${API}faq/get`);
        setGetFaq(response.data.faqOfCourse);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };
    fetchFAQs();
  }, []);

  useEffect(() => {
    if (formData.categoryName) {
      const filtered = courseData.filter(course => course.categoryName === formData.categoryName);
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses([]);
    }
  }, [formData.categoryName, courseData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'categoryName' && { courseName: '', courseId: '' }),
      ...(name === 'courseName' && { courseId: courseData.find(course => course.courseName === value)?.courseId || '' })
    }));
  };

  const selectedCourse = getFaq.find(course => course.courseId === selectedCourseId);
  const filteredFAQs = selectedCourse?.faq || [];

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const handleUpdateFAQ = async (faq) => {
    try {
      const payload = {
        courseId: selectedCourseId,
        _id: faq._id,
        question: faq.question,
        answer: faq.answer
      };

      await axios.patch("https://api.learnItfy.com/api/faq/update", payload);
      toast.success("FAQ updated successfully!");
    } catch (error) {
      toast.error("Failed to update FAQ");
      console.error("Error updating FAQ:", error);
    }
  };



  const handleFaqChange = (idx, field, value) => {
    setFaqList(prev =>
      prev.map((faq, i) =>
        i === idx ? { ...faq, [field]: value } : faq
      )
    );
  };

  const handleAddFaqField = () => {
    setFaqList(prev => [...prev, { question: "", answer: "" }]);
  };

  // const handleAddFaq = async (e) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);
  //   try {
  //     await axios.post("https://api.learnitfy.com/api/faq/add", {
  //       courseId: selectedCourseId,
  //       faq: faqList,
  //     });
  //     toast.success("All FAQ added successfully!");
  //     setFaqList([{ question: "", answer: "" }]);
  //     setSelectedCourseId("");
  //   } catch (err) {
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  const handleAddFaq = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post("https://api.learnitfy.com/api/faq/add", {
        courseId: selectedCourseId,
        faq: faqList,
      });
      console.log("faq add successfully ");

      toast.success("All FAQs added successfully!");

      // Reset form
      setFaqList([{ question: "", answer: "" }]);
      setSelectedCourseId("");
      setTimeout(() => {
        window.location.reload();
        console.log("faq add successfully ------");

      }, 1500);
    } catch (err) {
      toast.error("Failed to add FAQ.");
      console.error("Add FAQ error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-900 min-h-screen">
      <Header title="FAQ Management" />
      <main className="max-w-7xl mx-auto py-10 px-4 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-6">Manage Frequently Asked Questions</h1>

        <section>
          <h2 className="text-xl font-semibold text-white mb-6">Frequently Asked Questions</h2>
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className="mb-6 bg-yellow-600 text-white px-4 py-2 rounded"
          >
            {isEditMode ? "Cancel Edit" : "Edit All FAQs"}
          </button>
          <motion.div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq._id || index}
                className="bg-gray-800 rounded-xl shadow-md border border-gray-700 transition duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-4">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h3 className="text-white font-medium text-lg pr-4">{faq.question}</h3>
                    {expandedFAQ === index ? (
                      <ChevronUp className="text-gray-400" size={20} />
                    ) : (
                      <ChevronDown className="text-gray-400" size={20} />
                    )}
                  </button>

                  {expandedFAQ === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-gray-600 space-y-2"
                    >
                      {isEditMode ? (
                        <>
                          <input
                            type="text"
                            className="w-full p-2 rounded bg-gray-700 text-white"
                            value={faq.question}
                            onChange={(e) => {
                              const updated = [...filteredFAQs];
                              updated[index].question = e.target.value;
                              selectedCourse.faq = updated;
                              setGetFaq([...getFaq]);
                            }}
                          />
                          <textarea
                            className="w-full p-2 rounded bg-gray-700 text-white"
                            value={faq.answer}
                            onChange={(e) => {
                              const updated = [...filteredFAQs];
                              updated[index].answer = e.target.value;
                              selectedCourse.faq = updated;
                              setGetFaq([...getFaq]);
                            }}
                          />
                          <button
                            onClick={() => handleUpdateFAQ(faq)}
                            className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
                          >
                            Save FAQ
                          </button>
                        </>
                      ) : (
                        <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

        </section>

        <form
          onSubmit={handleAddFaq}
          className="bg-gray-800 p-6 rounded-lg shadow-md mb-8 mt-8"
        >
          <div className="mb-4 pt-1 ">
            <label className="block text-gray-300 mb-2">Select Course</label>
            <select
              value={selectedCourseId}
              onChange={e => setSelectedCourseId(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            >
              <option value="">Select a course</option>
              {/* Replace with your actual course list */}
              {courseData.map(course => (
                <option key={course.courseId} value={course.courseId}>
                  {course.courseName}
                </option>
              ))}
            </select>
          </div>
          {faqList.map((faq, idx) => (
            <div key={idx} className="mb-4">
              <input
                type="text"
                placeholder="Question"
                value={faq.question}
                onChange={e => handleFaqChange(idx, "question", e.target.value)}
                className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
                required
              />
              <input
                type="text"
                placeholder="Answer"
                value={faq.answer}
                onChange={e => handleFaqChange(idx, "answer", e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white"
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddFaqField}
            className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
          >
            Add Another FAQ
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit FAQ"}
          </button>
        </form>
      </main>
    </div >
  );
};

export default FAQPage;
