import React, { useState, useEffect } from 'react';
import { useThemeStore } from '@/store/feature/themeStore';
import { getTechOptions, createTechOption, updateTechOption, deleteTechOption } from '@/app/dashboard/actions';
import './TechOptionsManager.scss';

interface TechOption {
  id: string;
  name: string;
  category: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TechOptionsManagerProps {
  className?: string;
}

const TechOptionsManager: React.FC<TechOptionsManagerProps> = ({ className }) => {
  const { isDarkTheme, themes } = useThemeStore();
  const currentTheme = isDarkTheme ? themes.dark : themes.light;
  
  const [techOptions, setTechOptions] = useState<TechOption[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true to show skeleton
  const [message, setMessage] = useState<{ text: string; isError: boolean }>({ text: "", isError: false });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    isActive: true
  });

  const categories = [
    'Frontend', 'Backend', 'Database', 'DevOps', 'Testing', 'Build Tools', 'Other'
  ];

  // Load tech options
  const loadTechOptions = async () => {
    setIsLoading(true);
    try {
      const result = await getTechOptions();
      
      if (result.success) {
        setTechOptions(result.data);
        setMessage({ text: '', isError: false }); // Clear any previous errors
      } else {
        setMessage({ text: `Error: ${result.error}`, isError: true });
      }
    } catch (error) {
      console.error('Error loading tech options:', error);
      setMessage({ text: 'Failed to load tech options', isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTechOptions();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      
      if (editingId) {
        // Update existing tech option
        const formDataObj = new FormData();
        formDataObj.append('name', formData.name);
        formDataObj.append('category', formData.category);
        formDataObj.append('description', formData.description);
        formDataObj.append('isActive', formData.isActive.toString());
        
        result = await updateTechOption(editingId, formDataObj);
      } else {
        // Create new tech option
        const formDataObj = new FormData();
        formDataObj.append('name', formData.name);
        formDataObj.append('category', formData.category);
        formDataObj.append('description', formData.description);
        formDataObj.append('isActive', formData.isActive.toString());
        
        result = await createTechOption(formDataObj);
      }

      if (result.success) {
        setMessage({ 
          text: `Tech option ${editingId ? 'updated' : 'created'} successfully!`, 
          isError: false 
        });
        resetForm();
        loadTechOptions();
      } else {
        setMessage({ text: `Error: ${result.error}`, isError: true });
      }
    } catch (error) {
      setMessage({ text: 'Failed to save tech option', isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tech option?')) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await deleteTechOption(id);

      if (result.success) {
        setMessage({ text: 'Tech option deleted successfully!', isError: false });
        loadTechOptions();
      } else {
        setMessage({ text: `Error: ${result.error}`, isError: true });
      }
    } catch (error) {
      setMessage({ text: 'Failed to delete tech option', isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (option: TechOption) => {
    setEditingId(option.id);
    setFormData({
      name: option.name,
      category: option.category,
      description: option.description || '',
      isActive: option.isActive
    });
    setIsAdding(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      isActive: true
    });
    setEditingId(null);
    setIsAdding(false);
  };

  // Toggle active status
  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const option = techOptions.find(o => o.id === id);
      if (!option) return;

      const formDataObj = new FormData();
      formDataObj.append('name', option.name);
      formDataObj.append('category', option.category);
      formDataObj.append('description', option.description || '');
      formDataObj.append('isActive', (!currentStatus).toString());

      const result = await updateTechOption(id, formDataObj);
      if (result.success) {
        loadTechOptions();
      }
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  return (
    <div className={`tech-options-manager ${className || ''}`}>
      <div className="tech-options-header">
        <h3 style={{ color: currentTheme?.text || "#000" }}>
          Tech Options Management
        </h3>
        <button
          onClick={() => setIsAdding(true)}
          className="add-button"
          disabled={isLoading}
        >
          {isAdding ? 'Cancel' : 'Add New Option'}
        </button>
      </div>

      {message.text && (
        <div className={`message ${message.isError ? 'error' : 'success'}`}>
          {message.text}
        </div>
      )}

      {/* Add/Edit Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="tech-option-form">
          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., React, Node.js"
                required
              />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Optional description"
              rows={2}
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              Active
            </label>
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

      {/* Tech Options List */}
      <div className="tech-options-list">
        {isLoading && techOptions.length === 0 ? (
          // Show skeleton loader only on initial load
          <div className="loading-skeleton">
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="skeleton-item">
                <div className="skeleton-header">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-category"></div>
                </div>
                <div className="skeleton-description"></div>
                <div className="skeleton-actions">
                  <div className="skeleton-button"></div>
                  <div className="skeleton-button"></div>
                  <div className="skeleton-button"></div>
                </div>
              </div>
            ))}
          </div>
        ) : techOptions.length > 0 ? (
          // Show actual tech options
          techOptions.map(option => (
            <div key={option.id} className={`tech-option-item ${!option.isActive ? 'inactive' : ''}`}>
              <div className="option-info">
                <h4>{option.name}</h4>
                <span className="category">{option.category}</span>
                {option.description && (
                  <p className="description">{option.description}</p>
                )}
              </div>
              
              <div className="option-actions">
                <button
                  onClick={() => toggleActive(option.id, option.isActive)}
                  className={`toggle-button ${option.isActive ? 'active' : 'inactive'}`}
                  title={option.isActive ? 'Disable' : 'Enable'}
                >
                  {option.isActive ? '✓' : '✗'}
                </button>
                
                <button
                  onClick={() => handleEdit(option)}
                  className="edit-button"
                  disabled={isLoading}
                >
                  Edit
                </button>
                
                <button
                  onClick={() => handleDelete(option.id)}
                  className="delete-button"
                  disabled={isLoading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          // Show empty state
          <div className="empty-state">
            <p>No tech options found. Click &quot;Add New Option&quot; to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechOptionsManager;
