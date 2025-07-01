import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import axios from "axios";
import { toast } from "react-toastify";
import { ADMIN_GET_CATEGORY, ADMIN_GET_COURSES, ADD_ACTIVITIYS } from "../constants";

const CourseDetails = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseDetails, setCourseDetails] = useState([]);
  const [formData, setFormData] = useState({
    categoryName: "",
    courseName: "",
    courseId: "",
    duration: "",
    noOfModules: "",
    activities: "",
    notes1: "",
    notes2: "",
    notes3: "",
    notes4: "",
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
  const [tempCourseDetails, setTempCourseDetails] = useState([]);
  const [isEditingSelected, setIsEditingSelected] = useState(false);
  const [editSelectedForm, setEditSelectedForm] = useState(null);
  const [showCourseDetailForm, setShowCourseDetailForm] = useState(false);
  const [courseDetailForm, setCourseDetailForm] = useState({
    heading: "",
    aboutCourse: "",
    subHeading: "",
    point1: "",
    point2: "",
    point3: "",
    point4: "",
    point5: "",
    point6: "",
    point7: "",
    point8: "",
    point9: "",
    point10: "",
    point11: "",
    point12: "",
  });
  const [whoEnroll, setWhoEnroll] = useState({
    heading: "",
    point1: "",
    point2: "",
    point3: "",
    point4: "",
  });
  const [prerequisites, setPrerequisites] = useState({
    point1: "",
    point2: "",
  });
  const [submittedCourseDetail, setSubmittedCourseDetail] = useState(null);
  const [addStep, setAddStep] = useState(0); // 0: button, 1: select, 2: 10-points, 3: more about
  const [addCourseId, setAddCourseId] = useState("");
  const [addCourseName, setAddCourseName] = useState("");
  const [addCategoryName, setAddCategoryName] = useState("");
  const [tenPointsForm, setTenPointsForm] = useState({
    heading: "",
    aboutCourse: "",
    subHeading: "",
    point1: "",
    point2: "",
    point3: "",
    point4: "",
    point5: "",
    point6: "",
    point7: "",
    point8: "",
    point9: "",
    point10: "",
    point11: "",
    point12: "",
  });
  const [moreAboutForm, setMoreAboutForm] = useState({
    duration: "",
    noOfModules: "",
    activities: "",
    notes1: "",
    notes2: "",
    notes3: "",
    notes4: "",
  });
  const [modules, setModules] = useState([
    { moduleTitle: "", point1: "", point2: "", point3: "", point4: "", point5: "", point6: "" }
  ]);
  const API = import.meta.env.VITE_BASE_URL_API;

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}${ADMIN_GET_CATEGORY}`);
        console.log("Fetched Categories:", res.data.data);
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
        const response = await axios.get(`${API}${ADMIN_GET_COURSES}`);
        console.log("Fetched Courses:", response.data.data.coursesList);
        setCourseData(response.data.data.coursesList);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  // Updated: Fetch Course Details by CourseId
  const fetchCourseDetailsByCourseId = async (courseId) => {
    try {
      const response = await axios.get(`${API}/admin/get/courses?courseName=${courseId}`);
      console.log("Course Details API Response:", response.data);

      if (response.data && response.data.data && response.data.data.coursesList) {
        return response.data.data.coursesList[0]; // Return the first course details
      }
      return null;
    } catch (error) {
      console.error("Error fetching course details:", error);
      throw error;
    }
  };

  // Fetch All Course Details
  useEffect(() => {
    const fetchAllCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API}${ADD_ACTIVITIYS}`);
        console.log("All Course Details API Response:", response.data);

        if (response.data && response.data.data) {
          // For each course detail, fetch the complete course information
          const detailedCourseData = await Promise.all(
            response.data.data.map(async (courseDetail) => {
              try {
                const fullCourseData = await fetchCourseDetailsByCourseId(courseDetail.courseId);
                return {
                  ...courseDetail,
                  fullCourseData: fullCourseData
                };
              } catch (error) {
                console.error(`Error fetching details for course ${courseDetail.courseId}:`, error);
                return courseDetail;
              }
            })
          );

          setCourseDetails(detailedCourseData);
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
        setError("Failed to fetch course details");
      } finally {
        setLoading(false);
      }
    };

    fetchAllCourseDetails();
  }, []);

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
      ...(name === 'categoryName' && { courseName: '', courseId: '' }),
      ...(name === 'courseName' && {
        courseId: courseData.find(course => course.courseName === value)?.courseId || ''
      })
    }));
  };

  const handleAddCourseToList = (e) => {
    e.preventDefault();

    if (!formData.categoryName || !formData.courseName || !formData.duration || !formData.noOfModules || !formData.activities) {
      toast.info("Please fill in all required fields");

      return;
    }

    const newCourseDetail = {
      courseId: formData.courseId,
      categoryName: formData.categoryName,
      courseName: formData.courseName,
      moreAboutCourse: {
        duration: formData.duration,
        noOfModules: parseInt(formData.noOfModules),
        Activities: parseInt(formData.activities)
      },
      notes: {
        notes1: formData.notes1 || "",
        notes2: formData.notes2 || "",
        notes3: formData.notes3 || "",
        notes4: formData.notes4 || ""
      }
    };

    setTempCourseDetails(prev => [...prev, newCourseDetail]);
    setFormData(prev => ({
      ...prev,
      courseName: "",
      courseId: "",
      duration: "",
      noOfModules: "",
      activities: "",
      notes1: "",
      notes2: "",
      notes3: "",
      notes4: ""
    }));
    alert("Course details added to list! Add more courses or submit all course details.");
  };

  const handleSubmitAllCourseDetails = async () => {
    if (tempCourseDetails.length === 0) {
      alert("Please add at least one course detail");
      return;
    }

    setSubmitting(true);

    try {
      const promises = tempCourseDetails.map(courseDetail =>
        axios.post(`${API}admin/add/activities`, courseDetail, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );

      const responses = await Promise.all(promises);
      console.log("All Course Details Add Responses:", responses);

      // Refresh data from API after adding all
      // const refreshResponse = await axios.get(`${API}${ADD_ACTIVITIYS}`);
      // if (refreshResponse.data && refreshResponse.data.data) {
      //   setCourseDetails(refreshResponse.data.data);
      // }

      setTempCourseDetails([]);
      setFormData({
        categoryName: "",
        courseName: "",
        courseId: "",
        duration: "",
        noOfModules: "",
        activities: "",
        notes1: "",
        notes2: "",
        notes3: "",
        notes4: ""
      });
      setShowForm(false);
      alert(`${tempCourseDetails.length} course details added successfully!`);

    } catch (error) {
      console.error("Error adding course details:", error);

      if (error.response) {
        alert(`Error: ${error.response.data?.message || 'Failed to save some course details'}`);
      } else if (error.request) {
        alert("Network error. Please check your connection and try again.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const removeTempCourseDetail = (index) => {
    const updatedTempDetails = tempCourseDetails.filter((_, i) => i !== index);
    setTempCourseDetails(updatedTempDetails);
  };

  const handleEdit = (index) => {
    const detail = courseDetails[index];
    setFormData({
      categoryName: detail.categoryName || "",
      courseName: detail.courseName || "",
      courseId: detail.courseId || "",
      duration: detail.moreAboutCourse?.duration || "",
      noOfModules: detail.moreAboutCourse?.noOfModules?.toString() || "",
      activities: detail.moreAboutCourse?.Activities?.toString() || "",
      notes1: detail.notes?.notes1 || "",
      notes2: detail.notes?.notes2 || "",
      notes3: detail.notes?.notes3 || "",
      notes4: detail.notes?.notes4 || ""
    });
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = async (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course detail?");

    if (!confirmDelete) return;

    try {
      const detailId = courseDetails[index].id;

      const response = await axios.delete(`${API}${ADD_ACTIVITIYS}`, {
        data: { id: detailId },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Course Details Delete Response:", response.data);

      const refreshResponse = await axios.get(`${API}${ADD_ACTIVITIYS}`);
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
          duration: "",
          noOfModules: "",
          activities: "",
          notes1: "",
          notes2: "",
          notes3: "",
          notes4: ""
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
    (detail.moreAboutCourse?.duration && detail.moreAboutCourse.duration.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (detail.notes?.notes1 && detail.notes.notes1.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleDetail = (index) => {
    setExpandedDetail(expandedDetail === index ? null : index);
  };

  const addModule = () => {
    setModules([
      ...modules,
      { moduleTitle: "", point1: "", point2: "", point3: "", point4: "", point5: "", point6: "" }
    ]);
  };

  const removeModule = (index) => {
    setModules(modules.filter((_, i) => i !== index));
  };

  const handleModuleChange = (index, field, value) => {
    setModules(modules.map((mod, i) => i === index ? { ...mod, [field]: value } : mod));
  };

  const handleSubmitModules = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        courseId: formData.courseId || selectedCourse?.courseId,
        courseContent: modules
      };
      await axios.post(`${API}/admin/add/course/modules`, payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      toast.success("Modules added successfully!");
      setModules([{ moduleTitle: "", point1: "", point2: "", point3: "", point4: "", point5: "", point6: "" }]);
    } catch (err) {
      toast.error("Failed to add modules");
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Course Details Management" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">

        <div className="mb-6 flex justify-between items-center">
          {courseData.length > 0 && (
            <div className="ml-4">
              <select
                onChange={(e) => {
                  const selected = courseData.find((c) => c.courseId === e.target.value);
                  if (selected) {
                    setSelectedCourse({
                      courseId: selected.courseId,
                      moreAboutCourse: selected.moreAboutCourse,
                      notes: selected.notes,
                      courseName: selected.courseName,
                    });
                  } else {
                    setSelectedCourse(null);
                    setShowCourseDetailForm(false);
                  }
                }}
                className="bg-gray-700 text-white px-3 py-2 rounded-md focus:outline-none"
              >
                <option value="">🔍 View Course Details</option>
                
                {courseData.map((course, index)=>{
                  // setSelectCourseId(course.courseId)
                  console.log(course.courseId)
                  return(
                    <option key={index} value={course.courseId}>
                    {course.courseName}
                  </option>
                  )
                })}
              </select>
            </div>
          )}
          <div className="flex gap-3">
            {/* Add Multiple Course Details Stepper */}
            {addStep === 0 && (
              <button
                onClick={() => setAddStep(1)}
                className="flex items-center gap-2 px-5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
                disabled={submitting}
                
              >
                <Plus className="w-4 h-4" />
                Add Multiple Course Details
              </button>
            )}
            {addStep === 1 && (
              <form
                className="grid gap-4 mb-8 bg-gray-800 bg-opacity-60 backdrop-blur-md text-white rounded-xl p-6 border border-gray-700"
                onSubmit={e => {
                  e.preventDefault();
                  if (!addCategoryName || !addCourseName) {
                    toast.error("Please select category and course");
                    return;
                  }
                  const course = courseData.find(c => c.courseName === addCourseName && c.categoryName === addCategoryName);
                  if (!course) {
                    toast.error("Invalid course selection");
                    return;
                  }
                  setAddCourseId(course.courseId);
                  setAddStep(2);
                }}
              >
                <h3 className="text-lg font-semibold mb-2">Select Category & Course</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={addCategoryName}
                    onChange={e => {
                      setAddCategoryName(e.target.value);
                      setAddCourseName("");
                    }}
                    className="bg-gray-700 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="" disabled>Select Category</option>
                    {categoryData.map((cat, idx) => (
                      <option key={idx} value={cat.categoryName}>{cat.categoryName}</option>
                    ))}
                  </select>
                  <select
                    value={addCourseName}
                    onChange={e => setAddCourseName(e.target.value)}
                    className="bg-gray-700 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                    disabled={!addCategoryName}
                  >
                    <option value="" disabled>{addCategoryName ? "Select Course" : "Select Category First"}</option>
                    {courseData.filter(c => c.categoryName === addCategoryName).map((course, idx) => (
                      <option key={idx} value={course.courseName}>{course.courseName}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 mt-6">
                  <button type="submit" className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">Next</button>
                  <button type="button" className="px-5 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition" onClick={() => setAddStep(0)}>Cancel</button>
                </div>
              </form>
            )}
            {addStep === 2 && (
              <form
                className="mt-6 p-6 bg-gray-800 rounded-lg border border-gray-700"
                onSubmit={async e => {
                  e.preventDefault();
                  try {
                    const payload = {
                      courseId: addCourseId,
                      courseDetail: { ...tenPointsForm },
                      whoShouldEnroll: { ...whoEnroll },
                      prerequisites: { ...prerequisites }
                    };
                    await axios.post(`https://api.learnitfy.com/api/admin/add/course/detail`, payload, {
                      headers: { 'Content-Type': 'application/json' }
                    });
                    setAddStep(3);
                    toast.success("Course detail (10-points) submitted successfully!");
                  } catch (err) {
                    toast.error("Failed to submit course detail. Please try again.");
                    console.error("Error submitting course detail:", err);
                  }
                }}
              >
                <h3 className="text-lg font-semibold mb-4">Add Course Detail (10 Points)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Heading" value={tenPointsForm.heading} onChange={e => setTenPointsForm(f => ({ ...f, heading: e.target.value }))} className="bg-gray-700 border px-4 py-2 rounded-md" required />
                  <input type="text" placeholder="Sub Heading" value={tenPointsForm.subHeading} onChange={e => setTenPointsForm(f => ({ ...f, subHeading: e.target.value }))} className="bg-gray-700 border px-4 py-2 rounded-md" required />
                  <textarea placeholder="About Course" value={tenPointsForm.aboutCourse} onChange={e => setTenPointsForm(f => ({ ...f, aboutCourse: e.target.value }))} className="bg-gray-700 border px-4 py-2 rounded-md md:col-span-2" required />
                  {[...Array(12)].map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      placeholder={`Point ${i + 1}`}
                      value={tenPointsForm[`point${i + 1}`]}
                      onChange={e => setTenPointsForm(f => ({ ...f, [`point${i + 1}`]: e.target.value }))}
                      className="bg-gray-700 border px-4 py-2 rounded-md"
                    />
                  ))}
                </div>
                <h3 className="text-lg font-semibold mb-4 mt-10">Field your Who should enroll section</h3>
                <input type="text" placeholder="WSI point1" className="bg-gray-700 border px-4 py-2 rounded-md" value={whoEnroll.point1} onChange={e => setWhoEnroll(f => ({ ...f, point1: e.target.value }))}/>
                <input type="text" placeholder="WSI point1" className="bg-gray-700 border px-4 py-2 rounded-md" value={whoEnroll.point2} onChange={e => setWhoEnroll(f => ({ ...f, point2: e.target.value }))}/>
                <input type="text" placeholder="WSI point1" className="bg-gray-700 border px-4 py-2 rounded-md" value={whoEnroll.point3} onChange={e => setWhoEnroll(f => ({ ...f, point3: e.target.value }))}/>
                <input type="text" placeholder="WSI point1" className="bg-gray-700 border px-4 py-2 rounded-md" value={whoEnroll.point4} onChange={e => setWhoEnroll(f => ({ ...f, point4: e.target.value }))}/>
                
                <h3 className="text-lg font-semibold mb-4 mt-10">Prerequisites</h3>
                <input type="text" placeholder="Prerequisites 1" className="bg-gray-700 border px-4 py-2 rounded-md" value={prerequisites.point1} onChange={e => setPrerequisites(f => ({ ...f, point1: e.target.value }))}/>
                <input type="text" placeholder="Prerequisites 1" className="bg-gray-700 border px-4 py-2 rounded-md" value={prerequisites.point2} onChange={e => setPrerequisites(f => ({ ...f, point2: e.target.value }))}/>
                <button type="submit" className="mt-4 px-5 py-2 bg-green-600 rounded hover:bg-green-700 text-white">Next</button>
                <button type="button" className="mt-4 ml-3 px-5 py-2 bg-gray-600 rounded hover:bg-gray-700 text-white" onClick={() => setAddStep(1)}>Back</button>
              </form>
            )}
            {addStep === 3 && (
              <form
                className="mt-6 p-6 bg-gray-800 rounded-lg border border-gray-700"
                onSubmit={async e => {
                  e.preventDefault();
                  try {
                    const payload = {
                      courseId: addCourseId,
                      moreAboutCourse: {
                        duration: moreAboutForm.duration,
                        noOfModules: moreAboutForm.noOfModules,
                        Activities: moreAboutForm.activities
                      },
                      notes: {
                        notes1: moreAboutForm.notes1,
                        notes2: moreAboutForm.notes2,
                        notes3: moreAboutForm.notes3,
                        notes4: moreAboutForm.notes4
                      }
                    };
                    await axios.post(`${API}admin/add/activities`, payload, {
                      headers: { 'Content-Type': 'application/json' }
                    });
                    setAddStep(0);
                    setTenPointsForm({ heading: "", aboutCourse: "", subHeading: "", point1: "", point2: "", point3: "", point4: "", point5: "", point6: "", point7: "", point8: "", point9: "", point10: "", point11: "", point12: "" });
                    setMoreAboutForm({ duration: "", noOfModules: "", activities: "", notes1: "", notes2: "", notes3: "", notes4: "" });
                    setAddCourseId("");
                    setAddCourseName("");
                    setAddCategoryName("");
                    toast.success("Course details completed successfully!");
                  } catch (err) {
                    toast.error("Failed to submit course details. Please try again.");
                    console.error("Error submitting course details:", err);
                  }
                }}
              >
                <h3 className="text-lg font-semibold mb-4">More About Course & Course Notes</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" name="duration" placeholder="Duration (e.g., 9 Months)" value={moreAboutForm.duration} onChange={e => setMoreAboutForm(f => ({ ...f, duration: e.target.value }))} className="bg-gray-700 border px-4 py-2 rounded-md" required />
                  <input type="number" name="noOfModules" placeholder="Number of Modules" value={moreAboutForm.noOfModules} onChange={e => setMoreAboutForm(f => ({ ...f, noOfModules: e.target.value }))} className="bg-gray-700 border px-4 py-2 rounded-md" min="1" required />
                  <input type="number" name="activities" placeholder="Number of Activities" value={moreAboutForm.activities} onChange={e => setMoreAboutForm(f => ({ ...f, activities: e.target.value }))} className="bg-gray-700 border px-4 py-2 rounded-md" min="1" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <input type="text" name="notes1" placeholder="Note 1" value={moreAboutForm.notes1} onChange={e => setMoreAboutForm(f => ({ ...f, notes1: e.target.value }))} className="bg-gray-700 border px-4 py-2 rounded-md" />
                  <input type="text" name="notes2" placeholder="Note 2" value={moreAboutForm.notes2} onChange={e => setMoreAboutForm(f => ({ ...f, notes2: e.target.value }))} className="bg-gray-700 border px-4 py-2 rounded-md" />
                  <input type="text" name="notes3" placeholder="Note 3" value={moreAboutForm.notes3} onChange={e => setMoreAboutForm(f => ({ ...f, notes3: e.target.value }))} className="bg-gray-700 border px-4 py-2 rounded-md" />
                  <input type="text" name="notes4" placeholder="Note 4" value={moreAboutForm.notes4} onChange={e => setMoreAboutForm(f => ({ ...f, notes4: e.target.value }))} className="bg-gray-700 border px-4 py-2 rounded-md" />
                </div>
                <button type="submit" className="mt-4 px-5 py-2 bg-green-600 rounded hover:bg-green-700 text-white">Submit</button>
                <button type="button" className="mt-4 ml-3 px-5 py-2 bg-gray-600 rounded hover:bg-gray-700 text-white" onClick={() => setAddStep(2)}>Back</button>
              </form>
            )}
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
        {/* {error && (
          <div className="mb-4 p-4 bg-red-600 bg-opacity-20 border border-red-600 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )} */}

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
              {editIndex !== null ? "Edit Course Details" : "Add Multiple Course Details"}
            </h3>

            <form onSubmit={handleAddCourseToList}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category Selection */}
                <select
                  name="categoryName"
                  value={formData.categoryName}
                  onChange={handleChange}
                  className="bg-gray-700 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="bg-gray-700 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              </div>

              {/* More About Course Section */}
              <div className="mt-6">
                <h4 className="text-md font-medium mb-3 text-indigo-300">More About Course</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="duration"
                    placeholder="Duration (e.g., 9 Months)"
                    value={formData.duration}
                    onChange={handleChange}
                    className="bg-gray-700 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                    disabled={submitting}
                  />

                  <input
                    type="number"
                    name="noOfModules"
                    placeholder="Number of Modules"
                    value={formData.noOfModules}
                    onChange={handleChange}
                    className="bg-gray-700 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min="1"
                    required
                    disabled={submitting}
                  />

                  <input
                    type="number"
                    name="activities"
                    placeholder="Number of Activities"
                    value={formData.activities}
                    onChange={handleChange}
                    className="bg-gray-700 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min="1"
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Notes Section */}
              <div className="mt-6">
                <h4 className="text-md font-medium mb-3 text-green-300">Course Notes</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="notes1"
                    placeholder="Note 1 (e.g., Live classes will be conducted weekly)"
                    value={formData.notes1}
                    onChange={handleChange}
                    className="bg-gray-700 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={submitting}
                  />

                  <input
                    type="text"
                    name="notes2"
                    placeholder="Note 2 (e.g., Includes practical assignments)"
                    value={formData.notes2}
                    onChange={handleChange}
                    className="bg-gray-700 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={submitting}
                  />

                  <input
                    type="text"
                    name="notes3"
                    placeholder="Note 3 (e.g., Access to recorded sessions)"
                    value={formData.notes3}
                    onChange={handleChange}
                    className="bg-gray-700 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={submitting}
                  />

                  <input
                    type="text"
                    name="notes4"
                    placeholder="Note 4 (e.g., Certification after completion)"
                    value={formData.notes4}
                    onChange={handleChange}
                    className="bg-gray-700 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                  disabled={submitting}
                >
                  Add Course to List
                </button>

                {tempCourseDetails.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSubmitAllCourseDetails}
                    className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                        Submitting...
                      </>
                    ) : (
                      `Submit All Course Details (${tempCourseDetails.length})`
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditIndex(null);
                    setTempCourseDetails([]);
                    setFormData({
                      categoryName: "",
                      courseName: "",
                      courseId: "",
                      duration: "",
                      noOfModules: "",
                      activities: "",
                      notes1: "",
                      notes2: "",
                      notes3: "",
                      notes4: ""
                    });
                  }}
                  className="px-5 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* Temporary Course Details List */}
            {tempCourseDetails.length > 0 && (
              <div className="mt-6 p-4 bg-gray-700 rounded-md">
                <h4 className="text-md font-medium mb-3">Course Details to be submitted ({tempCourseDetails.length}):</h4>
                <div className="space-y-3">
                  {tempCourseDetails.map((detail, index) => (
                    <div key={index} className="flex justify-between items-start p-3 bg-gray-600 rounded">
                      <div className="flex-1">
                        <div className="flex gap-2 mb-2">
                          <span className="px-2 py-1 bg-indigo-600 text-white text-xs rounded">
                            {detail.categoryName}
                          </span>
                          <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">
                            {detail.courseName}
                          </span>
                          <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                            {detail.moreAboutCourse.duration}
                          </span>
                        </div>
                        <div className="text-sm text-gray-300">
                          <div>Modules: {detail.moreAboutCourse.noOfModules} | Activities: {detail.moreAboutCourse.Activities}</div>
                          {detail.notes.notes1 && <div className="mt-1">• {detail.notes.notes1}</div>}
                        </div>
                      </div>
                      <button
                        onClick={() => removeTempCourseDetail(index)}
                        className="text-red-400 hover:text-red-300 ml-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {selectedCourse && (
          <div className="mt-4 p-4 border border-gray-600 rounded-lg bg-gray-800 text-white">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">
                {selectedCourse.courseName} – Quick View
              </h3>
              <button
                className="px-3 py-1 bg-indigo-600 rounded hover:bg-indigo-700"
                onClick={() => {
                  setIsEditingSelected(true);
                  setEditSelectedForm({
                    duration: selectedCourse.moreAboutCourse?.duration || "",
                    noOfModules: selectedCourse.moreAboutCourse?.noOfModules || "",
                    Activities: selectedCourse.moreAboutCourse?.Activities || "",
                    notes1: selectedCourse.notes?.notes1 || "",
                    notes2: selectedCourse.notes?.notes2 || "",
                    notes3: selectedCourse.notes?.notes3 || "",
                    notes4: selectedCourse.notes?.notes4 || "",
                  });
                }}
              >
                Edit
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-indigo-300 font-medium mb-1">More About Course</h4>
                <div className="text-sm">
                  <div><strong>Duration:</strong> {selectedCourse.moreAboutCourse?.duration || "N/A"}</div>
                  <div><strong>Modules:</strong> {selectedCourse.moreAboutCourse?.noOfModules || "N/A"}</div>
                  <div><strong>Activities:</strong> {selectedCourse.moreAboutCourse?.Activities || "N/A"}</div>
                </div>
              </div>
              <div>
                <h4 className="text-green-300 font-medium mb-1">Notes</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {selectedCourse.notes?.notes1 && <li>{selectedCourse.notes.notes1}</li>}
                  {selectedCourse.notes?.notes2 && <li>{selectedCourse.notes.notes2}</li>}
                  {selectedCourse.notes?.notes3 && <li>{selectedCourse.notes.notes3}</li>}
                  {selectedCourse.notes?.notes4 && <li>{selectedCourse.notes.notes4}</li>}
                </ul>
              </div>
            </div>
          </div>
        )}

{isEditingSelected && editSelectedForm && (
  <form
    className="mt-4 p-4 border border-indigo-600 rounded-lg bg-gray-900 text-white"
    onSubmit={async (e) => {
      console.log("here is the course id testing:")
      e.preventDefault();
      try {
        // Update basic course details
        await axios.patch(`https://api.learnitfy.com/api/admin/update/course`, {
          courseId: selectedCourse.courseId,
          moreAboutCourse: {
            duration: editSelectedForm.duration,
            noOfModules: editSelectedForm.noOfModules,
            Activities: editSelectedForm.Activities,
          },
          notes: {
            notes1: editSelectedForm.notes1,
            notes2: editSelectedForm.notes2,
            notes3: editSelectedForm.notes3,
            notes4: editSelectedForm.notes4,
          }
        });

        // Update course detail information
        const courseDetailPayload = {
          courseId: selectedCourse.courseId,
          courseDetail: {
            heading: editSelectedForm.heading,
            aboutCourse: editSelectedForm.aboutCourse,
            subHeading: editSelectedForm.subHeading,
            point1: editSelectedForm.point1,
            point2: editSelectedForm.point2,
            point3: editSelectedForm.point3,
            point4: editSelectedForm.point4,
            point5: editSelectedForm.point5,
            point6: editSelectedForm.point6,
            point7: editSelectedForm.point7,
            point8: editSelectedForm.point8,
            point9: editSelectedForm.point9,
            point10: editSelectedForm.point10,
            point11: editSelectedForm.point11,
            point12: editSelectedForm.point12,
            whoEnrollHeading: editSelectedForm.whoEnrollHeading,
            whoEnrollPoint1: editSelectedForm.whoEnrollPoint1,
            whoEnrollPoint2: editSelectedForm.whoEnrollPoint2,
            whoEnrollPoint3: editSelectedForm.whoEnrollPoint3,
            whoEnrollPoint4: editSelectedForm.whoEnrollPoint4,
            prerequisitesPoint1: editSelectedForm.prerequisitesPoint1,
            prerequisitesPoint2: editSelectedForm.prerequisitesPoint2
          }
        };
        
        await axios.patch(`${API}/admin/update/course/detail`, courseDetailPayload, {
          headers: { 'Content-Type': 'application/json' }
        });

        toast.success("Course updated successfully!");
        setIsEditingSelected(false);
        
        // Refresh selectedCourse data
        const updated = await axios.get(`${API}admin/get/courses?courseName=${selectedCourse.courseName}`);
        if (updated.data && updated.data.data && updated.data.data.coursesList && updated.data.data.coursesList.length > 0) {
          setSelectedCourse(updated.data.data.coursesList[0]);
        }
      } catch (err) {
        toast.error("Failed to update course");
        console.error("Update error:", err);
      }
    }}
  >
    <h3 className="text-xl font-semibold mb-6 text-white">Edit Course Details</h3>

    {/* Basic Course Information */}
    <div className="mb-6">
      <h4 className="text-lg font-medium mb-4 text-indigo-300">Basic Course Information</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          value={editSelectedForm.duration || ""}
          onChange={e => setEditSelectedForm(f => ({ ...f, duration: e.target.value }))}
          placeholder="Duration"
          className="bg-gray-700 border border-gray-600 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
        />
        <input
          type="number"
          value={editSelectedForm.noOfModules || ""}
          onChange={e => setEditSelectedForm(f => ({ ...f, noOfModules: e.target.value }))}
          placeholder="Modules"
          className="bg-gray-700 border border-gray-600 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
        />
        <input
          type="number"
          value={editSelectedForm.Activities || ""}
          onChange={e => setEditSelectedForm(f => ({ ...f, Activities: e.target.value }))}
          placeholder="Activities"
          className="bg-gray-700 border border-gray-600 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
        />
      </div>
    </div>

    {/* Course Notes */}
    <div className="mb-6">
      <h4 className="text-lg font-medium mb-4 text-green-300">Course Notes</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          value={editSelectedForm.notes1 || ""}
          onChange={e => setEditSelectedForm(f => ({ ...f, notes1: e.target.value }))}
          placeholder="Note 1"
          className="bg-gray-700 border border-gray-600 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
        />
        <input
          type="text"
          value={editSelectedForm.notes2 || ""}
          onChange={e => setEditSelectedForm(f => ({ ...f, notes2: e.target.value }))}
          placeholder="Note 2"
          className="bg-gray-700 border border-gray-600 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
        />
        <input
          type="text"
          value={editSelectedForm.notes3 || ""}
          onChange={e => setEditSelectedForm(f => ({ ...f, notes3: e.target.value }))}
          placeholder="Note 3"
          className="bg-gray-700 border border-gray-600 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
        />
        <input
          type="text"
          value={editSelectedForm.notes4 || ""}
          onChange={e => setEditSelectedForm(f => ({ ...f, notes4: e.target.value }))}
          placeholder="Note 4"
          className="bg-gray-700 border border-gray-600 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
        />
      </div>
    </div>

    {/* Course Detail Information */}
    <div className="mb-6">
      <h4 className="text-lg font-medium mb-4 text-yellow-300">Course Detail Information</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          value={editSelectedForm.heading || ""}
          onChange={e => setEditSelectedForm(f => ({ ...f, heading: e.target.value }))}
          placeholder="Heading"
          className="bg-gray-700 border border-gray-600 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
        />
        <input
          type="text"
          value={editSelectedForm.subHeading || ""}
          onChange={e => setEditSelectedForm(f => ({ ...f, subHeading: e.target.value }))}
          placeholder="Sub Heading"
          className="bg-gray-700 border border-gray-600 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
        />
      </div>
      
      <textarea
        value={editSelectedForm.aboutCourse || ""}
        onChange={e => setEditSelectedForm(f => ({ ...f, aboutCourse: e.target.value }))}
        placeholder="About Course"
        className="bg-gray-700 border border-gray-600 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400 w-full mb-4"
        rows="3"
      />

      {/* 12 Points Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(12)].map((_, i) => (
          <input
            key={i}
            type="text"
            value={editSelectedForm[`point${i + 1}`] || ""}
            onChange={e => setEditSelectedForm(f => ({ ...f, [`point${i + 1}`]: e.target.value }))}
            placeholder={`Point ${i + 1}`}
            className="bg-gray-700 border border-gray-600 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
          />
        ))}
      </div>
    </div>

    {/* Who Should Enroll Section */}
    <div className="mb-6">
      <h4 className="text-lg font-medium mb-4 text-purple-300">Who Should Enroll</h4>
      <div className="mb-4">
        <input
          type="text"
          value={editSelectedForm.whoEnrollHeading || ""}
          onChange={e => setEditSelectedForm(f => ({ ...f, whoEnrollHeading: e.target.value }))}
          placeholder="Who Should Enroll Heading"
          className="bg-gray-700 border border-gray-600 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400 w-full"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(num => (
          <input
            key={num}
            type="text"
            value={editSelectedForm[`whoEnrollPoint${num}`] || ""}
            onChange={e => setEditSelectedForm(f => ({ ...f, [`whoEnrollPoint${num}`]: e.target.value }))}
            placeholder={`Who Should Enroll Point ${num}`}
            className="bg-gray-700 border border-gray-600 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
          />
        ))}
      </div>
    </div>

    {/* Prerequisites Section */}
    <div className="mb-6">
      <h4 className="text-lg font-medium mb-4 text-orange-300">Prerequisites</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map(num => (
          <input
            key={num}
            type="text"
            value={editSelectedForm[`prerequisitesPoint${num}`] || ""}
            onChange={e => setEditSelectedForm(f => ({ ...f, [`prerequisitesPoint${num}`]: e.target.value }))}
            placeholder={`Prerequisites ${num}`}
            className="bg-gray-700 border border-gray-600 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
          />
        ))}
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex gap-3 mt-6">
      <button 
        type="submit" 
        className="px-6 py-3 bg-green-600 rounded-md hover:bg-green-700 transition font-medium text-white"
      >
        Save Changes
      </button>
      <button 
        type="button" 
        className="px-6 py-3 bg-gray-600 rounded-md hover:bg-gray-700 transition font-medium text-white" 
        onClick={() => setIsEditingSelected(false)}
      >
        Cancel
      </button>
    </div>
  </form>
)}


        {showCourseDetailForm && (
          <form
            className="mt-6 p-6 bg-gray-800 rounded-lg border border-gray-700"
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const payload = {
                  courseId: selectedCourse?.courseId || formData.courseId,
                  courseDetail: { ...courseDetailForm }
                };
                // Replace with your actual POST endpoint
                await axios.post(`https://api.learnitfy.com/api/admin/add/course/detail`, payload, {
                  headers: { 'Content-Type': 'application/json' }
                });
                setSubmittedCourseDetail(payload.courseDetail);
                setShowCourseDetailForm(false);
                alert("Course detail submitted!");
              } catch (err) {
                alert("Failed to submit course detail");
              }
            }}
          >
            <h3 className="text-lg font-semibold mb-4">Add Course Detail</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Heading" value={courseDetailForm.heading} onChange={e => setCourseDetailForm(f => ({ ...f, heading: e.target.value }))} className="bg-gray-700 border px-4 py-2 rounded-md" required />
              <input type="text" placeholder="Sub Heading" value={courseDetailForm.subHeading} onChange={e => setCourseDetailForm(f => ({ ...f, subHeading: e.target.value }))} className="bg-gray-700 border px-4 py-2 rounded-md" required />
              <textarea placeholder="About Course" value={courseDetailForm.aboutCourse} onChange={e => setCourseDetailForm(f => ({ ...f, aboutCourse: e.target.value }))} className="bg-gray-700 border px-4 py-2 rounded-md md:col-span-2" required />
              {[...Array(12)].map((_, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`Point ${i + 1}`}
                  value={courseDetailForm[`point${i + 1}`]}
                  onChange={e => setCourseDetailForm(f => ({ ...f, [`point${i + 1}`]: e.target.value }))}
                  className="bg-gray-700 border px-4 py-2 rounded-md"
                />
              ))}
            </div>
            <button type="submit" className="mt-4 px-5 py-2 bg-green-600 rounded hover:bg-green-700 text-white">Submit</button>
          </form>
        )}

        {submittedCourseDetail && (
          <div className="mt-6 p-6 bg-gray-900 rounded-lg border border-green-700">
            <h3 className="text-lg font-semibold mb-2">{submittedCourseDetail.heading}</h3>
            <div className="mb-2 text-indigo-300">{submittedCourseDetail.subHeading}</div>
            <div className="mb-4 text-gray-300">{submittedCourseDetail.aboutCourse}</div>
            <ul className="list-disc list-inside space-y-1 text-gray-200">
              {Array.from({ length: 12 }, (_, i) => submittedCourseDetail[`point${i + 1}`])
                .filter(Boolean)
                .map((point, idx) => <li key={idx}>{point}</li>)}
            </ul>
          </div>
        )}

        {/* Place this section after course creation UI */}
        <form onSubmit={handleSubmitModules} className="mt-8 p-6 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-blue-300">Add Course Modules</h3>
          {modules.map((module, idx) => (
            <div key={idx} className="mb-4 p-4 border rounded bg-gray-700">
              <input
                type="text"
                placeholder="Module Title"
                value={module.moduleTitle}
                onChange={e => handleModuleChange(idx, "moduleTitle", e.target.value)}
                className="mb-2 w-full px-3 py-2 rounded"
                required
              />
              {[1,2,3,4,5,6].map(num => (
                <input
                  key={num}
                  type="text"
                  placeholder={`Point ${num}`}
                  value={module[`point${num}`] || ""}
                  onChange={e => handleModuleChange(idx, `point${num}`, e.target.value)}
                  className="mb-2 w-full px-3 py-2 rounded"
                />
              ))}
              {modules.length > 1 && (
                <button type="button" onClick={() => removeModule(idx)} className="text-red-400">Remove Module</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addModule} className="bg-green-600 text-white px-4 py-2 rounded mr-4">Add Module</button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit Modules</button>
        </form>
      </main>
    </div>
  );
};

export default CourseDetails;