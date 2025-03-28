package masterchef.backend.model;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor

@Entity

public class Recipe {
    private Integer id;
    private String dishName;
    private String imageUrl;
}
