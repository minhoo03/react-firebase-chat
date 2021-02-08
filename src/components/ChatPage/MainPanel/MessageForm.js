// textArea, send, upload

import React, { useRef, useState } from 'react'
import firebase from '../../../firebase'
import { useSelector } from 'react-redux'

import { Form, ProgressBar, Row, Col, Button } from 'react-bootstrap'

function MessageForm() {
    const chatRoom = useSelector(state => state.chatRoom.currentChatRoom)
    const user = useSelector(state => state.user.currentUser)

    const isPrivateTrueAndFalse = useSelector(state => state.chatRoom.isPrivateTrueAndFalse)
    // message send
    const [ content, setContent ] = useState("")
    const [ errors, setErrors ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const messageRef = firebase.database().ref("messages")

    const [percentage, setPercentage] = useState(0)
    // image upload
    const inputOpenImageRef = useRef()
    const storageRef = firebase.storage().ref()
    const typingRef = firebase.database().ref('typing')

    // 메세지 객체 생성
    const createMessage = (fileURL = null) => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: user.uid,
                name: user.displayName,
                image: user.photoURL
            }
        }
        if(fileURL !== null) {
            message["image"] = fileURL
        } else {
            message["content"] = content
        }
        return message
    }

    const handleChange = (event) => {
        setContent(event.target.value)
    }

    // send text
    const handleSubmit = async () => {
        if(!content) {
            setErrors(prev => prev.concat("문구를 적어주세요!")) // 원래 error에 ++
            return
        }
        setLoading(true)
        // firebase에 메시지 저장하는 부분
        try {
            await messageRef.child(chatRoom.id).push().set(createMessage())
            typingRef.child(chatRoom.id).child(user.uid).remove() // typing 삭제
            setLoading(false)
            setContent("")
        } catch(error) {
            setErrors(prev => prev.concat(error.message))
            setLoading(false)

            setTimeout(() => {
                    setErrors([])
            }, 5000);
        }
    }

    // open file input
    const handelOpenImageRef = () => {
        inputOpenImageRef.current.click()
    }

    const getPath = () => {
        if(isPrivateTrueAndFalse) {
            return `/message/private/${chatRoom.id}` // 내 아이디/상대 아이디 or 상대 아이디/ 내 아이디
        } else {
            return '/message/public'
        }
    }

    // storage에 image 전송
    const handleUploadImage = (e) => {
        const file = e.target.files[0]
        if(!file) return
        const filePath = `${getPath()}/${file.name}`
        const metadata = { contentType:file.metadata }

        // storage 전송
        setLoading(true) // 메세지 전송 못하게
        try {
            let uploadTask = storageRef.child(filePath).put(file,metadata)

            // percent
            uploadTask.on(
                "state_changed",
                UploadTaskSnapshot => {
                    const percentage = Math.round(
                        // 진행된 Byte / 전체 Byte
                        (UploadTaskSnapshot.bytesTransferred / UploadTaskSnapshot.totalBytes) * 100
                    )
                    setPercentage(percentage)
                }, 
                err => {
                    console.log(err)
                    setLoading(false)
                },
                () => {
                    // upload 완료 후 메시지 전송 (DB에 저장)
                    // 저장된 파일 URL
                    uploadTask.snapshot.ref.getDownloadURL()
                    .then(downloadURL => {
                        messageRef.child(chatRoom.id).push().set(createMessage(downloadURL))
                        setLoading(false)
                    })
                }
            )
        } catch (error) {
            alert(error)
        }
    }

    const handleKeyDown = (event) => {

        // typing User UI
        if(content) {
            typingRef.child(chatRoom.id).child(user.uid).set(user.displayName)
        } else {
            typingRef.child(chatRoom.id).child(user.uid).remove()
        }

        // send Chat
        if(event.ctrlKey && event.keyCode === 13) {
            handleSubmit()
        }
    }

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Control onKeyDown={handleKeyDown} as="textarea" rows={3} value={content} onChange={handleChange} placeholder="Ctrl키를 누른 상태로 Enter를 누를 시 전송됩니다." />
                </Form.Group>
            </Form>

            {
                !(percentage === 0 || percentage === 100) && <ProgressBar label={`${percentage}%`} now={percentage} />
            }
            <div>
                {errors.map(errorMSG => <p style={{color:"red"}} key={errorMSG}>{errorMSG}</p>)}
            </div>

            <Row>
                <Col>
                    <button className="msgForm-button" disabled={loading ? true: false} accept="image/jpeg, image/png" onClick={handelOpenImageRef}>Upload</button>
                </Col>

                <Col>
                    <button className="msgForm-button" disabled={loading ? true: false} onClick={handleSubmit} onKeyDown={handleKeyDown}>Send</button>
                </Col>
            </Row>
            <input type="file" style={{ display: 'none' }} ref={inputOpenImageRef} onChange={handleUploadImage} />
        </div>
    )
}

export default MessageForm
