import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Manutencao from "./pages/Manutencao/Index";

function RoutesApp() {

    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Manutencao />} />
                {/* <Route path="/home" element={<Home />} />
                <Route path="/sobrenos" element={<SobreNos />} />
                <Route path="/home" element={<Servicos />} />
                <Route path="/home" element={<Clientes />} />
                <Route path="/contato" element={<Contato />} /> */}
            </Routes>
        </BrowserRouter>
    )
}

export default RoutesApp;