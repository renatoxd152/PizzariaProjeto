package projeto.microservices.clientes.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;
import projeto.microservices.clientes.client.representation.PedidoRepresentation;
import projeto.microservices.clientes.controller.dto.ClienteDTO;
import projeto.microservices.clientes.controller.dto.ClienteLoginDTO;
import projeto.microservices.clientes.controller.mapper.ClienteMapper;
import projeto.microservices.clientes.model.Cliente;
import projeto.microservices.clientes.model.LoginResponse;
import projeto.microservices.clientes.service.ClienteService;
import projeto.microservices.clientes.service.JWTService;

import java.util.List;

@RestController
@RequestMapping("clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteMapper clienteMapper;
    private final ClienteService clienteService;
    private final JWTService jwtService;
    @PostMapping
    public ResponseEntity<Cliente> adicionarCliente(@Valid @RequestBody ClienteDTO clienteDTO)
    {
        Cliente cliente = clienteService.adicionarCliente(clienteMapper.map(clienteDTO));
        return ResponseEntity.ok(cliente);
    }

    @GetMapping
    public ResponseEntity<List<Cliente>> listarClientes()
    {
        return ResponseEntity.ok(clienteService.listarClientes());
    }

    @GetMapping("{id}")
    public ResponseEntity<Cliente> listarCliente(@PathVariable String id)
    {
        return ResponseEntity.ok(clienteService.listarClientePorId(id));
    }
    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<Cliente> listarClientePorCPF(@PathVariable String cpf)
    {
        return ResponseEntity.ok(clienteService.listarClientePorCPF(cpf));
    }

    @DeleteMapping("{cpf}")
    public ResponseEntity<Void> deletarCliente(@PathVariable("cpf") String cpf)
    {
        clienteService.deletarCliente(cpf);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("{cpf}")
    public ResponseEntity<Cliente> atualizarCliente(@PathVariable("cpf") String cpf, @RequestBody ClienteDTO clienteDTO)
    {
        return ResponseEntity.ok(clienteService.atualizarCliente(cpf, clienteMapper.map(clienteDTO)));
    }

    @GetMapping("/{id}/pedidos")
    public ResponseEntity<List<PedidoRepresentation>> listarPedidosPorIdCliente(@PathVariable String id)
    {
        return ResponseEntity.ok(clienteService.listarPedidosClientePorId(id));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody ClienteLoginDTO clienteLoginDTO)
    {
        Cliente cliente = clienteService.login(clienteLoginDTO);
        String token = jwtService.generateToken(cliente);
        LoginResponse loginResponse = new LoginResponse(token,jwtService.getExpirationTime());

        return ResponseEntity.ok(loginResponse);
    }


}
