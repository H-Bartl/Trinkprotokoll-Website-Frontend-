import { useState, useEffect } from "react";
import { EintragResource, ProtokollResource } from "../Resources";
import { deleteProtokoll, getAlleEintraege, getProtokoll } from "../backend/api";
import { LoadingIndicator } from "./LoadingIndicator";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useErrorBoundary } from "react-error-boundary";
import './PageProtokoll.css'; 
import { Button, Card, CardBody, CardFooter, CardHeader } from "react-bootstrap";
import { Edit } from "./Edit";
import { useLoginContext } from "./LoginContext";
import { Delete } from "./Delete";
import { LinkContainer } from "react-router-bootstrap";
import { EditEintrag } from "./EditEintrag";

export function PageProtokoll(){

    const params = useParams()
    let protokollId = params.protokollId

    const [totalProtokoll, setProtokoll] = useState<ProtokollResource>();
    const [loading, setLoading] = useState<ProtokollResource | undefined>(undefined)
    const [totalEintrag, setEintrag] = useState<EintragResource[]>();

    const navigate = useNavigate();

    const {loginInfo} = useLoginContext()

    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false)
    const [showDetail, setShowDetail] = useState(false)

    const {showBoundary} = useErrorBoundary();

    async function protEdit() {
        setShow(true)
    }

    async function deleteProt() {
        try {
            let p = await deleteProtokoll(protokollId!.toString())
            navigate("/")
        } catch (error) {
            
        }
    }

    useEffect(() => {
        async function load() {
            try {
                const protokoll = await getProtokoll(protokollId!);
                const eintrag = await getAlleEintraege(protokollId!)
                setProtokoll(protokoll)
                setEintrag(eintrag)
                setLoading(protokoll)
            } catch (error) {
                showBoundary(error)
            }
            
        }
        load();
    },[])

    if (!loading) {
        return <LoadingIndicator/>
    }
    else{
        return (<div>
                {loginInfo && (
                    <div style={{marginTop:"20px", marginLeft:"10px"}}>
                        <LinkContainer to={`/protokoll/${protokollId}/eintrag/neu`}>
                            <Button className="btn-info">Erstellen</Button>
                        </LinkContainer>
                    </div>
                )}
                    {

                            <Card className="protocol-card" key={totalProtokoll!.ersteller}>
                                <CardHeader style={{color: "white"}}>
                                    Protokoll von {totalProtokoll?.patient}
                                </CardHeader>
                                <CardBody className="protocol-body">
                                    <div className="protocol-row"><span className="protocol-label">Datum: {totalProtokoll!.datum}</span></div>
                                    <div className="protocol-row"><span className="protocol-label">Öffentlich: {totalProtokoll!.public ? "Ja" : "Nein"}</span></div>
                                    <div className="protocol-row"><span className="protocol-label">Geschlossen: {totalProtokoll!.closed ? "Ja" : "Nein"}</span></div>
                                    <div className="protocol-row"><span className="protocol-label">Ersteller: {totalProtokoll!.erstellerName}</span></div>
                                    <div className="protocol-row"><span className="protocol-label">Verändert: {totalProtokoll!.updatedAt}</span></div>
                                    <div className="protocol-row"><span className="protocol-label">Gesamtemenge: {totalProtokoll!.gesamtMenge}</span></div>
                                </CardBody>
                                <CardFooter>
                                    {loginInfo && (<><Button onClick={protEdit}>Editieren</Button><Button className="btn btn-danger" style={{marginLeft:"20px"}} onClick={() => setShow2(true)}>Löschen</Button></>)}
                                    {show && <Edit open={show} onHide={() => setShow(false)}></Edit>}
                                    {show2 && <Delete open={show2} onHide={() => setShow2(false)}></Delete>}
                                </CardFooter>
                            </Card>
                                    
                        
                    }
                    {totalEintrag!.map((eintrag) =>
                                        <Card className="protocol-card" key={eintrag.ersteller}>
                                            <CardHeader style={{color: "white"}}>
                                                Eintraege von {totalProtokoll!.patient}
                                            </CardHeader>
                                            <CardBody className="protocol-body">
                                                <div className="protocol-row"><span className="protocol-label">Getraenk: {eintrag.getraenk}</span></div>
                                                <div className="protocol-row"><span className="protocol-label">Menge: {eintrag.menge}</span></div>
                                                <div className="protocol-row"><span className="protocol-label">Kommentar: {eintrag.kommentar}</span></div>
                                                <div className="protocol-row"><span className="protocol-label">Ersteller: {eintrag.erstellerName}</span></div>
                                                <div className="protocol-row"><span className="protocol-label">Erstellt: {eintrag.createdAt}</span></div>
                                            </CardBody>
                                            <CardFooter>
                                                <LinkContainer to={`/eintrag/${eintrag.id}`}>
                                                    <Button>Details</Button>
                                                </LinkContainer>
                                            </CardFooter>
                                        </Card>
                                        )}
            </div>
        );
    }
}