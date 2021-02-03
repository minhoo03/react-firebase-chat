// 채팅방 정보

import React from 'react'

import { Container, Row, Col } from 'react-bootstrap'
import { InputGroup, FormControl } from 'react-bootstrap'
import { Accordion, Card } from 'react-bootstrap'

import Image from 'react-bootstrap/Image'

import { BsFillUnlockFill,BsFillLockFill } from 'react-icons/bs'
import { AiOutlineHeart,AiFillHeart, AiOutlineSearch } from 'react-icons/ai'

import { useSelector } from 'react-redux'

function MessageHeader({handleSearchChange}) {

    const chatRoom = useSelector(state => state.chatRoom.currentChatRoom)
    const isPrivateTrueAndFalse = useSelector(state => state.chatRoom.isPrivateTrueAndFalse)

    const buttonStyle = {
        outline: 'none',
        backgroundColor:'transparent',
        color:'#000000',
        textDecoration: 'none'
    }

    return (
        <div style={{
                width:'100%',
                height:'20vh',
                border:'.1rem solid #ececec',
                padding:'.5rem',
                marginBottom:'.5rem'
            }}
        >
            <Container>
                <Row>
                    <Col><h2>
                    {
                        isPrivateTrueAndFalse ?
                            <BsFillLockFill style={{marginBottom:'10px'}} />
                            :
                            <BsFillUnlockFill style={{marginBottom:'10px'}} />
                    }
                    {" "}<AiOutlineHeart style={{marginBottom:'5px'}} />
                    {" "}{chatRoom && chatRoom.name}</h2>
                    </Col>
                    <Col>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1"><AiOutlineSearch /></InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                onChange={handleSearchChange}
                                placeholder="Search Messages"
                                aria-label="Search"
                                aria-describedby="basic-addon1"
                            />
                        </InputGroup>
                    </Col>
                </Row>
                <div style={{display: 'flex', justifyContent:'flex-end'}}>
                    <p>
                        <Image src="" /> {" "}user name
                    </p>
                </div>
                <Row>
                    <Col>
                        <Accordion>
                            <Card style={{border:'0px'}}>
                                <Card.Header style={{padding:'0 1rem', backgroundColor:'transparent'}} className="card-button">
                                <Accordion.Toggle variant="link" eventKey="0" style={buttonStyle}>
                                    Click me!
                                </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                <Card.Body>Hello! I'm the body</Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </Col>
                    <Col>
                        <Accordion>
                            <Card style={{border:'0px'}}>
                                <Card.Header style={{padding:'0 1rem', backgroundColor:'transparent'}} className="card-button">
                                <Accordion.Toggle variant="link" eventKey="0" style={buttonStyle}>
                                    Click me!
                                </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                <Card.Body>Hello! I'm the body</Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default MessageHeader
