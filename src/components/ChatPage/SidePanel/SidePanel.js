import React from 'react'
import ChatRooms from './ChatRooms'
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
        <ChatRooms />
        <DirectMessages />   
        </div>
    )
}

export default SidePanel
