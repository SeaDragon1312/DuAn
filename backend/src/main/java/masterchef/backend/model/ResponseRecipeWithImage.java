package masterchef.backend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor

public class ResponseRecipeWithImage {
    private String introduction;
    private String[] steps;
    private String[] ingredients;
    private String healthImpact;
    private int healthScore;
    private String allergyWarning;
    private String dietType;
    private String preparationTime;
    private Integer imageId;
}
