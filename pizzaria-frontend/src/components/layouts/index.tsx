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
    )
}

