import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronUp, Trash, Pencil } from "lucide-react";
import axios from "axios";
import { USER_CONTACT_USER } from "../../constants";
// import {} from "../../../"

const QueriesTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [userData, setUserData] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [expandedId, setExpandedId] = useState(null);

	const API = import.meta.env.VITE_BASE_URL_API;

	useEffect(() => {
		const fetchQueriesData = async () => {
			try {
				setLoading(true);
				const response = await axios.get(`${API}${USER_CONTACT_USER}`);
				const queriesData = response.data.data.contacts;
				setUserData(queriesData);
				setFilteredUsers(queriesData);
				setLoading(false);
			} catch (err) {
				console.error("Failed to fetch user data:", err.message);
				setError(err.message);
				setLoading(false);
			}
		};

		fetchQueriesData();
	}, []);

	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);

		if (term === "") {
			setFilteredUsers(userData);
			return;
		}

		const filtered = userData.filter((user) =>
			`${user.firstName} ${user.lastName}`.toLowerCase().includes(term) ||
			user.email.toLowerCase().includes(term) ||
			user.phone.toLowerCase().includes(term) ||
			(user.description && user.description.toLowerCase().includes(term))
		);
		setFilteredUsers(filtered);
	};

	const toggleExpand = (id) => {
		setExpandedId(prev => (prev === id ? null : id));
	};

	const handleDelete = async (id) => {
		if (window.confirm("Are you sure you want to delete this query?")) {
			try {
				await axios.delete(`${API}user/contact/users/${id}`);
				const updatedData = userData.filter((user) => user.id !== id);
				setUserData(updatedData);
				setFilteredUsers(updatedData);
			} catch (err) {
				console.error("Failed to delete query:", err.message);
				alert(`Failed to delete: ${err.message}`);
			}
		}
	};

	if (loading) {
		return (
			<motion.div className="text-white text-center p-6">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
				<p>Loading queries...</p>
			</motion.div>
		);
	}

	if (error && filteredUsers.length === 0) {
		return (
			<motion.div className="text-red-400 text-center p-6">
				<p className="mb-4">Error loading queries: {error}</p>
				<button
					onClick={() => window.location.reload()}
					className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
				>
					Try Again
				</button>
			</motion.div>
		);
	}

	return (
		<motion.div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-xl font-semibold text-gray-100">Queries</h2>
				<div className="relative">
					<input
						type="text"
						placeholder="Search queries..."
						className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={searchTerm}
						onChange={handleSearch}
					/>
					<Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
				</div>
			</div>

			{filteredUsers.length === 0 ? (
				<div className="text-center text-gray-400 py-8">No queries found matching your search.</div>
			) : (
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-700">
						<thead>
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Phone</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Details</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-700">
							{filteredUsers.map((user, index) => (
								<React.Fragment key={user.id}>
									<tr className="hover:bg-gray-700">
										<td className="px-6 py-4">
											<div className="flex items-center">
												<div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
													{user.firstName?.charAt(0)}
												</div>
												<div className="ml-4 text-sm text-white">
													{user.firstName} {user.lastName}
												</div>
											</div>
										</td>
										<td className="px-6 py-4 text-sm text-gray-300">{user.email}</td>
										<td className="px-6 py-4 text-sm text-gray-300">{user.phone}</td>
										<td className="px-6 py-4">
											<button
												onClick={() => toggleExpand(user.id)}
												className="flex items-center text-blue-400 hover:text-blue-300"
											>
												View Details{" "}
												{expandedId === user.id ? (
													<ChevronUp size={16} className="ml-1" />
												) : (
													<ChevronDown size={16} className="ml-1" />
												)}
											</button>
										</td>
										<td className="px-6 py-4 text-sm text-gray-300">
											<button className="text-indigo-400 hover:text-indigo-300 mr-3">
												<Pencil size={18} />
											</button>
											<button
												className="text-red-400 hover:text-red-300"
												onClick={() => handleDelete(user.id)}
											>
												<Trash size={18} />
											</button>
										</td>
									</tr>

									<AnimatePresence>
										{expandedId === user.id && (
											<motion.tr
												initial={{ opacity: 0, height: 0 }}
												animate={{ opacity: 1, height: "auto" }}
												exit={{ opacity: 0, height: 0 }}
												className="bg-gray-900"
											>
												<td colSpan={5} className="px-6 py-4">
													<div className="bg-gray-800 p-4 rounded-md">
														<h4 className="text-sm font-medium text-gray-300 mb-2">
															Query Description:
														</h4>
														<p className="text-sm text-gray-400 leading-relaxed">
															{user.description || "No description provided."}
														</p>
													</div>
												</td>
											</motion.tr>
										)}
									</AnimatePresence>
								</React.Fragment>
							))}
						</tbody>
					</table>
				</div>
			)}
		</motion.div>
	);
};

export default QueriesTable;
