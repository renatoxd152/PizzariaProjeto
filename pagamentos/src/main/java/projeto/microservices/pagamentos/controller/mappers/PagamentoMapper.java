package projeto.microservices.pagamentos.controller.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import projeto.microservices.pagamentos.controller.dto.PagamentoDTO;
import projeto.microservices.pagamentos.model.Pagamento;

@Mapper(componentModel = "spring")
public interface PagamentoMapper {
    @Mapping(source = "valorAPagar", target = "total")
    Pagamento map(PagamentoDTO pagamentoDTO);
}
