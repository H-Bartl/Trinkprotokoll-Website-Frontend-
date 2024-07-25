import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ProtokollResource, EintragResource } from "../Resources";
import { getProtokoll, getAlleEintraege, getEintrag } from "../backend/api";
import { LoadingIndicator } from "./LoadingIndicator";
import { useErrorBoundary } from "react-error-boundary";
import { Card, CardBody, CardFooter, CardHeader } from "react-bootstrap";

export function PageEintrag(){
    const params = useParams()
    let eintragId = params.eintragId
    const [loading, setLoading] = useState<EintragResource | undefined>(undefined)
    const [totalEintrag, setEintrag] = useState<EintragResource>();

    const {showBoundary} = useErrorBoundary();

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
    })

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
            </Card>
        </div>
        );
    }
}