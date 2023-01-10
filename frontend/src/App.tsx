import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Container} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./pages/Home";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import UrlyStats from "./pages/UrlyStats";

function App() {
  return (
    <Container className="App">
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/s/:id" element={<UrlyStats />} />
            </Routes>
        </Router>
    </Container>
  );
}

export default App;
