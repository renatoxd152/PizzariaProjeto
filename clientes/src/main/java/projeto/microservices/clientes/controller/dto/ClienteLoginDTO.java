package projeto.microservices.clientes.controller.dto;

import jakarta.validation.constraints.NotBlank;

public record ClienteLoginDTO(@NotBlank(message = "O cpf deve ser preenchido!") String cpf,
                              @NotBlank(message = "A senha deve ser preenchida!") String senha) {
}
