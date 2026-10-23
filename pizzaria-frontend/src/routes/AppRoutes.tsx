import { Routes, Route, Navigate } from "react-router";
import CadastroUsuario  from "../pages/usuarios/cadastro";
import {LoginUsuario} from "../components/Usuario/login";
import MenuPizzasCliente from "../pages/menu/index.tsx";
import CarrinhoCliente from "../pages/carrinho/index.tsx";
import {MenuBebidas} from "../components/layouts/Menu/bebidas/MenuBebidas.tsx";
import {MenuEditPizza} from "../components/layouts/Menu/pizza/atualizar/EditarPizza.tsx";
import MenuPizzasAdmin from "../pages/menuAdmin/index.tsx"
import {RotaProtegida} from "../components/RotaAutenticada.tsx";
export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/usuarios/cadastro" replace />} />
            <Route path="/usuarios/cadastro" element={<CadastroUsuario />} />
            <Route path="/login" element={<LoginUsuario />} />

            <Route element={<RotaProtegida roleNecessaria="ROLE_CLIENTE" />}>
                <Route path="/pizzas" element={<MenuPizzasCliente />} />
                <Route path="/carrinho" element={<CarrinhoCliente />} />
                <Route path="/bebidas" element={<MenuBebidas />} />
            </Route>

            <Route element={<RotaProtegida roleNecessaria="ROLE_ADMIN" />}>
                <Route path="/editar/pizza/:id" element={<MenuEditPizza />} />
                <Route path="/cadastro/pizzas" element={<MenuPizzasAdmin />} />
            </Route>
        </Routes>
    );
};