import React, { Component } from 'react'
import MessageHeader from './MessageHeader'
import Message from './Message'
import MessageForm from './MessageForm'

import { connect } from 'react-redux'
import firebase from '../../../firebase'

export class MainPanel extends Component {

    state = {
        messages: [], // 보낸 이의 chat, user, chatRoom 정보
        messageRef: firebase.database().ref("messages"),
        messagesLoading: true
    }

    // 각 방의 채팅 구분
    componentDidMount() {
        const {chatRoom} = this.props
        if(chatRoom) {
            this.addMessagesListeners(chatRoom.id)
        }
    }

    // DB 변동 O => state에 msg 담음
    addMessagesListeners = (chatRoomId) => {
        let messagesArr = []
        this.state.messageRef.child(chatRoomId).on("child_added", snapShot => {
            messagesArr.push(snapShot.val())
            this.setState({ 
                messages: messagesArr,
                messagesLoading: false
            })
        })  
        // console.log('messagesArr',messagesArr)
    }

    // msg state를 Message component에 전달
    renderMessages = (messages) =>
        messages.length > 0 &&
        messages.map(message => (
            <Message
                key={message.timestamp}
                message={message}
                user={this.props.user}
            />
    ))

    render() {
        const{ messages } = this.state

        return (
            <div style={{padding: '2rem 2rem 0 2rem'}}>
                <MessageHeader />

                <div style={{
                    width:'100%',
                    height:'40vh',
                    border:'.1rem solid #ececec',
                    borderRadius:'4px',
                    padding:'1rem',
                    marginBottom:'1rem',
                    overflowY:'auto'
                }}>
                    {this.renderMessages(messages)}
                </div>

                <MessageForm />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.currenUser,
        chatRoom: state.chatRoom.currentChatRoom
    }
}
export default connect(mapStateToProps)(MainPanel)
