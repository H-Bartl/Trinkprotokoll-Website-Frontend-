import { useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from "react-bootstrap";
import { useLoginContext } from "./LoginContext";
import { postLogin } from "../backend/api";
import './PageIndex.css'; 

interface LoginDialogProps {
    open: boolean;
    onHide: () => void;
}

export function LoginDialog({open, onHide}: LoginDialogProps){
    
    const { setLoginInfo } = useLoginContext();
    const [loginData, setLoginData] = useState({ name: "", password: "" });
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [loginFailed, setLoginFailed] = useState("");

    async function onLogin() {
        try {
            setLoginData({name: name, password: password})
            const loginInfo = await postLogin(name, password)
            setLoginInfo(loginInfo)
            setLoginFailed("")
            onHide();
        } catch (error) {
            setLoginFailed("Benutzername oder Passwort falsch!")
        }
    }

    function onCancel() {
        setLoginData({ name: loginData.name, password: "" });
        onHide();
    }

    return (
        <Modal show={open} onHide={onHide} backdrop="static" keyboard={false}>
            <ModalHeader closeButton>
                <ModalTitle>Login</ModalTitle>
            </ModalHeader>
            <ModalBody className="protocol-body">
                <label className="protocol-label">Name: <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}/></label>
                <label className="protocol-label">Passwort: <input type="text" id="password" value={password} onChange={(e) => setPassword(e.target.value)}/></label>
                {<div style={{color: 'rgb(149, 46, 46)', fontWeight: 'bold'}}>{loginFailed}</div>}
            </ModalBody>
            <ModalFooter>
                <Button className="btn btn-danger" onClick={onCancel}>Abbrechen</Button>
                <Button onClick={onLogin}>OK</Button>
            </ModalFooter>
        </Modal>
    )
}