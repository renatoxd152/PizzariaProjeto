package projeto.microservices.pedidos.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import projeto.microservices.pedidos.client.representation.PizzaRepresentation;

import java.util.List;

@FeignClient(name = "pizzas", url = "${clients.pizzas.url}")
public interface PizzaClient {
    @GetMapping("/filtrar/{ids}")
    ResponseEntity<List<PizzaRepresentation>> obterDadosDaPizza(@PathVariable("ids") List<String> ids);
}
