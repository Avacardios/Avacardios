import React, { useState } from "react";
import { Link } from "react-router-dom";

const DropdownMenu = ({ setOpen, open })=>{
    
    const DropdownItem = (props)=>{
        return (
            <div className="menu-item"
            onClick={()=>setOpen(false)}>
                <Link to={`/account/${ props.children.toLowerCase() }`}>{ props.children }</Link>
            </div>
        )
    }
    
    return (<div className={`menu ${ open ? "menu-open" : ""}`}>
        <DropdownItem>Settings</DropdownItem>
        <DropdownItem>Orders</DropdownItem>
    </div>)
}
const Dropdown =()=>{
    const [open, setOpen] = useState(false)
    return (<div className={`dropdown-menu`}>
        <button className={open ? "dropdown-open" : ""} onClick={()=>setOpen(!open)}>Account</button>
        <DropdownMenu setOpen={ setOpen } open={ open }/>
    </div>)
}
export default Dropdown