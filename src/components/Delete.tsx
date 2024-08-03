import { error } from "console";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from "react-bootstrap";
import { deleteProtokoll } from "../backend/api";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";

interface DeleteProp {
    open: boolean;
    onHide: () => void;
}

export function Delete({open, onHide}: DeleteProp){

    const params = useParams()
    let protokollId = params.protokollId;

    const navigate = useNavigate()

    const {showBoundary} = useErrorBoundary();

    async function deleteProt() {
        try {
            await deleteProtokoll(protokollId!)
            navigate("/")
        } catch (error) {

        }
    }

    return (
        <Modal show={open} onHide={onHide} backdrop="static" keyboard={false} centered>
            <ModalHeader>
                <ModalTitle>Löschen</ModalTitle>
            </ModalHeader>
            <ModalBody className="protocol-body" style={{fontWeight:"bold"}}>
                Möchten Sie das Protokoll wirklich löschen?
            </ModalBody>
            <ModalFooter>
                <Button onClick={onHide} style={{marginRight: "268px"}}>Abbrechen</Button>
                <Button className="btn-danger" onClick={() => deleteProt()}>OK</Button>
            </ModalFooter>
        </Modal>
    )
}