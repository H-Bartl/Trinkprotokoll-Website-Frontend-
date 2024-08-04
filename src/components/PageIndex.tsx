import { useState, useEffect, useContext } from "react";
import { ProtokollResource } from "../Resources";
import { LoadingIndicator } from "./LoadingIndicator";
import { getAlleProtokolle } from "../backend/api";
import { Link } from "react-router-dom";
import './PageIndex.css'; 
import { useErrorBoundary } from "react-error-boundary";
import { Card, CardBody, CardHeader, CardFooter, Button } from "react-bootstrap";
import { useLoginContext } from "./LoginContext";
import { LinkContainer } from "react-router-bootstrap";

export function PageIndex() {

    const [totalProt, setProtokoll] = useState<ProtokollResource[]>([]);
    const [loading, setLoading] = useState<ProtokollResource[] | undefined>(undefined);

    const {loginInfo} = useLoginContext()

    const { showBoundary } = useErrorBoundary();

    useEffect(() => {
        async function load() {
            try {
                const alleProtokolle = await getAlleProtokolle();
                setProtokoll(alleProtokolle);
                setLoading(alleProtokolle);
            } catch (error) {
                showBoundary(error);
            }
        }
        load();
    }, [showBoundary, loginInfo]);

    if (!loading) {
        return <LoadingIndicator />;
    } else {
        return (<>
            {loginInfo && (
                <div style={{marginTop:"20px", marginLeft:"10px"}}>
                    <LinkContainer to={"/protokoll/neu"}>
                        <Button className="btn-info">Neues Protokoll</Button>
                    </LinkContainer>
                </div>
            )}
            
            <div className="protocols-container">
                {
                    totalProt.map(p => (
                        <Card className="protocol-card" key={p.id} style={{marginTop:"30px"}}>
                            <CardHeader style={{color: "white"}}>
                                Protokoll von {p.patient}
                            </CardHeader>
                            <CardBody className="protocol-body">
                                <div className="protocol-row"><span className="protocol-label">Datum:</span> {p.datum}</div>
                                <div className="protocol-row"><span className="protocol-label">Öffentlich:</span> {p.public ? "Ja" : "Nein"}</div>
                                <div className="protocol-row"><span className="protocol-label">Geschlossen:</span> {p.closed ? "Ja" : "Nein"}</div>
                                <div className="protocol-row"><span className="protocol-label">Ersteller:</span> {p.erstellerName}</div>
                                <div className="protocol-row"><span className="protocol-label">Verändert:</span> {p.updatedAt}</div>
                                <div className="protocol-row"><span className="protocol-label">Gesamtemenge:</span> {p.gesamtMenge}</div>
                            </CardBody>
                            <CardFooter>
                                <Link to={`/protokoll/${p.id}`}>Ansehen</Link>
                            </CardFooter>
                        </Card>
                    ))
                }
            </div>
            </>
        );
    }
}
