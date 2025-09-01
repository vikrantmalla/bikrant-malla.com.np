import { FaPlus, FaEdit, FaTrash, FaSync } from "react-icons/fa";

interface FormHeaderProps {
  title: string;
  isEditing: boolean;
  hasCurrentItem: boolean;
  isLoading: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onCreateNew: () => void;
  onRefresh?: () => void;
  itemName: string;
}

const FormHeader: React.FC<FormHeaderProps> = ({
  title,
  isEditing,
  hasCurrentItem,
  isLoading,
  onEdit,
  onDelete,
  onCreateNew,
  onRefresh,
  itemName,
}) => {
  return (
    <div className="form-header">
      <h1 className="form-title">{title}</h1>

      <div className="form-actions">
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="form-button form-button--secondary"
            disabled={isLoading}
            title={`Refresh ${itemName} List`}
          >
            <FaSync className={isLoading ? "fa-spin" : ""} />
          </button>
        )}
        
        {/* Show Edit/Delete buttons when viewing existing item */}
        {hasCurrentItem && !isEditing && (
          <>
            <button
              type="button"
              onClick={onEdit}
              className="form-button form-button--secondary"
              title={`Edit ${itemName}`}
            >
              <FaEdit />
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="form-button form-button--danger"
              disabled={isLoading}
              title={`Delete ${itemName}`}
            >
              <FaTrash />
            </button>
          </>
        )}
        
        {/* Only show Create New button when NOT editing existing item */}
        {!isEditing && (
          <button
            type="button"
            onClick={onCreateNew}
            className="form-button form-button--secondary"
            title={`Create New ${itemName}`}
          >
            <FaPlus />
          </button>
        )}
      </div>
    </div>
  );
};

export default FormHeader;
