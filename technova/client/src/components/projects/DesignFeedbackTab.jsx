import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiOutlineChatAlt, HiCheckCircle, HiCheck } from 'react-icons/hi';
import { format } from 'date-fns';

const DesignFeedbackTab = ({ project }) => {
  const { user } = useSelector(state => state.auth);
  const [annotations, setAnnotations] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [activeComment, setActiveComment] = useState(null); // { x, y } to show input box
  const [newCommentText, setNewCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const imgRef = useRef(null);

  const images = project.files.filter(f => f.fileUrl.match(/\.(jpeg|jpg|gif|png)$/i));

  const fetchAnnotations = async () => {
    try {
      const res = await api.get(`/annotations/${project._id}`);
      setAnnotations(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAnnotations();
    if (images.length > 0 && !selectedFile) {
      setSelectedFile(images[0].fileUrl);
    }
  }, [project]);

  const currentAnnotation = annotations.find(a => a.fileUrl === selectedFile);
  const comments = currentAnnotation?.comments || [];

  const handleImageClick = (e) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setActiveComment({ x, y });
    setNewCommentText('');
  };

  const submitComment = async () => {
    if (!newCommentText.trim()) return;
    setLoading(true);
    try {
      await api.post(`/annotations/${project._id}`, {
        fileUrl: selectedFile,
        x: activeComment.x,
        y: activeComment.y,
        text: newCommentText
      });
      toast.success('Comment added');
      setActiveComment(null);
      setNewCommentText('');
      fetchAnnotations();
    } catch (err) {
      toast.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const resolveComment = async (commentId) => {
    try {
      await api.put(`/annotations/${project._id}/${commentId}/resolve`);
      toast.success('Resolved');
      fetchAnnotations();
    } catch (err) {
      toast.error('Failed to resolve comment');
    }
  };

  if (images.length === 0) {
    return (
      <div className="p-8 text-center glass-card border border-white/5">
        <p className="text-surface-400">No design files (images) available in this project to annotate.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map(img => (
          <button 
            key={img._id}
            onClick={() => { setSelectedFile(img.fileUrl); setActiveComment(null); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              selectedFile === img.fileUrl ? 'bg-primary-500 text-white shadow-glow-primary' : 'bg-surface-800 text-surface-400 hover:text-white border border-white/5'
            }`}
          >
            {img.fileName}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="relative inline-block border border-white/10 rounded-xl overflow-hidden bg-surface-900">
            <img 
              ref={imgRef}
              src={selectedFile} 
              alt="Design Review" 
              className="max-w-full h-auto cursor-crosshair"
              onClick={handleImageClick}
            />
            
            {/* Render existing comments */}
            {comments.map((c, i) => (
              <div 
                key={c._id}
                className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center font-bold text-sm shadow-xl border-2 cursor-pointer transition-transform hover:scale-110 z-10 ${c.resolved ? 'bg-surface-700 text-surface-400 border-surface-600' : 'bg-primary-500 text-white border-white'}`}
                style={{ left: `${c.x}%`, top: `${c.y}%` }}
                title={c.text}
              >
                {i + 1}
              </div>
            ))}

            {/* Render active new comment input */}
            {activeComment && (
              <div 
                className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full bg-accent-500 border-2 border-white text-white flex items-center justify-center font-bold text-sm shadow-xl z-20 animate-pulse"
                style={{ left: `${activeComment.x}%`, top: `${activeComment.y}%` }}
              >
                +
                <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-surface-900 border border-white/20 p-3 rounded-xl shadow-2xl w-64 cursor-default" onClick={e => e.stopPropagation()}>
                  <textarea 
                    autoFocus
                    value={newCommentText}
                    onChange={e => setNewCommentText(e.target.value)}
                    placeholder="Leave feedback here..."
                    className="w-full bg-surface-800 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500 mb-2 resize-none"
                    rows="2"
                  />
                  <div className="flex gap-2">
                    <button onClick={submitComment} disabled={loading} className="flex-1 bg-primary-600 hover:bg-primary-500 text-white text-xs py-1.5 rounded transition-colors font-bold">Post</button>
                    <button onClick={() => setActiveComment(null)} className="flex-1 bg-surface-700 hover:bg-surface-600 text-white text-xs py-1.5 rounded transition-colors">Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-bold text-white mb-4 border-b border-white/10 pb-2">Feedback List</h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {comments.length === 0 ? (
              <p className="text-surface-500 text-sm italic">Click anywhere on the image to add your first annotation.</p>
            ) : (
              comments.map((c, i) => (
                <div key={c._id} className={`p-4 rounded-xl border transition-all ${c.resolved ? 'bg-surface-900/50 border-white/5 opacity-70' : 'bg-surface-800 border-white/10'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${c.resolved ? 'bg-surface-700 text-surface-400' : 'bg-primary-500 text-white'}`}>
                        {i + 1}
                      </div>
                      <span className="text-sm font-bold text-white">{c.author?.name}</span>
                    </div>
                    {c.resolved && <HiCheckCircle className="text-emerald-500 w-5 h-5" />}
                  </div>
                  <p className="text-sm text-surface-300 mb-3">{c.text}</p>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-surface-500">{format(new Date(c.createdAt), 'MMM d, h:mm a')}</span>
                    {!c.resolved && (user.role?.name === 'admin' || user._id === project.client._id) && (
                      <button onClick={() => resolveComment(c._id)} className="text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1">
                        <HiCheck /> Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignFeedbackTab;
