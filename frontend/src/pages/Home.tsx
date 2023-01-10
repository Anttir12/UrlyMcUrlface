import React, {useState} from 'react';
import {Button, Col, Form, Row} from "react-bootstrap";
import axios from "axios";
import './Home.css';


export default function Home() {

    const [urlyId, setUrlyId] = useState<string|null>(null);
    const [urly, setUrly] = useState<string>("");
    const [url, setUrl] = useState<string>("");
    const [urlError, setUrlError] = useState<Array<string>>([]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios.post("/api/urly", {url: url})
            .then((res) => {
                setUrlyId(res.data.id);
                setUrly(`${window.location.origin}/${res.data.slug}`)
            })
            .catch((err) => {
                console.log(err);
                console.log(err.response?.data);
                setUrlError(err.response?.data?.url ?? [])
            });
    }

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
        setUrlError([]);
    }

    return (
        <Row className={"home-row"}>
            {!urlyId ?
                <>
                    <Col xs={12} className={"home-title"}>
                        <h1>Welcome to urlyMcUrlFace's URL shortener!</h1>
                    </Col>
                    <Form onSubmit={handleSubmit} className={"col-xs-12 form-container"}>
                        <Form.Group>
                            <Form.Control type={"text"} placeholder={"Type/paste your URL here"}
                                          onBlur={handleInputBlur} isInvalid={urlError.length > 0} required/>
                            <Form.Control.Feedback type={"invalid"}>
                                {urlError.map(err => {return <p>{err}</p>})}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className={"col-xs-12 mt-3 d-flex justify-content-center"}>
                            <Button variant={"primary"} type={"submit"}>
                                Urlify!
                            </Button>
                        </Form.Group>
                    </Form>
                </>
                :
                <>
                    <Col xs={12} className={"home-title"}>
                        <h2>Urly created!</h2>
                    </Col>
                    <Col xs={12}>
                        Short Urly: <b><a href={urly}>{urly}</a></b>
                    </Col>
                    <Col xs={12}>
                        You can monitor URL usage here: <a href={`/s/${urlyId}`}>{window.location.origin}/s/{urlyId}</a>
                    </Col>
                    <Col xs={12}>
                        <p>Need more Urlies? Click the button!</p>
                        <Button onClick={() => {
                            setUrlyId(null);
                            setUrly("");
                        }}>Create new URL</Button>
                    </Col>

                </>
            }
        </Row>
    );
}
