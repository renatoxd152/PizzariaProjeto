import * as React from "react";
import {LayoutTelaInicial} from "../../layouts/TelaInicial";
import {useState} from "react";
import {LoginUsuarioForm} from "./form.tsx";

export const LoginUsuario: React.FC = () => {
    const [sucesso, setSucesso] = useState<string | null>(null);

    const handleSubmit = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSucesso(`Bem-vindo(a), Cadastro realizado.`);
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

                <LoginUsuarioForm onSubmit={handleSubmit}/>
            </div>
        </LayoutTelaInicial>
    )

}