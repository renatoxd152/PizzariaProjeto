package projeto.microservices.usuarios.controller.dto;

import jakarta.validation.constraints.NotBlank;

public record UsuarioLoginDTO(@NotBlank(message = "O cpf deve ser preenchido!") String cpf,
                              @NotBlank(message = "A senha deve ser preenchida!") String senha) {
}
