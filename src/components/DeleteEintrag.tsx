import { error } from "console";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from "react-bootstrap";
import { deleteEintrag, deleteProtokoll, getEintrag } from "../backend/api";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { EintragResource } from "../Resources";

interface DeleteProp {
    open: boolean;
    onHide: () => void;
}

export function DeleteEintrag({open, onHide}: DeleteProp){

    const params = useParams()
    let eintragId = params.eintragId;

    const navigate = useNavigate()

    async function deleteEint() {
        try {
            let p = await deleteEintrag(eintragId!)
            navigate(`/`)
        } catch (error) {
            
        }
    }

    return (
        <Modal show={open} onHide={onHide} backdrop="static" keyboard={false} centered>
            <ModalHeader>
                <ModalTitle>Löschen</ModalTitle>
            </ModalHeader>
            <ModalBody className="protocol-body" style={{fontWeight:"bold"}}>
                Möchten Sie den Eintrag wirklich löschen?
            </ModalBody>
            <ModalFooter>
                <Button onClick={onHide} style={{marginRight: "268px"}}>Abbrechen</Button>
                <Button className="btn-danger" onClick={() => deleteEint()}>OK</Button>
            </ModalFooter>
        </Modal>
    )
}