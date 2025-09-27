import React, { useState, useEffect } from 'react';
import { useThemeStore } from '@/store/feature/themeStore';
import { getTechTags, createTechTag, updateTechTag, deleteTechTag } from '@/app/dashboard/actions';
import './TechTagsManager.scss';

interface TechTag {
  id: string;
  tag: string;
  projectRelations?: Array<{
    project: {
      id: string;
      title: string;
    };
  }>;
  archiveProjectRelations?: Array<{
    archiveProject: {
      id: string;
      title: string;
    };
  }>;
}

interface TechTagsManagerProps {
  className?: string;
}

const TechTagsManager: React.FC<TechTagsManagerProps> = ({ className }) => {
  const { isDarkTheme, themes } = useThemeStore();
  const currentTheme = isDarkTheme ? themes.dark : themes.light;
  
  const [techTags, setTechTags] = useState<TechTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; isError: boolean }>({ text: "", isError: false });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    tag: ''
  });

  // Load tech tags
  const loadTechTags = async () => {
    setIsLoading(true);
    try {
      const result = await getTechTags();
      
      if (result.success) {
        setTechTags(result.data);
        setMessage({ text: '', isError: false });
      } else {
        setMessage({ text: `Error: ${result.error}`, isError: true });
      }
    } catch (error) {
      console.error('Error loading tech tags:', error);
      setMessage({ text: 'Error: fetch failed', isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTechTags();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      
      if (editingId) {
        // Update existing tech tag
        const formDataObj = new FormData();
        formDataObj.append('tag', formData.tag);
        result = await updateTechTag(editingId, formDataObj);
      } else {
        // Create new tech tag
        const formDataObj = new FormData();
        formDataObj.append('tag', formData.tag);
        result = await createTechTag(formDataObj);
      }

      if (result.success) {
        setMessage({ 
          text: `Tech tag ${editingId ? 'updated' : 'created'} successfully!`, 
          isError: false 
        });
        resetForm();
        loadTechTags();
      } else {
        setMessage({ text: `Error: ${result.error}`, isError: true });
      }
    } catch (error) {
      setMessage({ text: 'Failed to save tech tag', isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tech tag?')) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await deleteTechTag(id);

      if (result.success) {
        setMessage({ text: 'Tech tag deleted successfully!', isError: false });
        loadTechTags();
      } else {
        setMessage({ text: `Error: ${result.error}`, isError: true });
      }
    } catch (error) {
      setMessage({ text: 'Failed to delete tech tag', isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (techTag: TechTag) => {
    setEditingId(techTag.id);
    setFormData({
      tag: techTag.tag
    });
    setIsAdding(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      tag: ''
    });
    setEditingId(null);
    setIsAdding(false);
  };

  // Get usage count for a tag
  const getUsageCount = (techTag: TechTag) => {
    const projectCount = techTag.projectRelations?.length || 0;
    const archiveCount = techTag.archiveProjectRelations?.length || 0;
    return projectCount + archiveCount;
  };

  return (
    <div className={`tech-tags-manager ${className || ''}`}>
      <div className="tech-tags-header">
        <h3 style={{ color: currentTheme?.text || "#000" }}>
          Tech Tags Management
        </h3>
        <button
          onClick={() => setIsAdding(true)}
          className="add-button"
          disabled={isLoading}
        >
          {isAdding ? 'Cancel' : 'Add New Tag'}
        </button>
      </div>

      {message.text && (
        <div className={`message ${message.isError ? 'error' : 'success'}`}>
          {message.text}
        </div>
      )}

      {/* Add/Edit Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="tech-tag-form">
          <div className="form-group">
            <label>Tag Name *</label>
            <input
              type="text"
              value={formData.tag}
              onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
              placeholder="e.g., React, Node.js, MongoDB"
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (editingId ? 'Update' : 'Create')}
            </button>
            <button type="button" onClick={resetForm} disabled={isLoading}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Tech Tags List */}
      <div className="tech-tags-list">
        {isLoading && (!techTags || techTags.length === 0) ? (
          // Show skeleton loader only on initial load
          <div className="loading-skeleton">
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="skeleton-item">
                <div className="skeleton-tag"></div>
                <div className="skeleton-usage"></div>
                <div className="skeleton-actions">
                  <div className="skeleton-button"></div>
                  <div className="skeleton-button"></div>
                </div>
              </div>
            ))}
          </div>
        ) : techTags && techTags.length > 0 ? (
          // Show actual tech tags
          techTags.map(tag => (
            <div key={tag.id} className="tech-tag-item">
              <div className="tag-info">
                <h4>{tag.tag}</h4>
                <span className="usage-count">
                  Used in {getUsageCount(tag)} project{getUsageCount(tag) !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="tag-actions">
                <button
                  onClick={() => handleEdit(tag)}
                  className="edit-button"
                  disabled={isLoading}
                >
                  Edit
                </button>
                
                <button
                  onClick={() => handleDelete(tag.id)}
                  className="delete-button"
                  disabled={isLoading || getUsageCount(tag) > 0}
                  title={getUsageCount(tag) > 0 ? 'Cannot delete: Tag is in use' : 'Delete tag'}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          // Show empty state
          <div className="empty-state">
            <p>No tech tags found. Click &quot;Add New Tag&quot; to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechTagsManager;
