import React from 'react';
import {Container, Nav, Navbar} from "react-bootstrap";

export default function UrlyNav () {
    return (
        <Navbar bg={"light"} expand={"fluid"}>
            <Container fluid={true}>
                <Navbar.Brand href={"/"}>UrlyMcUrlFace's Url shortener</Navbar.Brand>
            </Container>
        </Navbar>
    )
}