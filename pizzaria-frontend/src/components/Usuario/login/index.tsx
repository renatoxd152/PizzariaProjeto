import * as React from "react";
import {LayoutTelaInicial} from "../../layouts/TelaInicial";
import {useState} from "react";
import {LoginUsuarioForm} from "./form.tsx";
import {useUsuarioService} from "../../../services/usuario.service.ts";
import type {UsuarioLogin} from "../../../models/Usuario/UsuarioLogin.ts";
import {getRoles, rotaInicialPorRole} from "../../../auth/auth.ts";
import {useNavigate} from "react-router";

export const LoginUsuario: React.FC = () => {
    const [erro, setErro] = useState<string | null>(null);
    const service = useUsuarioService();
    const navigate = useNavigate();
    const handleSubmit = async (usuario: UsuarioLogin) => {
        try {
            setErro(null);
            const resposta = await service.login(usuario);
            localStorage.setItem("token", resposta.token);
            localStorage.setItem(
                "token_expira_em",
                String(Date.now() + resposta.expireIn)
            );
            navigate(rotaInicialPorRole(getRoles()), {replace: true});
        } catch (e) {
            console.error(e);
            setErro("Não foi possível realizar o login. Tente novamente.");
            throw e;
        }
    };
    return(<LayoutTelaInicial
            titulo="Faça o login para entrar no sistema"
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


                {erro && (
                    <div className="alert alert-danger" role="alert">
                        {erro}
                    </div>
                )}

                <LoginUsuarioForm onSubmit={handleSubmit}/>
            </div>
        </LayoutTelaInicial>
    )

}