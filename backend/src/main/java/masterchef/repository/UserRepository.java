package masterchef.repository;

import org.springframework.stereotype.Repository;

import masterchef.backend.model.User;

@Repository
public interface UserRepository {
    User findByUsername(String username);
}
