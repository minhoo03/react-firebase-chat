// 현재 선택된 채팅방 구분 && DB에 저장된 채팅방의 채팅을 Message 컴포넌트에 전달

import React, { Component } from 'react'
import MessageHeader from './MessageHeader'
import Message from './Message'
import MessageForm from './MessageForm'

import { connect } from 'react-redux'
import firebase from '../../../firebase'

import Skeleton from '../../../commons/components/Skeleton'

export class MainPanel extends Component {

    messageEndRef = React.createRef()

    state = {
        messages: [], // 보낸 이의 chat, user, chatRoom 정보
        messageRef: firebase.database().ref("messages"),
        messagesLoading: true,
        searchTerm: "", // search input
        searchResults: [],
        seatchLoading: false,
        typingRef: firebase.database().ref('typing'),
        typingUsers: [], // 입력중인 유저
        listenerLists: []
    }

    handleSearchChange = e => {
        this.setState({
            searchTerm: e.target.value,
            searchLoading: true
        }, () => this.handleSearchMessages())
    }

    handleSearchMessages = () => {
        const chatRoomMessages = [...this.state.messages]
        const regex = new RegExp(this.state.searchTerm, "gi")
        const searchResults = chatRoomMessages.reduce((acc, message) => { // message가 있는 배열에 reduce
            if(
                (message.content && message.content.match(regex)) || // message Text가 있을 때, 정규식(input)과 일치하는 것 있나 확인
                message.user.name.match(regex)
            ) {
                acc.push(message)
            }
            return acc
        }, [])
        this.setState({searchResults})
    }

    // 각 방의 채팅 구분
    componentDidMount() {
        const {chatRoom} = this.props
        if(chatRoom) {
            this.addMessagesListeners(chatRoom.id)
            this.addTypingListeners(chatRoom.id)
        }
    }


    componentWillUnmount() {
        this.removeListeners(this.state.listenerLists)
        this.state.messageRef.off()
    }


    removeListeners = (listeners) => {
        listeners.forEach(listner => {
            listner.ref.child(listner.id).off(listner.event)
        })
    }

    // ref가 참조하고 있는 messageEndRef로 스크롤한다
    componentDidUpdate() {
        if(this.messageEndRef) {
            this.messageEndRef.scrollIntoView({behavior: 'smooth'})
        }
    }


    // typing table에 추가된 유저 uid가 내 uid와 다르다면.. setState
    addTypingListeners = (chatRoomId) => {
        let typingUsers = []

        // typing이 새로 들어올 때
        // DB를 실시간 확인 => !Redux user => setState -> renderTypingUser()
        this.state.typingRef.child(chatRoomId).on("child_added",
        DataSnapshot => {
            if (DataSnapshot.key !== this.props.user.uid) {
                typingUsers = typingUsers.concat({
                    id: DataSnapshot.key,
                    name: DataSnapshot.val()
                });
                this.setState({ typingUsers });
            }
        });

        // listenerLists state에 등록된 리스너를 넣어주기
        this.addToListenerLists(chatRoomId, this.state.typingRef, "child_added")

        // typing이 지워질 때
        this.state.typingRef.child(chatRoomId).on('child_removed', DataSnapshot => {
            // typing DB의 모든 유저 확인 => typing에서 제거된 유저 id가 남았나 확인 => (남았다면 n / 없다면 -1)
            const index = typingUsers.findIndex(user => user.id === DataSnapshot.key)
            if(index !== -1) { // 만약 '타이핑' 지워진 유저가 index에 있다면 제거
                typingUsers = typingUsers.filter(user => user.id !== DataSnapshot.key)
                this.setState({typingUsers})
            }
        })

        // listenerLists state에 등록된 리스너를 넣어주기
        this.addToListenerLists(chatRoomId, this.state.typingRef, "child_removed")
    }


    addToListenerLists = (id, ref, event) => {
        // 이미 등록된 리스너인지 확인
        const index = this.state.listenerLists.findIndex(listener => {
            return (
                listener.id === id && 
                listener.ref === ref &&
                listener.event === event
            )
        })

        if(index === -1) { // 이미 있다면
            const newListeners = { id, ref, event }
            this.setState({
                listenerLists: this.state.listenerLists.concat(newListeners) // 기존 state에 추가
            })
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


    // state가 있다면 -> setState된 유저들을 map => span
    renderTypingUsers = (typingUsers) => {
        return typingUsers.length > 0 && typingUsers.map(user => {
            return <span>{user.name}님이 채팅을 입력하고 있습니다..</span>
        })
    }


    // DB의 message를 state에 담을 때 Loading은 false가 된다...
    // 그러므로 true인 동안은 skeleton 작업 중
    renderMessageSkeleton = (messagesLoading) => {
      return messagesLoading && (
           <>
           {/* 4개의 배열을 maping */}
            {[...Array(4)].map(i =>
                <Skeleton key={i} />
            )}
           </>
       ) 
    }

    render() {
        const{ messages, searchResults, searchTerm, typingUsers, messagesLoading } = this.state

        return (
            <div style={{padding: '2rem 2rem 0 2rem'}}>
                <MessageHeader handleSearchChange={this.handleSearchChange} />

                <div style={{
                    width:'100%',
                    height:'40vh',
                    border:'.1rem solid #ececec',
                    borderRadius:'4px',
                    padding:'1rem',
                    marginBottom:'1rem',
                    overflowY:'auto'
                }}>

                    {this.renderMessageSkeleton(messagesLoading)}
                    {searchTerm ?
                        this.renderMessages(searchResults)
                        :
                        this.renderMessages(messages)
                    }
                    {this.renderTypingUsers(typingUsers)}
                    {/* node는 현재 div를 가르킨다 => messageEndRef가 div를 참조 중 */}
                    <div ref={node => (this.messageEndRef = node)} />
                </div>

                <MessageForm />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.currentUser,
        chatRoom: state.chatRoom.currentChatRoom
    }
}
export default connect(mapStateToProps)(MainPanel)
