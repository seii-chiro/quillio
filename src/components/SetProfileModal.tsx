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
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user.value)

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file')
                return
            }

            // 5MB max
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Avatar size must be less than 5MB')
                return
            }

            setAvatarFile(file)

            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const uploadAvatar = async (file: File): Promise<string | null> => {
        if (!user?.id) {
            toast.error('User not authenticated')
            return null
        }

        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}-${Date.now()}.${fileExt}`
        const filePath = `private/${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file)

        if (uploadError) {
            toast.error(`Avatar upload failed: ${uploadError.message}`)
            return null
        }

        const { data, error: urlError } = await supabase.storage
            .from('avatars')
            .createSignedUrl(filePath, 60 * 60 * 24 * 365)

        if (urlError || !data) {
            toast.error(`Failed to generate avatar URL: ${urlError?.message}`)
            return null
        }

        return data.signedUrl
    }

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user?.id) return
        if (!userProfile.display_name?.trim()) {
            toast.error('Please enter a display name')
            return
        }

        setIsSubmitting(true)

        let avatarUrl = null

        if (avatarFile) {
            avatarUrl = await uploadAvatar(avatarFile)
            if (!avatarUrl) {
                setIsSubmitting(false)
                return
            }
        }

        const { error } = await supabase
            .from('profile')
            .insert([
                { display_name: userProfile.display_name, id: user?.id, avatar: avatarUrl },
            ])
            .select()

        setIsSubmitting(false)

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
                    <form onSubmit={handleFormSubmit} className="space-y-4">
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

                        <InputLabelGroup>
                            <label
                                htmlFor="avatar"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Upload Avatar (optional)
                            </label>
                            <input
                                type="file"
                                id="avatar"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-0 focus:border-black"
                            />
                            {avatarPreview && (
                                <div className="mt-2 flex items-center gap-3">
                                    <img src={avatarPreview} alt="Avatar preview" className="w-16 h-16 rounded-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAvatarFile(null)
                                            setAvatarPreview(null)
                                        }}
                                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </InputLabelGroup>

                        <FormSubmitButton disabled={isSubmitting}>
                            {isSubmitting ? 'Setting...' : 'Set'}
                        </FormSubmitButton>
                    </form>
                </div>
            </Modal>
        </>
    )
}

export default SetProfileModal