package projeto.microservices.clientes.model;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.io.Serializable;

@Getter
@Setter
@RequiredArgsConstructor
public class Cliente implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    private String id;
    private String nome;
    private String telefone;
    private String cpf;
    private String email;
}
