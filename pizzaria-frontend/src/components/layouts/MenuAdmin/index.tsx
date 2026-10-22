import * as React from "react";
import { useState } from "react";
import { MenuInicial } from "../Menu/LayoutMenu.tsx";
import { itensMenuAdmin } from "../../config/MenuAdmin.ts";
import "./index.css"
import {type PizzaRequest, TamanhoPizza} from "../../../models/Pizza/Pizza.ts";
import type {UnidadeMedida} from "../../../models/Pizza/IngredientePizza.ts";
import {useCadastroPizzaService} from "../../../services/cadastro.pizzas.service.ts";

interface IngredienteDTO {
    nomeIngrediente: string;
    quantidade: number;
    unidadeMedida: string;
}

interface PizzaDTO {
    nome: string;
    preco: number;
    tamanho: string;
    itens: IngredienteDTO[];
}

export const MenuPizzasAdmin: React.FC = () => {
    const [imagem, setImagem] = useState<File | null>(null);
    const [previewImagem, setPreviewImagem] = useState<string | null>(null);
    const service = useCadastroPizzaService();
    const [enviando, setEnviando] = useState(false);
    const [pizza, setPizza] = useState<PizzaDTO>({
        nome: "",
        preco: 0,
        tamanho: "",
        itens: [
            {
                nomeIngrediente: "",
                quantidade: 1,
                unidadeMedida: "GRAMAS"
            }
        ]
    });

    function alterarCampo(
        campo: "nome" | "preco" | "tamanho",
        valor: string
    ) {
        setPizza((atual) => ({
            ...atual,
            [campo]: campo === "preco" ? Number(valor) : valor
        }));
    }

    function alterarIngrediente(
        index: number,
        campo: keyof IngredienteDTO,
        valor: string
    ) {
        setPizza((atual) => ({
            ...atual,
            itens: atual.itens.map((ingrediente, i) =>
                i === index
                    ? {
                        ...ingrediente,
                        [campo]: campo === "quantidade"
                            ? Number(valor)
                            : valor
                    }
                    : ingrediente
            )
        }));
    }

    function adicionarIngrediente() {
        setPizza((atual) => ({
            ...atual,
            itens: [
                ...atual.itens,
                {
                    nomeIngrediente: "",
                    quantidade: 1,
                    unidadeMedida: "GRAMAS"
                }
            ]
        }));
    }

    function removerIngrediente(index: number) {
        setPizza((atual) => ({
            ...atual,
            itens: atual.itens.filter((_, i) => i !== index)
        }));
    }

    function paraRequest(form: PizzaDTO): PizzaRequest {
        return {
            nome: form.nome,
            preco: form.preco,
            tamanhoPizza: form.tamanho as TamanhoPizza,
            ingredientes: form.itens.map((item) => ({
                nomeIngrediente: item.nomeIngrediente.trim(),
                quantidade: item.quantidade,
                unidadeMedida: item.unidadeMedida as UnidadeMedida
            }))
        };
    }

    async function cadastrarPizza(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!imagem) {
            alert("Selecione uma foto da pizza.");
            return;
        }

        try {
            setEnviando(true);
            await service.salvar(paraRequest(pizza), imagem);
            alert("Pizza cadastrada com sucesso!");

            setPizza({
                nome: "",
                preco: 0,
                tamanho: "",
                itens: [{ nomeIngrediente: "", quantidade: 1, unidadeMedida: "GRAMAS" }]
            });
            if (previewImagem) URL.revokeObjectURL(previewImagem);
            setImagem(null);
            setPreviewImagem(null);
        } catch (erro) {
            console.error(erro);
            alert("Erro ao cadastrar a pizza.");
        } finally {
            setEnviando(false);
        }
    }

    return (
        <MenuInicial
            titulo="Cadastro de Pizzas"
            subtitulo="Monte uma pizza para seus clientes"
            itensMenu={itensMenuAdmin}
        >
            <div className="container py-4">
                <div className="pz">
                    <form className="pz-folha" onSubmit={cadastrarPizza}>
                        <div className="pz-faixa" aria-hidden="true" />

                        <div className="pz-pagina">

                            {/* Coluna principal */}
                            <div className="pz-principal">

                                <section>
                                    <div className="pz-linha-prato">
                                        <label className="pz-campo pz-campo-nome">
                                            <span className="pz-rotulo">Nome da pizza</span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Ex.: Calabresa Especial"
                                                value={pizza.nome}
                                                onChange={(e) =>
                                                    alterarCampo("nome", e.target.value)
                                                }
                                                required
                                            />
                                        </label>

                                        <span className="pz-pontilhado" aria-hidden="true" />

                                        <label className="pz-campo pz-campo-preco">
                                            <span className="pz-rotulo">Preço</span>
                                            <div className="pz-preco">
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="49,90"
                                                    min="0.01"
                                                    step="0.01"
                                                    value={pizza.preco || ""}
                                                    onChange={(e) =>
                                                        alterarCampo("preco", e.target.value)
                                                    }
                                                    required
                                                />
                                            </div>
                                        </label>
                                    </div>

                                    <label className="pz-campo pz-campo-tamanho">
                                        <span className="pz-rotulo">Tamanho</span>
                                        <select
                                            className="form-select"
                                            value={pizza.tamanho}
                                            onChange={(e) =>
                                                alterarCampo("tamanho", e.target.value)
                                            }
                                            required
                                        >
                                            <option value="">Selecione</option>
                                            <option value="PEQUENA">Pequena</option>
                                            <option value="MEDIA">Média</option>
                                            <option value="GRANDE">Grande</option>
                                            <option value="GIGANTE">Gigante</option>
                                        </select>
                                    </label>
                                </section>

                                <section className="pz-ingredientes">
                                    <div className="pz-cabecalho-ingredientes">
                                        <div>
                                            <h4 className="pz-titulo-secao">Ingredientes</h4>
                                            <p className="pz-subtitulo-secao">
                                                O que vai na pizza e em que quantidade.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            className="btn btn-outline-primary"
                                            onClick={adicionarIngrediente}
                                        >
                                            + Adicionar ingrediente
                                        </button>
                                    </div>

                                    <div className="pz-lista">
                                        {pizza.itens.map((ingrediente, index) => (
                                            <div
                                                key={index}
                                                className="pz-ingrediente"
                                            >
                                                <label className="pz-celula">
                                                    <span className="pz-rotulo">Nome do ingrediente</span>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Ex.: Mussarela"
                                                        value={ingrediente.nomeIngrediente}
                                                        onChange={(e) =>
                                                            alterarIngrediente(
                                                                index,
                                                                "nomeIngrediente",
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                    />
                                                </label>

                                                <label className="pz-celula">
                                                    <span className="pz-rotulo">Quantidade</span>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        min="0.01"
                                                        step="any"
                                                        value={ingrediente.quantidade}
                                                        onChange={(e) =>
                                                            alterarIngrediente(
                                                                index,
                                                                "quantidade",
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                    />
                                                </label>

                                                <label className="pz-celula">
                                                    <span className="pz-rotulo">Unidade de medida</span>
                                                    <select
                                                        className="form-select"
                                                        value={ingrediente.unidadeMedida}
                                                        onChange={(e) =>
                                                            alterarIngrediente(
                                                                index,
                                                                "unidadeMedida",
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                    >
                                                        <option value="GRAMAS">Gramas</option>
                                                        <option value="KG">Quilogramas</option>
                                                        <option value="ML">Mililitros</option>
                                                        <option value="L">Litros</option>
                                                        <option value="UNIDADE">Unidade</option>
                                                    </select>
                                                </label>

                                                <div className="pz-celula-acao">
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger"
                                                        onClick={() =>
                                                            removerIngrediente(index)
                                                        }
                                                        disabled={pizza.itens.length === 1}
                                                    >
                                                        Remover
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            {/* Coluna lateral: foto */}
                            <aside className="pz-lateral">
                                <h4 className="pz-titulo-secao">Foto da pizza</h4>
                                <p className="pz-subtitulo-secao">PNG, JPG ou WebP.</p>

                                <label htmlFor="imagemPizza" className="pz-upload">
                                    <input
                                        id="imagemPizza"
                                        type="file"
                                        accept="image/png, image/jpeg, image/webp"
                                        onChange={(e) => {
                                            const arquivo = e.target.files?.[0];
                                            if (!arquivo) return;
                                            setImagem(arquivo);
                                            setPreviewImagem(URL.createObjectURL(arquivo));
                                        }}
                                    />
                                    <div
                                        className={
                                            "pz-moldura" +
                                            (previewImagem ? " com-imagem" : "")
                                        }
                                    >
                                        {previewImagem ? (
                                            <img src={previewImagem} alt="Prévia da pizza" />
                                        ) : (
                                            <div className="pz-moldura-texto">
                                                Adicionar foto
                                                <small>Clique para escolher um arquivo</small>
                                            </div>
                                        )}
                                    </div>
                                </label>

                                {previewImagem && (
                                    <div className="pz-trocar">
                                        Clique na foto para trocar.
                                    </div>
                                )}
                            </aside>

                        </div>

                        <div className="pz-enviar">
                            <button type="submit" className="btn btn-primary" disabled={enviando}>
                                {enviando ? "Salvando..." : "Cadastrar pizza"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MenuInicial>
    );
};