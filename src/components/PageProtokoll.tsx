import { useState, useEffect } from "react";
import { EintragResource, ProtokollResource } from "../Resources";
import { getAlleEintraege, getProtokoll } from "../backend/api";
import { LoadingIndicator } from "./LoadingIndicator";
import { Link, useParams } from "react-router-dom";
import { useErrorBoundary } from "react-error-boundary";
import './PageProtokoll.css'; 
import { Card, CardBody, CardFooter, CardHeader } from "react-bootstrap";

export function PageProtokoll(){
    const params = useParams()
    let protokollId = params.protokollId
    const [totalProtokoll, setProtokoll] = useState<ProtokollResource>();
    const [loading, setLoading] = useState<ProtokollResource | undefined>(undefined)
    const [totalEintrag, setEintrag] = useState<EintragResource[]>();

    const {showBoundary} = useErrorBoundary();

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
    })

    if (!loading) {
        return <LoadingIndicator/>
    }
    else{
        return (<div>
                    {

                            <Card className="protocol-card" key={totalProtokoll!.ersteller}>
                                <CardHeader style={{color: "white"}}>
                                    Protokoll von {totalProtokoll?.patient}
                                </CardHeader>
                                <CardBody className="protocol-body">
                                    <div className="protocol-row"><span className="protocol-label">Datum: {totalProtokoll!.datum}</span></div>
                                    <div className="protocol-row"><span className="protocol-label">Öffentlich: {totalProtokoll!.public!.toString()}</span></div>
                                    <div className="protocol-row"><span className="protocol-label">Geschlossen: {totalProtokoll!.closed!.toString()}</span></div>
                                    <div className="protocol-row"><span className="protocol-label">Ersteller: {totalProtokoll!.erstellerName}</span></div>
                                    <div className="protocol-row"><span className="protocol-label">Verändert: {totalProtokoll!.updatedAt}</span></div>
                                    <div className="protocol-row"><span className="protocol-label">Gesamtemenge: {totalProtokoll!.gesamtMenge}</span></div>
                                </CardBody>
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
                                                <Link to={`/eintrag/${eintrag.id}`}>Eintrag ansehen</Link>
                                            </CardFooter>
                                        </Card>
                                        )}
            </div>
        );
    }
}