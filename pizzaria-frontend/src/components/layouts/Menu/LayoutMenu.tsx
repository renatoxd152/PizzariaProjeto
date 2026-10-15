import * as React from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { MenuLateral, type ItemMenu } from "../../Menu/MenuLateral.tsx";
import "./index.css";

interface LayoutProps {
    titulo:ReactNode;
    subtitulo?: string;
    acoes?: ReactNode;
    children?: ReactNode;
    className?: string;
    tituloClassName?: string;
    styleDiv?: React.CSSProperties;
}

const itensMenu: ItemMenu[] = [
    { to: "/", label: "Início" },
    { to: "/bebidas", label: "Bebidas" },
    { to: "/pizzas", label: "Pizzas Favoritas" },
];

export const MenuInicial: React.FC<LayoutProps> = ({
                                                       titulo,
                                                       subtitulo,
                                                       acoes,
                                                       children,
                                                       className = "",
                                                       tituloClassName = "",
                                                       styleDiv,
                                                   }) => {
    const navigate = useNavigate();
    const sair = () => navigate("/login");

    return (
        <div className="d-flex flex-column flex-md-row min-vh-100">
            <MenuLateral itens={itensMenu} onSair={sair} />

            <main className="pagina flex-grow-1" style={{ minWidth: 0, ...styleDiv }}>
                <div className={`container-xl py-4 ${className}`}>
                    <header className="pagina__header">
                        <div>
                            <h1 className={`pagina__titulo ${tituloClassName}`}>{titulo}</h1>
                            {subtitulo && <p className="pagina__subtitulo">{subtitulo}</p>}
                        </div>
                        {acoes && <div className="pagina__acoes">{acoes}</div>}
                    </header>

                    <section>{children}</section>
                </div>
            </main>
        </div>
    );
};