interface ItemsListProps<T> {
  items: T[];
  selectedItemId: string | null;
  onSelectItem: (id: string) => void;
  renderItem: (item: T) => React.ReactNode;
  title: string;
  itemName: string;
  isLoading?: boolean;
}

function ItemsList<T extends { id: string }>({
  items,
  selectedItemId,
  onSelectItem,
  renderItem,
  title,
  itemName,
  isLoading = false,
}: ItemsListProps<T>) {
  // Show loading state
  if (isLoading) {
    return (
      <div className="projects-list">
        <h3>{title}</h3>
        <div className="projects-grid">
          {[1, 2, 3].map((index) => {
            return (
              <div
                key={`loading-${index}`}
                className="project-card project-card--loading"
              >
                <div className="loading-skeleton">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text"></div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="loading-message">
          <p>Loading {itemName.toLowerCase()}...</p>
        </div>
      </div>
    );
  }

  // Safety check: ensure items is an array
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="projects-list">
        <h3>{title}</h3>
        <div className="projects-grid">
          <div className="project-card project-card--empty">
            <p>No {itemName.toLowerCase()} found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-list">
      <h3>{title}</h3>
      <div className="projects-grid">
        {items.map((item) => {
          return (
            <div
              key={item.id}
              className={`project-card ${
                selectedItemId === item.id ? "project-card--selected" : ""
              }`}
              onClick={() => onSelectItem(item.id)}
            >
              {renderItem(item)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ItemsList;
