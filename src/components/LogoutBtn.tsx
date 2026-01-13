import { IoMdLogOut } from "react-icons/io";
import { supabase } from "../supabaseClient";
import { toast } from "sonner";
import { useState } from "react";
import Modal from 'react-modal'
import { useNavigate } from "react-router";


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

const LogoutBtn = () => {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            toast.error(error.message);
            return
        }

        navigate('/login');
    }

    return (
        <>
            <button
                className="flex flex-col items-center cursor-pointer hover:text-red-600"
                type="button"
                onClick={() => setShowConfirmDialog(true)}
            >
                <IoMdLogOut size={24} />
            </button>
            <Modal
                isOpen={showConfirmDialog}
                onRequestClose={() => setShowConfirmDialog(false)}
                style={customStyles}
                contentLabel="Confirm logout"
            >
                <div className="space-y-4">
                    <p className="text-slate-700">Are you sure you want to log out?</p>

                    <div className="flex justify-end gap-3">
                        <button
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            onClick={handleLogout}
                        >
                            Yes, log out
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

export default LogoutBtn