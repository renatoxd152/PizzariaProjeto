package projeto.microservices.clientes.controller;

import org.apache.coyote.Response;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import projeto.microservices.clientes.client.PedidoClient;
import projeto.microservices.clientes.client.enums.StatusPedido;
import projeto.microservices.clientes.client.representation.PedidoRepresentation;
import projeto.microservices.clientes.client.representation.PizzaRepresentation;
import projeto.microservices.clientes.controller.dto.ClienteDTO;
import projeto.microservices.clientes.controller.mapper.ClienteMapper;
import projeto.microservices.clientes.model.Cliente;
import projeto.microservices.clientes.service.ClienteService;
import tools.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ClienteController.class)
public class ClienteControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ClienteService clienteService;

    @MockitoBean
    private ClienteMapper clienteMapper;
    @Autowired
    private ObjectMapper objectMapper;

    private Cliente cliente;

    @Mock
    private PizzaRepresentation pizzaRepresentation;
    @Mock
    private PedidoRepresentation pedidoRepresentation;
    @Mock
    private List<PedidoRepresentation> listaPedidos;

    @BeforeEach
    void setup()
    {
        cliente = new Cliente();
        cliente.setNome("Renato");
        cliente.setTelefone("161616131");
        cliente.setCpf("46413164212");
        cliente.setEmail("renato@gmail.com");
        cliente.setId("id");

        pizzaRepresentation = new PizzaRepresentation("Frango com Catupiry", BigDecimal.valueOf(49.9),"id");

        pedidoRepresentation = new PedidoRepresentation("idPedido",
                StatusPedido.PENDENTE,
                BigDecimal.valueOf(49.9),
                List.of(pizzaRepresentation));

        this.listaPedidos = List.of(pedidoRepresentation);
    }

    @Nested
    public class AdicionarCliente
    {
        @Test
        @DisplayName("Fazendo a chamada para a rota sem o parâmetro esperado")
        public void chamarARotaSemOParametro() throws Exception
        {
            mockMvc.perform(
                    post("/clientes").contentType(MediaType.APPLICATION_JSON)
                    )
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Enviando o corpo com os dados na requisição")
        public void deveCadastrarCliente() throws Exception
        {
            when(clienteService.adicionarCliente(any(Cliente.class))).thenReturn(cliente);

            mockMvc.perform(
                            post("/clientes")
                                    .contentType(MediaType.APPLICATION_JSON)
                                    .content(objectMapper.writeValueAsString(cliente ))
                    )
                    .andExpect(status().isOk());
        }


    }

    @Nested
    public class ListarClientes
    {
        @Test
        @DisplayName("Deve listar os clientes na requisição")
        public void deveListarOsClientes() throws Exception
        {
            List<Cliente> clientes = new ArrayList<>();
            clientes.add(cliente);
            when(clienteService.listarClientes()).thenReturn(clientes);

            mockMvc.perform(MockMvcRequestBuilders.
                    get("/clientes")
            ).andExpect(status().isOk())
                    .andExpect(jsonPath("$").isArray())
                    .andExpect(jsonPath("$.length()").value(1))
                    .andExpect(jsonPath("$[0].nome").value(cliente.getNome()))
                    .andExpect(jsonPath("$[0].email").value(cliente.getEmail()))
                    .andExpect(jsonPath("$[0].cpf").value(cliente.getCpf()))
                    .andExpect(jsonPath("$[0].telefone").value(cliente.getTelefone()));

            verify(clienteService).listarClientes();
        }

        @Test
        @DisplayName("Deve listar cliente por ID")
        public void deveListarClientePorId() throws Exception
        {
            when(clienteService.listarClientePorId(cliente.getId())).thenReturn(cliente);

            mockMvc.perform(get("/clientes/{id}", cliente.getId()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.nome").value(cliente.getNome()))
                    .andExpect(jsonPath("$.email").value(cliente.getEmail()))
                    .andExpect(jsonPath("$.cpf").value(cliente.getCpf()))
                    .andExpect(jsonPath("$.telefone").value(cliente.getTelefone()));

            verify(clienteService).listarClientePorId(cliente.getId());

        }


        @Test
        @DisplayName("Deve listar cliente por ID")
        public void deveListarClientePorCPF() throws Exception
        {
            when(clienteService.listarClientePorCPF(cliente.getCpf())).thenReturn(cliente);

            mockMvc.perform(get("/clientes/cpf/{cpf}", cliente.getCpf()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.nome").value(cliente.getNome()))
                    .andExpect(jsonPath("$.email").value(cliente.getEmail()))
                    .andExpect(jsonPath("$.cpf").value(cliente.getCpf()))
                    .andExpect(jsonPath("$.telefone").value(cliente.getTelefone()));

            verify(clienteService).listarClientePorCPF(cliente.getCpf());

        }

        @Test
        @DisplayName("Deve listar os pedidos de determinado pelo Id do Cliente")
        public void deveListarPedidosPeloIdDoCliente() throws Exception
        {
            when(clienteService.listarPedidosClientePorId(cliente.getId())).thenReturn(listaPedidos);

            mockMvc.perform(MockMvcRequestBuilders.
                            get("/clientes/{id}/pedidos", cliente.getId())
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

            verify(clienteService).listarPedidosClientePorId(cliente.getId());
        }
    }

    @Nested
    public class DeletarCliente
    {
        @Test
        @DisplayName("Deve deletar um cliente")
        public void deveDeletarUmCliente() throws Exception
        {
            doNothing().when(clienteService).deletarCliente(cliente.getCpf());

            mockMvc.perform(
                    delete("/clientes/{cpf}", cliente.getCpf())
            ).andExpect(status().isNoContent());

            verify(clienteService).deletarCliente(cliente.getCpf());
        }

    }

    @Nested
    public class AtualizarCliente
    {
        @Test
        @DisplayName("Deve atualizar um cliente")
        public void deveAtualizarUmCliente() throws Exception
        {
            Cliente clienteAtualizado = new Cliente();
            clienteAtualizado.setNome("Teste");
            clienteAtualizado.setTelefone("123123123");
            clienteAtualizado.setCpf("3123123231");
            clienteAtualizado.setEmail("teste@gmail.com");
            clienteAtualizado.setId("id");


            when(clienteMapper.map(any(ClienteDTO.class)))
                    .thenReturn(clienteAtualizado);

            when(clienteService.atualizarCliente(cliente.getCpf(), clienteAtualizado)).thenReturn(clienteAtualizado);

            mockMvc.perform(put("/clientes/{cpf}", cliente.getCpf()).contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(clienteAtualizado)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.nome").value(clienteAtualizado.getNome()))
                    .andExpect(jsonPath("$.email").value(clienteAtualizado.getEmail()))
                    .andExpect(jsonPath("$.cpf").value(clienteAtualizado.getCpf()))
                    .andExpect(jsonPath("$.telefone").value(clienteAtualizado.getTelefone()));

            verify(clienteService).atualizarCliente(cliente.getCpf(), clienteAtualizado);
        }

    }




}
