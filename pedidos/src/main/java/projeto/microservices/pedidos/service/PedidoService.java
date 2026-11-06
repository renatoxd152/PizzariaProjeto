package projeto.microservices.pedidos.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import projeto.microservices.pedidos.client.ClienteClient;
import projeto.microservices.pedidos.client.PizzaClient;
import projeto.microservices.pedidos.client.enums.UsuarioRole;
import projeto.microservices.pedidos.client.representation.ClienteRepresentation;
import projeto.microservices.pedidos.controller.dto.PedidoDTO;
import projeto.microservices.pedidos.controller.mapper.ItemPedidoMapper;
import projeto.microservices.pedidos.model.ItemPedido;
import projeto.microservices.pedidos.model.Pedido;

import projeto.microservices.pedidos.model.enums.StatusPedido;
import projeto.microservices.pedidos.publisher.PedidoPublisher;
import projeto.microservices.pedidos.repository.PedidoRepository;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PedidoService {
    private final ClienteClient clienteClient;
    private final PizzaClient pizzaClient;
    private final PedidoRepository pedidoRepository;
    private final PedidoPublisher pedidoPublisher;
    private final ItemPedidoMapper itemPedidoMapper;

    public Pedido adicionarPedido(PedidoDTO pedidoDTO) {
        System.out.println("CPF VINDO DO PEDIDO:" + pedidoDTO.clienteCPF());
        ResponseEntity<ClienteRepresentation> clienteRepresentation = clienteClient.obterDadosDoCliente(pedidoDTO.clienteCPF());
        if (clienteRepresentation.getBody().usuarioRole() != UsuarioRole.CLIENTE)
        {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "O CPF informado não pertence a um cliente!");
        }
        List<ItemPedido> itens = itemPedidoMapper.toEntityList(pedidoDTO.itens());
        Pedido pedido = criarPedido(clienteRepresentation, itens);
        Pedido pedidoSalvo = pedidoRepository.save(pedido);
        pedidoPublisher.publicar(pedidoSalvo);
        return pedidoSalvo;
    }

    private static Pedido criarPedido(ResponseEntity<ClienteRepresentation> clienteRepresentation, List<ItemPedido> itens) {
        Pedido pedido = new Pedido();
        pedido.setClienteRepresentation(clienteRepresentation.getBody());
        pedido.setItens(itens);
        pedido.setStatusPedido(StatusPedido.PENDENTE);
        pedido.setTotal(somarValoresDoPedido(itens));
        return pedido;
    }

    private static BigDecimal somarValoresDoPedido(List<ItemPedido> itens) {
        BigDecimal total = BigDecimal.ZERO;
        for(ItemPedido item : itens)
        {
            total = total.add(item.getProduto().getPreco());
        }
        return total;
    }

    public List<Pedido> listarPedidos() {
        return pedidoRepository.findAll();
    }

    public List<Pedido> listarPedidosPorIdCliente(String idCliente) {
        return pedidoRepository.findByIdCliente(idCliente);
    }
}
