import React, { Component } from 'react'
import { AiOutlineSmile } from 'react-icons/ai'

export class DirectMessages extends Component {

    renderDirectMessages = () => {
        
    }

    render() {
        return (
            <div>
                <span style={{display:'flex', alignItems:'center'}}>
                    <AiOutlineSmile style={{marginRight: 3}} /> Direct Messages(1)
                </span>

                <ul style={{listStyleType: 'none', padding: 0}}>
                    {this.renderDirectMessages()}
                </ul>
            </div>
        )
    }
}

export default DirectMessages
