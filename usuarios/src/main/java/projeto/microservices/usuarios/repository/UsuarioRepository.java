package projeto.microservices.usuarios.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import projeto.microservices.usuarios.model.Usuario;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends MongoRepository<Usuario, String> {
    boolean existsByCpf(String cpf);
    Optional<Usuario> findByCpf(String cpf);
}
