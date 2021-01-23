import React from 'react'
import {Link} from 'react-router-dom'

function RegisterPage() {
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
                    //ref={register({ required: true, maxLength: 10 })}
                />
                {/* {errors.exampleRequired && <p>This field is required</p>} */}

                <label>Name</label>
                <input
                    name="name"
                    //ref={register({ required: true, maxLength: 10 })}
                />
                {/* {errors.exampleRequired && <p>This field is required</p>} */}

                <label>Password</label>
                <input
                    name="password"
                    type="password"
                    //ref={register({ required: true, maxLength: 10 })}
                />
                {/* {errors.exampleRequired && <p>This field is required</p>} */}

                <label>Password Confirm</label>
                <input
                    name="password_confirm"
                    type="password"
                    //ref={register({ required: true, maxLength: 10 })}
                />
                {/* {errors.exampleRequired && <p>This field is required</p>} */}
                <input type="submit" />
                <Link style={{color: '#adadad', textDecoration: 'none'}} to="Login">이미 아이디가 있다면...</Link>
            </form>
        </div>
    )
}

export default RegisterPage
