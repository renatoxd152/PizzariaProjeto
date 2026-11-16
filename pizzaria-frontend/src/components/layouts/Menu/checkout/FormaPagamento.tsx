import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {QRCodeSVG} from "qrcode.react";

export type FormaPagamentoTipo = "PIX" | "CARTAO_CREDITO" | "DINHEIRO";

export interface DadosPagamento {
    forma: FormaPagamentoTipo;
    ultimosDigitos?: string;
    trocoPara?: number;
}

interface FormaPagamentoProps {
    total: number;
    processando?: boolean;
    erro?: string | null;
    onPagar: (dados: DadosPagamento) => void | Promise<void>;
    verificarPix?: () => Promise<boolean>;
    onPixConfirmado?: () => void | Promise<void>;
    onSimularPix?: () => void | Promise<void>;
    intervaloPixMs?: number;
}

const formatarPreco = (valor: number) =>
    valor.toLocaleString("pt-BR", {style: "currency", currency: "BRL"});

const validarLuhn = (numero: string): boolean => {
    const digitos = numero.replace(/\D/g, "");
    if (digitos.length < 13 || digitos.length > 19) return false;
    let soma = 0;
    let dobrar = false;
    for (let i = digitos.length - 1; i >= 0; i--) {
        let n = Number(digitos[i]);
        if (dobrar) {
            n *= 2;
            if (n > 9) n -= 9;
        }
        soma += n;
        dobrar = !dobrar;
    }
    return soma % 10 === 0;
};

const mascararNumero = (valor: string) =>
    valor.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");

