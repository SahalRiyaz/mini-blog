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
  Feather,
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
      setError('Could not load essay text. Please return to the studio.');
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
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 font-serif">Opening essay manuscript...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/admin"
          className="inline-flex items-center space-x-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Curator Studio</span>
        </Link>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin"
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors"
          >
            Discard
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-md transition-all font-sans"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publishing...' : isEditing ? 'Update Article' : 'Publish to Journal'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm rounded-2xl flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Editor Card */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-amber-100/90 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6 transition-colors">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 font-sans">
            Essay Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. The Architecture of Silence: Morandi’s Still Lifes and the Poetics of the Everyday"
            required
            className="w-full px-4 py-3 text-lg font-serif font-bold rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1 font-sans">
            <Tag className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span>Artistic Themes & Movements (comma separated)</span>
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="modern-art, painting, aesthetics, exhibition, still-life"
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
        </div>

        {/* Toolbar & Tab Switcher */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-amber-100 dark:border-slate-800 mb-3">
            {/* Toolbar Buttons */}
            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => insertMarkdown('**', '**')}
                className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('*', '*')}
                className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('## ')}
                className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Heading 2"
              >
                <Heading className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('> ')}
                className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Blockquote / Critical Citation"
              >
                <Quote className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('- ')}
                className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Catalog List"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('[', '](https://example.com)')}
                className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Reference Link"
              >
                <Link2 className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center space-x-1 bg-amber-50 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('write')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'write'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Writing Desk</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'preview'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Reader Preview</span>
              </button>
            </div>
          </div>

          {/* Editor or Preview Pane */}
          {activeTab === 'write' ? (
            <textarea
              id="post-content-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Compose your article in Markdown here...&#10;&#10;## Visual Analysis&#10;Reflections on the artist's brushwork, palette, and emotional resonance...&#10;&#10;> 'Every canvas is a journey into a foreign harbor.'"
              rows={16}
              required
              className="w-full p-4 font-mono text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-y leading-relaxed transition-colors"
            />
          ) : (
            <div className="min-h-[384px] p-6 bg-slate-50/50 dark:bg-slate-950/60 rounded-2xl border border-amber-100 dark:border-slate-800 overflow-y-auto">
              {content.trim() ? (
                <div className="markdown-body">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm text-slate-400 dark:text-slate-500 italic font-serif">No manuscript text to preview yet. Begin composing above.</p>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
