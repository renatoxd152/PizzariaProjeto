import * as React from "react";
import {useState} from "react";
import {LayoutTelaInicial} from "../../layouts/TelaInicial";
import {CadastroUsuarioForm} from "./form.tsx";
import type {Usuario} from "../../../models/Usuario/Usuario.ts";
import {useUsuarioService} from "../../../services/usuario.service.ts";

export const CadastroUsuario: React.FC = () => {
    const [sucesso, setSucesso] = useState<string | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const service = useUsuarioService();

    const handleSubmit = async (usuario: Usuario) => {
        try {
            setErro(null);
            await service.salvar(usuario);
            setSucesso(`Bem-vindo(a), ${usuario.nome}! Cadastro realizado.`);
        } catch (e) {
            console.error(e);
            setErro("Não foi possível realizar o cadastro. Tente novamente.");
            throw e;
        }
    };

    return (<LayoutTelaInicial
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

                    {erro && (
                        <div className="alert alert-danger" role="alert">
                            {erro}
                        </div>
                    )}

                    <CadastroUsuarioForm onSubmit={handleSubmit}/>
                </div>
            </LayoutTelaInicial>
    );
};