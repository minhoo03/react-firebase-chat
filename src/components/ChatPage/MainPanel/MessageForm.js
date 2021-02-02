// textArea, send, upload

import React, { useRef, useState } from 'react'
import firebase from '../../../firebase'
import { useSelector } from 'react-redux'

import { Form, ProgressBar, Row, Col, Button } from 'react-bootstrap'

function MessageForm() {
    const chatRoom = useSelector(state => state.chatRoom.currentChatRoom)
    const user = useSelector(state => state.user.currentUser)
    // message send
    const [ content, setContent ] = useState("")
    const [ errors, setErrors ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const messageRef = firebase.database().ref("messages")
    // image upload
    const inputOpenImageRef = useRef()
    const storageRef = firebase.storage().ref()

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
    // storage에 image 전송
    const handleUploadImage = async (e) => {
        const file = e.target.files[0]
        if(!file) return
        const filePath = `/meesage/public/${file.name}`
        const metadata = { contentType:file.metadata }

        // storage 전송
        try {
            await storageRef.child(filePath).put(file,metadata)
        } catch (error) {
            alert(error)
        }
    }

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Control as="textarea" rows={3} value={content} onChange={handleChange} />
                </Form.Group>
            </Form>

            <ProgressBar label="60%" now={60} />
            <div>
                {errors.map(errorMSG => <p style={{color:"red"}} key={errorMSG}>{errorMSG}</p>)}
            </div>

            <Row>
                <Col>
                    <button className="msgForm-button" onClick={handelOpenImageRef}>Upload</button>
                </Col>

                <Col>
                    <button className="msgForm-button" onClick={handleSubmit}>Send</button>
                </Col>
            </Row>
            <input type="file" style={{ display: 'none' }} ref={inputOpenImageRef} onChange={handleUploadImage} />
        </div>
    )
}

export default MessageForm
