import { supabase } from "../supabaseClient";
import { toast } from "sonner";
import { useState } from "react";
import Modal from 'react-modal'
import type { ProfileInsert } from "../types/profile";
import InputLabelGroup from "./input-label-goup";
import StyledInput from "./styled-input";
import FormSubmitButton from "./styled-submit-btn";
import { useAppDispatch, useAppSelector } from "../hooks/store-hooks";
import { setUserHasProfile } from "../slice/userHasProfileSlice";


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

type SetProfileModalProps = {
    isOpen: boolean;
    onRequestClose: () => void;
}

const SetProfileModal = ({ isOpen, onRequestClose }: SetProfileModalProps) => {
    const [userProfile, setUserProfile] = useState<ProfileInsert>({ display_name: "" });
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user.value)

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user?.id) return

        const { error } = await supabase
            .from('profile')
            .insert([
                { display_name: userProfile.display_name, id: user?.id },
            ])
            .select()

        if (error) {
            toast.error(error.message);
            return
        }

        dispatch(setUserHasProfile(true));
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onRequestClose={onRequestClose}
                style={customStyles}
                contentLabel="Confirm logout"
            >
                <div className="space-y-4">
                    <form onSubmit={handleFormSubmit}>
                        <InputLabelGroup>
                            <label
                                htmlFor="display_name"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Set your display name so you can start writing your blogs!
                            </label>
                            <StyledInput
                                id="display_name"
                                placeholder="ex: johndoe"
                                value={userProfile.display_name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserProfile({ ...userProfile, display_name: e.target.value })}
                            />
                        </InputLabelGroup>

                        <FormSubmitButton>
                            Set
                        </FormSubmitButton>
                    </form>
                </div>
            </Modal>
        </>
    )
}

export default SetProfileModal