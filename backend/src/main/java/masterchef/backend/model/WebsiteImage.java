package masterchef.backend.model;

import java.sql.Blob;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

@Getter

@Entity
@Table(name = "images")

public class WebsiteImage {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    private Blob imageData;

    public WebsiteImage(Blob imageData) {
        this.imageData = imageData;
    }
}
