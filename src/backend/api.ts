// istanbul ignore file -- no coverage, since we would need a running backend for that

import { EintragResource, LoginResource, ProtokollResource } from "../Resources";
import { LoginInfo } from "../components/LoginContext";
import { fetchWithErrorHandling } from "./fetchWithErrorHandling";
import { eintraege, protokolle } from "./testdata";

export let erstellerId: string;

export async function getAlleProtokolle(): Promise<ProtokollResource[]> {
    if (process.env.REACT_APP_REAL_FETCH!=='true') {
        await new Promise(r => setTimeout(r, 700));
        return Promise.resolve(protokolle);
    } else {
        // Implementieren Sie hier einen echten Fetch-Call,
        // um die Daten tatsächlich von Ihrem Server zu laden.
        const url = `${process.env.REACT_APP_API_SERVER_URL}/api/protokoll/alle`
        const response = await fetchWithErrorHandling(url, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            credentials: "include" as RequestCredentials
        });
        return await response.json()
    }
}

export async function getAlleEintraege(protokollId: string): Promise<EintragResource[]> {
    if (process.env.REACT_APP_REAL_FETCH!=='true') {
        await new Promise(r => setTimeout(r, 700));
        return Promise.resolve(eintraege);
    } else {
        // Implementieren Sie hier einen echten Fetch-Call,
        // um die Daten tatsächlich von Ihrem Server zu laden.
        const url = `${process.env.REACT_APP_API_SERVER_URL}/api/protokoll/${protokollId}/eintraege`
        const response = await fetchWithErrorHandling(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include" as RequestCredentials});
        return await response.json()
    }
}

export async function getProtokoll(protokollId:string): Promise<ProtokollResource> {
    if (process.env.REACT_APP_REAL_FETCH!=='true') {
        await new Promise(r => setTimeout(r, 700));
        return Promise.resolve(protokolle[0]);
    } else {
        // Implementieren Sie hier einen echten Fetch-Call,
        // um die Daten tatsächlich von Ihrem Server zu laden.
        const url = `${process.env.REACT_APP_API_SERVER_URL}/api/protokoll/${protokollId}`
        const response = await fetchWithErrorHandling(url, {credentials: "include" as RequestCredentials})
        return await response.json()
    }
    
}

export async function putProtokoll(protResource: ProtokollResource): Promise<ProtokollResource> {

    const url = `${process.env.REACT_APP_API_SERVER_URL}/api/protokoll/${protResource.id}`
    const response = await fetchWithErrorHandling(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(protResource),
        credentials: "include" as RequestCredentials
    })
    return await response.json()
}

export async function postProtokoll(protResource:ProtokollResource): Promise<ProtokollResource> {
    const url = `${process.env.REACT_APP_API_SERVER_URL}/api/protokoll/`
    const response = await fetchWithErrorHandling(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(protResource),
        credentials: "include" as RequestCredentials
    })
    return await response.json()
}

export async function deleteProtokoll(protokollId:string) {
    const url = `${process.env.REACT_APP_API_SERVER_URL}/api/protokoll/${protokollId}`
    await fetchWithErrorHandling(url, {
        method: "DELETE",
        credentials: "include" as RequestCredentials
    })
}

export async function getEintrag(eintragId:string): Promise<EintragResource> {
    if (process.env.REACT_APP_REAL_FETCH!=='true') {
        await new Promise(r => setTimeout(r, 700));
        return Promise.resolve(eintraege[0]);
    } else {
        // Implementieren Sie hier einen echten Fetch-Call,
        // um die Daten tatsächlich von Ihrem Server zu laden.
        const url = `${process.env.REACT_APP_API_SERVER_URL}/api/eintrag/${eintragId}`
        const response = await fetchWithErrorHandling(url, {credentials: "include" as RequestCredentials})
        return await response.json()
    }
    // const url = `${process.env.REACT_APP_API_SERVER_URL}/api/protokoll/${protokollId}`
    //     const response = await fetchWithErrorHandling(url)
    //     return await response.json()
    
}

export async function putEintrag(eintragResource: EintragResource): Promise<EintragResource> {

    const url = `${process.env.REACT_APP_API_SERVER_URL}/api/eintrag/${eintragResource.id}`
    const response = await fetchWithErrorHandling(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(eintragResource),
        credentials: "include" as RequestCredentials
    })
    return await response.json()
}

export async function postEintrag(eintragResource: EintragResource): Promise<EintragResource> {
    const url = `${process.env.REACT_APP_API_SERVER_URL}/api/eintrag/`
    const response = await fetchWithErrorHandling(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(eintragResource),
        credentials: "include" as RequestCredentials
    })
    return await response.json()
}

export async function deleteEintrag(eintragId:string) {
    const url = `${process.env.REACT_APP_API_SERVER_URL}/api/eintrag/${eintragId}`
    await fetchWithErrorHandling(url, {
        method: "DELETE",
        credentials: "include" as RequestCredentials
    })
}

export async function postLogin(name: string, password: string):Promise<LoginResource> {
    const url = `${process.env.REACT_APP_API_SERVER_URL}/api/login/`
    const response = await fetchWithErrorHandling(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include" as RequestCredentials,
        body: JSON.stringify({ name, password })
    })
    return await response.json()
}

export async function getLogin(): Promise<LoginInfo|false> {
    const url = `${process.env.REACT_APP_API_SERVER_URL}/api/login/`
    const response = await fetchWithErrorHandling(url, {
        method: "GET",
        credentials: "include" as RequestCredentials
    })
    let retur = await response.json()
    erstellerId = retur.id
    return retur
}

export async function deleteLogin(): Promise<any> {
    const url = `${process.env.REACT_APP_API_SERVER_URL}/api/login/`
    const response = await fetchWithErrorHandling(url, { 
        method: "DELETE", 
        credentials: "include" as RequestCredentials
    })
    return response
}