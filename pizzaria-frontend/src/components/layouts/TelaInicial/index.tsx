import * as React from "react";
import type {ReactNode} from "react";

interface LayoutProps{
    titulo:string;
    children?:ReactNode;
    className?:string;
    tittleClassName?:string;
    styleDiv?:React.CSSProperties;
}
export const LayoutTelaInicial: React.FC<LayoutProps> = (props: LayoutProps) =>
{
    return(
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
        <div style={props.styleDiv}>
            <section>
                <div className={`container ${props.className}`}>
                    <div>
                        <header>
                            <p className={props.tittleClassName}>{props.titulo}</p>
                        </header>
                    </div>
                    <div>
                        <div>
                            {props.children}
                        </div>
                    </div>
                </div>
            </section>
        </div>
        </div>
    )
}

