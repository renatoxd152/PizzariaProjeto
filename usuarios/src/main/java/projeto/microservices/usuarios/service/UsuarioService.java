package projeto.microservices.usuarios.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import projeto.microservices.usuarios.client.PedidoClient;
import projeto.microservices.usuarios.client.representation.PedidoRepresentation;
import projeto.microservices.usuarios.controller.dto.UsuarioLoginDTO;
import projeto.microservices.usuarios.exception.UsuarioException;
import projeto.microservices.usuarios.model.Usuario;
import projeto.microservices.usuarios.repository.UsuarioRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PedidoClient pedidoClient;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public Usuario adicionarUsuario(Usuario usuario) {
        if (usuarioRepository.existsByCpf(usuario.getCpf()))
        {
            throw new UsuarioException("Esse CPF já está cadastrado!");
        }
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        return usuarioRepository.save(usuario);
    }

    public List<Usuario> listarUsuarios()
    {
        return usuarioRepository.findAll();
    }

    public Usuario listarUsuarioPorId(String id)
    {
        return usuarioRepository.findById(id).
                orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Esse usuario não foi encontrado!"));
    }

    public Usuario listarUsuarioPorCPF(String cpf) {
        return usuarioRepository.findByCpf(cpf).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Esse usuario não foi encontrado!"));
    }

    public void deletarUsuario(String cpf)
    {
        Usuario usuario = usuarioRepository.findByCpf(cpf)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Esse usuario não existe!"));
        usuarioRepository.deleteById(usuario.getId());
    }

    public Usuario atualizarUsuario(String cpf, Usuario usuario) {
        Usuario usuarioEncontrado = usuarioRepository.findByCpf(cpf)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Esse usuario não existe!"));

        usuarioEncontrado.setEmail(usuario.getEmail());
        usuarioEncontrado.setNome(usuario.getNome());
        usuarioEncontrado.setTelefone(usuario.getTelefone());
        return usuarioRepository.save(usuarioEncontrado);
    }

    public List<PedidoRepresentation> listarPedidosUsuarioPorId(String id) {
        return pedidoClient.obterPedidosPorIdUsuario(id);
    }

    public Usuario login (UsuarioLoginDTO usuarioLoginDTO)
    {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(usuarioLoginDTO.cpf(),usuarioLoginDTO.senha()));

        return usuarioRepository.findByCpf(usuarioLoginDTO.cpf()).orElseThrow();
    }
}
