package masterchef.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import masterchef.backend.model.WebsiteImage;

@Repository
public interface WebsiteImageRepository extends JpaRepository<WebsiteImage, Integer> {
}
