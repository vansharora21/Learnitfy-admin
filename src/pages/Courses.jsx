import { useState } from "react";
import {  Plus, Edit, Trash2, Search } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";


const OverviewPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: "", image: "", description: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      const file = files[0];
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        alert("Please upload a valid image file (PNG, JPEG, JPG).");
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.image || !formData.description) return;

    if (editIndex !== null) {
      const updated = [...categories];
      updated[editIndex] = formData;
      setCategories(updated);
      setEditIndex(null);
    } else {
      setCategories((prev) => [...prev, formData]);
    }

    setFormData({ name: "", image: "", description: "" });
    setShowForm(false);
  };

  const handleEdit = (index) => {
    setFormData(categories[index]);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    const updated = categories.filter((_, i) => i !== index);
    setCategories(updated);
    if (editIndex === index) {
      setEditIndex(null);
      setFormData({ name: "", image: "", description: "" });
      setShowForm(false);
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Courses" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}


        {/* ADD/EDIT FORM */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditIndex(null);
              setFormData({ name: "", image: "", description: "" });
            }}
            className="flex items-center gap-2 px-5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            <Plus className="w-4 h-4" />
            {editIndex !== null ? "Edit Category" : "Add Category"}
          </button>

          {categories.length > 0 && (
            <div className="relative">
              <input
                type="text"
                placeholder="Search categories..."
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
            onSubmit={handleAddCategory}
            className="grid gap-4 mb-8 bg-gray-800 bg-opacity-60 backdrop-blur-md text-white rounded-xl p-6 border border-gray-700"
          >
            <input
              type="text"
              name="name"
              placeholder="Category Name"
              value={formData.name}
              onChange={handleChange}
              className="bg-gray-700 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="file"
              name="image"
              accept="image/png, image/jpeg, image/jpg"
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
              {editIndex !== null ? "Update Category" : "Save Category"}
            </button>
          </form>
        )}

        {/* CATEGORY TABLE */}
        {filteredCategories.length > 0 ? (
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Name
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
                  {filteredCategories.map((cat, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-6 py-4">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-100 font-semibold">{cat.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{cat.description}</td>
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
          <p className="text-center text-gray-400 mt-8">No categories found.</p>
        )}
      </main>
    </div>
  );
};

export default OverviewPage;



