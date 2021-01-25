import React from 'react'
import firebase from '../../../firebase'
import { IoMdChatbubbles } from 'react-icons/io'
import Dropdown from 'react-bootstrap/Dropdown'
import Image from 'react-bootstrap/Image'

import { useSelector } from 'react-redux'

function UserPanel() {
    // Redux store의 state 받아옴
    const user = useSelector(state => state.user.currentUser)

    const handleLogout = () => {
        firebase.auth().signOut()
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
                        style={{background:'transparent', border:'0px'}}
                    >
                        {user && user.displayName}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">프로필 사진 변경</Dropdown.Item>
                        <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    )
}

export default UserPanel
