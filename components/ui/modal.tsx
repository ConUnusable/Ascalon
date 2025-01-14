import React from "react";
import ReactDOM from "react-dom";

const Modal = ({ children, onClose }: { children: React.ReactNode, onClose: () => void }) => {
    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>Close</button>
                {children}
            </div>
        </div>,
        document.body
    );
};

export default Modal;