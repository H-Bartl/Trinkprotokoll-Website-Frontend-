import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, Button, FormLabel, FormText, Row, FormGroup, Card } from "react-bootstrap";
import './PageIndex.css'; 
import React, { useState } from "react";
import { erstellerId, getProtokoll, postProtokoll, putProtokoll } from "../backend/api";
import { useNavigate, useParams } from "react-router-dom";
import { Form } from "react-bootstrap";
import { ProtokollResource } from "../Resources";
import { useErrorBoundary } from "react-error-boundary";
import { DefaultDeserializer } from "v8";
import { LinkContainer } from "react-router-bootstrap";

export function CreateProtokoll() {

    const refTitle = React.useRef<HTMLInputElement>(null)
    const refOtherData = React.useRef<HTMLTextAreaElement>(null)

    const {showBoundary} = useErrorBoundary();

    const [patient, setPatient] = useState("")
    const [date, setDate] = useState("")
    const [publik, setPublic] = useState<boolean>(false);
    const [closed, setClosed] = useState<boolean>(false);

    const navigate = useNavigate();

    let protResource: ProtokollResource = {
        patient: patient,
        datum: date,
        public: publik,
        closed: closed,
        ersteller: erstellerId
    }

    const [error, setError] = useState("")

    async function validate() {
        if(patient.length < 3 || patient.length > 100){
            setError("Name muss zwischen 3 und 100 zeichen haben!")
        }
    }

    async function postProt() {
        try {
            let p = await postProtokoll(protResource)
            if(p){
                navigate(`/`)
            }
        } catch (error) {
        }
    }


    return (
        <Form style={{marginTop:"30px", marginLeft:"10px", marginRight:"75%"}}>

            <Form.Label>Patient</Form.Label>
            <Form.Control type="text" value={patient} onChange={(e) => setPatient(e.target.value)} onBlur={validate} isInvalid={!!error}>
            </Form.Control>
            <Form.Control.Feedback type="invalid">
                {error}
            </Form.Control.Feedback>
            
            <Form.Label>Datum</Form.Label>
            <Form.Control type="date" placeholder="DD.MM.YYYY" value={date} onChange={(e) => setDate(e.target.value)} onBlur={validate}>
            </Form.Control>

            <Form.Label>Öffentlich</Form.Label>
            <Form.Control className="form-check-input" type="checkbox" value={publik.toString()} onChange={(e) => setPublic(true)}></Form.Control>
            
            <Form.Label>Geschlossen</Form.Label>
            <Form.Control className="form-check-input" type="checkbox" value={closed.toString()} onChange={(e) => setClosed(true)}></Form.Control>
            
            <LinkContainer to="/" style={{marginTop:"20px"}}>
                <Button className="btn btn-danger">Abbrechen</Button>
            </LinkContainer>

            <Button onClick={postProt} style={{marginTop:"20px", marginLeft:"80px"}}>Speichern</Button>
        </Form>
    )
}