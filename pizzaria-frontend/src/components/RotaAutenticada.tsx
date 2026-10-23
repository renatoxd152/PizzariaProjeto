import {Navigate, Outlet} from "react-router";
import {estaLogado, getRoles, rotaInicialPorRole} from "../auth/auth";

interface RotaProtegidaProps {
    roleNecessaria?: string;
}

export const RotaProtegida = ({roleNecessaria}: RotaProtegidaProps) => {
    if (!estaLogado()) {
        return <Navigate to="/login" replace />;
    }

    const roles = getRoles();

    if (roleNecessaria && !roles.includes(roleNecessaria)) {
        return <Navigate to={rotaInicialPorRole(roles)} replace />;
    }

    return <Outlet />;
};