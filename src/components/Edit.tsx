import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, Button } from "react-bootstrap";
import './PageIndex.css'; 
import { useEffect, useState } from "react";
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

    const [protokollTotal, setProtokollTotal] = useState<ProtokollResource>();
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
        if(patient.length < 3 || patient.length > 1000){
            setError("Name muss zwischen 3 und 1000 zeichen haben")
        } else {
            setError("");
        }
    }

    useEffect(() => {
        async function load() {
            try {
                const protokoll = await getProtokoll(protokollId!);
                setProtokollTotal(protokoll)
                setPatient(protokoll.patient);
                setDate(protokoll.datum);
                setPublic(protokoll.public!);
                setClosed(protokoll.closed!);
            } catch (error) {
                // handle error
            }
        }
        load();
    }, [protokollId])

    async function putProt() {
        try {
            let p = await putProtokoll(protResource)
            if(p){
                navigate(`/`)
            }
            onHide()
        } catch (error) {
            //showBoundary(error)
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
                {error && (
                    <div style={{ color: 'rgb(149, 46, 46)', fontWeight: 'bold' }}>{error}</div>
                )}

                <label className="protocol-label">Datum:</label>
                <input type="date" id="datum" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} style={{marginBottom:"10px"}}/>
                
                <div style={{marginBottom:"7px"}}>
                    <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="publicCheck" 
                        checked={publik} 
                        onChange={(e) => setPublic(e.target.checked)} 
                    />
                    <label className="form-check-label" style={{marginLeft:"10px"}}>öffentlich</label>
                </div>

                <div>
                    <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="closedCheck" 
                        checked={closed} 
                        onChange={(e) => setClosed(e.target.checked)} 
                    />
                    <label className="form-check-label" style={{marginLeft:"10px"}}>geschlossen</label>
                </div>
                
                <Button className="btn-danger" onClick={onHide} style={{marginRight:"270px", marginTop:"7px"}}>Abbrechen</Button>
                <Button className="btn-success" onClick={putProt}>Speichern</Button>
            </ModalBody>
            <ModalFooter>
                <Button onClick={onHide} style={{marginRight: "285px"}}>Zurück zur Übersicht</Button>
            </ModalFooter>
        </Modal>
    )
}
