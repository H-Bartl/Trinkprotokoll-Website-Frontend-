import { act, render, screen } from "@testing-library/react";
import { MyErrorFallback } from "../MyErrorFallback";
import { Bomb } from "./Bomb";
import { ErrorBoundary } from "react-error-boundary";

const orgError = console.error;

beforeEach(() => {
    console.error = () => {}
})

afterEach(() => {
    console.error = orgError;
})

test("Fallback testen",async () => {

    render(
        <div>
            <ErrorBoundary FallbackComponent = {MyErrorFallback}>
                <Bomb></Bomb>
            </ErrorBoundary>
        </div>
    )

    const linkElement = screen.getByText('💥 CABOOM 💥')
    expect(linkElement).toBeInTheDocument()
})