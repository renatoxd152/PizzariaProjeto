package projeto.microservices.clientes.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import projeto.microservices.clientes.client.representation.PedidoRepresentation;

import java.util.List;

@FeignClient(name = "pedidos", url = "${clients.cliente.pedidos.url}")
public interface PedidoClient {
    @GetMapping("/clientes/{id}/pedidos")
    List<PedidoRepresentation> obterPedidosPorIdCliente(@PathVariable("id") String id);
}
