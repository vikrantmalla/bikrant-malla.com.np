import { FormMessage as FormMessageType } from "@/hooks/useFormManager";

interface FormMessageProps {
  message: FormMessageType;
}

const FormMessage: React.FC<FormMessageProps> = ({ message }) => {
  if (!message.text) return null;

  return (
    <div
      className={`form-message ${
        message.isError ? "form-message--error" : "form-message--success"
      }`}
    >
      {message.text}
    </div>
  );
};

export default FormMessage;
