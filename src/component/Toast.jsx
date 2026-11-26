import { useEffect } from "react";

function Toast({ message, clearToast }) {
    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => {
            clearToast();
        }, 3000);

        return () => clearTimeout(timer);
    }, [message, clearToast]);

    if (!message) return null;

    return (
        <div className="toast">
            <span>✓</span>
            {message}
            <button onClick={clearToast}>×</button>
        </div>
    );
}

export default Toast;