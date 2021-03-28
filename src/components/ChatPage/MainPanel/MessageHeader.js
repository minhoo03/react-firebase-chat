// 채팅방 정보

import React, { useState, useEffect } from 'react'

import { Container, Row, Col } from 'react-bootstrap'
import { InputGroup, FormControl } from 'react-bootstrap'
import { Accordion, Card } from 'react-bootstrap'
import Image from 'react-bootstrap/Image'

import { BsFillUnlockFill,BsFillLockFill } from 'react-icons/bs'
import { AiOutlineHeart,AiFillHeart, AiOutlineSearch } from 'react-icons/ai'

import { useSelector } from 'react-redux'
import firebase from '../../../firebase'

function MessageHeader({handleSearchChange}) {

    const usersRef = firebase.database().ref('users')
    const chatRoom = useSelector(state => state.chatRoom.currentChatRoom)
    const user = useSelector(state => state.user.currentUser)
    
    const isPrivateTrueAndFalse = useSelector(state => state.chatRoom.isPrivateTrueAndFalse)
    const [isFavorite, setIsFavorite] = useState(false)

    const buttonStyle = {
        outline: 'none',
        backgroundColor:'transparent',
        color:'#000000',
        textDecoration: 'none'
    }

    useEffect(() => {
        if(chatRoom && user) {
            addFavoriteLustener(chatRoom.id, user.uid)
        }
    }, [])

    const addFavoriteLustener = (chatRoomId, userId) => {
        usersRef.child(userId).child('favorited').once('value').then(data => { // 한 번 읽어옴
            // data.val() : 방의 정보 / chatRoomIds : 방의 key(id)
            if(data.val() !== null) { // 유저 DB에 좋아요 누른 방이 있으면
                const chatRoomIds = Object.keys(data.val())
                const isAlreadtFavorited = chatRoomIds.includes(chatRoomId) // DB에서 읽어온 chatRoomIds중 현재 내가 속한 chatRoom.id가 있다면 true
                setIsFavorite(isAlreadtFavorited)
            }
        })
    }

    const handleFavorite = () => {
        if(isFavorite) {
            usersRef.child(`${user.uid}/favorited`).child(chatRoom.id).remove(err => {
                if(err !== null) return console.log(err)
            })
            setIsFavorite(prev => !prev)
        } else {
            usersRef.child(`${user.uid}/favorited`).update({
                [chatRoom.id] : {
                    name: chatRoom.name,
                    description: chatRoom.description,
                    createBy: {
                        name: chatRoom.createBy.name,
                        image: chatRoom.createBy.image
                    }
                }
            })
            setIsFavorite(prev => !prev)
        }
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
                    {" "}
                    {/* DM 아닐때만 */}
                    {!isPrivateTrueAndFalse && 
                        <span style={{cursor:'pointer'}}>
                            {isFavorite ?
                                <AiFillHeart style={{marginBottom:'5px'}} onClick={handleFavorite} />
                                :
                                <AiOutlineHeart style={{marginBottom:'5px'}} onClick={handleFavorite} />
                            }
                        </span>
                        }
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
                {!isPrivateTrueAndFalse &&
                    <Row>
                        <Col>
                            <Accordion>
                                <Card style={{marginTop:'1rem'}}>
                                    <Card.Header style={{padding:'0 1rem', backgroundColor:'transparent'}} className="card-button">
                                    <Accordion.Toggle variant="link" eventKey="0" style={buttonStyle}>
                                        Description
                                    </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                    <Card.Body>{chatRoom && chatRoom.description}</Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </Col>
                        <Col>
                            <Accordion>
                                <Card style={{marginTop:'1rem'}}>
                                    <Card.Header style={{padding:'0 1rem', backgroundColor:'transparent'}} className="card-button">
                                    <Accordion.Toggle variant="link" eventKey="0" style={buttonStyle}>
                                        Create By
                                    </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                    <Card.Body>
                                        <Image src={chatRoom && chatRoom.createBy.image} roundedCircle style={{width:'30px', height:'30px'}} /> {" "}{chatRoom && chatRoom.createBy.name}'s room
                                    </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </Col>
                </Row>
                }
            </Container>
        </div>
    )
}

export default MessageHeader
