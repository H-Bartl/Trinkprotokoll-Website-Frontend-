import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, Button } from "react-bootstrap";
import './PageIndex.css'; 
import { useEffect, useState } from "react";
import { erstellerId, getEintrag, putEintrag } from "../backend/api";
import { useNavigate, useParams } from "react-router-dom";
import { EintragResource } from "../Resources";
import { useErrorBoundary } from "react-error-boundary";

interface EditProp {
    open: boolean;
    onHide: () => void;
}

export function EditEintrag({open, onHide}: EditProp) {

    const {showBoundary} = useErrorBoundary();

    const [getraenk, setGetraenk] = useState("");
    const [menge, setMenge] = useState<number>(0);
    const [kommentar, setKommentar] = useState("");
    const [eintrag, setEintrag] = useState<EintragResource>();

    const params = useParams();
    let eintragId = params.eintragId;
    let protokollId = params.protokollId;

    const navigate = useNavigate();

    const [error, setError] = useState("");
    const [mengeError, setMengeError] = useState("");
    const [kommentarErr, setKommentarErr] = useState("");

    let eintragResource: EintragResource = {
        id: eintragId,
        menge: menge,
        getraenk: getraenk,
        kommentar: kommentar,
        ersteller: erstellerId,
        protokoll: eintrag?.protokoll!
    };

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

    useEffect(() => {
        async function load() {
            try {
                const get = await getEintrag(eintragId!);
                setEintrag(get);
                setGetraenk(get.getraenk);
                setMenge(get.menge);
                setKommentar(get.kommentar!);
            } catch (error) {
                showBoundary(error);
            }
        }
        load();
    }, [eintragId, showBoundary]);

    async function putEint() {
        if (await validate()) {
            try {
                let p = await putEintrag(eintragResource);
                if (p) {
                    navigate(`/`);
                }
                onHide();
            } catch (error) {
                showBoundary(error);
            }
        }
    }

    return (
        <Modal show={open} onHide={onHide} backdrop="static" keyboard={false}>
            <ModalHeader>
                <ModalTitle>Editieren</ModalTitle>
            </ModalHeader>
            <ModalBody className="protocol-body">
                <label className="protocol-label">Getraenk:</label>
                <input type="text" id="getraenk" className="form-control" value={getraenk} onChange={(e) => setGetraenk(e.target.value)} onBlur={validate} />
                {error && (
                    <div style={{ color: 'rgb(149, 46, 46)', fontWeight: 'bold' }}>{error}</div>
                )}

                <label className="protocol-label">Menge:</label>
                <input type="number" id="menge" className="form-control" value={menge} onChange={(e) => setMenge(parseInt(e.target.value))} onBlur={validate} style={{marginBottom:"10px"}} />
                {mengeError && (
                    <div style={{ color: 'rgb(149, 46, 46)', fontWeight: 'bold' }}>{mengeError}</div>
                )}

                <label className="protocol-label">Kommentar:</label>
                <input type="text" id="kommentar" className="form-control" value={kommentar} onChange={(e) => setKommentar(e.target.value)} onBlur={validate} style={{marginBottom:"10px"}} />
                {kommentarErr && (
                    <div style={{ color: 'rgb(149, 46, 46)', fontWeight: 'bold' }}>{kommentarErr}</div>
                )}

                <Button className="btn-danger" onClick={onHide} style={{marginRight:"270px", marginTop:"7px"}}>Abbrechen</Button>
                <Button className="btn-success" onClick={putEint}>Speichern</Button>
            </ModalBody>
            <ModalFooter>
                <Button onClick={onHide} style={{marginRight: "285px"}}>Zurück zur Übersicht</Button>
            </ModalFooter>
        </Modal>
    );
}
