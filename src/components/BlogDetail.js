import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { config } from '../config';
import { ArrowLeft, User, Clock, Share2, Image as ImageIcon, Calendar, BookOpen } from 'lucide-react';

const BlogDetail = () => {
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { blogId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogDetail = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${config.API_HOST}/api/user/getBlogs/${blogId}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch blog details');
                }
                
                const data = await response.json();
                setBlog(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching blog details:', error);
                setError('Unable to load blog details. Please try again later.');
                setLoading(false);
            }
        };

        if (blogId) {
            fetchBlogDetail();
        }
    }, [blogId]);
    const formatContent = (content) => {
        if (!content) return [];
        
        // Split content into sections based on headers (assuming headers start with #)
        const sections = content.split(/(?=# )/);
        
        return sections.map(section => {
            const lines = section.trim().split('\n');
            const isHeader = lines[0].startsWith('# ');
            
            return {
                header: isHeader ? lines[0].replace('# ', '') : '',
                content: isHeader ? lines.slice(1).join('\n') : section
            };
        });
    };
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: blog.title,
                text: blog.content.substring(0, 200) + '...',
                url: window.location.href
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href)
                .then(() => alert('Link copied to clipboard!'));
        }
    };

    const DefaultBlogImage = () => (
        <div className="w-full h-96 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center rounded-xl">
            <ImageIcon className="w-20 h-20 text-white opacity-80" />
        </div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
                    <div className="mt-4 text-purple-600 font-medium">Loading...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
                    <div className="text-red-500 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-center text-gray-800 font-medium">{error}</p>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
                <div className="text-center text-gray-600">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-xl font-medium">No blog found</p>
                </div>
            </div>
        );
    }
    const formatParagraph = (text) => {
        // Check if paragraph ends with : or ?
        if (text.trim().endsWith(':') || text.trim().endsWith('?')) {
          return <p className="font-bold">{text}</p>;
        }
        return <p>{text}</p>;
      };
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Navigation Bar */}
                <nav className="flex items-center justify-between mb-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors group"
                    >
                        <ArrowLeft className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Blogs</span>
                    </button>
                    {/* <button 
                        onClick={handleShare}
                        className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all hover:scale-105 text-purple-600"
                    >
                        <Share2 className="h-5 w-5" />
                    </button> */}
                </nav>
 
                {/* Main Content */}
                <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Featured Image */}
                     <div className="mb-8">
                        {blog.image ? (
                            <img 
                                src={blog.image} 
                                alt={blog.title} 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <DefaultBlogImage />
                        )}
                    </div>
                    {/* Header Section */}
                    <div className="p-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-6 leading-tight">
                            {blog.title}
                        </h1>
                        
                        <div className="flex flex-wrap items-center gap-6 mb-8 text-sm">
                            <div className="flex items-center space-x-2 text-blue-600">
                                <User className="h-5 w-5" />
                                <span className="font-medium">{blog.author}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-purple-600">
                                <Calendar className="h-5 w-5" />
                                <span className="font-medium">
                                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>

                   

                    {/* Content Section */}
                    <div className="px-8 pb-12">
                     <div className="prose prose-lg max-w-none">
                      <div className="text-gray-800 leading-relaxed space-y-6">
                           {blog.content.split('\n').map((paragraph, index) => (
                              paragraph && formatParagraph(paragraph)
                          ))}
                      </div>
                      </div>
                      </div>
                </article>
            </div>
        </div>
    );
};

export default BlogDetail;