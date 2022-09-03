import NavLinks from "./NavLinks";
import {GiHamburgerMenu} from 'react-icons/gi'
import { useState } from "react";
import "./Navbar.css";
const Navbar= () => {

    const [open, setOpen] = useState(false);

    return(
        <>
            <div className="logo">
            <img src="https://i.ibb.co/yPk5FFv/abccc.png" alt = "logo"></img>
            </div>
            <GiHamburgerMenu className ='hamburger' 
            size ='40px' color='white' 
            onClick ={() => setOpen(!open)}/>
            { open && <div className="drop-down-menu"><NavLinks /></div>}
            <div className="menu">
                <NavLinks />
            </div>
        </>
    );
}

export default Navbar;