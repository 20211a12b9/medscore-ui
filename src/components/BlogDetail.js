import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { config } from '../config';
import { ArrowLeft, User, Calendar, Image as ImageIcon } from 'lucide-react';
import DOMPurify from 'dompurify';

const BlogDetail = () => {
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { blogId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogDetail = async () => {
            try {
                const response = await fetch(`${config.API_HOST}/api/user/getBlogs/${blogId}`);
                if (!response.ok) throw new Error('Failed to fetch blog details');
                const data = await response.json();
                setBlog(data);
            } catch (error) {
                setError('Unable to load blog details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (blogId) fetchBlogDetail();
    }, [blogId]);

    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            .blog-content {
                max-width: 100%;
                text-align: left;
            }
            .blog-content img {
                max-width: 100%;
                height: auto;
                margin: 1.5rem 0;
                border-radius: 0.5rem;
            }
            .blog-content p {
                margin: 1.25rem 0;
                line-height: 1.8;
                font-size: 1.125rem;
            }
            .blog-content h1 { font-size: 2rem; margin: 2rem 0 1rem; }
            .blog-content h2 { font-size: 1.75rem; margin: 1.75rem 0 1rem; }
            .blog-content h3 { font-size: 1.5rem; margin: 1.5rem 0 1rem; }
            .blog-content h4 { font-size: 1.25rem; margin: 1.25rem 0 1rem; }
            .blog-content h1, .blog-content h2, .blog-content h3, .blog-content h4 {
                font-weight: 700;
                color: #1a1a1a;
            }
            .blog-content ul, .blog-content ol {
                margin: 1.25rem 0;
                padding-left: 1.5rem;
            }
            .blog-content li {
                margin: 0.75rem 0;
                line-height: 1.6;
            }
            .blog-content blockquote {
                border-left: 4px solid #6366f1;
                padding: 1rem 1.5rem;
                margin: 1.5rem 0;
                background-color: #f3f4f6;
                border-radius: 0.5rem;
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    const DefaultBlogImage = () => (
        <div className="w-full h-72 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center rounded-t-xl">
            <ImageIcon className="w-16 h-16 text-white opacity-90" />
        </div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                    <div className="text-red-500 mb-3">⚠️</div>
                    <p className="text-gray-800">{error}</p>
                </div>
            </div>
        );
    }

    if (!blog) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 py-8">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors mb-6"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span>Back</span>
                </button>
 
                <article className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {blog.image ? (
                        <img 
                            src={blog.image} 
                            alt={blog.title} 
                            className="w-full h-72 object-cover"
                        />
                    ) : (
                        <DefaultBlogImage />
                    )}

                    <div className="p-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            {blog.title}
                        </h1>
                        
                        <div className="flex flex-wrap gap-4 mb-6 text-sm">
                            <div className="flex items-center gap-2 text-indigo-600">
                                <User className="h-4 w-4" />
                                <span>{blog.author}</span>
                            </div>
                            <div className="flex items-center gap-2 text-purple-600">
                                <Calendar className="h-4 w-4" />
                                <span>
                                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>

                        <div className="blog-content prose prose-indigo max-w-none"
                            dangerouslySetInnerHTML={{ 
                                __html: DOMPurify.sanitize(blog.content, {
                                    ADD_TAGS: ['iframe'],
                                    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']
                                })
                            }}
                        />
                    </div>
                </article>
            </div>
        </div>
    );
};

export default BlogDetail;