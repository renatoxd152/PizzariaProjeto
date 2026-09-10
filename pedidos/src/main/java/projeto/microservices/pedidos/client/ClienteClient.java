package projeto.microservices.pedidos.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import projeto.microservices.pedidos.client.representation.ClienteRepresentation;

@FeignClient(name = "clientes", url = "${clients.clientes.url}")
public interface ClienteClient {

    @GetMapping("/cpf/{cpf}")
    ResponseEntity<ClienteRepresentation> obterDadosDoCliente(@PathVariable("cpf") String cpf);
}
