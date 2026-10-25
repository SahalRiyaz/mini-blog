import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { api } from '../api/client.js';
import {
  ArrowLeft,
  Bold,
  Italic,
  Heading,
  List,
  Quote,
  Link2,
  AlertCircle,
} from 'lucide-react';

export default function PostEditorPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [activeTab, setActiveTab] = useState('write');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      fetchPostToEdit();
    }
  }, [id]);

  const fetchPostToEdit = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getPost(id);
      const post = res.data.post;
      setTitle(post.title || '');
      setContent(post.content || '');
      setTagsInput(post.tags ? post.tags.join(', ') : '');
    } catch (err) {
      console.error('Failed to load essay for editing:', err);
      setError('Could not load essay text. Please return to the dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const insertMarkdown = (prefix, suffix = '') => {
    const textarea = document.getElementById('post-content-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = `${prefix}${selectedText || 'text'}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selectedText.length || 4));
    }, 10);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Please provide an essay title and the body of the article.');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const parsedTags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title: title.trim(),
        content: content.trim(),
        tags: parsedTags,
      };

      if (isEditing) {
        await api.updatePost(id, payload);
        navigate(`/posts/${id}`);
      } else {
        const res = await api.createPost(payload);
        const createdId = res.data.post?.id || res.data.post?._id;
        navigate(`/posts/${createdId}`);
      }
    } catch (err) {
      console.error('Failed to save essay:', err);
      setError(err.response?.data?.error || 'Failed to publish essay. Please check your entries.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="h-6 bg-gray-800 rounded w-1/3 mx-auto mb-4"></div>
        <p className="text-xs text-gray-500">Loading manuscript...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Substack Writer Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-8">
        <Link
          to="/admin"
          className="inline-flex items-center space-x-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </Link>

        <div className="flex items-center space-x-3">
          {/* Mode Switcher */}
          <div className="flex items-center space-x-1 bg-[#12141D] border border-gray-800 p-0.5 rounded-full text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`px-3 py-1 rounded-full font-medium transition-all ${
                activeTab === 'write'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-full font-medium transition-all ${
                activeTab === 'preview'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Preview
            </button>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs tracking-tight shadow-md transition-all"
          >
            {saving ? 'Publishing...' : isEditing ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Editor Body */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
            className="w-full font-serif font-bold text-3xl sm:text-4xl text-white placeholder:text-gray-600 bg-transparent border-none focus:outline-none focus:ring-0 px-0"
          />
        </div>

        <div>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Add themes & tags (e.g. painting, sculpture, modern-art)..."
            className="w-full text-xs font-sans text-gray-300 placeholder:text-gray-600 bg-transparent border-b border-gray-800 pb-2 focus:outline-none focus:border-blue-500 px-0"
          />
        </div>

        {/* Minimal Formatting Bar */}
        <div className="flex items-center space-x-1 py-1.5 border-y border-gray-800 text-gray-400 text-xs">
          <button
            type="button"
            onClick={() => insertMarkdown('**', '**')}
            className="p-1 hover:text-white rounded"
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('*', '*')}
            className="p-1 hover:text-white rounded"
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('## ')}
            className="p-1 hover:text-white rounded"
            title="Heading"
          >
            <Heading className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('> ')}
            className="p-1 hover:text-white rounded"
            title="Quote"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('- ')}
            className="p-1 hover:text-white rounded"
            title="List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('[', '](https://example.com)')}
            className="p-1 hover:text-white rounded"
            title="Link"
          >
            <Link2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Editor or Preview */}
        {activeTab === 'write' ? (
          <textarea
            id="post-content-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tell your story in Markdown..."
            rows={18}
            required
            className="w-full font-serif text-[1.125rem] leading-[1.8] text-gray-200 placeholder:text-gray-600 bg-transparent border-none focus:outline-none focus:ring-0 px-0 resize-y"
          />
        ) : (
          <div className="min-h-[400px] py-4">
            {content.trim() ? (
              <div className="markdown-body">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            ) : (
              <p className="font-serif italic text-gray-500">Nothing to preview yet. Start typing above.</p>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
