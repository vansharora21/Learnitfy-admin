import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Trash } from "lucide-react";

const EmailTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [email, setemail] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// user/send/brochure
	useEffect(() => {
		const fetchemail = async () => {
			try {
				setLoading(true);
				const response = await fetch('https://api.example.com/email');
				if (!response.ok) {
					throw new Error(`Error: ${response.status} - ${response.statusText}`);
				}
				const data = await response.json();
				setemail(data);
				setFilteredUsers(data);
				setLoading(false);
			} catch (err) {
				console.error("Failed to fetch email:", err);
				setError(err.message);
				setLoading(false);
				const fallbackData = [
					{ id: 1, email: "john@example.com", Course: "Python" },
					{ id: 2, email: "jane@example.com", Course: "Web Dev" },
					{ id: 3, email: "bob@example.com", Course: "C/C++" },
					{ id: 4, email: "alice@example.com", Course: "Java" },
					{ id: 5, email: "charlie@example.com", Course: "Devops" },
				];
				setemail(fallbackData);
				setFilteredUsers(fallbackData);
			}
		};
		fetchemail();
	}, []);

	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		if (term === "") {
			setFilteredUsers(email);
			return;
		}
		const filtered = email.filter(
			(user) => 
				user.email.toLowerCase().includes(term) ||
				(user.Course && user.Course.toLowerCase().includes(term))
		);
		setFilteredUsers(filtered);
	};

	const handleDelete = async (id) => {
		if (window.confirm("Are you sure you want to delete this email entry?")) {
			try {
				const response = await fetch(`https://api.example.com/email/${id}`, {
					method: 'DELETE',
				});
				if (!response.ok) {
					throw new Error(`Error: ${response.status} - ${response.statusText}`);
				}
				setemail(email.filter(user => user.id !== id));
				setFilteredUsers(filteredUsers.filter(user => user.id !== id));
			} catch (err) {
				console.error("Failed to delete email entry:", err);
				alert(`Failed to delete: ${err.message}`);
			}
		}
	};

	if (loading) {
		return (
			<motion.div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 flex justify-center items-center' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
				<div className="text-white">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
					<p>Loading emails...</p>
				</div>
			</motion.div>
		);
	}

	if (error && filteredUsers.length === 0) {
		return (
			<motion.div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
				<div className="text-red-400 text-center">
					<p className="mb-4">Error loading emails: {error}</p>
					<button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Try Again</button>
				</div>
			</motion.div>
		);
	}

	return (
		<motion.div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Brochure Emails</h2>
				<div className='relative'>
					<input type='text' placeholder='Search email or course...' className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500' value={searchTerm} onChange={handleSearch} />
					<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
				</div>
			</div>
			{filteredUsers.length === 0 ? (
				<div className="text-center text-gray-400 py-8">No Email found matching your search.</div>
			) : (
				<div className='overflow-x-auto'>
					<table className='min-w-full divide-y divide-gray-700'>
						<thead>
							<tr>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Email</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Course Inquired</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Actions</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-gray-700'>
							{filteredUsers.map((user) => (
								<motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} layout>
									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='text-sm text-gray-300'>{user.email}</div>
									</td>
									<td className='px-6 py-4 whitespace-nowrap'>
										<span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100'>{user.Course}</span>
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
										<button className='text-red-400 hover:text-red-300' onClick={() => handleDelete(user.id)}><Trash size={18} /></button>
									</td>
								</motion.tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</motion.div>
	);
};

export default EmailTable;
