import React, { useEffect, useLayoutEffect, useState } from 'react';
import './ProfileStyle.scss'
import { useGlobalVariableContext } from '../../Context/GlobalVariableContext'
import CRUD from '../../Services/CRUD';

const Profile = ({margin}) => {
   
    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();
    const [profile, setProfile] = useState(null)
    const [editProfile, setEditProfile] = useState({
    })

    const k = async () => {
        if (globalVariables) {
            const result = globalVariables.GetData_Mode === 'sql' ?
                await CRUD.SQL_ExecuteQuery(`select * from Users where id=${globalVariables.userInfo.user.id?globalVariables.userInfo.user.id:1}`, globalVariables.urlBase_Server, false)
                : await CRUD.GetData(`${globalVariables.urlBase_DataBase}/Users?id=${globalVariables.userInfo.user.id?globalVariables.userInfo.user.id:1}`)
            if (result && result.length > 0) {
                setProfile(result[0])
            }
        }
    }

    useEffect(() => {
        k()
    }, [globalVariables])

    const handleEdit = (e) => {
        const fieldName = e.target.dataset.name;
        setEditProfile(prevEditProfile => ({
            ...prevEditProfile,
            [fieldName]: prevEditProfile.hasOwnProperty(fieldName) ? !prevEditProfile[fieldName] : true
        }));
    }

    const handleCancel = () => {
        k()
        setEditProfile({})
    }

    const handleChange = (e) => {
        setProfile(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleUpdate = async () => {
        globalVariables.GetData_Mode === 'sql' ?
            await CRUD.SQl_Update(profile.id, 'Users', globalVariables.urlBase_Server, profile)
            : await CRUD.AddEditData(profile.id, 'Users', globalVariables.urlBase_DataBase, 'edit', profile)
        handleCancel()
    }

    useEffect(() => {
        //  console.log(111, editProfile);
    }, [editProfile, profile])

    return <div className="profile-component" style={{margin:`${margin}`}}>
        {profile && (<div className="row gutters">
            <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
                <div className="card h-100">
                    <div className="card-body">
                        <div className="account-settings">
                            <div className="user-profile">
                                <div className="user-avatar">
                                    <img src={`${globalVariables.imageBasePath}/${profile.avatar}`} alt="Maxwell Admin" />
                                </div>
                                <br />
                                <h5 className="user-name">{profile.name}</h5>
                                <h6 className="user-email">{profile.email}</h6>
                                <br />
                            </div>
                            <div className="about ">
                                <div className="form-group ">
                                    <label className='parent-edit-icon'>
                                        <h5>About</h5>
                                        <i data-name="about" onClick={(e) => handleEdit(e)} className='fa fa-pencil edit-icon'></i>
                                    </label>
                                    {editProfile.about !== undefined && editProfile.about === true ?
                                        <textarea value={profile.about} name='about' onChange={(e) => handleChange(e)} className='text-about' rows={5} /> :
                                        <p>{profile.about}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
                <div className="card h-100">
                    <div className="card-body">
                        <div className="row gutters">
                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                <h6 className="mb-2 text-primary">Personal Details</h6>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                <div className="form-group ">
                                    <label className='parent-edit-icon' htmlFor="fullName">Full Name

                                        <i data-name='name' onClick={(e) => handleEdit(e)} className='fa fa-pencil edit-icon'></i>

                                    </label>
                                    {editProfile.name && editProfile.name === true ?
                                        <input value={profile.name} name='name' onChange={(e) => handleChange(e)} type="text" className="form-control" id="fullName" placeholder="Enter full name" /> :
                                        <p>{profile.name}</p>}
                                </div>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                <div className="form-group ">
                                    <label className='parent-edit-icon' htmlFor="eMail">Email
                                        <i data-name='email' onClick={(e) => handleEdit(e)} className='fa fa-pencil edit-icon'></i>
                                    </label>
                                    {editProfile.email && editProfile.email === true ?
                                        <input value={profile.email} name='email' onChange={(e) => handleChange(e)} type="email" className="form-control" id="eMail" placeholder="Enter email ID" /> :
                                        <p>{profile.email}</p>}
                                </div>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                <div className="form-group ">
                                    <label className='parent-edit-icon' htmlFor="phone">Phone
                                        <i data-name='phone' onClick={(e) => handleEdit(e)} className='fa fa-pencil edit-icon'></i>

                                    </label>
                                    {editProfile.phone && editProfile.phone === true ?
                                        <input value={profile.phone} name='phone' onChange={(e) => handleChange(e)} type="text" className="form-control" id="phone" placeholder="Enter phone number" /> :
                                        <p>{profile.phone}</p>}

                                </div>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                <div className="form-group ">
                                    <label className='parent-edit-icon' htmlFor="website">Website URL
                                        <i data-name='website' onClick={(e) => handleEdit(e)} className='fa fa-pencil edit-icon'></i>
                                    </label>
                                    {editProfile.website && editProfile.website === true ?
                                        <input value={profile.website} name='website' onChange={(e) => handleChange(e)} type="url" className="form-control" id="website" placeholder="Website url" /> :
                                        <p>{profile.website}</p>}

                                </div>
                            </div>
                        </div>
                        {/* <div className="row gutters">
                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                <h6 className="mt-3 mb-2 text-primary">Address</h6>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                <div className="form-group">
                                    <label htmlFor="Street">Street</label>
                                    <input type="name" className="form-control" id="Street" placeholder="Enter Street" />
                                </div>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                <div className="form-group">
                                    <label htmlFor="ciTy">City</label>
                                    <input type="name" className="form-control" id="ciTy" placeholder="Enter City" />
                                </div>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                <div className="form-group">
                                    <label htmlFor="sTate">State</label>
                                    <input type="text" className="form-control" id="sTate" placeholder="Enter State" />
                                </div>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                <div className="form-group">
                                    <label htmlFor="zIp">Zip Code</label>
                                    <input type="text" className="form-control" id="zIp" placeholder="Zip Code" />
                                </div>
                            </div>
                        </div> */}
                        <br />
                        <br />
                        <div className="row gutters">
                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                <div className="text-right">
                                    <button onClick={() => handleCancel()} type="button" id="submit" name="submit" className="btn btn-secondary">Cancel</button>
                                    <button disabled onClick={() => handleUpdate()} type="button" id="submit" name="submit" className="btn btn-primary btn-update">Update</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )}
    </div>


};

export default Profile;