import React, {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';

import avatar from './../assets/images/avatar.png';
import imageIcon from './../assets/images/image-add.png';
import {useUser} from "../contexts/UserContext";
import {useLoading} from "../contexts/LoadingContext";
import SimpleReactValidator from "simple-react-validator";
import {loginUser, resetPassword} from "../services/auth.service";
import {toast} from "react-toastify";
import {deleteUserAddress, postUserAddress, updateUserProfile} from "../services/user.service";
import {uploadImage} from "../services/file.service";
import ProfileSidebar from "../components/Home/ProfileSidebar";
import {Button, Collapse, Modal} from "react-bootstrap";
import {useProvinces} from "../contexts/ProvinceContext";
import Form from "react-bootstrap/Form";


function MyAddress(){
    const { loadingDispatch } = useLoading();
    const [accordion, setAccordion] = useState(false);
    const { user, getUserFromToken } = useUser();
    const { provinces } = useProvinces();

    const [selectedProvinceId, setSelectedProvinceId] = useState(null);
    const [selectedDistrictId, setSelectedDistrictId] = useState(null);
    const [address, setAddress] = useState('');
    const [showDeleteModals, setShowDeleteModals] = useState([]);

    const handleDeleteModalToggle = (index) => {
        const newShowDeleteModals = [...showDeleteModals];
        newShowDeleteModals[index] = !newShowDeleteModals[index];
        setShowDeleteModals(newShowDeleteModals);
    };

    const [validator] = React.useState(new SimpleReactValidator({
        className: 'text-danger font-13'
    }));

    const handleProvinceChange = (event) => {
        const selectedProvinceId = parseInt(event.target.value, 10);
        if (isNaN(selectedProvinceId)) {
            setSelectedProvinceId(null);
        } else {
            setSelectedProvinceId(selectedProvinceId);
        }
        setSelectedDistrictId(null); // Reset selected district when province changes
        validator.showMessages();
    };

    const handleDistrictChange = (event) => {
        const selectedDistrictId = parseInt(event.target.value, 10);
        if (isNaN(selectedDistrictId)) {
            setSelectedDistrictId(null);
        } else {
            setSelectedDistrictId(selectedDistrictId);
        }
        validator.showMessages();
    };

    const submitUserAddress = async (e) => {
        e.preventDefault();
        if (validator.allValid()) {
            try {
                loadingDispatch({type: 'START_LOADING'});
                await postUserAddress({
                    address: address,
                    districtId: selectedDistrictId,
                });
                getUserFromToken();
                setAddress('');
                setSelectedProvinceId(null);
                setSelectedDistrictId(null);
                setAccordion(false);
                toast.success('Added new address!');
            } catch (error) {
                toast.error('Fail to add new address!');
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
                                            <h5 className="text-uppercase">Manage addresses</h5>
                                        </div>
                                        <div className="row">
                                            <div className="col-12">
                                                {user.userAddresses.length > 0 ? user.userAddresses.map((address, index) =>
                                                        <div
                                                            className="d-flex justify-content-between align-items-center rounded-2 px-3 py-3 border mb-3"
                                                            key={address.id}
                                                        >
                                                            <div
                                                                className="d-flex justify-content-between align-items-center">
                                                                <i className="fas fa-map-marker-alt text-primary"></i>
                                                                <div className="ps-3">
                                                                    <div
                                                                        className="text-secondary fw-bold">{address.address}</div>
                                                                    <div className="text-secondary">
                                                                        {address.districtName}, {address.provinceName}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                {/*<button*/}
                                                                {/*    className="btn btn-primary m-r10"*/}
                                                                {/*    type="button"*/}
                                                                {/*    onClick={() => null}*/}
                                                                {/*>*/}
                                                                {/*    <i className="fas fa-edit"></i>*/}
                                                                {/*</button>*/}
                                                                <button
                                                                    className="btn btn-danger"
                                                                    type="button"
                                                                    onClick={() => handleDeleteModalToggle(index)}
                                                                >
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                                <DeleteConfirmModal
                                                                    show={showDeleteModals[index]}
                                                                    onHide={() => handleDeleteModalToggle(index)}
                                                                    userAddress={address}
                                                                    getUserFromToken={getUserFromToken}
                                                                />
                                                            </div>

                                                        </div>
                                                    )
                                                    :
                                                    <p>You don't have any saved address.</p>
                                                }
                                                <button
                                                    className="btn btn-outline-primary mt-2 mb-3" type="button"
                                                    onClick={() => setAccordion(!accordion)}
                                                >
                                                    Add New Address
                                                    {accordion
                                                        ? <i className="fas fa-minus m-l10"></i>
                                                        : <i className="fas fa-plus m-l10"></i>
                                                    }

                                                </button>
                                                <Collapse in={accordion}>
                                                    <form onSubmit={submitUserAddress}>
                                                        <div className="row">
                                                            <div className="form-group mb-3">
                                                                <input
                                                                    type="text"
                                                                    name="address"
                                                                    className="form-control"
                                                                    placeholder="Address"
                                                                    value={address}
                                                                    onChange={(e) => {
                                                                        setAddress(e.target.value);
                                                                        validator.showMessages()
                                                                    }}
                                                                />
                                                                {validator.message('address', address, 'required')}
                                                            </div>
                                                            <div className="form-group col-md-6 mb-3">
                                                                <Form.Select
                                                                    onChange={handleProvinceChange}
                                                                    value={selectedProvinceId}
                                                                >
                                                                    <option value="">Province</option>
                                                                    {provinces.map(province =>
                                                                        <option key={province.id} value={province.id}>
                                                                            {province.name}
                                                                        </option>
                                                                    )}
                                                                </Form.Select>
                                                                {validator.message('province', selectedProvinceId, 'required')}
                                                            </div>
                                                            <div className="form-group col-md-6 mb-3">
                                                                <Form.Select
                                                                    onChange={handleDistrictChange}
                                                                    value={selectedDistrictId}
                                                                >
                                                                    <option value="">District</option>
                                                                    {selectedProvinceId &&
                                                                        provinces.find((province) => province.id === selectedProvinceId).districts.map(district =>
                                                                            <option key={district.id} value={district.id}>
                                                                                {district.name}
                                                                            </option>
                                                                        )
                                                                    }
                                                                </Form.Select>
                                                                {validator.message('district', selectedDistrictId, 'required')}
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <Button
                                                                className="btn btn-primary btnhover"
                                                                type="submit"
                                                            >Submit</Button>
                                                        </div>
                                                    </form>
                                                </Collapse>
                                            </div>
                                        </div>
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
export default MyAddress;


function DeleteConfirmModal({show, onHide, userAddress, getUserFromToken}) {
    const { loadingDispatch } = useLoading();

    const handleDeleteUserAddress = async () => {
        try {
            loadingDispatch({type: 'START_LOADING'});
            await deleteUserAddress(userAddress.id);
            getUserFromToken();
            toast.success('Deleted address!');
        } catch (error) {
            toast.error('Fail to delete address!');
        } finally {
            loadingDispatch({type: 'STOP_LOADING'});
        }
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            contentClassName="border-0 rounded-2 shadow"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Are you sure ?
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-start align-items-center">
                    <i className="fas fa-map-marker-alt text-primary"></i>
                    <div className="ps-3">
                        <div
                            className="text-secondary fw-bold">{userAddress.address}</div>
                        <div className="text-secondary">
                            {userAddress.districtName}, {userAddress.provinceName}
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide}>Close</Button>
                <Button onClick={handleDeleteUserAddress} variant="danger">Delete</Button>
            </Modal.Footer>
        </Modal>
    );
}