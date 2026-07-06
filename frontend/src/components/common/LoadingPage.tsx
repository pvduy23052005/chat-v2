interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
}

function LoadingSpinner({ size = "medium", color = "primary" }: LoadingSpinnerProps) {
  const spinnerClass = size === "small" ? "spinner-border-sm" : "";
  return (
    <div className={`spinner-border ${spinnerClass} text-${color}`} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
}

interface LoadingPageProps {
  message?: string;
}

function LoadingPage({ message = "Đang tải..." }: LoadingPageProps) {
  return (
    <>
      {/* Phần CSS nhúng trực tiếp vào JSX */}
      <style dangerouslySetInnerHTML={{ __html: `
        .loading-fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .loading-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .loading-message {
          font-size: 16px;
          color: #4b5563;
          margin: 0;
          font-weight: 500;
          font-family: sans-serif;
        }
      `}} />

      {/* Phần HTML (JSX) */}
      <div className="loading-fullscreen">
        <div className="loading-content">
          <LoadingSpinner size="large" color="primary" />
          {message && <p className="loading-message">{message}</p>}
        </div>
      </div>
    </>
  );
}

export default LoadingPage;
