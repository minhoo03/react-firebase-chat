import React, { useRef } from 'react'
import firebase from '../../../firebase'
import { IoMdChatbubbles } from 'react-icons/io'
import Dropdown from 'react-bootstrap/Dropdown'
import Image from 'react-bootstrap/Image'

import { useSelector } from 'react-redux'

function UserPanel() {
    // Redux store의 state 받아옴
    const user = useSelector(state => state.user.currentUser)

    const inputOpenImageRef = useRef()

    const handleLogout = () => {
        firebase.auth().signOut()
    }

    const handleOpenImageRef = () => {
        inputOpenImageRef.current.click()
    }

    const handleUploadImage = () => {
        
    }

    return (
        <div>
            <h3 style={{ color: '#ffffff'}}>
                <IoMdChatbubbles />{" "}Chat App
            </h3>
            
            <div style={{display:'flex', marginBottom:'1rem'}}>
                <Image src={user && user.photoURL} roundedCircle
                style={{width:'30px', height:'30px', marginTop:'5px'}} />

                <Dropdown>
                    <Dropdown.Toggle 
                        id="dropdown-basic" 
                        style={{background:'transparent', border:'0'}}
                    >
                        {user && user.displayName}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={handleOpenImageRef}>프로필 사진 변경</Dropdown.Item>
                        <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <input accept="image/jpeg, image/png" type="file" style={{display:'none'}} ref={inputOpenImageRef} onChange={handleUploadImage}/>
        </div>
    )
}

export default UserPanel
