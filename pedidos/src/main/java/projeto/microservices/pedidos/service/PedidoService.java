package projeto.microservices.pedidos.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import projeto.microservices.pedidos.client.ClienteClient;
import projeto.microservices.pedidos.client.PizzaClient;
import projeto.microservices.pedidos.client.representation.ClienteRepresentation;
import projeto.microservices.pedidos.client.representation.PizzaRepresentation;
import projeto.microservices.pedidos.controller.dto.PedidoDTO;
import projeto.microservices.pedidos.model.Pedido;
import projeto.microservices.pedidos.model.enums.StatusPedido;
import projeto.microservices.pedidos.repository.PedidoRepository;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PedidoService {
    private final ClienteClient clienteClient;
    private final PizzaClient pizzaClient;
    private final PedidoRepository pedidoRepository;

    public Pedido adicionarPedido(PedidoDTO pedidoDTO) {
        ResponseEntity<ClienteRepresentation> clienteRepresentation = clienteClient.obterDadosDoCliente(pedidoDTO.clienteCPF());
        ResponseEntity<List<PizzaRepresentation>> pizzaRepresentation = pizzaClient.obterDadosDaPizza(pedidoDTO.pizzasIds());
        Pedido pedido = criarPedido(clienteRepresentation, pizzaRepresentation);
        return pedidoRepository.save(pedido);
    }

    private static Pedido criarPedido(ResponseEntity<ClienteRepresentation> clienteRepresentation, ResponseEntity<List<PizzaRepresentation>> pizzaRepresentation) {
        Pedido pedido = new Pedido();
        pedido.setClienteRepresentation(clienteRepresentation.getBody());
        pedido.setPizzas(pizzaRepresentation.getBody());
        pedido.setStatusPedido(StatusPedido.PENDENTE);
        pedido.setTotal(somarValoresDasPizzas(pizzaRepresentation));
        return pedido;
    }

    private static BigDecimal somarValoresDasPizzas(ResponseEntity<List<PizzaRepresentation>> pizzaRepresentation) {
        BigDecimal total = BigDecimal.ZERO;
        for(PizzaRepresentation pizza : pizzaRepresentation.getBody())
        {
            total = total.add(pizza.preco());
        }
        return total;
    }
}
