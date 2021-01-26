import React, { useRef } from 'react'
import firebase from '../../../firebase'
import { IoMdChatbubbles } from 'react-icons/io'
import Dropdown from 'react-bootstrap/Dropdown'
import Image from 'react-bootstrap/Image'

import { useDispatch, useSelector } from 'react-redux'
import { setPhotoURL } from '../../../Redux/actions/user_action'

function UserPanel() {
    // Redux store의 state 받아옴
    const user = useSelector(state => state.user.currentUser)
    const dispatch = useDispatch() 
    const inputOpenImageRef = useRef()

    const handleLogout = () => {
        firebase.auth().signOut()
    }

    const handleOpenImageRef = () => {
        inputOpenImageRef.current.click()
    }

    const handleUploadImage = async (e) => {
        const file = e.target.files[0]

        const metadata = { contentType: file.metadata }

        try {
            // *스토리지에 파일 저장     // firebase.storage() 사용 .ref(테이블).child(로우:파일명).put({컬럼: file과 file 타입})
            let uploadTaskSnapshot = await firebase.storage().ref()
            .child(`user_image/${user.uid}`).put(file, metadata)

            let downloadURL = await uploadTaskSnapshot.ref.getDownloadURL()

            // *auth: user > currenUser 프로필 이미지 수정
            await firebase.auth().currentUser.updateProfile({
                photoURL: downloadURL
            })
            // *Redux state의 프로필 이미지 수정
            dispatch(setPhotoURL(downloadURL))

            // *DB 유저 이미지 수정
            await firebase.database().ref('users')
            .child(user.uid)
            .update({ image: downloadURL })
        } catch (error) {
            alert(error)
        }
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
