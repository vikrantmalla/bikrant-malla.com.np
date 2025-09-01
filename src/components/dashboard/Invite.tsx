import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useThemeStore } from "@/store/feature/themeStore";
import { Role } from "@/types/enum";
import "./Invite.scss";

const inviteSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  role: z.enum([Role.EDITOR, Role.VIEWER]),
});

type InviteFormData = z.infer<typeof inviteSchema>;

export const Invite = () => {
  const { isDarkTheme, themes } = useThemeStore();
  const currentTheme = isDarkTheme ? themes.dark : themes.light;
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean }>({
    text: "",
    isError: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      role: Role.EDITOR,
    },
  });

  const onSubmit = async (data: InviteFormData) => {
    setIsLoading(true);
    setMessage({ text: "", isError: false });

    try {
      const response = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({
          text: result.message || "Invitation sent successfully!",
          isError: false,
        });
        reset(); // Reset form on success
      } else {
        setMessage({
          text: `Error: ${result.error || "Failed to send invitation"}`,
          isError: true,
        });
      }
    } catch (error) {
      console.error("Invite error:", error);
      setMessage({ text: "Failed to send invitation", isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard__section">
      <h2
        className="dashboard__section-title"
        style={{ color: currentTheme?.text || "#000" }}
      >
        Invite Collaborator
      </h2>

      {message.text && (
        <div
          className={`dashboard__message ${
            message.isError
              ? "dashboard__message--error"
              : "dashboard__message--success"
          }`}
        >
          {message.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="dashboard__invite-form"
      >
        <div className="dashboard__form-group">
          <label htmlFor="invite-email" className="dashboard__form-label">
            Email Address
          </label>
          <input
            id="invite-email"
            type="email"
            {...register("email")}
            placeholder="Enter collaborator's email"
            className="dashboard__form-input"
          />
          {errors.email && (
            <span className="dashboard__form-error">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="dashboard__form-group">
          <label htmlFor="invite-role" className="dashboard__form-label">
            Role
          </label>
          <select
            id="invite-role"
            {...register("role")}
            className="dashboard__form-select"
          >
            <option value={Role.EDITOR}>Editor</option>
            <option value={Role.VIEWER}>Viewer</option>
          </select>
          {errors.role && (
            <span className="dashboard__form-error">{errors.role.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="dashboard__invite-btn"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Invitation"}
        </button>
      </form>
    </div>
  );
};
