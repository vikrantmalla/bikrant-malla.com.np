import React, { useState } from 'react'
import Link from 'next/link'
import Switch from './Switch'

const NavBar = () => {
    const [click, setClick] = useState(false);

    const handleClick = () => setClick(!click);

    return (
        <>

            <header className="header container">
                <div className="nav-container">
                    <nav className="nav">
                        <ul className={click ? "nav-menu active" : "nav-menu"}>
                            <li className="nav-item ff-serif-jose fs-400">
                                <Link href="#aboutme">
                                    <a>AboutMe</a>
                                </Link>
                            </li>
                            <li className="nav-item ff-serif-jose fs-400">
                                <Link href="#skill">
                                    <a>Skill</a>
                                </Link>
                            </li>
                            <li className="nav-item ff-serif-jose fs-400">
                                <Link href="#project">
                                    <a>Project</a>
                                </Link>
                            </li>
                            <li className="nav-item ff-serif-jose fs-400">
                                <Link href="#concept">
                                    <a>Concept</a>
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <div className="menu-icon" onClick={handleClick}>
                        <i className={click ? "fas fa-times" : "fas fa-bars"} />
                    </div>
                    <Switch />
                </div>
            </header>

        </>
    )
}

export default NavBar
