package masterchef.backend.model;

import jakarta.persistence.Column;
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
// import masterchef.backend.dto.RecipeDTO;

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

    @Column(columnDefinition = "TEXT")
    private String introduction;

    @Column(columnDefinition = "TEXT")
    private String healthImpact;

    @ManyToOne
    @JoinColumn(name = "image_id", referencedColumnName = "id")
    private WebsiteImage image;

    @ManyToOne
    @JoinColumn(name = "owner_username", referencedColumnName = "username")
    private User user;

    public Recipe(String dishName, String introduction, String healthImpact, WebsiteImage image, User user) {
        this.dishName = dishName;
        this.introduction = introduction;
        this.healthImpact = healthImpact;
        this.image = image;
        this.user = user;
    }
}
