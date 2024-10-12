

import React, { useEffect, useLayoutEffect, useState } from 'react';
import "./LoginHtmlStyle.scss";
import { useGlobalVariableContext } from '../../Context/GlobalVariableContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import EmailSenderFunction from '../EmailSender/EmailSenderFunction'
import CRUD from '../../Services/CRUD';


function LoginHtml({ ShowForPortfolio }) {
    console.log(100);
    const { globalVariables, updateGlobalVariables } = useGlobalVariableContext();

    const fetchtoken = async (username, password) => {
        return Promise.all([
            globalVariables.GetData_Mode === 'sql' ?
                await CRUD.SQL_ExecuteQuery(`select * from Users where username='${username ? username : -1}' and password='${password}'`, globalVariables.urlBase_Server, false)
                : await CRUD.GetData(`${globalVariables.urlBase_DataBase}/Users?username=${username ? username : -1}&&passsword=${password}`),
        ]).then(([user]) => {
            if (user) {
                const token = user.token
                // return res.json({ success: true, data: token });
                return ({
                    success: true,
                    data: token,  // Replace 'token' with the actual token value
                })
            }
            else {
                //return res.status(401).json({ success: false, message: 'Invalid username or password' });
                return ({
                    success: false,
                    data: 'username or password is wrong',
                });
            }
        })
    }



    //get user info by token
    const fetchCurrentUserInfo = async (token) => {
        console.log(700, token);
        return Promise.all([
            globalVariables.GetData_Mode === 'sql' ?
                await CRUD.SQL_ExecuteQuery(`select * from Users where token='${token ? token === undefined ? '' : token : ''}'`, globalVariables.urlBase_Server, false)
                : await CRUD.GetData(`${globalVariables.urlBase_DataBase}/Users?token=${token}`),
        ]).then(([user]) => {
            if (user) {
                return ({
                    success: true,
                    data: user
                })
            }
            else {
                return ({
                    success: false,
                    error: "token is not valid"
                })
            }
        })
    }

    const [active, setActive] = useState('') //Determine signIn showen or signUp
    const [token, setToken] = useState(null)
    const [newToken, setNewToken] = useState(null)
    const [errorMassage, setErrorMassage] = useState('')


    const [registerClicked, setRegisterClicked] = useState(false)

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        confirmPassword: '',
        email: '',
        newsletter: false,
        agree: false
    });


    //for show validation
    const [lastCurrendField, setLastCurrendField] = useState({
        last: '',
        current: '',
    });


    useEffect(() => {
        //in Sign Up
        if (active !== '') {
            validateForm()
        }
    }, [lastCurrendField, formData, registerClicked])


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (e.type === 'change'  /*event onchange*/) {
            setFormData({
                ...formData,
                [name]:
                    e.target.name === 'newsletter' ? !formData.newsletter :
                        e.target.name === 'agree' ? !formData.agree :
                            value
            });
        }

        if (e.target.name !== lastCurrendField.current && active !== ''/*Sign Up*/) {
            setLastCurrendField({
                ...lastCurrendField,
                last: lastCurrendField.current === '' ? e.target.name : lastCurrendField.current,
                current: e.target.name
            })
        }
        if (active !== ''/*Sign Up*/) {
            validateForm()
        }

    };


    const [errors, setErrors] = useState({});
    const [showErrors, setShowErrors] = useState({});

    const validationRules = {
        username: {
            required: true,
            show: false
        },
        name: {
            required: true,
            show: false
        },
        email: {
            required: true,
            pattern: /^\S+@\S+\.\S+$/,
            show: false
        },
        password: {
            required: true,
            minLength: 6,
            show: false
        },
        // confirmPassword: {
        //     required: true,
        //     match: true,
        //     show: false

        // },
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = {};

        for (const field in validationRules) {
            if (lastCurrendField.last === field && lastCurrendField.last !== lastCurrendField.current) {
                setShowErrors({
                    ...showErrors,
                    [`${field}show`]: true
                })
                // validationRules[`${field}show`] = true
            }

            if (validationRules[field].required && (formData[field] === '' || formData[field] === false)) {
                //  newErrors[field] === undefined ?
                newErrors[field] = '*' //:
                //   newErrors[field] = '\n' + '*'
                valid = false;
            }
            if (validationRules[field].minLength && formData[field] !== '' && formData[field].length < validationRules[field].minLength) {
                newErrors[field] === undefined ?
                    newErrors[field] = `${field} must be at least ${validationRules[field].minLength} characters` :
                    newErrors[field] += '\n' + `${field} must be at least ${validationRules[field].minLength} characters`

                valid = false;
            }

            if (validationRules[field].pattern && formData[field] !== '' && !validationRules[field].pattern.test(formData[field])
                && formData[field] !== '') {
                newErrors[field] === undefined ?
                    newErrors[field] = `Invalid ${field} format` :
                    newErrors[field] += '\n' + `Invalid ${field} format`
                valid = false;
            }

            if (validationRules[field].match && formData[field] !== '') {
                //     console.log(222);
                if (formData.password !== formData.confirmPassword) {
                    newErrors[field] === undefined ?
                        newErrors[field] = 'password is not match with confirmPassword' :
                        newErrors[field] += '\n' + 'password is not match with confirmPassword'
                    valid = false;
                }
            }


        }
        if (registerClicked === true) {
            const newErrors2 = {};
            for (const field in validationRules) {
                newErrors2[`${field}show`] = true
            }
            setShowErrors(newErrors2)
        }
        setErrors(newErrors);
        return valid;
    };



    const handleSignInUP = () => {
        if (active === '') {
            setActive('active')
        }
        else {
            setActive('')
        }
    }

    const handleSignIn = (e) => {

        setErrorMassage('')
        e.preventDefault()
        fetchtoken(formData.username, formData.password)
            .then(({ success, data }) => {
                if (success) {
                    setToken(data)
                    localStorage.setItem('token', data)
                    // console.log(username, password, data);
                }
                else {
                    setErrorMassage('Invalid username or password')
                    //    console.log(88, errorMassage);
                }
            })
    }

    const createNewToken = async () => {
        const generatedToken = `token_${Math.random().toString(36).substring(7)}`;
        setNewToken(generatedToken);
        return generatedToken;
    }

    const handleSignUp = async (e) => {
        e.preventDefault()
        setRegisterClicked(true)
        if (validateForm()) {

            //  console.log(111);
            let flag = true
            const newErrors = {}
            //check email and username not exist
            const users = await CRUD.GetData(`${globalVariables.urlBase_DataBase}/Users`)

            const user_username = users.find(u => u.username === formData.username);
            if (user_username) {
                flag = false
                newErrors['username'] = 'Username is registered Before' //:
                setShowErrors({
                    ...showErrors,
                    ['usernameshow']: true
                })
            }

            const user_email = users.find(u => u.email === formData.email);
            if (user_email) {
                flag = false
                newErrors['email'] = 'email is registered Before' //:
                setShowErrors({
                    ...showErrors,
                    ['emailshow']: true
                })
            }
            //    console.log(89, flag, newErrors);
            if (flag === false) {
                setErrors(newErrors)

            }
            if (flag === true) {
                //     console.log(7, newToken);

                const updatedToken = await createNewToken();
                //     console.log(8, updatedToken);



                const item = {
                    "username": formData.username,
                    "password": formData.password,
                    "email": formData.email,
                    "name": formData.name,
                    "avatar": "img_avatar.png",
                    "token": updatedToken,
                    "isVerified": false
                }

                CRUD.AddEditData('', 'Users', globalVariables.urlBase_DataBase, 'insert', item)
                    .then(() => {
                        const emailData = {
                            to: formData.email,
                            subject: 'wellcome... sgh_Site',
                            text: `Please verify your email with click on this link ${globalVariables.urlBase_Server}/verify-email/${updatedToken}`,
                        }
                        const response = EmailSenderFunction(emailData)
                        //         console.log(response);
                    })
                // Form is valid, you can submit the data or take the necessary action.
                //    console.log('Form submitted:', formData);

            } else {
                // Form is invalid, do not submit or take action.
                //    console.log('Form has validation errors.', formData);
            }
        }
    }



    const history = useNavigate();
    useLayoutEffect(() => {
        //console.log(11, token);
        if (ShowForPortfolio !== true) {
            const tokenn = localStorage.getItem('token')
            if (tokenn) {
                setToken(tokenn)
            }
        }
    }, [])

    useEffect(() => {
        // console.log(token);
        if (token) {
            fetchCurrentUserInfo(token)
                .then(({ success, data }) => {
                    updateGlobalVariables({
                        userInfo: {
                            user: data,
                            token: token
                        }
                    });
                    history('appProject1');
                })
        }
    }, [token])

    // htttps://codepen.io/871051/pen/KKJVvmN
    return (
        <>
            <div className="Login-div">
                <div className={`container ${active}`}>
                <button className="toggle-btn-mobile  d-md-none" onClick={handleSignInUP}>
                    {active===''?'Sign Up Form':'Sign In Form'}
                    </button>
                        
                    <div className="form-container sign-up">
                        <form>
                            <h1>Create Account</h1>
                            <div className="social-icons">
                                <a href="" className="icons"><i className="fa-brands fa fa-google-plus"></i></a>
                                <a href="" className="icons"><i className="fa-brands fa fa-facebook-f"></i></a>
                                <a href="" className="icons"><i className="fa-brands fa fa-github"></i></a>
                                <a href="" className="icons"><i className="fa-brands fa fa-linkedin"></i></a>
                            </div>
                            <span>or use your email to registration</span>


                            <div className='input_field'>
                                <div className="sub_input_field">
                                    <input type="text" placeholder="Name" name="name" onFocus={handleInputChange} onChange={handleInputChange} value={formData.name} />
                                </div>
                                {showErrors.nameshow === true && <div className='validate'>{errors.name}</div>}
                            </div>
                            <div className='input_field'>
                                <div className="sub_input_field">
                                    <input type="email" placeholder="email" name="email" onFocus={handleInputChange} onChange={handleInputChange} value={formData.email} />
                                </div>
                                {showErrors.emailshow === true && <div className='validate'>{errors.email}</div>}
                            </div>
                            <div className='input_field'>
                                <div className="sub_input_field">
                                    <input type="text" placeholder="UserName" name="username" onFocus={handleInputChange} onChange={handleInputChange} value={formData.username} />
                                </div>
                                {showErrors.usernameshow === true && <div className='validate'>{errors.username}</div>}
                            </div>
                            <div className='input_field'>
                                <div className="sub_input_field">
                                    <input type="password" placeholder="Password" name="password" onFocus={handleInputChange} onChange={handleInputChange} value={formData.password} />
                                </div>
                                {showErrors.passwordshow === true && <div className='validate'>{errors.password}</div>}
                            </div>

                            <button disabled onClick={(e) => handleSignUp(e)}>Sign Up</button>
                        </form >
                    </div >
                    <div className="form-container sign-in">
                        <form>
                            <h1>Sign In</h1>
                            <div className="social-icons">
                                <a href="" className="icons"><i className="fa-brands fa  fa-google-plus"></i></a>
                                <a href="" className="icons"><i className="fa-brands  fa fa-facebook-f"></i></a>
                                <a href="" className="icons"><i className="fa-brands  fa fa-github"></i></a>
                                <a href="" className="icons"><i className="fa-brands  fa fa-linkedin"></i></a>
                            </div>
                            <span>or use your email/password</span>
                            <input type="text" placeholder="UserName" name="username" onFocus={handleInputChange} onChange={handleInputChange} value={formData.username} />
                            <input type="password" placeholder="Password" name="password" onFocus={handleInputChange} onChange={handleInputChange} value={formData.password} />

                            {errorMassage !== '' && <label className='alert alert-danger'>{errorMassage}</label>}
                            <button disabled onClick={(e) => handleSignIn(e)}>Sign In</button>
                            <Link disabled to={`/${globalVariables.ProjectName}/ForgottPass`}>Forget your Password?</Link>
                        </form>
                    </div>

                    <div className="toggle-container d-none d-md-block">
                        <div className="toggle">
                            <div className="toggle-panel toggle-left">
                                <h1>Welcome Back!</h1>
                                <p>Enter your Personal details to use all of site features</p>
                                <button className="hidden" onClick={handleSignInUP}>Sign In</button>
                            </div>
                            <div className="toggle-panel toggle-right">
                                <h1>Hello, Friend!</h1>
                                <p>Register with your Personal details to use all of site features</p>
                                <button className="hidden" onClick={handleSignInUP}>Sign Up</button>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </>
    );
}

export default LoginHtml;