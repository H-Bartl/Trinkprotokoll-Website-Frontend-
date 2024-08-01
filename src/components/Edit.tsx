import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, Button } from "react-bootstrap";
import './PageIndex.css'; 
import { useState } from "react";
import { erstellerId, getProtokoll, putProtokoll } from "../backend/api";
import { useNavigate, useParams } from "react-router-dom";
import { ProtokollResource } from "../Resources";
import { useErrorBoundary } from "react-error-boundary";

interface EditProp {
    open: boolean;
    onHide: () => void;
}

export function Edit({open, onHide}: EditProp) {


    const {showBoundary} = useErrorBoundary();

    const [patient, setPatient] = useState("")
    const [date, setDate] = useState("")
    const [publik, setPublic] = useState<boolean>(false);
    const [closed, setClosed] = useState<boolean>(false);
    const params = useParams()
    let protokollId = params.protokollId

    const navigate = useNavigate();

    let protResource: ProtokollResource = {
        id: protokollId,
        patient: patient,
        datum: date,
        public: publik,
        closed: closed,
        ersteller: erstellerId
    }

    const [error, setError] = useState("")

    async function validate() {
        if(patient.length<1000 && patient.length<3){
            setError("Name muss zwischen 3 und 1000 zeichen haben")
        }
    }

    async function putProt() {
        try {
            let p = await putProtokoll(protResource)
            if(p){
                navigate(`/`)
            }
            onHide()
        } catch (error) {
            showBoundary(error)
        }
    }


    return (

        <Modal show={open} onHide={onHide} backdrop="static" keyboard={false}>
            <ModalHeader>
                <ModalTitle>Editieren</ModalTitle>
            </ModalHeader>
            <ModalBody className="protocol-body">
                <label className="protocol-label">Patient:</label>
                <input type="text" id="patient" className="form-control" value={patient} onChange={(e) => setPatient(e.target.value)} onBlur={validate}/>

                <label className="protocol-label">Datum:</label>
                <input type="text" id="datum" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} style={{marginBottom:"10px"}}/>
                
                <div style={{marginBottom:"7px"}}>
                    <input className="form-check-input" type="checkbox" id="publicCheck" value={publik.toString()} onChange={(e) => setPublic(true)}/>
                    <label className="form-check-label" style={{marginLeft:"10px"}}>öffentlich</label>
                </div>

                <div>
                    <input className="form-check-input" type="checkbox" id="closedCheck" value={closed.toString()} onChange={(e) => setClosed(true)}/>
                    <label className="form-check-label" style={{marginLeft:"10px"}}>geschlossen</label>
                </div>
                
                <Button className="btn-danger" onClick={onHide} style={{marginRight:"270px", marginTop:"7px"}}>Abbrechen</Button><Button className="btn-success" onClick={putProt}>Speichern</Button>

                {<div style={{ color: 'rgb(149, 46, 46)', fontWeight: 'bold' }}></div>}
            </ModalBody>
            <ModalFooter>
                <Button onClick={onHide} style={{marginRight: "285px"}}>Zurück zur Übersicht</Button>
            </ModalFooter>
        </Modal>
    )
}
