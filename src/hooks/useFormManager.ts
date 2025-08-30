import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { clientApi } from "@/service/apiService";

export interface FormMessage {
  text: string;
  isError: boolean;
}

export interface FormState<T> {
  message: FormMessage;
  isEditing: boolean;
  currentItem: T | null;
  isLoading: boolean;
  items: T[];
  selectedItemId: string | null;
}

export interface FormActions<T> {
  handleEdit: (item: T) => void;
  handleCancel: () => void;
  handleDelete: (id: string) => void;
  handleCreateNew: () => void;
  handleSelectItem: (id: string) => void;
  onSubmit: (data: any) => Promise<void>;
  resetForm: () => void;
}

type ApiEndpoint = 'projects' | 'archiveProjects';

export function useFormManager<T extends { id: string; portfolioId?: string }>(
  apiEndpoint: ApiEndpoint,
  itemName: string
) {
  const [message, setMessage] = useState<FormMessage>({ text: "", isError: false });
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<T[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const { portfolioInfo } = useAuth();

  // Helper function to determine if fields should be disabled
  const isFieldDisabled = () => !isEditing && !!currentItem;

  // Get portfolio ID from user context or existing items
  const getPortfolioId = useCallback(async () => {
    // First try to get from user context (most reliable)
    if (portfolioInfo?.id) {
      return portfolioInfo.id;
    }

    // Fallback to existing items
    if (items.length > 0 && items[0].portfolioId) {
      return items[0].portfolioId;
    }

    // Last resort: try to get portfolio ID from user context via API
    try {
      const data = await clientApi.auth.checkRole();
      if (data.user.portfolio?.id) {
        return data.user.portfolio.id;
      }
    } catch (error) {
      console.error("Error fetching portfolio ID:", error);
    }

    return null;
  }, [portfolioInfo?.id, items]);

  // Fetch existing items data
  useEffect(() => {
    if (hasFetched.current) return;
    
    const fetchItems = async () => {
      try {
        const response = await clientApi[apiEndpoint].get();
        // Extract the items array from the API response
        // API returns { message, projects, portfolio } for projects endpoint
        // and { message, archiveProjects, portfolio } for archive-projects endpoint
        const itemsData = response.projects || response.archiveProjects || response;
        setItems(Array.isArray(itemsData) ? itemsData : []);
      } catch (error) {
        console.error(`Error fetching ${itemName}:`, error);
        setItems([]);
      } finally {
        hasFetched.current = true;
      }
    };

    fetchItems();
  }, [apiEndpoint, itemName]);

  // Function to refresh items data
  const refreshItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await clientApi[apiEndpoint].get();
      // Extract the items array from the API response
      const itemsData = response.projects || response.archiveProjects || response;
      setItems(Array.isArray(itemsData) ? itemsData : []);
    } catch (error) {
      console.error(`Error refreshing ${itemName}:`, error);
    } finally {
      setIsLoading(false);
    }
  }, [apiEndpoint, itemName]);

  const onSubmit = useCallback(async (data: any) => {
    setIsLoading(true);
    setMessage({ text: "", isError: false });

    const portfolioId = await getPortfolioId();
    if (!portfolioId) {
      setMessage({
        text: "No portfolio found. Please create a portfolio first.",
        isError: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      let result;

      if (isEditing && currentItem) {
        // Update existing item
        result = await clientApi[apiEndpoint].update(currentItem.id, data);
      } else {
        // Create new item
        result = await clientApi[apiEndpoint].create({ ...data, portfolioId });
      }

      if (result) {
        setMessage({
          text: isEditing
            ? `${itemName} updated successfully!`
            : `${itemName} created successfully!`,
          isError: false,
        });

        if (!isEditing) {
          // If creating new, reset form and refresh data
          setCurrentItem(null);
          setIsEditing(false);
          await refreshItems();
        } else {
          // After successful update, refresh items data and exit editing mode
          await refreshItems();
          setIsEditing(false);
        }
      } else {
        setMessage({
          text: `Failed to ${isEditing ? "update" : "create"} ${itemName}`,
          isError: true,
        });
      }
    } catch (error) {
      setMessage({
        text: `An error occurred while ${
          isEditing ? "updating" : "submitting"
        } the form`,
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentItem, getPortfolioId, isEditing, apiEndpoint, itemName, refreshItems]);

  const handleEdit = useCallback((item: T) => {
    setCurrentItem(item);
    setIsEditing(true);
    setMessage({ text: "", isError: false });
  }, []);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setCurrentItem(null);
    setMessage({ text: "", isError: false });
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (
      !confirm(
        `Are you sure you want to delete this ${itemName}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsLoading(true);
    setMessage({ text: "", isError: false });

    try {
      const result = await clientApi[apiEndpoint].delete(id);

      if (result) {
        setMessage({
          text: `${itemName} deleted successfully!`,
          isError: false,
        });

        // Reset form if we were editing this item
        if (currentItem && currentItem.id === id) {
          setCurrentItem(null);
          setIsEditing(false);
        }

        // Refresh data to ensure consistency
        await refreshItems();
      } else {
        setMessage({
          text: `Failed to delete ${itemName}`,
          isError: true,
        });
      }
    } catch (error) {
      setMessage({
        text: `An error occurred while deleting the ${itemName}`,
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentItem, apiEndpoint, itemName, refreshItems]);

  const handleCreateNew = useCallback(() => {
    setIsEditing(false);
    setCurrentItem(null);
    setMessage({ text: "", isError: false });
  }, []);

  const handleSelectItem = useCallback((id: string) => {
    setSelectedItemId(id);
    const item = items.find((item) => item.id === id);
    if (item) {
      setCurrentItem(item);
    }
  }, [items]);

  const resetForm = useCallback(() => {
    setIsEditing(false);
    setCurrentItem(null);
    setMessage({ text: "", isError: false });
  }, []);

  return {
    // State
    message,
    isEditing,
    currentItem,
    isLoading,
    items,
    selectedItemId,
    isFieldDisabled,
    
    // Actions
    handleEdit,
    handleCancel,
    handleDelete,
    handleCreateNew,
    handleSelectItem,
    onSubmit,
    resetForm,
    refreshItems,
    
    // Setters
    setMessage,
    setCurrentItem,
    setIsEditing,
    setItems,
  };
}
