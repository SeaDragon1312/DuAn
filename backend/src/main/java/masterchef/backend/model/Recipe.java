package masterchef.backend.model;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

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

    private Integer healthScore;
    private String allergyWarning;
    private String dietType;
    private String preparationTime;

    private Boolean isPublished = false;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "image_id", referencedColumnName = "id")
    private WebsiteImage image;

    @ManyToOne
    @JoinColumn(name = "owner_id", referencedColumnName = "userId")
    private WebUser user;

    private Date publishedDate;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Step> stepList;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Ingredient> ingredientList;

    public Recipe(String dishName, String introduction, String healthImpact, Integer healthScore, String warning,
            String dietType, String prepTime, WebsiteImage image, WebUser user, Boolean isPublished) {
        this.dishName = dishName;
        this.introduction = introduction;
        this.healthImpact = healthImpact;
        this.healthScore = healthScore;
        this.allergyWarning = warning;
        this.dietType = dietType;
        this.preparationTime = prepTime;
        this.image = image;
        this.user = user;
        this.isPublished = isPublished == null ? false : isPublished;
        if (this.isPublished)
            this.publishedDate = new Date();
    }
}
