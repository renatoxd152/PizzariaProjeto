package projeto.microservices.pedidos.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @Operation(summary = "Cadastrar pedido")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Pedido criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    @PostMapping
    public ResponseEntity<Pedido> criarPedido(@RequestBody PedidoDTO pedidoDTO, @AuthenticationPrincipal Jwt jwt)
    {
        Pedido pedido = pedidoService.adicionarPedido(pedidoDTO);
        return ResponseEntity.ok(pedido);
    }
    @Operation(summary = "Listar todas as pizzas")
    @ApiResponse(responseCode = "200", description = "Lista de pizzas")
    @GetMapping
    public ResponseEntity<List<Pedido>> listarPedidos()
    {
        return ResponseEntity.ok(pedidoService.listarPedidos());
    }
    @Operation(summary = "Buscar pizza por ID")
    @GetMapping("/clientes/{id}")
    public ResponseEntity<List<Pedido>> listarPedidosPorIdCliente(@PathVariable String id)
    {
        return ResponseEntity.ok(pedidoService.listarPedidosPorIdCliente(id));
    }
}
