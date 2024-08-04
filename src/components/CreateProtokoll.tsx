import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, Button, FormLabel, FormText, Row, FormGroup, Card } from "react-bootstrap";
import './PageIndex.css'; 
import React, { useState } from "react";
import { erstellerId, getAlleProtokolle, postProtokoll } from "../backend/api";
import { useNavigate, useParams } from "react-router-dom";
import { Form } from "react-bootstrap";
import { ProtokollResource } from "../Resources";
import { useErrorBoundary } from "react-error-boundary";
import { LinkContainer } from "react-router-bootstrap";
import { ErrorFromValidation } from "../backend/fetchWithErrorHandling";

export function CreateProtokoll() {

    const refTitle = React.useRef<HTMLInputElement>(null)
    const refOtherData = React.useRef<HTMLTextAreaElement>(null)

    const { showBoundary } = useErrorBoundary();

    const [patient, setPatient] = useState("")
    const [date, setDate] = useState("")
    const [publik, setPublic] = useState<boolean>(false);
    const [closed, setClosed] = useState<boolean>(false);

    const [validationErrors, setValidationErrors] = useState({});
    const [error, setError] = useState("")

    const navigate = useNavigate();

    let protResource: ProtokollResource = {
        patient: patient,
        datum: date,
        public: publik,
        closed: closed,
        ersteller: erstellerId
    }

    async function validate() {
        let isValid = true;
        let errorMessage = "";

        if (patient.length < 3 || patient.length > 100) {
            errorMessage = "Name muss zwischen 3 und 100 Zeichen haben!";
            isValid = false;
        }

        // Überprüfe, ob bereits ein Protokoll mit demselben Patienten und Datum existiert
        const protokolls = await getAlleProtokolle();
        const duplicate = protokolls.find(prot => prot.patient === patient && prot.datum === date);
        if (duplicate) {
            errorMessage = "Ein Protokoll mit demselben Patienten und Datum existiert bereits!";
            isValid = false;
        }

        setError(errorMessage);
        return isValid;
    }

    async function postProt() {
        if (await validate()) {
            try {
                let p = await postProtokoll(protResource)
                if (p) {
                    navigate(`/`)
                }
            } catch (error) {
                if (error instanceof ErrorFromValidation) {
                    error.validationErrors.forEach((validationError) => {
                        setValidationErrors({ ...validationErrors, [validationError.value]: validationError.msg });
                    })
                }
            }
        }
    }

    return (
        <Form style={{ marginTop: "30px", marginLeft: "10px", marginRight: "70%" }}>

            <Form.Label>Patient</Form.Label>
            <Form.Control type="text" value={patient} onChange={(e) => setPatient(e.target.value)} onBlur={validate} isInvalid={!!error}>
            </Form.Control>
            <Form.Control.Feedback type="invalid">
                {error + validationErrors}
            </Form.Control.Feedback>

            <Form.Label>Datum</Form.Label>
            <Form.Control type="date" placeholder="DD.MM.YYYY" value={date} onChange={(e) => setDate(e.target.value)} onBlur={validate}>
            </Form.Control>

            <Form.Label>Öffentlich</Form.Label>
            <Form.Check
                type="checkbox"
                checked={publik}
                onChange={(e) => setPublic(e.target.checked)}
            />

            <Form.Label>Geschlossen</Form.Label>
            <Form.Check
                type="checkbox"
                checked={closed}
                onChange={(e) => setClosed(e.target.checked)}
            />

            <LinkContainer to="/" style={{ marginTop: "20px" }}>
                <Button className="btn btn-danger">Abbrechen</Button>
            </LinkContainer>

            <Button onClick={postProt} style={{ marginTop: "20px", marginLeft: "80px" }}>Speichern</Button>
        </Form>
    )
}