const mascararValidade = (valor: string) => {
    const d = valor.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

const validadeOk = (valor: string): boolean => {
    const m = /^(\d{2})\/(\d{2})$/.exec(valor);
    if (!m) return false;
    const mes = Number(m[1]);
    const ano = 2000 + Number(m[2]);
    if (mes < 1 || mes > 12) return false;
    const hoje = new Date();
    return ano > hoje.getFullYear() || (ano === hoje.getFullYear() && mes >= hoje.getMonth() + 1);
};

const CODIGO_PIX_FAKE =
    "00020126580014br.gov.bcb.pix0136SIMULACAO-PIZZARIA-0000-0000-000052040000530398654045.005802BR5909PIZZARIA6009SAO PAULO62070503***6304FAKE";

const OPCOES: { valor: FormaPagamentoTipo; titulo: string; descricao: string; icone: string }[] = [
    {valor: "PIX", titulo: "Pix", descricao: "Aprovação imediata", icone: "bi-qr-code"},
    {valor: "CARTAO_CREDITO", titulo: "Cartão de crédito", descricao: "Pague agora pelo site", icone: "bi-credit-card"},
    {valor: "DINHEIRO", titulo: "Dinheiro", descricao: "Pague na entrega", icone: "bi-cash-coin"},
];

export const FormaPagamento: React.FC<FormaPagamentoProps> = ({
                                                                  total,
                                                                  processando = false,
                                                                  erro,
                                                                  onPagar,
                                                                  verificarPix,
                                                                  onPixConfirmado,
                                                                  onSimularPix,
                                                                  intervaloPixMs = 3000,
                                                              }) => {
    const [forma, setForma] = useState<FormaPagamentoTipo>("PIX");
    const [copiado, setCopiado] = useState(false);
    const [simulando, setSimulando] = useState(false);

    const [numero, setNumero] = useState("");
    const [nome, setNome] = useState("");
    const [validade, setValidade] = useState("");
    const [cvv, setCvv] = useState("");

    const [precisaTroco, setPrecisaTroco] = useState(false);
    const [trocoPara, setTrocoPara] = useState("");

    const [tentou, setTentou] = useState(false);

    const verificarPixRef = useRef(verificarPix);
    const onPixConfirmadoRef = useRef(onPixConfirmado);
    useEffect(() => {
        verificarPixRef.current = verificarPix;
        onPixConfirmadoRef.current = onPixConfirmado;
    });

    useEffect(() => {
        if (forma !== "PIX" || !verificarPixRef.current) return;

        let ativo = true;
        const id = setInterval(async () => {
            try {
                const pago = await verificarPixRef.current?.();
                if (ativo && pago) {
                    clearInterval(id);
                    await onPixConfirmadoRef.current?.();
                }
            } catch {
            }
        }, intervaloPixMs);

        return () => {
            ativo = false;
            clearInterval(id);
        };
    }, [forma, intervaloPixMs]);

    const errosCartao = {
        numero: !validarLuhn(numero) ? "Número de cartão inválido." : null,
        nome: nome.trim().length < 3 ? "Informe o nome impresso no cartão." : null,
        validade: !validadeOk(validade) ? "Validade inválida ou vencida." : null,
        cvv: !/^\d{3,4}$/.test(cvv) ? "CVV deve ter 3 ou 4 dígitos." : null,
    };

    const valorTroco = Number(trocoPara.replace(",", "."));
    const erroTroco =
        precisaTroco && (!trocoPara || Number.isNaN(valorTroco) || valorTroco < total)
            ? `O valor precisa ser maior ou igual a ${formatarPreco(total)}.`
            : null;

    const copiarPix = async () => {
        try {
            await navigator.clipboard.writeText(CODIGO_PIX_FAKE);
            setCopiado(true);
            setTimeout(() => setCopiado(false), 2000);
        } catch {
            setCopiado(false);
        }
    };

    const simularPix = async () => {
        if (!onSimularPix) return;
        setSimulando(true);
        try {
            await onSimularPix();
        } finally {
            setSimulando(false);
        }
    };

    const confirmar = async () => {
        setTentou(true);

        if (forma === "CARTAO_CREDITO") {
            if (Object.values(errosCartao).some(Boolean)) return;
            await onPagar({forma, ultimosDigitos: numero.replace(/\D/g, "").slice(-4)});
            return;
        }

        if (forma === "DINHEIRO") {
            if (erroTroco) return;
            await onPagar({forma, trocoPara: precisaTroco ? valorTroco : undefined});
        }
    };

    const campoInvalido = (mensagem: string | null) => tentou && mensagem !== null;

    const textoBotao = () => {
        if (processando) return "Processando...";
        if (forma === "DINHEIRO") return `Confirmar pedido • ${formatarPreco(total)}`;
        return `Pagar ${formatarPreco(total)}`;
    };

    return (
        <div className="row g-4">
            <div className="col-lg-8">
                <div className="card">
                    <div className="list-group list-group-flush" role="radiogroup" aria-label="Forma de pagamento">
                        {OPCOES.map((op) => (
                            <label
                                key={op.valor}
                                className={`list-group-item d-flex align-items-center gap-3 py-3 ${
                                    forma === op.valor ? "bg-success-subtle" : ""
                                }`}
                                style={{cursor: "pointer"}}
                            >
                                <input
                                    type="radio"
                                    className="form-check-input mt-0"
                                    name="forma-pagamento"
                                    value={op.valor}
                                    checked={forma === op.valor}
                                    onChange={() => {
                                        setForma(op.valor);
                                        setTentou(false);
                                    }}
                                />
                                <i className={`bi ${op.icone} fs-4`}></i>
                                <div>
                                    <div className="fw-semibold">{op.titulo}</div>
                                    <small className="text-muted">{op.descricao}</small>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="card mt-3">
                    <div className="card-body">
                        {forma === "PIX" && (
                            <>
                                <h6 className="mb-3">Pague com Pix</h6>
                                <div className="d-flex flex-column flex-md-row gap-4 align-items-md-center">
                                    <div
                                        className="border rounded d-flex align-items-center justify-content-center bg-light flex-shrink-0"
                                        style={{width: 160, height: 160}}
                                        aria-label="QR code de exemplo"
                                    >
                                        <QRCodeSVG value={CODIGO_PIX_FAKE} size={140} />
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="mb-2 text-muted">
                                            Esta é uma simulação. Nenhuma cobrança real será feita.
                                        </p>
                                        <label className="form-label small mb-1" htmlFor="pix-codigo">
                                            Pix copia e cola
                                        </label>
                                        <div className="input-group">
                                            <input
                                                id="pix-codigo"
                                                className="form-control form-control-sm"
                                                value={CODIGO_PIX_FAKE}
                                                readOnly
                                            />
                                            <button className="btn btn-outline-secondary btn-sm" onClick={copiarPix}>
                                                {copiado ? "Copiado!" : "Copiar"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {forma === "CARTAO_CREDITO" && (
                            <>
                                <h6 className="mb-3">Dados do cartão</h6>
                                <p className="small text-muted">
                                    Simulação: use qualquer número válido (ex.: 4242 4242 4242 4242). Números
                                    terminados em 0000 serão recusados. Os dados do cartão não são enviados nem
                                    salvos.
                                </p>
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label" htmlFor="cartao-numero">Número do cartão</label>
                                        <input
                                            id="cartao-numero"
                                            className={`form-control ${campoInvalido(errosCartao.numero) ? "is-invalid" : ""}`}
                                            inputMode="numeric"
                                            autoComplete="off"
                                            placeholder="0000 0000 0000 0000"
                                            value={numero}
                                            onChange={(e) => setNumero(mascararNumero(e.target.value))}
                                        />
                                        <div className="invalid-feedback">{errosCartao.numero}</div>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label" htmlFor="cartao-nome">Nome no cartão</label>
                                        <input
                                            id="cartao-nome"
                                            className={`form-control ${campoInvalido(errosCartao.nome) ? "is-invalid" : ""}`}
                                            autoComplete="off"
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value.toUpperCase())}
                                        />
                                        <div className="invalid-feedback">{errosCartao.nome}</div>
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label" htmlFor="cartao-validade">Validade</label>
                                        <input
                                            id="cartao-validade"
                                            className={`form-control ${campoInvalido(errosCartao.validade) ? "is-invalid" : ""}`}
                                            inputMode="numeric"
                                            autoComplete="off"
                                            placeholder="MM/AA"
                                            value={validade}
                                            onChange={(e) => setValidade(mascararValidade(e.target.value))}
                                        />
                                        <div className="invalid-feedback">{errosCartao.validade}</div>
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label" htmlFor="cartao-cvv">CVV</label>
                                        <input
                                            id="cartao-cvv"
                                            className={`form-control ${campoInvalido(errosCartao.cvv) ? "is-invalid" : ""}`}
                                            inputMode="numeric"
                                            autoComplete="off"
                                            placeholder="123"
                                            value={cvv}
                                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                        />
                                        <div className="invalid-feedback">{errosCartao.cvv}</div>
                                    </div>
                                </div>
                            </>
                        )}

                        {forma === "DINHEIRO" && (
                            <>
                                <h6 className="mb-3">Pagamento na entrega</h6>
                                <div className="form-check mb-3">
                                    <input
                                        id="precisa-troco"
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={precisaTroco}
                                        onChange={(e) => setPrecisaTroco(e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="precisa-troco">
                                        Preciso de troco
                                    </label>
                                </div>
                                {precisaTroco && (
                                    <div style={{maxWidth: 260}}>
                                        <label className="form-label" htmlFor="troco-para">Troco para quanto?</label>
                                        <div className="input-group">
                                            <span className="input-group-text">R$</span>
                                            <input
                                                id="troco-para"
                                                className={`form-control ${campoInvalido(erroTroco) ? "is-invalid" : ""}`}
                                                inputMode="decimal"
                                                placeholder="100,00"
                                                value={trocoPara}
                                                onChange={(e) => setTrocoPara(e.target.value)}
                                            />
                                            <div className="invalid-feedback">{erroTroco}</div>
                                        </div>
                                        {!erroTroco && trocoPara && !Number.isNaN(valorTroco) && (
                                            <small className="text-muted">
                                                Troco a receber: {formatarPreco(valorTroco - total)}
                                            </small>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="col-lg-4">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title mb-3">Resumo</h5>
                        <div className="d-flex justify-content-between mb-3">
                            <strong>Total a pagar</strong>
                            <strong>{formatarPreco(total)}</strong>
                        </div>

                        {erro && <div className="alert alert-danger py-2">{erro}</div>}

                        {forma === "PIX" ? (
                            <>
                                <div className="d-flex align-items-center gap-2 text-muted" role="status">
                                    <div className="spinner-border spinner-border-sm" aria-hidden="true"></div>
                                    <span>Aguardando confirmação do pagamento...</span>
                                </div>
                                <small className="text-muted d-block mt-2">
                                    O pedido é confirmado automaticamente assim que o Pix for pago.
                                </small>

                                {onSimularPix && (
                                    <button
                                        className="btn btn-outline-secondary btn-sm w-100 mt-3"
                                        onClick={simularPix}
                                        disabled={simulando}
                                    >
                                        {simulando ? "Simulando..." : "Simular pagamento (modo teste)"}
                                    </button>
                                )}
                            </>
                        ) : (
                            <button className="btn btn-success w-100" onClick={confirmar} disabled={processando}>
                                {textoBotao()}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};