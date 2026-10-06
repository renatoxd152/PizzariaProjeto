package projeto.microservices.usuarios.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import projeto.microservices.usuarios.client.enums.StatusPedido;
import projeto.microservices.usuarios.client.representation.PedidoRepresentation;
import projeto.microservices.usuarios.client.representation.PizzaRepresentation;
import projeto.microservices.usuarios.controller.dto.UsuarioDTO;
import projeto.microservices.usuarios.controller.mapper.UsuarioMapper;
import projeto.microservices.usuarios.model.Usuario;
import projeto.microservices.usuarios.model.enums.UsuarioRole;
import projeto.microservices.usuarios.service.JWTService;
import projeto.microservices.usuarios.service.UsuarioService;
import tools.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UsuarioController.class)
public class UsuarioControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UsuarioService usuarioService;

    @MockitoBean
    private UsuarioMapper usuarioMapper;
    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private JWTService jwtService;

    private Usuario usuario;
    private UsuarioDTO usuarioDTO;
    @Mock
    private PizzaRepresentation pizzaRepresentation;
    @Mock
    private PedidoRepresentation pedidoRepresentation;
    @Mock
    private List<PedidoRepresentation> listaPedidos;
    @MockitoBean
    private UserDetailsService userDetailsService;
    @BeforeEach
    void setup()
    {
        usuarioDTO = new UsuarioDTO("Renato","161616131","46413164212","renato@gmail.com","123456", UsuarioRole.CLIENTE);

        usuario = new Usuario();
        usuario.setNome("Renato");
        usuario.setTelefone("161616131");
        usuario.setCpf("46413164212");
        usuario.setEmail("renato@gmail.com");
        usuario.setId("id");
        usuario.setSenha("123456");
        usuario.setUsuarioRole(UsuarioRole.CLIENTE);
        usuario.setCpf("4123123123");
        pizzaRepresentation = new PizzaRepresentation("Frango com Catupiry", BigDecimal.valueOf(49.9),"id");

        pedidoRepresentation = new PedidoRepresentation("idPedido",
                StatusPedido.PENDENTE,
                BigDecimal.valueOf(49.9),
                List.of(pizzaRepresentation));

        this.listaPedidos = List.of(pedidoRepresentation);
    }

    @Nested
    public class AdicionarUsuario
    {
        @Test
        @DisplayName("Fazendo a chamada para a rota sem o parâmetro esperado")
        public void chamarARotaSemOParametro() throws Exception
        {
            mockMvc.perform(
                    post("/usuarios").contentType(MediaType.APPLICATION_JSON)
                    )
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Enviando o corpo com os dados na requisição")
        public void deveCadastrarUsuario() throws Exception
        {
            when(usuarioService.adicionarUsuario(any(Usuario.class))).thenReturn(usuario);

            mockMvc.perform(
                            post("/usuarios")
                                    .contentType(MediaType.APPLICATION_JSON)
                                    .content(objectMapper.writeValueAsString(usuarioDTO))
                    )
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.senha").doesNotExist())
            ;
        }


    }

    @Nested
    public class ListarUsuarios
    {
        @Test
        @DisplayName("Deve listar os usuarios na requisição")
        public void deveListarOsUsuarios() throws Exception
        {
            List<Usuario> usuarios = new ArrayList<>();
            usuarios.add(usuario);
            when(usuarioService.listarUsuarios()).thenReturn(usuarios);

            mockMvc.perform(MockMvcRequestBuilders.
                    get("/usuarios")
            ).andExpect(status().isOk())
                    .andExpect(jsonPath("$").isArray())
                    .andExpect(jsonPath("$.length()").value(1))
                    .andExpect(jsonPath("$[0].nome").value(usuario.getNome()))
                    .andExpect(jsonPath("$[0].email").value(usuario.getEmail()))
                    .andExpect(jsonPath("$[0].cpf").value(usuario.getCpf()))
                    .andExpect(jsonPath("$[0].telefone").value(usuario.getTelefone()))
                    .andExpect(jsonPath("$[0].senha").doesNotExist())
                    .andExpect(jsonPath("$[0].usuarioRole").value(usuario.getUsuarioRole().toString()));

            verify(usuarioService).listarUsuarios();
        }

        @Test
        @DisplayName("Deve listar usuario por ID")
        public void deveListarUsuarioPorId() throws Exception
        {
            when(usuarioService.listarUsuarioPorId(usuario.getId())).thenReturn(usuario);

            mockMvc.perform(get("/usuarios/{id}", usuario.getId()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.nome").value(usuario.getNome()))
                    .andExpect(jsonPath("$.email").value(usuario.getEmail()))
                    .andExpect(jsonPath("$.cpf").value(usuario.getCpf()))
                    .andExpect(jsonPath("$.telefone").value(usuario.getTelefone()))
                    .andExpect(jsonPath("$.senha").doesNotExist())
                    .andExpect(jsonPath("$.usuarioRole").value(usuario.getUsuarioRole().toString()));

            verify(usuarioService).listarUsuarioPorId(usuario.getId());

        }


        @Test
        @DisplayName("Deve listar usuario por ID")
        public void deveListarUsuarioPorCPF() throws Exception
        {
            when(usuarioService.listarUsuarioPorCPF(usuario.getCpf())).thenReturn(usuario);

            mockMvc.perform(get("/usuarios/cpf/{cpf}", usuario.getCpf()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.nome").value(usuario.getNome()))
                    .andExpect(jsonPath("$.email").value(usuario.getEmail()))
                    .andExpect(jsonPath("$.cpf").value(usuario.getCpf()))
                    .andExpect(jsonPath("$.telefone").value(usuario.getTelefone()))
                    .andExpect(jsonPath("$.senha").doesNotExist())
                    .andExpect(jsonPath("$.usuarioRole").value(usuario.getUsuarioRole().toString()));

            verify(usuarioService).listarUsuarioPorCPF(usuario.getCpf());

        }

        @Test
        @DisplayName("Deve listar os pedidos de determinado pelo Id do Usuario")
        public void deveListarPedidosPeloIdDoUsuario() throws Exception
        {
            when(usuarioService.listarPedidosUsuarioPorId(usuario.getId())).thenReturn(listaPedidos);

            mockMvc.perform(MockMvcRequestBuilders.
                            get("/usuarios/{id}/pedidos", usuario.getId())
                    ).andExpect(status().isOk())
                    .andExpect(jsonPath("$").isArray())
                    .andExpect(jsonPath("$.length()").value(1))
                    .andExpect(jsonPath("$[0].id").value(pedidoRepresentation.id()))
                    .andExpect(jsonPath("$[0].statusPedido").value(pedidoRepresentation.statusPedido().toString()))
                    .andExpect(jsonPath("$[0].total").value(pedidoRepresentation.total()))
                    .andExpect(jsonPath("$[0].pizzas.length()").value(1))
                    .andExpect(jsonPath("$[0].pizzas[0].nome").value(pizzaRepresentation.nome()))
                    .andExpect(jsonPath("$[0].pizzas[0].preco").value(pizzaRepresentation.preco()))
                    .andExpect(jsonPath("$[0].pizzas[0].id").value(pizzaRepresentation.id()));

            verify(usuarioService).listarPedidosUsuarioPorId(usuario.getId());
        }
    }

    @Nested
    public class DeletarUsuario
    {
        @Test
        @DisplayName("Deve deletar um usuario")
        public void deveDeletarUmUsuario() throws Exception
        {
            doNothing().when(usuarioService).deletarUsuario(usuario.getCpf());

            mockMvc.perform(
                    delete("/usuarios/{cpf}", usuario.getCpf())
            ).andExpect(status().isNoContent());

            verify(usuarioService).deletarUsuario(usuario.getCpf());
        }
    }

    @Nested
    public class AtualizarUsuario
    {
        @Test
        @DisplayName("Deve atualizar um usuario")
        public void deveAtualizarUmUsuario() throws Exception
        {
            Usuario usuarioAtualizado = new Usuario();
            usuarioAtualizado.setNome("Teste");
            usuarioAtualizado.setTelefone("123123123");
            usuarioAtualizado.setCpf("3123123231");
            usuarioAtualizado.setEmail("teste@gmail.com");
            usuarioAtualizado.setId("id");
            usuarioAtualizado.setUsuarioRole(UsuarioRole.CLIENTE);


            when(usuarioMapper.map(any(UsuarioDTO.class)))
                    .thenReturn(usuarioAtualizado);

            when(usuarioService.atualizarUsuario(usuario.getCpf(), usuarioAtualizado)).thenReturn(usuarioAtualizado);

            mockMvc.perform(put("/usuarios/{cpf}", usuario.getCpf()).contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(usuarioAtualizado)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.nome").value(usuarioAtualizado.getNome()))
                    .andExpect(jsonPath("$.email").value(usuarioAtualizado.getEmail()))
                    .andExpect(jsonPath("$.cpf").value(usuarioAtualizado.getCpf()))
                    .andExpect(jsonPath("$.telefone").value(usuarioAtualizado.getTelefone()))
                    .andExpect(jsonPath("$.senha").doesNotExist())
                    .andExpect(jsonPath("$.usuarioRole").value(usuario.getUsuarioRole().toString()));

            verify(usuarioService).atualizarUsuario(usuario.getCpf(), usuarioAtualizado);
        }
    }
}
