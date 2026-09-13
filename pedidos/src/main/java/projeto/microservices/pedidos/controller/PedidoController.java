package projeto.microservices.pedidos.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import projeto.microservices.pedidos.controller.dto.PedidoDTO;
import projeto.microservices.pedidos.model.Pedido;
import projeto.microservices.pedidos.service.PedidoService;

import java.util.List;

@RestController
@RequestMapping("pedidos")
@RequiredArgsConstructor
public class PedidoController {
    private final PedidoService pedidoService;
    @PostMapping
    public ResponseEntity<Pedido> criarPedido(@RequestBody PedidoDTO pedidoDTO)
    {
        Pedido pedido = pedidoService.adicionarPedido(pedidoDTO);
        return ResponseEntity.ok(pedido);
    }
    @GetMapping
    public ResponseEntity<List<Pedido>> listarPedidos()
    {
        return ResponseEntity.ok(pedidoService.listarPedidos());
    }
}
