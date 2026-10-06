package projeto.microservices.usuarios.controller;

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
public class UsuarioController {

    private final UsuarioMapper usuarioMapper;
    private final UsuarioService usuarioService;
    private final JWTService jwtService;
    @PostMapping
    public ResponseEntity<Usuario> adicionarUsuario(@Valid @RequestBody UsuarioDTO usuarioDTO)
    {
        Usuario usuario = usuarioService.adicionarUsuario(usuarioMapper.map(usuarioDTO));
        return ResponseEntity.ok(usuario);
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> listarUsuarios()
    {
        return ResponseEntity.ok(usuarioService.listarUsuarios());
    }

    @GetMapping("{id}")
    public ResponseEntity<Usuario> listarUsuario(@PathVariable String id)
    {
        return ResponseEntity.ok(usuarioService.listarUsuarioPorId(id));
    }
    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<Usuario> listarUsuarioPorCPF(@PathVariable String cpf)
    {
        return ResponseEntity.ok(usuarioService.listarUsuarioPorCPF(cpf));
    }

    @GetMapping("/{id}/pedidos")
    public ResponseEntity<List<PedidoRepresentation>> listarPedidosPorIdUsuario(@PathVariable String id)
    {
        return ResponseEntity.ok(usuarioService.listarPedidosUsuarioPorId(id));
    }

    @DeleteMapping("{cpf}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable("cpf") String cpf)
    {
        usuarioService.deletarUsuario(cpf);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("{cpf}")
    public ResponseEntity<Usuario> atualizarUsuario(@PathVariable("cpf") String cpf, @RequestBody UsuarioDTO usuarioDTO)
    {
        return ResponseEntity.ok(usuarioService.atualizarUsuario(cpf, usuarioMapper.map(usuarioDTO)));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody UsuarioLoginDTO usuarioLoginDTO)
    {
        Usuario usuario = usuarioService.login(usuarioLoginDTO);
        String token = jwtService.generateToken(usuario);
        LoginResponse loginResponse = new LoginResponse(token,jwtService.getExpirationTime());

        return ResponseEntity.ok(loginResponse);
    }


}
