import {Navigate, Outlet} from "react-router";
import {estaLogado, getRoles} from "../auth/auth";

interface RotaProtegidaProps {
    roleNecessaria?: string;
}

export const RotaProtegida = ({roleNecessaria}: RotaProtegidaProps) => {
    if (!estaLogado()) {
        return <Navigate to="/login" replace />;
    }

    if (roleNecessaria && !getRoles().includes(roleNecessaria)) {
        return <Navigate to="cadastro/pizzas" replace />;
    }

    return <Outlet />;
};