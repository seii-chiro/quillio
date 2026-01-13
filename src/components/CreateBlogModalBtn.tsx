import { useState } from "react";
import Modal from 'react-modal'
import CreateBlog from "./BlogForm";
import { MdOutlineCancel } from "react-icons/md";
import { RiQuillPenAiLine } from "react-icons/ri";

Modal.setAppElement('#root')

const customStyles: Modal.Styles = {
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.45)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        position: 'relative',
        inset: 'auto',
        padding: '1rem',
        borderRadius: '0.5rem',
        border: 'none',
        maxWidth: '40rem',
        width: 'min(90%, 40rem)',
        boxShadow: '0 10px 30px rgba(2,6,23,0.35)',
    },
};

const CreateBlogModalBtn = () => {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const handleCloseModal = () => {
        setShowConfirmDialog(false);
    }

    return (
        <>
            <button
                className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 flex items-center gap-2"
                type="button"
                onClick={() => setShowConfirmDialog(true)}
            >
                <RiQuillPenAiLine />
                Create New Blog
            </button>
            <Modal
                isOpen={showConfirmDialog}
                onRequestClose={() => setShowConfirmDialog(false)}
                style={customStyles}
                contentLabel="Confirm logout"
            >
                <div className="w-full">
                    <div className="w-full flex justify-end mb-3">
                        <button
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => setShowConfirmDialog(false)}
                        >
                            <MdOutlineCancel size={24} className="hover:text-red-600" />
                        </button>
                    </div>
                    <CreateBlog onClose={handleCloseModal} />
                </div>
            </Modal>
        </>
    )
}

export default CreateBlogModalBtn