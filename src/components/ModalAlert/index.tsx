import Modal from 'react-modal';

import './style.scss';

type ModalConfirmProps = {
    modalIsOpen: boolean,
    iconImg?: string,
    iconAlt?: string,
    modalTitle?: string,
    modalContent?: string,
    buttonConfirmText?: string,
    onConfirm: () => void,
    onCancel: () => void
}

Modal.setAppElement('#root');

export function ModalConfirm(props: ModalConfirmProps) {
    return (
        <Modal
            className='modal'
            isOpen={props.modalIsOpen}
            onAfterOpen={() => {}}
            onRequestClose={() => {}}
            contentLabel="Example Modal"
        >
            <img src={props.iconImg} alt={props.iconAlt ?? ''} />
            <h2>{props.modalTitle}</h2>
            <p>{props.modalContent}</p>
            <div>
                <button 
                    className='btn-cancel'
                    onClick={props.onCancel}
                >Cancelar</button>
                <button onClick={props.onConfirm}>{props.buttonConfirmText}</button>
            </div>
        </Modal>
    );
}