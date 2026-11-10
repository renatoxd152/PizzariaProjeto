package projeto.microservices.pizzas.controller;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import projeto.microservices.pizzas.controller.dto.BebidaDTO;
import projeto.microservices.pizzas.controller.mapper.BebidaMapper;
import projeto.microservices.pizzas.model.Bebida;
import projeto.microservices.pizzas.service.BebidaService;
import java.io.IOException;

@RestController
@RequestMapping("bebidas")
@RequiredArgsConstructor
public class BebidaController {

    private final BebidaService bebidaService;
    private final BebidaMapper bebidaMapper;

    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Bebida criada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Bebida> criarBebida(
            @RequestPart("bebida") BebidaDTO bebidaDTO, @RequestPart("imagem") MultipartFile imagem
    ) throws IOException {
        Bebida bebida = bebidaMapper.map(bebidaDTO);
        return ResponseEntity.ok(bebidaService.criarBebida(bebida, imagem));
    }
}
