import * as React from "react";
import { useEffect, useState } from "react";
import "./index.css";
import {useCadastroBebidaService} from "../../../../services/cadastro.bebidas.service.ts";

export const CadastroBebidasAdmin: React.FC = () => {

    const [nome, setNome] = useState("");
    const [preco, setPreco] = useState("");
    const [imagem, setImagem] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);
    const [enviando, setEnviando] = useState(false);
    const {salvar} = useCadastroBebidaService();

    useEffect(() => {
        if (!imagem) {
            setPreview(null);
            return;
        }

        const url = URL.createObjectURL(imagem);
        setPreview(url);

        return () => URL.revokeObjectURL(url);
    }, [imagem]);

    const cadastrar = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMensagem(null);

        if (!imagem) {
            setMensagem({ tipo: "erro", texto: "Selecione uma imagem para a bebida!" });
            return;
        }

        const bebida = {
            nome,
            preco: Number(preco)
        };

        try {
            setEnviando(true);
            await salvar(bebida, imagem);

            setMensagem({ tipo: "sucesso", texto: "Bebida cadastrada com sucesso!" });
            setNome("");
            setPreco("");
            setImagem(null);
        } catch (error) {
            console.error(error);
            setMensagem({ tipo: "erro", texto: "Erro ao cadastrar a bebida. Tente novamente." });
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="bebida-container">

            <div className="bebida-card">

                <div className="bebida-card-header">
                    <div>
                        <h3>Nova bebida</h3>
                        <p>Preencha as informações para cadastrar um produto.</p>
                    </div>

                    <div className="bebida-header-icon">
                        🥤
                    </div>
                </div>
                {mensagem && (
                    <div className={`bebida-mensagem ${mensagem.tipo}`} role="alert">
                        {mensagem.texto}
                    </div>
                )}
                <form onSubmit={cadastrar}>

                    <div className="bebida-form-grid">

                        <div className="bebida-field">
                            <label htmlFor="nome">Nome do produto</label>

                            <input
                                id="nome"
                                type="text"
                                placeholder="Ex.: Coca-Cola 2L"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />
                        </div>

                        <div className="bebida-field">
                            <label htmlFor="preco">Preço de venda</label>

                            <div className="bebida-price-input">
                                <span>R$</span>

                                <input
                                    id="preco"
                                    type="number"
                                    placeholder="0,00"
                                    step="0.01"
                                    min="0.01"
                                    value={preco}
                                    onChange={(e) => setPreco(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                    </div>

                    <div className="bebida-field bebida-image-field">
                        <label>Imagem do produto</label>

                        <label htmlFor="imagem" className="bebida-upload">

                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Prévia da bebida"
                                    className="bebida-preview"
                                />
                            ) : (
                                <div className="bebida-upload-content">
                                    <span className="bebida-upload-icon">
                                        📷
                                    </span>

                                    <strong>Escolha uma imagem</strong>

                                    <span>
                                        Clique aqui para selecionar uma foto
                                    </span>

                                    <small>PNG, JPG ou WEBP</small>
                                </div>
                            )}

                            <input
                                id="imagem"
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={(e) =>
                                    setImagem(e.target.files?.[0] ?? null)
                                }
                                required
                            />

                        </label>

                        {imagem && (
                            <div className="bebida-file-info">
                                <span>{imagem.name}</span>

                                <button
                                    type="button"
                                    onClick={() => setImagem(null)}
                                >
                                    Remover imagem
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="bebida-form-footer">

                        <button type="submit" className="bebida-submit" disabled={enviando}>
                            {enviando ? "Cadastrando..." : "Cadastrar bebida"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};