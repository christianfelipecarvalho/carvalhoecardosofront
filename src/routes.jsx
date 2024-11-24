import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Clientes from "./pages/Clientes";
import Contato from "./pages/Contato";
import Home from "./pages/Home";
import Servicos from "./pages/Servicos";
import SobreNos from "./pages/SobreNos";
function RoutesApp() {

    return (
        <BrowserRouter>
            <Header />
            <Routes>
                {/* <Route path="/" element={<Manutencao />} /> */}
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/sobrenos" element={<SobreNos />} />
                <Route path="/servicos" element={<Servicos />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/contato" element={<Contato />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    )
}

export default RoutesApp;