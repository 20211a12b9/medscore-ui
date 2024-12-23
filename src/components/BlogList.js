import React, { useState, useEffect } from 'react';
import { config } from '../config';
import { useNavigate } from 'react-router-dom';
import { Clock, User, Image as ImageIcon } from 'lucide-react';
import { HomeNavbar } from './HomeNavbar';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${config.API_HOST}/api/user/getBlogs`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch blogs');
                }
                
                const data = await response.json();
                setBlogs(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching blogs:', error);
                setError('Unable to load blogs. Please try again later.');
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const handleReadMore = (blogId) => {
        navigate(`/blog/${blogId}`);
    };

    const DefaultBlogImage = () => (
        <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-white opacity-80" />
        </div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 shadow-lg"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 bg-red-50 p-6 rounded-lg shadow-md mt-10 max-w-md mx-auto">
                <p className="font-semibold">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="fixed top-0 left-0 w-full z-50">
        <HomeNavbar/>
      </div>
            <div className="max-w-7xl mx-auto mt-10">
                <div className="text-center mb-12">
                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-3">
                        Explore Our Blogs
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Discover interesting stories, insights, and perspectives from our community
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map(blog => (
                        <div 
                            key={blog._id}
                            className="group bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                        >
                            <div className="relative h-48 overflow-hidden">
                                {blog.image ? (
                                    <img 
                                        src={blog.image} 
                                        alt={blog.title} 
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                                    />
                                ) : (
                                    <DefaultBlogImage />
                                )}
                            </div>
                            
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {blog.title}
                                </h2>
                                <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                                    {blog.content}
                                </p>
                                
                                <div className="flex items-center text-sm text-gray-500 space-x-4 mb-6">
                                    <div className="flex items-center space-x-2">
                                        <User className="h-4 w-4 text-blue-500" />
                                        <span>{blog.author}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Clock className="h-4 w-4 text-purple-500" />
                                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => handleReadMore(blog._id)}
                                    className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium"
                                >
                                    Read More →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {blogs.length === 0 && (
                    <div className="text-center text-gray-500 py-16 bg-white rounded-2xl shadow-md">
                        <ImageIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <p className="text-xl font-medium">No blogs available at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogList;