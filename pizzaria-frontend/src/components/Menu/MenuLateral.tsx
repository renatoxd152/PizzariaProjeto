import * as React from "react";
import { useState } from "react";
import { NavLink } from "react-router";
import "./index.css";

export interface ItemMenu {
    to: string;
    label: string;
}

interface MenuLateralProps {
    itens: ItemMenu[];
    titulo?: string;
    onSair?: () => void;
    className?: string;
}

export const MenuLateral: React.FC<MenuLateralProps> = ({
                                                            itens,
                                                            titulo = "Meu Sistema",
                                                            onSair,
                                                            className = "",
                                                        }) => {
    const [aberto, setAberto] = useState(false);
    const fechar = () => setAberto(false);

    return (
        <aside className={`menu-lateral bg-dark text-white ${className}`}>
            <div className="menu-lateral__topo d-flex align-items-center justify-content-between p-3">
                <h5 className="mb-0">{titulo}</h5>
                <button
                    type="button"
                    className="btn btn-outline-light btn-sm d-md-none"
                    onClick={() => setAberto((a) => !a)}
                    aria-expanded={aberto}
                    aria-controls="menu-lateral-conteudo"
                    aria-label={aberto ? "Fechar menu" : "Abrir menu"}
                >
                    {aberto ? "✕" : "☰"}
                </button>
            </div>

            <div
                id="menu-lateral-conteudo"
                className={`menu-lateral__conteudo px-3 pb-3 ${aberto ? "menu-lateral__conteudo--aberto" : ""}`}
            >
                <nav className="nav nav-pills flex-column gap-1">
                    {itens.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === "/"}
                            onClick={fechar}
                            className={({ isActive }) =>
                                `nav-link text-white ${isActive ? "active" : ""}`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {onSair && (
                    <button
                        type="button"
                        className="btn btn-outline-light mt-3 mt-md-auto w-100"
                        onClick={() => {
                            fechar();
                            onSair();
                        }}
                    >
                        Sair
                    </button>
                )}
            </div>
        </aside>
    );
};