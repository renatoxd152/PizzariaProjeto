import * as React from "react";
import { itensMenuAdmin } from "../../../config/MenuAdmin.ts";
import { MenuInicial } from "../../Menu/LayoutMenu.tsx";
import { useCadastroPizzaService } from "../../../../services/cadastro.pizzas.service.ts";
import styles from "./index.module.css"

const formatarPreco = (valor: number) =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const UNIDADES: Record<string, string> = {
    GRAMA: "g", GRAMAS: "g",
    MILILITRO: "ml", MILILITROS: "ml",
    UNIDADE: "un", UNIDADES: "un",
    FATIA: "fatia(s)", FATIAS: "fatia(s)",
    LITRO: "L", LITROS: "L",
    KG: "kg",
};

export const MenuListagemPizzasAdmin: React.FC = () => {
    const service = useCadastroPizzaService();
    const [pizzas, setPizzas] = React.useState<any[]>([]);
    const [carregando, setCarregando] = React.useState(true);
    const API_URL = "http://localhost:8081";
    React.useEffect(() => {
        const carregarPizzas = async () => {
            try {
                const response = await service.listar();
                setPizzas(response);
            } catch (error) {
                console.error("Erro ao carregar pizzas:", error);
            } finally {
                setCarregando(false);
            }
        };

        carregarPizzas();
    }, []);

    return (
        <MenuInicial titulo="Listagem de Pizzas" itensMenu={itensMenuAdmin}>
            {carregando && <p className={styles.aviso}>Carregando pizzas...</p>}

            {!carregando && pizzas.length === 0 && (
                <p className={styles.aviso}>Nenhuma pizza cadastrada.</p>
            )}

            <div className={styles.grid}>
                {pizzas.map((pizza) => (
                    <article key={pizza.id} className={styles.card}>
                        <div className={styles.imagemWrapper}>
                            <img
                                className={styles.imagem}
                                src={`${API_URL}${pizza.imagem}`}
                                alt={pizza.nome}
                            />
                            <span className={styles.tamanho}>{pizza.tamanho}</span>
                        </div>

                        <div className={styles.conteudo}>
                            <h3 className={styles.nome}>{pizza.nome}</h3>

                            <p className={styles.subtitulo}>Ingredientes</p>
                            <ul className={styles.ingredientes}>
                                {pizza.itens.map((item: any) => (
                                    <li key={item.id}>
                                        <span>{item.nomeIngrediente}</span>
                                        <span className={styles.quantidade}>
                                            {item.quantidade}{" "}
                                            {UNIDADES[item.unidadeMedida] ??
                                                item.unidadeMedida.toLowerCase()}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <div className={styles.rodape}>
                                <strong className={styles.preco}>
                                    {formatarPreco(pizza.preco)}
                                </strong>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </MenuInicial>
    );
};