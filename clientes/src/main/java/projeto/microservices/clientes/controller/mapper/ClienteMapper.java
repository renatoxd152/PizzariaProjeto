package projeto.microservices.clientes.controller.mapper;

import org.mapstruct.Mapper;
import projeto.microservices.clientes.controller.dto.ClienteDTO;
import projeto.microservices.clientes.model.Cliente;

@Mapper(componentModel = "spring")
public interface ClienteMapper {
    Cliente map(ClienteDTO clienteDTO);
}
