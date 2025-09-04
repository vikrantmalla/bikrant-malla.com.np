import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { clientApi } from "@/service/apiService";

export interface FormMessage {
  text: string;
  isError: boolean;
}

type ApiEndpoint = 'portfolio' | 'projects' | 'archiveProjects';

export function useSingleItemFormManager<T extends { id: string }>(
  apiEndpoint: ApiEndpoint,
  itemName: string
) {
  const [message, setMessage] = useState<FormMessage>({ text: "", isError: false });
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const hasFetched = useRef(false);

  const { portfolioInfo } = useAuth();

  // Helper function to determine if fields should be disabled
  const isFieldDisabled = () => !isEditing && !!currentItem;

  // Fetch existing item data
  useEffect(() => {
    if (hasFetched.current) return;
    
    const fetchItem = async () => {
      try {
        const itemData = await (clientApi[apiEndpoint] as any).get();
        // Extract the actual item data from the API response
        // API responses might have different structures, so we need to handle them properly
        const actualItem = (itemData as any).project || (itemData as any).archiveProject || (itemData as any).portfolio || itemData;
        setCurrentItem(actualItem as T);
      } catch (error) {
        console.error(`Error fetching ${itemName}:`, error);
      } finally {
        hasFetched.current = true;
      }
    };

    fetchItem();
  }, [apiEndpoint, itemName]);

  const onSubmit = useCallback(async (data: any) => {
    setIsLoading(true);
    setMessage({ text: "", isError: false });

    try {
      let result;

      if (isEditing && currentItem) {
        // Update existing item
        result = await (clientApi[apiEndpoint] as any).update(currentItem.id, data);
      } else {
        // Create new item
        result = await (clientApi[apiEndpoint] as any).create(data);
      }

      if (result) {
        setMessage({
          text: isEditing
            ? `${itemName} updated successfully!`
            : `${itemName} created successfully!`,
          isError: false,
        });

        if (!isEditing) {
          // If creating new, reset form
          setCurrentItem(null);
          setIsEditing(false);
        } else {
          // After successful update, refresh item data and exit editing mode
          try {
            const itemData = await (clientApi[apiEndpoint] as any).get();
            // Extract the actual item data from the API response, similar to initial fetch
            const actualItem = (itemData as any).project || (itemData as any).archiveProject || (itemData as any).portfolio || itemData;
            setCurrentItem(actualItem as T);
            setIsEditing(false); // Exit editing mode after successful update
          } catch (error) {
            console.error(`Error refreshing ${itemName}:`, error);
            setIsEditing(false); // Still exit editing mode even if refresh fails
          }
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
  }, [currentItem, isEditing, apiEndpoint, itemName]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setMessage({ text: "", isError: false });
  }, []);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setMessage({ text: "", isError: false });
  }, []);

  const handleDelete = useCallback(async () => {
    if (!currentItem) return;

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
      // The type definition for clientApi[apiEndpoint] is currently missing the 'delete' method.
      // We assert its type to include 'delete' as it's expected to exist for this operation,
      // based on the usage of `currentItem.id` and the intent to delete.
      const client = clientApi[apiEndpoint] as unknown as { delete: (id: string) => Promise<any> };
      const result = await client.delete(currentItem.id);

      if (result) {
        setMessage({ text: `${itemName} deleted successfully!`, isError: false });
        setCurrentItem(null);
        setIsEditing(false);
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
  }, [currentItem, apiEndpoint, itemName]);

  const handleCreateNew = useCallback(() => {
    setIsEditing(false);
    setCurrentItem(null);
    setMessage({ text: "", isError: false });
  }, []);

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
    isFieldDisabled,
    
    // Actions
    handleEdit,
    handleCancel,
    handleDelete,
    handleCreateNew,
    onSubmit,
    resetForm,
    
    // Setters
    setMessage,
    setCurrentItem,
    setIsEditing,
  };
}
