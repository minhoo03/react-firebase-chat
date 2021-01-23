import React, { useRef } from 'react'
import {Link} from 'react-router-dom'
import {useForm, userForm} from 'react-hook-form'

function RegisterPage() {

    // useForm에서 메소드 꺼냄
    const { register, watch, errors } = useForm({mode:'onChange'})
    const password = useRef()
    password.current = watch("password")

    // 'name:email'을 관찰 : 바뀔때마다 console
    console.log(watch("email"))

    return (
        <div className="auth_wrapper">
            <div className="auth_title">
                <h3>Register</h3>
            </div>
            <form>
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
                <input type="submit" />
                <Link style={{color: '#adadad', textDecoration: 'none'}} to="Login">이미 아이디가 있다면...</Link>
            </form>
        </div>
    )
}

export default RegisterPage
