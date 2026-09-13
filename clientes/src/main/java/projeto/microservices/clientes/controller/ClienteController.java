package projeto.microservices.clientes.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import projeto.microservices.clientes.controller.dto.ClienteDTO;
import projeto.microservices.clientes.controller.mapper.ClienteMapper;
import projeto.microservices.clientes.exception.ClienteException;
import projeto.microservices.clientes.model.Cliente;
import projeto.microservices.clientes.service.ClienteService;

import java.util.List;

@RestController
@RequestMapping("clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteMapper clienteMapper;
    private final ClienteService clienteService;
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

}
