import React from 'react'

function RegisterPage() {
    return (
        <div>
            <form>
                <label>Example</label>
                <input name="example" defaultValue="test" />
                <label>ExampleRequired</label>
                <input
                    name="exampleRequired"
                    //ref={register({ required: true, maxLength: 10 })}
                />
                {/* {errors.exampleRequired && <p>This field is required</p>} */}
                <input type="submit" />
            </form>
        </div>
    )
}

export default RegisterPage
