import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, Button, FormLabel, FormText, Row, FormGroup, Card } from "react-bootstrap";
import './PageIndex.css'; 
import React, { useState } from "react";
import { erstellerId, getProtokoll, postEintrag, postProtokoll, putProtokoll } from "../backend/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form } from "react-bootstrap";
import { EintragResource, ProtokollResource } from "../Resources";
import { useErrorBoundary } from "react-error-boundary";
import { DefaultDeserializer } from "v8";
import { LinkContainer } from "react-router-bootstrap";

export function CreateEintrag() {

    const refTitle = React.useRef<HTMLInputElement>(null)
    const refOtherData = React.useRef<HTMLTextAreaElement>(null)

    const { showBoundary } = useErrorBoundary();

    const [getraenk, setGetraenk] = useState("");
    const [menge, setMenge] = useState<number>(0);
    const [kommentar, setKommentar] = useState("");

    const params = useParams();
    let protokollId = params.protokollId;

    let eintragResource: EintragResource = {
        getraenk: getraenk,
        menge: menge,
        kommentar: kommentar,
        ersteller: erstellerId,
        protokoll: protokollId!
    }

    const navigate = useNavigate();

    const [error, setError] = useState("");

    const [mengeError, setMengeError] = useState("")
    const [kommentarErr, setKommentarErr] = useState("")

    async function validate() {
        let isValid = true;

        if (getraenk.length < 1 || getraenk.length > 100) {
            setError("Name muss zwischen 1 und 100 Zeichen haben!");
            isValid = false;
        } else {
            setError("");
        }

        if (menge > 10000) {
            setMengeError("Menge muss weniger oder gleich 10000 sein.");
            isValid = false;
        } else if (menge <= 0) {
            setMengeError("Menge muss mehr als 0 sein.");
            isValid = false;
        } else {
            setMengeError("");
        }

        if (kommentar.length > 0 && (kommentar.length < 1 || kommentar.length > 1000)) {
            setKommentarErr("Kommentar muss zwischen 1 und 1000 Zeichen haben.");
            isValid = false;
        } else {
            setKommentarErr("");
        }

        return isValid;
    }

    async function createEintrag() {
        if (await validate()) {
            try {
                let p = await postEintrag(eintragResource)
                navigate(`/protokoll/${eintragResource.protokoll}`)
                
            } catch (error) {
                // showBoundary(error);
            }
        }
    }

    return (
        <Form style={{ marginTop: "30px", marginLeft: "10px", marginRight: "75%" }}>
            <Form.Label>Getraenk</Form.Label>
            <Form.Control type="text" value={getraenk} onChange={(e) => setGetraenk(e.target.value)} onBlur={validate} isInvalid={!!error}>
            </Form.Control>
            <Form.Control.Feedback type="invalid">
                {error}
            </Form.Control.Feedback>

            <Form.Label>Menge</Form.Label>
            <Form.Control type="number" value={menge} onChange={(e) => setMenge(parseInt(e.target.value))} onBlur={validate} isInvalid={!!mengeError}>
            </Form.Control>
            <Form.Control.Feedback type="invalid">
                {mengeError}
            </Form.Control.Feedback>

            <Form.Label>Kommentar</Form.Label>
            <Form.Control as="textarea" rows={4} placeholder="Kommentar (optional)" value={kommentar} onChange={(e) => setKommentar(e.target.value)} isInvalid={!!kommentarErr}></Form.Control>
            <Form.Control.Feedback type="invalid">
                {kommentarErr}
            </Form.Control.Feedback>

            <LinkContainer to="/" style={{ marginTop: "20px" }}>
                <Button className="btn btn-danger">Abbrechen</Button>
            </LinkContainer>

            <Button onClick={createEintrag} style={{ marginTop: "20px", marginLeft: "80px" }}>Speichern</Button>

            <hr className="separator" />

            <div>
                <Link to={`/protokoll/${protokollId}`}>Zurück zum Protokoll</Link>
            </div>
        </Form>
    );
}
