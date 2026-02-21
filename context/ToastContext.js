import React from "react";

const ToastContext = React.createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = React.useState({
    visible: false,
    message: "",
    type: "success",
  });
  const timerRef = React.useRef(null);

  const showToast = React.useCallback((message, type = "success") => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ visible: true, message, type });
    timerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, showToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be inside ToastProvider");
  return ctx.showToast;
}

export default ToastContext;
