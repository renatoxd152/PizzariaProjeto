package projeto.microservices.usuarios.controller.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import projeto.microservices.usuarios.controller.dto.UsuarioDTO;
import projeto.microservices.usuarios.model.Usuario;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {
    Usuario map(UsuarioDTO usuarioDTO);
}
