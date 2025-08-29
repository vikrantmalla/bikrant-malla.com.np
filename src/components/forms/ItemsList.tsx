interface ItemsListProps<T> {
  items: T[];
  selectedItemId: string | null;
  onSelectItem: (id: string) => void;
  renderItem: (item: T) => React.ReactNode;
  title: string;
  itemName: string;
}

function ItemsList<T extends { id: string }>({
  items,
  selectedItemId,
  onSelectItem,
  renderItem,
  title,
  itemName,
}: ItemsListProps<T>) {
  // Safety check: ensure items is an array
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <div className="projects-list">
      <h3>{title}</h3>
      <div className="projects-grid">
        {items.map((item) => (
          <div
            key={item.id}
            className={`project-card ${
              selectedItemId === item.id ? "project-card--selected" : ""
            }`}
            onClick={() => onSelectItem(item.id)}
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ItemsList;
