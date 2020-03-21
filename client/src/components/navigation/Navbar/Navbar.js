import React from "react";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

const navbar = ( props ) => {

    return (
        <Navbar bg='light' expand='lg'>
            <Navbar.Brand href='/home'>CoronaLog</Navbar.Brand>
            <Navbar.Toggle aria-controls='basic-navbar-nav' />
            <Navbar.Collapse id='basic-navbar-nav'>
                <Nav className='mr-auto'>
                    <Nav.Link href='/'>Home</Nav.Link>
                    <Nav.Link href='/about-us'>About Us</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );

}

export default navbar;