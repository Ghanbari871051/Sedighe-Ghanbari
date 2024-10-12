import React from 'react';
import './ModalStyle.scss'

function Modal({ showModal, onClose, children }) {
    if (!showModal) return null;

    return (
        <div className="modal-component">
            <div className='my_modal'>
                <div className="my_modal-content">
                    <i onClick={() => onClose()} className='fa fa-close close'></i>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;
