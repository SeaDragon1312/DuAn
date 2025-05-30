package masterchef.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import masterchef.backend.dto.IngredientDTO;

@Getter
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "ingredients")

public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private String type;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "recipe_id", referencedColumnName = "id")
    private Recipe recipe;

    public Ingredient(IngredientDTO ingredientDTO, Recipe recipe) {
        this.name = ingredientDTO.getName();
        this.recipe = recipe;
        this.type = "food";
    }

    public Ingredient(String name, Recipe recipe) {
        this.name = name;
        this.recipe = recipe;
        this.type = "food";
    }
}
