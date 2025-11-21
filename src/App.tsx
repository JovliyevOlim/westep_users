import Route from './route/index.tsx';
import {ToastProvider} from "./layouts/ToastProvider.tsx";

function App() {

    return (
        <>
            <Route/>
            <ToastProvider/>
        </>
)
}

export default App
