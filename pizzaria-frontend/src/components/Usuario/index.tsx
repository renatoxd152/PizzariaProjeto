import * as React from "react";
import {useState} from "react";
import {LayoutTelaInicial} from "../layouts";
import {CadastroUsuarioForm} from "./form.tsx";
import type {Usuario} from "../../models/Usuario/Usuario.ts";

export const CadastroUsuario: React.FC = () => {
    const [sucesso, setSucesso] = useState<string | null>(null);

    const handleSubmit = async (usuario: Usuario) => {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // simula a API
        setSucesso(`Bem-vindo(a), ${usuario.nome}! Cadastro realizado.`);
    };

    return (
        <div className="d-flex min-vh-100">
            <aside
                className="auth-brand d-none d-lg-flex flex-column justify-content-center align-items-center text-center p-5"
                style={{flex: "0 0 42%"}}
            >
                <div className="auth-emoji mb-3">🍕</div>
                <h1 className="auth-title display-3 mb-3">Pizzaria</h1>
                <div className="auth-divider" />
                <p className="auth-subtitle mb-5" style={{maxWidth: 360}}>
                    Massa artesanal, ingredientes frescos e entrega rápida na sua porta.
                </p>
                <ul className="auth-benefits list-unstyled text-start mb-0">
                    <li><span className="auth-check">✓</span>Peça em poucos cliques</li>
                    <li><span className="auth-check">✓</span>Acompanhe o pedido em tempo real</li>
                    <li><span className="auth-check">✓</span>Ofertas exclusivas para clientes</li>
                </ul>
            </aside>
            <LayoutTelaInicial
                titulo="Crie sua conta"
                className=""
                tittleClassName="h2 fw-bold mb-1"
                styleDiv={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    padding: "1rem",
                }}
            >
                <div style={{width: 460, maxWidth: "100%"}}>
                    <p className="text-muted mb-4">Preencha os dados para começar a pedir.</p>

                    {sucesso && (
                        <div className="alert alert-success alert-dismissible" role="alert">
                            {sucesso}
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Fechar"
                                onClick={() => setSucesso(null)}
                            />
                        </div>
                    )}

                    <CadastroUsuarioForm onSubmit={handleSubmit}/>
                </div>
            </LayoutTelaInicial>
        </div>
    );
};