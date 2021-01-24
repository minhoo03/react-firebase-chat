import React, { useRef, useState } from 'react'
import {Link} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import firebase from '../../firebase'
import md5 from 'md5'

function RegisterPage() {

    
    const { register, watch, errors, handleSubmit } = useForm({mode:'onChange'}) // useForm에서 메소드 꺼냄
    const [errorFromSubmit, setErrorFromSubmit] = useState('')
    const [loading, setLoading] = useState(false)

    const password = useRef() // dom 선택과 focus 선택
    password.current = watch("password")

    const onSubmit = async (data) => {
        try{
            setLoading(true)
            let createUser = await firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
            console.log('createUser',createUser)
            setLoading(false)

            await createUser.user.updateProfile({
                displayName: data.name,
                photoURL: `http://gravatar.com/avatar/${md5(createUser.user.email)}?d=identicon`
            })
        } catch(error) {
            setErrorFromSubmit(error.message)
            setLoading(false)
            setTimeout(() => {
                setErrorFromSubmit('')
            }, 5000)
        }
    }

    return (
        <div className="auth_wrapper">
            <div className="auth_title">
                <h3>Register</h3>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>Email</label>
                <input
                    name="email"
                    type="email"
                    ref={register({required: true, pattern: /^\S+@\S+$/i})}
                />
                {errors.email && <p>This email field is required</p>}

                <label>Name</label>
                <input
                    name="name"
                    ref={register({ required: true, maxLength: 10 })}
                />
                {errors.name && errors.name.type==="required" && <p>This name field is required</p>}
                {errors.name && errors.name.type==="maxLength" && <p>Your input exceed maximum length</p>}

                <label>Password</label>
                <input
                    name="password"
                    type="password"
                    ref={register({ required: true, minLength: 6 })}
                />
                {errors.password && errors.password.type==="required" && <p>This password field is required</p>}
                {errors.password && errors.password.type==="minLength" && <p>Password must have at least 6 characters</p>}

                <label>Password Confirm</label>
                <input
                    name="password_confirm"
                    type="password"
                    ref={register({ 
                        required: true,
                        validate: (value) =>
                            // value <= password_confirm
                            value === password.current
                    })}
                />
                {errors.password_confirm && errors.password_confirm.type==="required" && <p>This password confirm field is required</p>}
                {errors.password_confirm && errors.password_confirm.type==="validate" && <p>This password do not match</p>}

                {/* firebase 가입 오류 state가 있을 시 */}
                {errorFromSubmit && <p>{errorFromSubmit}</p>}
                <input type="submit" disabled={loading} />
                <Link style={{color: '#adadad', textDecoration: 'none'}} to="Login">이미 아이디가 있다면...</Link>
            </form>
        </div>
    )
}

export default RegisterPage
