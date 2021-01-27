import React, { Component } from 'react'
import { AiOutlineSmile } from 'react-icons/ai'
import { AiOutlinePlus } from 'react-icons/ai'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import { connect } from 'react-redux'
import firebase from '../../../firebase'

import { setCurrentChatRoom } from '../../../Redux/actions/chatRoom_action'

export class ChatRooms extends Component {
    // const [show, setShow] = useState(false);
    state = {
        show: false,
        name: "",
        description: "",
        chatRoomsRef: firebase.database().ref("chatRooms"),
        chatRooms: [],
        firstLoad: true,
        activeChatRoomId: ""
    } 

    // useEffect
    componentDidMount() {
        this.AddChatRoomsListeners()
    }

    // 임의로 첫 번째 ROOM이 redux에 들어가지게
    setFirstChatRoom = () => {
        const firstChatRoom = this.state.chatRooms[0]

        if(this.state.firstLoad && this.state.chatRooms.length > 0) {
            this.props.dispatch(setCurrentChatRoom(firstChatRoom))
            this.setState({activeChatRoomId: firstChatRoom.id})
        }
        // 처음 로드했을때만 첫 번째 ROOM이 선택되어야 하므로
        this.setState({firstChatRoom: false})
    }

    // chatroom 데이터 실시간 받기
    AddChatRoomsListeners = () => {
        let chatRoomsArray = []

        // .on : DB에 child가 추가되는지 실시간 확인 중
        this.state.chatRoomsRef.on("child_added", DataSnapshot => {
            chatRoomsArray.push(DataSnapshot.val())
            console.log('chatRoomsArray',chatRoomsArray)
            this.setState({chatRooms: chatRoomsArray}, () => this.setFirstChatRoom()) // 확인된 DB child를 setState
        })
    }

    // const handleClose = () => setShow(false);
    handleClose = () => this.setState({show: false})
    handleShow = () => this.setState({show: true})

    // 유효성 체크 (state 있는지 확인)
    isFormVaild = (name, description) => name && description 

    // room 정보를 redux에 넣기
    changeChatRoom = (room) => {
        this.props.dispatch(setCurrentChatRoom(room))
        this.setState({activeChatRoomId: room.id})
    }

    // state: chatroom에 값이 있을 경우 map을 이용해 렌더링
    renderChatRooms = (chatRooms) => 
        chatRooms.length > 0 && chatRooms.map(room => (
            <li 
                key={room.id}
                style={{backgroundColor: room.id === this.state.activeChatRoomId && "#ffffff45"}}
                onClick={() => this.changeChatRoom(room)} // li 클릭시 redux 저장
            >
                # {room.name}
            </li>
        ))
    

    // form submit
    handleSubmit = (e) => {
        e.preventDefault()
        const { name, description } = this.state

        if(this.isFormVaild(name, description)) {
            this.addChatRoom() // state : name, desc 있을 시 chatroom 생성
        }
    }

    // 채팅방 정보를 chatRoom 객체에 삽입
    addChatRoom = async () => {
        const key = this.state.chatRoomsRef.push().key // push하면 고유id 값 생성됨
        const { name, description } = this.state
        const { user } = this.props // redux state
        const newChatRoom = { // 컬럼 obj
            id: key,
            name: name,
            description: description,
            createBy: {
                name: user.displayName,
                image: user.photoURL
            }
        }

        // chatRoom 객체를 DB에 insert
        try { 
            await this.state.chatRoomsRef.child(key).update(newChatRoom) // state 담긴 db > table 경로에 접근 > row에 key > 컬럼에 newChatRoom
            this.setState({
                name: "",
                description: "",
                show: false
            })
        } catch (error) {
            alert(error)
        }
    }

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

                {/* chatRooms state를 렌더링한 li 감싸개 */}
                <ul style={{listStyleType:'none', padding: 0}}>
                    {this.renderChatRooms(this.state.chatRooms)}
                </ul>

                {/* ADD CHAT ROOM MODAL */}
                {/* input이 변경될 때 -> state > name 에 input value를 담아줌 */}
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create a chat room</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Name</Form.Label>
                                <Form.Control placeholder="Enter chat romm name" type="text" onChange={(e)=> this.setState({name:e.target.value})} />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Description</Form.Label>
                                <Form.Control placeholder="Enter chat room description" type="text" onChange={(e)=> this.setState({description:e.target.value})}/>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.handleSubmit}>
                        Create
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

// redux state를 props로 바꿔 사용하겠다 / class component라 HOOK 사용 불가
const mapStateToProps = state => {
    return {
        user: state.user.currentUser
    }
}
export default connect(mapStateToProps)(ChatRooms)
