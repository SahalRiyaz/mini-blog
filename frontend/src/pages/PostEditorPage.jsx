import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { api } from '../api/client.js';
import {
  ArrowLeft,
  Save,
  Eye,
  Edit,
  Code,
  Bold,
  Italic,
  Heading,
  List,
  Quote,
  Link2,
  AlertCircle,
  Tag,
} from 'lucide-react';

export default function PostEditorPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [activeTab, setActiveTab] = useState('write'); // 'write' or 'preview'
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
      console.error('Failed to load post for editing:', err);
      setError('Could not load article data. Please return to the dashboard.');
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

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selectedText.length || 4));
    }, 10);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Please provide both a title and article content.');
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
      console.error('Failed to save post:', err);
      setError(err.response?.data?.error || 'Failed to save post. Please check your inputs.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto"></div>
        <p className="text-xs text-slate-500 mt-3">Loading article editor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/admin"
          className="inline-flex items-center space-x-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin"
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-md shadow-brand-500/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publishing...' : isEditing ? 'Update Post' : 'Publish Story'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Editor Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Post Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Architecting Scalable REST APIs with Express and Node.js"
            required
            className="w-full px-4 py-3 text-lg font-bold rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-900 placeholder:text-slate-300"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center space-x-1">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span>Tags (comma separated)</span>
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="javascript, tutorial, webdev, express"
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800 placeholder:text-slate-300"
          />
        </div>

        {/* Markdown Toolbar & Tab Switcher */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 mb-3">
            {/* Toolbar Buttons */}
            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => insertMarkdown('**', '**')}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('*', '*')}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('## ')}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Heading 2"
              >
                <Heading className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('> ')}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Blockquote"
              >
                <Quote className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('`', '`')}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Inline Code"
              >
                <Code className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('```javascript\n', '\n```')}
                className="px-2 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors text-xs font-mono font-medium"
                title="Code Block"
              >
                {'{ }'}
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('- ')}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Bulleted List"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('[', '](https://example.com)')}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Link"
              >
                <Link2 className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('write')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'write'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Markdown Editor</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'preview'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>
            </div>
          </div>

          {/* Editor or Preview Pane */}
          {activeTab === 'write' ? (
            <textarea
              id="post-content-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article in Markdown here...&#10;&#10;## Subheading&#10;Paragraph content with **bold**, *italics*, and lists:&#10;- Item 1&#10;- Item 2"
              rows={16}
              required
              className="w-full p-4 font-mono text-sm rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-y leading-relaxed"
            />
          ) : (
            <div className="min-h-[384px] p-6 bg-slate-50/50 rounded-2xl border border-slate-200 overflow-y-auto">
              {content.trim() ? (
                <div className="markdown-body">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">No content to preview yet. Start typing above!</p>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
