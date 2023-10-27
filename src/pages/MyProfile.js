import React, {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';

import avatar from './../assets/images/avatar.png';
import imageIcon from './../assets/images/image-add.png';
import {useUser} from "../contexts/UserContext";
import {useLoading} from "../contexts/LoadingContext";
import SimpleReactValidator from "simple-react-validator";
import {loginUser, resetPassword} from "../services/auth.service";
import {toast} from "react-toastify";
import {updateUserProfile} from "../services/user.service";
import {uploadImage} from "../services/file.service";
import ProfileSidebar from "../components/Home/ProfileSidebar";


function MyProfile(){
    const { loadingDispatch } = useLoading();
    const { user, getUserFromToken } = useUser();
    const [ formData, setFormData ] = useState({
        fname: '',
        lname: '',
        email: '',
        phone: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const inputRef = useRef();

    useEffect(() => {
        if (user != null) {
            setFormData({
                ...formData,
                fname: user.fname,
                lname: user.lname,
                email: user.email,
                phone: user.phone
            })
        }
    }, [user])

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        // Check file type
        if (file) {
            const fileType = file.type;
            if (!fileType.match('image/(png|jpeg|jpg)')) {
                // Invalid file type
                toast.error('Invalid file type. Only PNG, JPG, and JPEG files are allowed.');
                return;
            }

            // Check file size (limit to 3MB)
            const maxSize = 3 * 1024 * 1024; // 3MB in bytes
            if (file.size > maxSize) {
                // File size exceeds the limit
                toast.error('File size exceeds the limit (3MB).');
                return;
            }

            setSelectedFile(file);

            // Generate a preview of the selected image
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            setSelectedFile(null);
            setImagePreview(null);
        }
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
        setImagePreview(null);
    };

    const changeHandler = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
        validator.showMessages();
    };

    const [validator] = React.useState(new SimpleReactValidator({
        className: 'text-danger font-13'
    }));

    const submitUpdateProfileForm = async (e) => {
        e.preventDefault();
        if (validator.allValid()) {
            try {
                loadingDispatch({type: 'START_LOADING'});
                let avatarUrl = user.avatar ? user.avatar : null;
                // First upload the avatar image:
                if (selectedFile) {
                    try {
                        const uploadedImage = await uploadImage(selectedFile);
                        console.log('Uploaded Image:', uploadedImage);
                        avatarUrl = uploadedImage.imageUrl;
                    } catch (error) {
                        // Handle the error
                        console.error('Error uploading image:', error);
                        toast.error('Fail to upload image!');
                    }
                }

                // Then update user profile:
                await updateUserProfile({
                    fname: formData.fname,
                    lname: formData.lname,
                    email: formData.email,
                    phone: formData.phone,
                    avatar: avatarUrl
                });
                getUserFromToken();
                toast.success('Update profile success!');
            } catch (error) {
                toast.error('Fail updating profile!');
            } finally {
                loadingDispatch({type: 'STOP_LOADING'});
            }
        } else {
            toast.error('Input validation fail!');
        }
    };

    // RESET PASSWORD
    const [ resetPwFormData, setResetPwFormData ] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [passwordValidator] = React.useState(new SimpleReactValidator({
        className: 'text-danger font-13',
        messages: {
            in: 'The confirm password field does not match'
        },
    }));

    const passwordChangeHandler = (e) => {
        setResetPwFormData({...resetPwFormData, [e.target.name]: e.target.value});
        passwordValidator.showMessages();
    };

    const submitResetPasswordForm = async (e) => {
        e.preventDefault();
        if (passwordValidator.allValid()) {
            try {
                loadingDispatch({type: 'START_LOADING'});
                // Then update user profile:
                await resetPassword({
                    oldPassword: resetPwFormData.oldPassword,
                    newPassword: resetPwFormData.newPassword
                });
                toast.success('Reset password successfully!');
                setResetPwFormData({
                    oldPassword: '',
                    newPassword: ''
                })
            } catch (error) {
                toast.error('Fail to reset password!');
            } finally {
                loadingDispatch({type: 'STOP_LOADING'});
            }
        } else {
            toast.error('Input validation fail!');
        }
    };


    return(
        <>
            {user != null &&
             <div className="page-content bg-white">
                <div className="content-block">
                    <section className="content-inner bg-white">
                        <div className="container">
                            <div className="row">
                                <div className="col-xl-3 col-lg-4 m-b30">
                                    <ProfileSidebar user={user} />
                                </div>
                                <div className="col-xl-9 col-lg-8 m-b30">
                                    <div className="shop-bx shop-profile">
                                        <div className="shop-bx-title clearfix">
                                            <h5 className="text-uppercase">User Information</h5>
                                        </div>
                                        <form onSubmit={submitUpdateProfileForm} id="profile-update-form">
                                            <div className="row">
                                                {/*<div className="col-lg-6 col-md-6">*/}
                                                {/*    <div className="mb-3">*/}
                                                {/*        <label className="form-label">Avatar</label>*/}
                                                {/*        <input*/}
                                                {/*            type="file"*/}
                                                {/*            className="form-control"*/}
                                                {/*            onChange={handleFileChange}*/}
                                                {/*        />*/}
                                                {/*    </div>*/}
                                                {/*</div>*/}
                                                {/*<div className="col-lg-6 col-md-6">*/}
                                                {/*    <div className="mb-3">*/}
                                                {/*        {imagePreview && (*/}
                                                {/*            <img*/}
                                                {/*                src={imagePreview}*/}
                                                {/*                alt="Selected"*/}
                                                {/*                className="w-100px h-100px rounded-3 border border-primary p-1"*/}
                                                {/*                style={{objectFit: "cover"}}*/}
                                                {/*            />*/}
                                                {/*        )}*/}
                                                {/*    </div>*/}
                                                {/*</div>*/}
                                                <div className="mb-3">
                                                    <label className="form-label d-block">Avatar</label>
                                                    <div className="avatar-container">
                                                        {imagePreview ? (
                                                            <div className="avatar-preview">
                                                                <img
                                                                    src={imagePreview}
                                                                    alt="Selected"
                                                                    className="avatar-image img-thumbnail"
                                                                />
                                                                <div className="delete-icon" onClick={handleRemoveImage}>
                                                                    <i className="fas fa-times"></i>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <img
                                                                src={imageIcon}
                                                                alt="Avatar"
                                                                className="avatar-image img-thumbnail p-4"
                                                            />
                                                        )}
                                                        <div className="edit-icon" onClick={() => inputRef.current.click()}>
                                                            <i className="fas fa-edit"></i>
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        className="form-control visually-hidden"
                                                        onChange={handleFileChange}
                                                        ref={inputRef}
                                                    />
                                                </div>
                                                <div className="col-lg-6 col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label">First Name</label>
                                                        <input
                                                            type="text"
                                                            name="fname"
                                                            className="form-control"
                                                            value={formData.fname}
                                                            onChange={(e) => changeHandler(e)}
                                                        />
                                                        {validator.message('firstName', formData.fname, 'required')}
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label">Last Name</label>
                                                        <input
                                                            type="text"
                                                            name="lname"
                                                            className="form-control"
                                                            value={formData.lname}
                                                            onChange={(e) => changeHandler(e)}
                                                        />
                                                        {validator.message('lastName', formData.lname, 'required')}
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label">Email</label>
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            className="form-control"
                                                            value={formData.email}
                                                            onChange={(e) => changeHandler(e)}
                                                        />
                                                        {validator.message('email', formData.email, 'required|email')}
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label">Phone Number</label>
                                                        <input
                                                            type="text"
                                                            name="phone"
                                                            className="form-control"
                                                            value={formData.phone}
                                                            onChange={(e) => changeHandler(e)}
                                                        />
                                                        {validator.message('phone', formData.phone, 'phone')}
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                className="btn btn-primary btnhover mt-3"
                                                type="submit"
                                            >
                                                Submit
                                            </button>
                                        </form>


                                        <div className="shop-bx-title clearfix mt-5">
                                            <h5 className="text-uppercase">Change Password</h5>
                                        </div>
                                        <form onSubmit={submitResetPasswordForm}>
                                            <div className="row">
                                                <div className="col-lg-6 col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label">Old Password</label>
                                                        <input
                                                            type="password"
                                                            name="oldPassword"
                                                            className="form-control"
                                                            value={resetPwFormData.oldPassword}
                                                            onChange={(e) => passwordChangeHandler(e)}
                                                        />
                                                        {passwordValidator.message('oldPassword', resetPwFormData.oldPassword, 'required|min:8')}
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label">New Password</label>
                                                        <input
                                                            type="password"
                                                            name="newPassword"
                                                            className="form-control"
                                                            value={resetPwFormData.newPassword}
                                                            onChange={(e) => passwordChangeHandler(e)}
                                                        />
                                                        {passwordValidator.message('newPassword', resetPwFormData.newPassword, 'required|min:8')}
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label">Confirm New Password</label>
                                                        <input
                                                            type="password"
                                                            name="confirmPassword"
                                                            className="form-control"
                                                            value={resetPwFormData.confirmPassword}
                                                            onChange={(e) => passwordChangeHandler(e)}
                                                        />
                                                        {passwordValidator.message('confirmPassword', resetPwFormData.confirmPassword, `required|min:8|in:${resetPwFormData.newPassword}`)}
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                className="btn btn-primary btnhover mt-3"
                                                type="submit"
                                            >
                                                Submit
                                            </button>
                                        </form>


                                    </div>    
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
             </div>
            }
        </>
    )
}
export default MyProfile;