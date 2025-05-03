package masterchef.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
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
import masterchef.backend.dto.StepDTO;

@Getter
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "steps")

public class Step {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer orderNum;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "recipe_id", referencedColumnName = "id")
    private Recipe recipe;

    public Step(StepDTO stepDTO, Recipe recipe) {
        this.description = stepDTO.getDescription();
        this.recipe = recipe;
    }

    public Step(String description, Integer order, Recipe recipe) {
        this.description = description;
        this.orderNum = order;
        this.recipe = recipe;
    }
}
