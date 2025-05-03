package masterchef.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import masterchef.backend.model.WebsiteImage;
import java.util.List;
import java.sql.Blob;

@Repository
public interface WebsiteImageRepository extends JpaRepository<WebsiteImage, Integer> {
    List<WebsiteImage> findByImageData(Blob imageData);
}
