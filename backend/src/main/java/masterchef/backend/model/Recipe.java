package masterchef.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import masterchef.backend.dto.RecipeDTO;

@Getter
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "recipes")

public class Recipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String dishName;

    @OneToOne
    @JoinColumn(name = "image_id", referencedColumnName = "id")
    private WebsiteImage image;

    @ManyToOne
    @JoinColumn(name = "owner_username", referencedColumnName = "username")
    private User user;

    public Recipe(RecipeDTO recipeDTO, User user) {
        this.dishName = recipeDTO.getDishName();
        this.image = recipeDTO.getImage();
        this.user = user;
    }
}
