import { FallbackProps } from "react-error-boundary";

export function MyErrorFallback({error}:FallbackProps){
    return (
        <div>
            <h1>Something went wrong:</h1>
            <pre>{error.message}</pre>
            <pre>{error.stack}</pre>
        </div>
    )
}