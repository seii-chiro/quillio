import { useState } from "react";
import Modal from 'react-modal'
import { MdOutlineCancel } from "react-icons/md";
import type { BlogWithAuthor } from "../types/blogs";
import BlogForm from "./BlogForm";

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

type EditBlogModalBtnProps = {
    blog: BlogWithAuthor;
}

const EditBlogModalBtn = ({ blog }: EditBlogModalBtnProps) => {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const handleCloseModal = () => {
        setShowConfirmDialog(false);
    }

    return (
        <>
            <button
                className="px-3 py-1 bg-sky-600 text-white rounded hover:bg-sky-700 flex items-center gap-2"
                type="button"
                onClick={() => setShowConfirmDialog(true)}
            >
                Edit
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
                    <BlogForm title={blog.title} body={blog.body} only_me={blog.only_me} isEditing={true} id={blog.id} onClose={handleCloseModal} />
                </div>
            </Modal>
        </>
    )
}

export default EditBlogModalBtn