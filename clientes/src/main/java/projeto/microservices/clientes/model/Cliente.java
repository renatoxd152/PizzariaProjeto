package projeto.microservices.clientes.model;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;

@Getter
@Setter
@RequiredArgsConstructor
@Document(collection = "clientes")
public class Cliente implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    private String id;
    private String nome;
    private String telefone;
    private String cpf;
    private String email;
}
