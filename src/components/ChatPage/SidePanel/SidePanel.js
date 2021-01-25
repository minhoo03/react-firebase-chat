import React from 'react'
import ChatRoom from './ChatRoom'
import FavoritePanel from './FavoritePanel'
import DirectMessages from './DirectMessages'
import UserPanel from './UserPanel'

function SidePanel() {
    return (
        <div style={{
            backgroundColor:'#7B83EB',
            padding:'2rem',
            minHeight:'100vh',
            color:'white',
            minWidth:'275px'
        }}
        >
        <UserPanel />
        <FavoritePanel /> 
        <ChatRoom />
        <DirectMessages />   
        </div>
    )
}

export default SidePanel
