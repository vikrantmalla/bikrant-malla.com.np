import { useState, useEffect } from "react";
import { getProjectLimits, updateProjectLimits } from "@/app/dashboard/actions";
import "./ProjectLimitsConfig.scss";

interface ProjectLimits {
  maxWebProjects: number;
  maxDesignProjects: number;
  maxTotalProjects: number;
}

const ProjectLimitsConfig = () => {
  const [limits, setLimits] = useState<ProjectLimits | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean }>({ text: "", isError: false });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadLimits();
  }, []);

  const loadLimits = async () => {
    const result = await getProjectLimits();
    if (result.success) {
      setLimits(result.data);
    } else {
      setMessage({ text: "Failed to load project limits", isError: true });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", isError: false });

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await updateProjectLimits(formData);
      if (result.success) {
        setMessage({ text: "Project limits updated successfully!", isError: false });
        setLimits(result.data);
        setIsEditing(false);
      } else {
        setMessage({ text: `Error: ${result.error}`, isError: true });
      }
    } catch (error) {
      setMessage({ text: "Failed to update project limits", isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMessage({ text: "", isError: false });
    loadLimits(); // Reload original values
  };

  if (!limits) {
    return <div className="config-loading">Loading project limits...</div>;
  }

  return (
    <div className="project-limits-config">
      <div className="config-header">
        <h3>Project Limits Configuration</h3>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="config-edit-btn"
          >
            Edit Limits
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="config-form">
          <div className="config-grid">
            <div className="config-item">
              <label htmlFor="maxTotalProjects">Maximum Total Projects</label>
              <input
                type="number"
                id="maxTotalProjects"
                name="maxTotalProjects"
                defaultValue={limits.maxTotalProjects}
                min="1"
                max="50"
                required
                className="config-input"
              />
            </div>
            <div className="config-item">
              <label htmlFor="maxWebProjects">Maximum Web Projects</label>
              <input
                type="number"
                id="maxWebProjects"
                name="maxWebProjects"
                defaultValue={limits.maxWebProjects}
                min="1"
                max="25"
                required
                className="config-input"
              />
            </div>
            <div className="config-item">
              <label htmlFor="maxDesignProjects">Maximum Design Projects</label>
              <input
                type="number"
                id="maxDesignProjects"
                name="maxDesignProjects"
                defaultValue={limits.maxDesignProjects}
                min="1"
                max="25"
                required
                className="config-input"
              />
            </div>
          </div>
          
          <div className="config-actions">
            <button
              type="submit"
              className="config-save-btn"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="config-cancel-btn"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="config-display">
          <div className="config-grid">
            <div className="config-item">
              <span className="config-label">Maximum Total Projects:</span>
              <span className="config-value">{limits.maxTotalProjects}</span>
            </div>
            <div className="config-item">
              <span className="config-label">Maximum Web Projects:</span>
              <span className="config-value">{limits.maxWebProjects}</span>
            </div>
            <div className="config-item">
              <span className="config-label">Maximum Design Projects:</span>
              <span className="config-value">{limits.maxDesignProjects}</span>
            </div>
          </div>
        </div>
      )}

      {message.text && (
        <div className={`config-message ${message.isError ? 'config-message--error' : 'config-message--success'}`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default ProjectLimitsConfig;
