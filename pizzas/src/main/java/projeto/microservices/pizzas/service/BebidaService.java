package projeto.microservices.pizzas.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import projeto.microservices.pizzas.model.Bebida;
import projeto.microservices.pizzas.repository.BebidaRepository;
import java.io.IOException;
import static projeto.microservices.pizzas.service.utils.ImagemUtils.salvarImagem;

@Service
@RequiredArgsConstructor
public class BebidaService {
    private final BebidaRepository bebidaRepository;

    public Bebida criarBebida(Bebida bebida, MultipartFile imagem) throws IOException {
        bebida.setImagem(salvarImagem(imagem,"bebidas"));
        return bebidaRepository.save(bebida);
    }
}
