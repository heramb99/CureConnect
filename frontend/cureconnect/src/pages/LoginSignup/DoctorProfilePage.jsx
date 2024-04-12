import React, { useState, useEffect } from 'react';
import {  useNavigate } from "react-router-dom";
import { auth, storage } from '../Authentication/firebase';
import { updatePassword } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import PatientNavbar from "../../Components/PatientNavbar";
import PatientFooter from "../../Components/PatientFooter";
import '../../pages/css/ProfilePageStyle.css';
import '../../pages/css/Imageupload.css';
import getUserDetails from '../../service/userService';
import updateProfile from '../../service/userService';
import getBookingDetails from '../../service/userService';
import countMonthAppointment from '../PatientDashboard/PatientBookings';
import { ToastContainer, toast } from 'react-toastify';
import {deleteUserAccount} from '../Authentication/Auth';
import profileImage from '../../assets/profileImage.jpg';
import DoctorNavbar from '../../Components/DoctorNavbar';
import DoctorFooter from '../../Components/DoctorFooter';
import doctorService from "../../service/doctorService";


export const DoctorProfilePage = () => {

    const [imageUpload, setImageUpload] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [token, authToken] = useState('');
    var userId;
    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        id: '',
        userRole: '',
        userName: '',
        birthdate: '',
        email: '',
        number: '',
        address: '',
        gender: '',
        city: '',
        country: '',
        profilePicture: ''
    });

    const [newPassword, setNewPassword] = useState({
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {

        const fetchUserDetails = async () => {

            const userDataString = localStorage.getItem("userInfo");

            const userData = JSON.parse(userDataString);

            // Check if user is loged in or not
            if (!userData || !userData.id || !userData.token || !userData.role || userData.role != 'doctor') {
                return navigate("/user/Login");
            }

            userId = userData.id;
            formData.id = userId;
            formData.userRole = userData.role;
            authToken(userData.token);

            try {
                const details = await doctorService.fetchDoctorDetails(userId, userData.token);

                if (details === null || details === undefined) {
                    navigate('/user/login');
                } else {

                    setFormData(details);

                }

            } catch (error) {
                console.error('Error from profile page:', error);
                navigate('/user/login');
            }
        };

        fetchUserDetails();

    }, []);

    const handlePasswordUpdate = async () => {

        const user = auth.currentUser;

        if (user) {
            updatePassword(user, newPassword.password).then(() => {
                toast.success("Password updated Succesfully !!");
            }).catch((error) => {
            });
        }
    };


    const handleValidation = () => {

        const nameRegex = /^[a-zA-Z]+( [a-zA-Z]+)*$/;
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;<>,.?~\-]).{8,}$/;
        const mobileRegex = /^\d{10}$/;
        const postcodeRegex = /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i;

        if (newPassword.password) {

            if (!passRegex.test(newPassword.password)) {
                toast.error("Password must be at least 8 characters long and contain at least one lowercase letter, uppercase letter, number, and special character !");
                return false;
            }

            if (!newPassword.confirmPassword || newPassword.confirmPassword === 0 || (newPassword.password != newPassword.confirmPassword)) {
                toast.error("Confirm Password should be same !");
                return false;
            }
        }

        return true;
    }

    const handleClick = async (e) => {

        e.preventDefault();

        if (imageUpload != null) {
            toast.success('User Details are updated !!');
        } else {
            try {
                if (((newPassword.password.length === 0) || !newPassword.password)) {
                    toast.error('Nothing to update !!');
                } else if ((newPassword.password)) {
                    if (handleValidation) {
                        handlePasswordUpdate();
                    }
                }
            } catch (e) {
                toast.error('Unable to update the data');
            }
        }
    }

    const handleLogout = async (e) => {
        e.preventDefault();

        try {
            toast.success('Logout Successful');
            localStorage.clear();
            setTimeout(() => {
                navigate("/user/Login");
            }, 500);
        } catch (error) {
            toast.error('Error to log out user');
        }
    }

    return (
        <>
            <DoctorNavbar location={""} />
            <div className="w-full overflow-auto bg-primaryColor">
                <div className='BoxWrapper bg-backgroundColor p-1/2'>
                    <div className='profileWrapper flex flex-col md:flex-row gap-4  bg-backgroundColor'>
                        <div className='w-full md:w-1/3  bg-backgroundColor p-6 border-r'>
                            <div className="flex flex-col items-center text-center">
                                <div className="ImageUploadcontainer">
                                    <div className="avatar-upload">
                                        <div className="avatar-preview">
                                            {formData.profileUrl ? (
                                                <img src={formData.profileUrl} alt="Uploaded" className="imageStyle object-cover rounded-[50%] w-[200px] h-[200px] bg-no-repeat" />
                                            ) : (
                                                <img src={formData.profileUrl} alt="Doctor Logo" className="imageStyle object-cover rounded-[50%] w-[200px] h-[200px] bg-no-repeat" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <h2 className="text-lg font-semibold" id='userName'>{formData.userName ? formData.userName : 'User Name'}</h2>
                                <h2 className="text-lg font-semibold" id='userRole'>{formData.userRole ? formData.userRole : ''}</h2>
                            </div>
                            < br />
                            < br />
                        </div>

                        <div className='w-full md:w-2/3 bg-backgroundColor p-6'>
                            <form className="w-full">
                                <div className='flex justify-between'>
                                    <div className='divContainer flex sm:flex-row w-full flex-col'>

                                        <div className='flex flex-col w-full sm:p-3 p-1' >
                                            <div className="flex flex-col md:col-span-1 mb-2">
                                                <label className="text-sm font-medium leading-none mb-2">
                                                    User Name
                                                </label>
                                                <input id="userName" className="border border-black rounded-md py-2 px-3 outline-none"
                                                    placeholder={formData.userName ? formData.userName : 'User Name'}
                                                    value={formData.userName || ''} disabled  />
                                            </div>
                                            <div className="flex flex-col md:col-span-1 mb-2">
                                                <label htmlFor="gender" className="text-sm font-medium leading-none mb-2">
                                                    Gender
                                                </label>
                                                <input id="gender" className="border border-black rounded-md py-2 px-3 outline-none"
                                                    placeholder={formData.gender ? formData.gender : 'User Name'}
                                                    value={formData.gender || ''} disabled  />
                                            </div>
                                            <div className="flex flex-col md:col-span-1 mb-2">
                                                <label className="text-sm font-medium leading-none mb-2" htmlFor="phone">
                                                    Phone Number
                                                </label>
                                                <input id="number" className="border border-black rounded-md py-2 px-3 outline-none"
                                                    placeholder={formData.number ? formData.number : '9090909090'}
                                                    value={formData.number || ''} disabled  />
                                            </div>
                                        </div>
                                        <div className='flex flex-col w-full sm:p-3 p-1'>
                                            <div className="flex flex-col md:col-span-1 mb-2">
                                                <label className="text-sm font-medium leading-none mb-2" htmlFor="email">
                                                    Email Address
                                                </label>
                                                <input id="email" className="border border-black rounded-md py-2 px-3 outline-none" readOnly
                                                    placeholder={formData.email ? formData.email : 'example@email.com'}
                                                    value={formData.email || ''} disabled />
                                            </div>
                                            <div className="flex flex-col md:col-span-1 mb-2">
                                                <label className="text-sm font-medium leading-none mb-2" htmlFor="password">
                                                    Password
                                                </label>
                                                <input type="password" id="password" className="border border-black rounded-md py-2 px-3 outline-none"
                                                    value={newPassword.password}
                                                    onChange={(e) => setNewPassword({
                                                        ...newPassword,
                                                        [e.target.id]: e.target.value,
                                                    })} />
                                            </div>
                                            <div className="flex flex-col md:col-span-1 mb-2">
                                                <label className="text-sm font-medium leading-none mb-2" htmlFor="confirmPassword">
                                                    Confirm Password
                                                </label>
                                                <input type="password" id="confirmPassword"
                                                    className="border border-black rounded-md py-2 px-3 outline-none"
                                                    value={newPassword.confirmPassword}
                                                    onChange={(e) => setNewPassword({
                                                        ...newPassword,
                                                        [e.target.id]: e.target.value,
                                                    })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-col w-full sm:p-3 p-1 sm:-mt-4 -mt-2'>
                                    <div className="flex flex-col md:col-span-2 mb-2">
                                        <label className="text-sm font-medium leading-none mb-2" htmlFor="education">
                                            Education
                                        </label>
                                        <input id="education" className="border border-black rounded-md py-2 px-3 outline-none"
                                            placeholder={formData.educationDetails ? formData.educationDetails : 'NA'}
                                            value={formData.educationDetails || ''}  disabled/>
                                    </div>

                                    <div className="flex flex-col md:col-span-2 mb-2">
                                        <label className="text-sm font-medium leading-none mb-2" htmlFor="specialization">
                                            Specialization
                                        </label>
                                        <input
                                            id="specialization"
                                            className="border border-black rounded-md py-2 px-3 outline-none"
                                            placeholder={formData.specialization ? formData.specialization : 'NA'}
                                            value={formData.specialization || ''} disabled/>
                                    </div>
                                    <div className="flex flex-col md:col-span-2 mb-2">
                                        <label className="text-sm font-medium leading-none mb-2" htmlFor="experience">
                                            Experience
                                        </label>
                                        <input
                                            id="experience"
                                            className="border border-black rounded-md py-2 px-3 outline-none"
                                            placeholder={formData.experience ? formData.experience : 'NA'}
                                            value={formData.experience + ' Years' || ''} disabled/>
                                    </div>
                                    <div className="flex flex-col md:col-span-2 mb-2">
                                        <label className="text-sm font-medium leading-none mb-2" htmlFor="description">
                                            Description
                                        </label>
                                        <input
                                            id="description"
                                            className="border border-black rounded-md py-2 px-3 outline-none"
                                            placeholder={formData.description ? formData.description : 'NA'}
                                            value={formData.description || ''} disabled/>
                                    </div>
                                </div>
                                <div className='flex justify-center sm:flex-row w-full flex-col items-center'>
                                    <div className="col-span-2 sm:p-3 p-1">
                                        <button
                                            className='relative px-8 py-2 rounded-md bg-secondaryColor isolation-auto z-10 border-2 bg-secondaryColor before:absolute before:w-full 
                                        before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full 
                                        before:bg-teal-600 before:-z-10 before:aspect-square 
                                        before:hover:scale-150 overflow-hidden 
                                        text-white hover:text-white'
                                            onClick={handleClick}>
                                            Update Password
                                        </button>
                                    </div>
                                    <div className="col-span-2 sm:p-3 p-1">
                                        <button
                                            className='relative px-8 py-2 rounded-md bg-red-500 isolation-auto z-10 border-2 border-red-600 before:absolute before:w-full 
                                       before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full 
                                       before:bg-red-600 before:-z-10 before:aspect-square 
                                       before:hover:scale-150 overflow-hidden 
                                       text-white hover:text-white'
                                            onClick={handleLogout}>
                                            Log Out
                                        </button>
                                    </div>
                                </div>
                                <ToastContainer />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <DoctorFooter />
        </>
    )
}