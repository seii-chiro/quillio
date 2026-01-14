import { supabase } from "../supabaseClient";
import { toast } from "sonner";
import { useState } from "react";
import Modal from 'react-modal'
import { IoTrashOutline } from "react-icons/io5";

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
        maxWidth: '28rem',
        width: 'min(90%, 28rem)',
        boxShadow: '0 10px 30px rgba(2,6,23,0.35)',
    },
};

type ConfirmDeleteBlogBtnProps = {
    blogId: number;
    onBlogDeleted?: (blogId: number) => void;
}

const ConfirmDeleteBlogBtn = ({ blogId, onBlogDeleted }: ConfirmDeleteBlogBtnProps) => {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const handleLogout = async () => {
        const { error } = await supabase
            .from('blogs')
            .delete()
            .eq('id', blogId)
            .select();

        if (error) {
            toast.error(error.message);
            return
        }

        setShowConfirmDialog(false);
        toast.success("Blog deleted successfully");

        if (onBlogDeleted) {
            onBlogDeleted(blogId)
        }
    }

    return (
        <>
            <button
                className="flex flex-col items-center cursor-pointer hover:text-red-600"
                type="button"
                onClick={() => setShowConfirmDialog(true)}
            >
                <IoTrashOutline className="text-red-600 hover:text-red-800 cursor-pointer" size={20} />
            </button>
            <Modal
                isOpen={showConfirmDialog}
                onRequestClose={() => setShowConfirmDialog(false)}
                style={customStyles}
                contentLabel="Confirm delete blog"
            >
                <div className="space-y-4">
                    <p className="text-slate-700">Are you sure you want to delete this blog?</p>

                    <div className="flex justify-end gap-3">
                        <button
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            onClick={handleLogout}
                        >
                            Yes, delete
                        </button>

                        <button
                            className="px-4 py-2 bg-slate-100 rounded-md hover:bg-slate-200"
                            onClick={() => setShowConfirmDialog(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default ConfirmDeleteBlogBtn