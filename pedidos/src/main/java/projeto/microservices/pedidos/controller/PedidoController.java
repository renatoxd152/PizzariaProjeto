package projeto.microservices.pedidos.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import projeto.microservices.pedidos.controller.dto.PedidoDTO;
import projeto.microservices.pedidos.model.Pedido;
import projeto.microservices.pedidos.service.PedidoService;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("pedidos")
@RequiredArgsConstructor
public class PedidoController {
    private final PedidoService pedidoService;
    @PostMapping
    public ResponseEntity<Pedido> criarPedido(@RequestBody PedidoDTO pedidoDTO, @AuthenticationPrincipal Jwt jwt)
    {
        if (!Objects.equals(jwt.getClaimAsString("cpf"), pedidoDTO.clienteCPF())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Você não pode criar pedidos para outro cliente");
        }

        Pedido pedido = pedidoService.adicionarPedido(pedidoDTO);
        return ResponseEntity.ok(pedido);
    }
    @GetMapping
    public ResponseEntity<List<Pedido>> listarPedidos()
    {
        return ResponseEntity.ok(pedidoService.listarPedidos());
    }
    @GetMapping("/clientes/{id}")
    public ResponseEntity<List<Pedido>> listarPedidosPorIdCliente(@PathVariable String id)
    {
        return ResponseEntity.ok(pedidoService.listarPedidosPorIdCliente(id));
    }
}
