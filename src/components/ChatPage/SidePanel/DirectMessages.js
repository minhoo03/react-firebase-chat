import React, { Component } from 'react'
import firebase from '../../../firebase'
import { AiOutlineSmile } from 'react-icons/ai'
import { connect } from 'react-redux'

export class DirectMessages extends Component {

    state = {
        usersRef: firebase.database().ref("users"),
        users:[]
    }

    componentDidMount() {
        if(this.props.user){
            this.addUserListeners(this.props.user.uid)
        }
    }

    addUserListeners = (currentUserId) => {
        const {usersRef} = this.state
        let usersArray = []
        usersRef.on("child_added", DataSnapshot => {
            if(currentUserId !== DataSnapshot.key) { // 로그인 된 내 아이디를 제외한 DB 유저들의 key값
                let user = DataSnapshot.val() // DataSnapshot: 유저 정보를 user에 담음(현재는 이름과 이미지만)
                user["uid"] = DataSnapshot.key // 유저의 모든 정보를 가진 key를 이용해 uid도 추가해줌
                user["status"] = "offline"

                usersArray.push(user) // 수정한 user정보를 userArray에 담고 state로 전송
                this.setState({users: usersArray})
            }
        })
    }

    // renderDirectMessages = users => { return users.length > 0 && users.map(user => <li key={user.uid}>#{" "}{user.name}</li>) }
    renderDirectMessages = users => 
        users.length > 0 &&
        users.map(user => 
            <li key={user.uid} onClick={() => this.changeChatRoom(user)}>
                #{" "}{user.name}
            </li>
        )

    changeChatRoom = (user) => {
        const chatRoomId = this.getChatRoomId(user.uid) // 선택된 유저
    }

    getChatRoomId = (userId) => {
        const currentUserId = this.props.user.uid // 로그인 된 유저

        return userId > currentUserId ? // 채팅방 Id가 2개가 되지 않도록
        `${userId}/${currentUserId}`
        :
        `${currentUserId}/${userId}`
    }

    render() {
        const { users } = this.state
        
        console.log('users', this.state.users)
        return (
            <div>
                <span style={{display:'flex', alignItems:'center'}}>
                    <AiOutlineSmile style={{marginRight: 3}} /> Direct Messages(1)
                </span>

                <ul style={{listStyleType: 'none', padding: 0}}>
                    {this.renderDirectMessages(users)}
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
export default connect(mapStateToProps)(DirectMessages)
