import React, { Component } from 'react'
import {AiOutlineSmile} from 'react-icons/ai'
import firebase from '../../../firebase'
import {connect} from 'react-redux'

import { setCurrentChatRoom, setPrivateChatRoom } from '../../../Redux/actions/chatRoom_action'

export class FavoritePanel extends Component {

    state = {
        usersRef : firebase.database().ref('users'),
        favoritedChatRoom: [],
        activeChatRoomId: ''
    }


    componentDidMount() {
        if(this.props.user) {
            this.addListeners(this.props.user.uid) // 현재 로그인 된 유저
        }
    }

    componentWillUnmount() {
        if(this.props.user) {
            this.removeListener(this.props.user.uid)
        }
    }

    removeListener = (userId) => {
        this.state.usersRef.child(`${userId}/favorited`).off()
    }


    addListeners = (userId) => {
        const { usersRef } = this.state

        usersRef
            .child(userId)
            .child('favorited')
            .on('child_added', DataSnapshot => {
                const favoritedChatRoom = { id: DataSnapshot.key, ...DataSnapshot.val()}

                this.setState({
                    favoritedChatRoom: [...this.state.favoritedChatRoom, favoritedChatRoom] // 기존 state favoriteCR, const favoriteCR
                })
            })

        usersRef
            .child(userId)
            .child('favorited')
            .on('child_removed', DataSnapshot => {
                const chatRoomToRemove = { id: DataSnapshot.key, ...DataSnapshot.val()}
                
                const filteredChatRooms = this.state.favoritedChatRoom.filter(chatRoom => { // 기존 favoriteCR을 하나 하나 chatRoom에 담음
                    return chatRoom.id !== chatRoomToRemove.id // 이제 없는 CR을 걸러서 return
                })
                this.setState({favoritedChatRoom: filteredChatRooms})

        })
    }


    renderFavotiredChatRoom = (favoritedChatRoom) => {
        return favoritedChatRoom.length > 0 && favoritedChatRoom.map(chatRoom => (
            <li key={chatRoom.id} onClick={() => this.changeChatRoom(chatRoom)} 
                style={{backgroundColor:chatRoom.id === this.state.activeChatRoomId && '#ffffff45'}}
            >
                # {chatRoom.name}
            </li>
        ))
    }


    changeChatRoom = (chatRoom) => { // onClick으로 chatRoom 정보가 넘어온다
        this.props.dispatch(setCurrentChatRoom(chatRoom)) // 현재 내가 있는 방을 Redux로
        this.props.dispatch(setPrivateChatRoom(false))
        this.setState({activeChatRoomId: chatRoom.id})
    }
    

    render() {
        const { favoritedChatRoom } = this.state
        return (
            <div>
                <span style={{display:'flex', alignItems:'center'}}>
                    <AiOutlineSmile style={{marginRight: '3px'}} /> FAVORITE ({this.state.favoritedChatRoom && this.state.favoritedChatRoom.length})
                </span>

                <ul style={{listStyleType: 'none', padding: '0'}}>
                    {this.renderFavotiredChatRoom(favoritedChatRoom)}
                </ul>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.currentUser
    }
}
export default connect(mapStateToProps)(FavoritePanel)
