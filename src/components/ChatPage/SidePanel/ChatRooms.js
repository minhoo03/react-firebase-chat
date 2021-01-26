import React, { Component } from 'react'
import { AiOutlineSmile } from 'react-icons/ai'
import { AiOutlinePlus } from 'react-icons/ai'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

export class ChatRooms extends Component {


    // func => class : 함수 호출에 this / state 호출에 this.state 필요
    // const [show, setShow] = useState(false);
    state = {
        show: false
    }
    // const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);
    handleClose = () => this.setState({show: false})
    handleShow = () => this.setState({show: true})


    render() {
        return (
            <div>
                <div style={{
                    position: 'relative', width: '100%',
                    display: 'flex', alignItems: 'center'
                }}>
                    <AiOutlineSmile style={{marginRight: 3}} />
                    ChatRooms {" "} (1)
                    <AiOutlinePlus style={{
                        position: 'absolute', right:0, cursor: 'pointer'
                    }} onClick={this.handleShow} />
                </div>

                {/* ADD CHAT ROOM MODAL */}

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Create a chat room</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Name</Form.Label>
                            <Form.Control placeholder="Enter chat romm name" />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Description</Form.Label>
                            <Form.Control placeholder="Enter chat room description" />
                        </Form.Group>
                    </Form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.handleClose}>
                        Save Changes
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default ChatRooms
