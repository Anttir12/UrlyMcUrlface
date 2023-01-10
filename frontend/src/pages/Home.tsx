import React, {useState} from 'react';
import {Button, Col, Form, Row} from "react-bootstrap";
import axios from "axios";


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
        <>
            {!urlyId ?
                <>
                    <Row>
                        <Col xs={12}>
                            <h1>Welcome to urlyMcUrlFace's URL shortener!</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group>
                                    <Form.Control type={"text"} placeholder={"Type your URL here"}
                                                  onBlur={handleInputBlur} isInvalid={urlError.length > 0} required/>
                                    <Form.Control.Feedback type={"invalid"}>
                                        {urlError.map(err => {return <p>{err}</p>})}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Button variant={"primary"} type={"submit"}>
                                    Submit
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </>
                :
                <>
                    <h2>URL CREATED!</h2>
                    <p>Shortened URL: <b><a href={urly}>{urly}</a></b></p>
                    <p>You can monitor URL usage here: <a href={`/s/${urlyId}`}>{window.location.origin}/s/{urlyId}</a></p>
                    <Button onClick={() => {
                        setUrlyId(null);
                        setUrly("");
                    }}>Create new URL</Button>
                </>
            }
        </>
    );
}
