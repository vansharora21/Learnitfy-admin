import { useState } from 'react';
import { motion } from 'framer-motion';
// Remove these lines:
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        console.log('Logging in with', email, password);
        // Add login logic here
    };

    return (
        <div className="min-h-screen flex bg-[#0f172a]">
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-[#0f172a]">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-6 text-center">
                        <h1 className="text-3xl font-bold text-white mb-2">Sign in to <span className="text-blue-500">Learnitfy</span></h1>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-gray-300 mb-2">Your email</label>
                            <input
                                type="email"
                                className="rounded-full bg-[#1e293b] text-white border border-gray-600 px-4 py-3"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">Enter Password</label>
                            <Input
                                type="password"
                                className="rounded-full bg-[#1e293b] text-white border border-gray-600 px-4 py-3"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="text-right text-gray-400 text-sm">
                            <a href="#" className="hover:underline">Forgot Password</a>
                        </div>
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <button
                                type="submit"
                                className="w-full bg-white text-black font-semibold py-3 px-4 rounded-full transition duration-300"
                            >
                                SIGN IN
                            </button>
                        </motion.div>
                        <p className="text-gray-400 text-center text-sm">
                            Need an account? <a href="#" className="text-blue-400 hover:underline">Sign up</a>
                        </p>
                    </form>
                </motion.div>
                <p className="text-xs text-gray-600 mt-8 text-center max-w-xs">
                    By proceeding you agree to the <a href="#" className="underline">Terms & Conditions</a> and <a href="#" className="underline">Privacy Policy</a>.
                </p>
            </div>
            <div className="hidden md:flex w-1/2 items-center justify-center bg-[#1e293b] relative">
                <img
                    src="/images/3D.png" // Learnitfy 3D image added here
                    alt="Learnitfy Preview"
                    className="rounded-lg shadow-lg w-[85%]"
                />
                <div className="absolute bg-orange-300 rounded-full w-48 h-48 top-20 left-20 opacity-30 -z-10"></div>
            </div>
        </div>
    );
}
