package masterchef.backend.dto;

import lombok.Getter;
import masterchef.backend.model.Recipe;

@Getter

public class DisplayRecipeDTO {
    private Integer id;
    private String imageUrl;
    private String title;
    private String author;
    private String dietType;

    public DisplayRecipeDTO(Recipe recipe) {
        this.id = recipe.getId();
        this.imageUrl = "https://duan-1jwf.onrender.com/api/image/get?id=" + recipe.getImage().getId();
        this.title = recipe.getDishName();
        this.author = recipe.getUser().getFullName();
        this.dietType = recipe.getDietType();
    }
}
