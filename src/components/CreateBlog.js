import React, { useState, useRef } from 'react';
import { X, PlusCircle, Save } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';
import { config } from '../config';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
const CreateBlog = () => {
  const editorRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    tags: [],
    image: null
  });
  const navigate=useNavigate();
  const [tagInput, setTagInput] = useState('');

  const handleEditorChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content: content
    }));
  };

  const handleImageChange = (e) => {
    const file=e.target.files[0]
        console.log("file",file)
        if (file) {
          var reader = new FileReader();
          reader.readAsDataURL(e.target.files[0])
          reader.onload = () => {
           console.log("loded image",reader.result)
            setFormData({
                ...formData,
                image:reader.result
            })
            
          };
          reader.onerror = (error) => {
            console.error("Error reading file:", error);
          };
          
        }
      };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.image) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch(`${config.API_HOST}/api/user/postBlogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setFormData({
          title: '',
          content: '',
          author: '',
          tags: [],
          image: null
        });
        setTagInput('');
        alert('Blog post created successfully!');
      } else {
        alert(result.message || 'Failed to create blog post');
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('Network error. Please try again.');
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const authorOptions = ['Medscore', 'Manish', 'Vamshi', 'Other'];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
       <div className="max-w-4xl mx-auto">
      <button 
                    onClick={() => navigate(-1)}
                    className=" flex items-center text-gray-600 hover:text-indigo-600 transition-colors mb-6 space-x-2"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span>Back</span>
                </button>
      <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-4xl bg-white shadow-md rounded-lg p-8 space-y-6"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Create New Blog Post</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter blog post title"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Content</label>
            <Editor
              apiKey="guu3b3m0ppmv4u3zrnf1x1okjgijzmvydlpz4xerp3dfriu0" 
              onInit={(evt, editor) => editorRef.current = editor}
              value={formData.content}
              onEditorChange={handleEditorChange}
              init={{
                height: 500,
                menubar: true,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help | image',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                images_upload_handler: async (blobInfo) => {
                  // Here you would typically upload the image to your server
                  // and return the URL. For now, we'll convert it to base64
                  return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(blobInfo.blob());
                    reader.onload = () => resolve(reader.result);
                  });
                }
              }}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Author</label>
            <select
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Author</option>
              {authorOptions.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>
            {formData.author === 'Other' && (
              <input
                type="text"
                placeholder="Enter custom author name"
                value={formData.author === 'Other' ? '' : formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Featured Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Tags</label>
            <div className="flex">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tags"
                className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addTag}
                className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition-colors"
              >
                <PlusCircle size={20} />
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                  >
                    {tag}
                    <button 
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-red-600"
                    >
                      <X size={16} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <button 
            type="submit" 
            className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Save size={20} />
            Create Post
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default CreateBlog;