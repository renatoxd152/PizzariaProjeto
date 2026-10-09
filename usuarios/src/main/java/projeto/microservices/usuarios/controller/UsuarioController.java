package projeto.microservices.usuarios.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import projeto.microservices.usuarios.client.representation.PedidoRepresentation;
import projeto.microservices.usuarios.controller.dto.UsuarioDTO;
import projeto.microservices.usuarios.controller.dto.UsuarioLoginDTO;
import projeto.microservices.usuarios.controller.mapper.UsuarioMapper;
import projeto.microservices.usuarios.model.Usuario;
import projeto.microservices.usuarios.model.LoginResponse;
import projeto.microservices.usuarios.service.UsuarioService;
import projeto.microservices.usuarios.service.JWTService;

import java.util.List;

@RestController
@RequestMapping("usuarios")
@RequiredArgsConstructor
@Tag(name = "Usuários", description = "Gerenciamento de usuários")
public class UsuarioController {

    private final UsuarioMapper usuarioMapper;
    private final UsuarioService usuarioService;
    private final JWTService jwtService;
    @Operation(
            summary = "Cadastrar usuário",
            description = "Cadastra um novo usuário no sistema"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200",
                    description = "Usuário cadastrado com sucesso"),
            @ApiResponse(responseCode = "400",
                    description = "Dados inválidos",
                    content = @Content),
            @ApiResponse(responseCode = "409",
                    description = "Usuário já cadastrado",
                    content = @Content)
    })
    @PostMapping
    public ResponseEntity<Usuario> adicionarUsuario(@Valid @RequestBody UsuarioDTO usuarioDTO)
    {
        Usuario usuario = usuarioService.adicionarUsuario(usuarioMapper.map(usuarioDTO));
        return ResponseEntity.ok(usuario);
    }
    @Operation(summary = "Listar todos os usuários")
    @GetMapping
    public ResponseEntity<List<Usuario>> listarUsuarios()
    {
        return ResponseEntity.ok(usuarioService.listarUsuarios());
    }
    @Operation(summary = "Buscar usuário por ID")
    @GetMapping("{id}")
    public ResponseEntity<Usuario> listarUsuario(@PathVariable String id)
    {
        return ResponseEntity.ok(usuarioService.listarUsuarioPorId(id));
    }
    @Operation(summary = "Buscar usuário por CPF")
    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<Usuario> listarUsuarioPorCPF(@PathVariable String cpf)
    {
        return ResponseEntity.ok(usuarioService.listarUsuarioPorCPF(cpf));
    }
    @Operation(summary = "Listar pedidos de um usuário")
    @GetMapping("/{id}/pedidos")
    public ResponseEntity<List<PedidoRepresentation>> listarPedidosPorIdUsuario(@PathVariable String id)
    {
        return ResponseEntity.ok(usuarioService.listarPedidosUsuarioPorId(id));
    }
    @Operation(summary = "Excluir usuário por CPF")
    @ApiResponse(responseCode = "204",
            description = "Usuário excluído com sucesso")
    @DeleteMapping("{cpf}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable("cpf") String cpf)
    {
        usuarioService.deletarUsuario(cpf);
        return ResponseEntity.noContent().build();
    }
    @Operation(summary = "Atualizar usuário por CPF")
    @PutMapping("{cpf}")
    public ResponseEntity<Usuario> atualizarUsuario(@PathVariable("cpf") String cpf, @RequestBody UsuarioDTO usuarioDTO)
    {
        return ResponseEntity.ok(usuarioService.atualizarUsuario(cpf, usuarioMapper.map(usuarioDTO)));
    }
    @Operation(
            summary = "Realizar login",
            description = "Autentica o usuário e retorna um token JWT"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200",
                    description = "Login realizado com sucesso"),
            @ApiResponse(responseCode = "401",
                    description = "Credenciais inválidas",
                    content = @Content)
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody UsuarioLoginDTO usuarioLoginDTO)
    {
        Usuario usuario = usuarioService.login(usuarioLoginDTO);
        String token = jwtService.generateToken(usuario);
        LoginResponse loginResponse = new LoginResponse(token,jwtService.getExpirationTime());

        return ResponseEntity.ok(loginResponse);
    }


}
