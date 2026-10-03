package projeto.microservices.usuarios.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import projeto.microservices.usuarios.client.representation.PedidoRepresentation;

import java.util.List;

@FeignClient(name = "pedidos", url = "${clients.cliente.pedidos.url}")
public interface PedidoClient {
    @GetMapping("/clientes/{id}/pedidos")
    List<PedidoRepresentation> obterPedidosPorIdUsuario(@PathVariable("id") String id);
}
