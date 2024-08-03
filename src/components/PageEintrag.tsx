import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ProtokollResource, EintragResource } from "../Resources";
import { getProtokoll, getAlleEintraege, getEintrag } from "../backend/api";
import { LoadingIndicator } from "./LoadingIndicator";
import { useErrorBoundary } from "react-error-boundary";
import { Button, Card, CardBody, CardFooter, CardHeader } from "react-bootstrap";
import { useLoginContext } from "./LoginContext";
import { DeleteEintrag } from "./DeleteEintrag";
import { EditEintrag } from "./EditEintrag";

export function PageEintrag(){
    const params = useParams()
    let protokollId = params.protokoll
    let eintragId = params.eintragId
    const [loading, setLoading] = useState<EintragResource | undefined>(undefined)
    const [totalEintrag, setEintrag] = useState<EintragResource>();

    const [show, setShow] = useState(false)
    const [show2, setShow2] = useState(false)

    const {showBoundary} = useErrorBoundary();

    const {loginInfo} = useLoginContext()

    useEffect(() => {
        async function load() {
            try {
                const eintrag = await getEintrag(eintragId!)
                setEintrag(eintrag)
                setLoading(eintrag)
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
        return (
        <div className="protocols-container">
            <Card className="protocol-card" key={totalEintrag?.ersteller}>
                <CardHeader style={{color: "white"}}>
                    Eintrag
                </CardHeader>
                <CardBody className="protocol-body">
                <div className="protocol-row"><span className="protocol-label">Getraenk: {totalEintrag?.getraenk}</span></div>
                <div className="protocol-row"><span className="protocol-label">Menge: {totalEintrag!.menge}</span></div>
                <div className="protocol-row"><span className="protocol-label">Kommentar: {totalEintrag!.kommentar}</span></div>
                <div className="protocol-row"><span className="protocol-label">Ersteller: {totalEintrag!.erstellerName}</span></div>
                <div className="protocol-row"><span className="protocol-label">Erstellt: {totalEintrag!.createdAt}</span></div>
                </CardBody>
                <CardFooter>
                            {loginInfo && (
                                <>
                                    <Button onClick={() => setShow(true)}>Editieren</Button>
                                    <Button className="btn btn-danger" style={{ marginLeft: "20px" }} onClick={() => setShow2(true)}>Löschen</Button>
                                    {show && <EditEintrag open={show} onHide={() => setShow(false)} />}
                                    {show2 && <DeleteEintrag open={show2} onHide={() => setShow2(false)} />}
                                </>
                            )}
                            <div>
                                <Link to={`/protokoll/${totalEintrag?.protokoll}`} style={{ display: "block", marginTop: "10px" }}>Zurück zum Protokoll</Link>
                            </div>
                        </CardFooter>
            </Card>
        </div>
        );
    }
}