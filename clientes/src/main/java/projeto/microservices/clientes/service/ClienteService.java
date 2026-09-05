package projeto.microservices.clientes.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import projeto.microservices.clientes.controller.dto.ClienteDTO;
import projeto.microservices.clientes.exception.ClienteException;
import projeto.microservices.clientes.model.Cliente;
import projeto.microservices.clientes.repository.ClienteRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public Cliente adicionarCliente(Cliente cliente) {
        System.out.println("CPF RECEBIDO:" + cliente.getCpf());
        System.out.println("CPF EXISTE:" + clienteRepository.existsByCpf(cliente.getCpf()));
        if (clienteRepository.existsByCpf(cliente.getCpf()))
        {
            throw new ClienteException("Esse CPF já está cadastrado!");
        }
        return clienteRepository.save(cliente);
    }

    public List<Cliente> listarClientes()
    {
        return clienteRepository.findAll();
    }

    public Cliente listarClientePorId(String id)
    {
        return clienteRepository.findById(id).orElse(null);
    }

    public Cliente listarClientePorCPF(String cpf) {
        return clienteRepository.findByCpf(cpf).orElse(null);
    }

    public void deletarCliente(String cpf)
    {
        Cliente cliente = clienteRepository.findByCpf(cpf)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Esse cliente não existe!"));
        clienteRepository.deleteById(cliente.getId());
    }

    public Cliente atualizarCliente(String cpf, Cliente cliente) {
        Cliente clienteEncontrado = clienteRepository.findByCpf(cpf)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Esse cliente não existe!"));

        clienteEncontrado.setEmail(cliente.getEmail());
        clienteEncontrado.setNome(cliente.getNome());
        clienteEncontrado.setTelefone(cliente.getTelefone());
        return clienteRepository.save(clienteEncontrado);
    }
}
