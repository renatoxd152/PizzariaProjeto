package projeto.microservices.usuarios.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;
import projeto.microservices.usuarios.client.PedidoClient;
import projeto.microservices.usuarios.client.enums.StatusPedido;
import projeto.microservices.usuarios.client.representation.PedidoRepresentation;
import projeto.microservices.usuarios.client.representation.PizzaRepresentation;
import projeto.microservices.usuarios.exception.UsuarioException;
import projeto.microservices.usuarios.model.Usuario;
import projeto.microservices.usuarios.repository.UsuarioRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuario;

    @Mock
    private PedidoClient pedidoClient;

    @Mock
    private PizzaRepresentation pizzaRepresentation;

    @Mock
    private List<PedidoRepresentation> pedidoRepresentation;

    @Mock
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setup()
    {
        usuario = new Usuario();

        usuario.setId("idUsuario");
        usuario.setCpf("47613163121");
        usuario.setTelefone("17113123123");
        usuario.setEmail("teste@gmail.com");
        usuario.setNome("Usuario");
        usuario.setSenha(passwordEncoder.encode("123456"));

        pizzaRepresentation = new PizzaRepresentation("Frango com Catupiry", BigDecimal.valueOf(49.9),"id");

        pedidoRepresentation = List.of(new PedidoRepresentation("idPedido",
                StatusPedido.PENDENTE,
                BigDecimal.valueOf(49.9),
                List.of(pizzaRepresentation)));
    }

    @Nested
    public class AdicionarUsuarios
    {
        @Test
        @DisplayName("Deve lançar uma exceção em caso se o CPF já existir")
        public void deveEmitirExcecaoComCpfExistente()
        {
            Usuario usuario = new Usuario();
            usuario.setCpf("48121231221");

            when(usuarioRepository.existsByCpf("48121231221")).thenReturn(true);
            UsuarioException exception = assertThrows(UsuarioException.class,
                    () -> usuarioService.adicionarUsuario(usuario));

            assertThat(exception.getMessage()).isEqualTo("Esse CPF já está cadastrado!");
        }

        @Test
        @DisplayName("Deve cadastrar um novo usuario")
        public void deveCadastrarUsuario()
        {
            when(usuarioRepository.existsByCpf(usuario.getCpf())).thenReturn(false);
            when(passwordEncoder.encode(usuario.getSenha())).thenReturn("123456");

            when(usuarioRepository.save(usuario)).thenReturn(usuario);
            Usuario resultado = usuarioService.adicionarUsuario(usuario);
            assertEquals(usuario,resultado);
        }
    }

    @Nested
    public class ListarUsuarios
    {
        @Test
        @DisplayName("Deve listar usuario por ID")
        public void deveListarUsuarioPorId()
        {

            when(usuarioRepository.findById("idUsuario")).thenReturn(Optional.of(usuario));

            Usuario resultado = usuarioService.listarUsuarioPorId("idUsuario");

            assertEquals(usuario, resultado);
        }

        @Test
        @DisplayName("Deve listar se não tiver usuarios")
        public void deveListarSeNãoTiverUsuarios()
        {
            when(usuarioRepository.findById("idUsuario")).thenReturn(Optional.empty());

            ResponseStatusException exception = assertThrows(
                    ResponseStatusException.class,
                    () -> usuarioService.listarUsuarioPorId("idUsuario")
            );

            assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        }

        @Test
        @DisplayName("Deve listar um usuario pelo CPF")
        public void listarUsuarioPorCPF()
        {
            when(usuarioRepository.findByCpf(usuario.getCpf())).thenReturn(Optional.of(usuario));

            Usuario resultado = usuarioService.listarUsuarioPorCPF(usuario.getCpf());

            assertEquals(usuario,resultado);
        }

        @Test
        @DisplayName("Deve gerar uma mensagem de erro com o status de não encontrado")
        public void deveGerarMensagemComNotFound()
        {
            when(usuarioRepository.findByCpf("46412315212")).thenReturn(Optional.empty());

            ResponseStatusException exception = assertThrows(
                    ResponseStatusException.class,
                    () -> usuarioService.listarUsuarioPorCPF("46412315212")
            );

            assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        }
    }

    @Nested
    public class AtualizarUsuarios
    {
        @Test
        @DisplayName("Deve atualizar um usuario existente")
        public void deveAtualizarUmUsuarioExistente()
        {
            Usuario usuario = new Usuario();
            usuario.setId("idUsuario");
            usuario.setCpf("47613163121");
            usuario.setTelefone("17113123123");
            usuario.setEmail("teste@gmail.com");
            usuario.setNome("Usuario");

            Usuario usuarioAtualizado = new Usuario();
            usuarioAtualizado.setId("idUsuario");
            usuarioAtualizado.setCpf("47613163121");
            usuarioAtualizado.setTelefone("1699312641");
            usuarioAtualizado.setEmail("renato@gmail.com");
            usuarioAtualizado.setNome("Renato");

            when(usuarioRepository.save(usuario)).thenReturn(usuario);
            when(usuarioRepository.findByCpf("47613163121"))
                    .thenReturn(Optional.of(usuario));

            Usuario resultado = usuarioService.atualizarUsuario("47613163121", usuarioAtualizado);

            assertEquals(usuario, resultado);
        }

        @Test
        @DisplayName("Deve retornar erro se não encontrar o usuario para atualizar")
        public void deveRetornarErroSeNaoEncontrarOUsuario()
        {
            Usuario usuarioAtualizado = new Usuario();
            usuarioAtualizado.setId("idUsuario");
            usuarioAtualizado.setCpf("47613163121");
            usuarioAtualizado.setTelefone("1699312641");
            usuarioAtualizado.setEmail("renato@gmail.com");
            usuarioAtualizado.setNome("Renato");

            ResponseStatusException exception = assertThrows(
                    ResponseStatusException.class,
                    () -> usuarioService.atualizarUsuario("47613163121", usuarioAtualizado)
            );

            assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        }

    }

    @Nested
    public class DeletarUsuario
    {
        @Test
        @DisplayName("Deve retornar erro se excluir um usuario que não existe")
        public void deveRetornarErroAoDeletarUmUsuarioQueNaoExiste()
        {
            ResponseStatusException exception = assertThrows(
                    ResponseStatusException.class,
                    () -> usuarioService.deletarUsuario("47613163121")
            );

            assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        }

        @Test
        @DisplayName("Deve excluir um usuario que existe")
        public void deveExcluirOUsuario()
        {
            when(usuarioRepository.findByCpf("47613163121")).thenReturn(Optional.of(usuario));
            usuarioService.deletarUsuario("47613163121");

            verify(usuarioRepository).deleteById("idUsuario");
        }
    }

    @Nested
    public class ListarPedidos
    {
        @Test
        @DisplayName("Deve listar todos os pedidos de um usuario")
        public void deveListarTodosPedidosDeUmUsuario()
        {
            when(pedidoClient.obterPedidosPorIdUsuario(usuario.getId())).thenReturn(pedidoRepresentation);

            List<PedidoRepresentation> resultados = usuarioService.listarPedidosUsuarioPorId(usuario.getId());

            assertEquals(pedidoRepresentation, resultados);
        }

    }

}
