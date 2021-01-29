import React, { useState } from 'react'
import firebase from '../../../firebase'
import { useSelector } from 'react-redux'

import { Form, ProgressBar, Row, Col, Button } from 'react-bootstrap'

function MessageForm() {
    const chatRoom = useSelector(state => state.chatRoom.currentChatRoom)
    const user = useSelector(state => state.user.currentUser)

    const [ content, setContent ] = useState("")
    const [ errors, setErrors ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const messageRef = firebase.database().ref("messages")

    const handleChange = (event) => {
        setContent(event.target.value)
    }

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
                    <button className="msgForm-button">Upload</button>
                </Col>

                <Col>
                    <button className="msgForm-button" onClick={handleSubmit}>Send</button>
                </Col>
            </Row>
        </div>
    )
}

export default MessageForm
