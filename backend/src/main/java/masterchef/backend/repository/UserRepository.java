package masterchef.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import masterchef.backend.model.WebUser;


@Repository
public interface UserRepository extends JpaRepository<WebUser, String> {
    WebUser findByUserId(String userId);
}
