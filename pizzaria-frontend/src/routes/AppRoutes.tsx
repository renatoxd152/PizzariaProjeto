import { Routes, Route, Navigate } from "react-router";
import CadastroUsuario  from "../pages/usuarios/cadastro";
import {LoginUsuario} from "../components/Usuario/login";
import {MenuPizzasCliente} from "../pages/menu/MenuPizzasCliente.tsx";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/usuarios/cadastro" replace />} />
            <Route path="/usuarios/cadastro" element={<CadastroUsuario />} />
            <Route path="/login" element={<LoginUsuario/>}/>
            <Route path="/pizzas" element={<MenuPizzasCliente/>} />
        </Routes>
    );
};