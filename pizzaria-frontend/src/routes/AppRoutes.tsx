import { Routes, Route, Navigate } from "react-router";
import CadastroUsuario  from "../pages/usuarios";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/usuarios/cadastro" replace />} />
            <Route path="/usuarios/cadastro" element={<CadastroUsuario />} />
        </Routes>
    );
};