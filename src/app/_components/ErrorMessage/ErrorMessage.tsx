type ErrorMessageProps = {
  error: string | null;
};

const ErrorMessage = ({ error }: ErrorMessageProps) => {
  return error ? <p style={{ color: "red" }}>{error}</p> : null;
};

export default ErrorMessage;
