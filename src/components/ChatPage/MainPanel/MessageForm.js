import React from 'react'

import { Form, ProgressBar, Row, Col, Button } from 'react-bootstrap'

function MessageForm() {

    return (
        <div>
            <Form>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Control as="textarea" rows={3} />
                </Form.Group>
            </Form>

            <ProgressBar label="60%" now={60} />

            <Row>
                <Col>
                    <button className="msgForm-button">Upload</button>
                </Col>

                <Col>
                    <button className="msgForm-button">Send</button>
                </Col>
            </Row>
        </div>
    )
}

export default MessageForm
