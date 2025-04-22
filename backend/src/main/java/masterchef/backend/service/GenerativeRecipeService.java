package masterchef.backend.service;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import masterchef.backend.dto.RecipeDTO;
import masterchef.backend.model.Ingredient;
import masterchef.backend.model.Recipe;
import masterchef.backend.model.Step;
import masterchef.backend.model.User;
import masterchef.backend.repository.IngredientRepository;
import masterchef.backend.repository.RecipeRepository;
import masterchef.backend.repository.StepRepository;
import masterchef.backend.repository.UserRepository;
import masterchef.backend.repository.WebsiteImageRepository;

@Service
public class GenerativeRecipeService {
    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private GeminiTextService geminiTextService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StepRepository stepRepository;

    @Autowired
    private IngredientRepository ingredientRepository;

    @Autowired
    private WebsiteImageRepository websiteImageRepository;

    public String generateRecipe(RecipeDTO recipeDTO) {
        User user = userRepository.findByUsername(recipeDTO.getUsername());
        if (user == null)
            return null;

        String generativeRecipeFormat = "{" +
                "\"introduction\": String," +
                "\"steps\": [String]," +
                "\"ingredients\": [String]," +
                "\"healthImpact\": String" +
                "}";
        String godPrompt = "You will receive the procedure for how to cook \"" + recipeDTO.getDishName() +
                "\". Your task is to generate introduction for this dish, create a list of step for this dish," +
                " a list of ingredients needed to cook it, and its health impact. " +
                "The output must be only a JSON object in this exact format: " +
                generativeRecipeFormat;
        String godResponse = geminiTextService.generateText(godPrompt);

        try {
            JSONObject jsonObject = new JSONObject(sanitizeResponse(godResponse));
            String introduction = jsonObject.getString("introduction");
            String[] steps = jsonObject.getJSONArray("steps").toList().toArray(new String[0]);
            String[] ingredients = jsonObject.getJSONArray("ingredients").toList().toArray(new String[0]);
            String healthImpact = jsonObject.getString("healthImpact");

            Recipe recipe = new Recipe(recipeDTO.getDishName(), introduction, healthImpact,
                    websiteImageRepository.findById(2).get(),
                    user);

            recipeRepository.save(recipe);

            for (String step : steps) {
                stepRepository.save(new Step(step, recipe));
            }
            for (String ingredient : ingredients) {
                ingredientRepository.save(new Ingredient(ingredient, recipe));
            }

            return sanitizeResponse(godResponse);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private String sanitizeResponse(String jsonResponse) {
        int startIndex = jsonResponse.indexOf("{");
        int endIndex = jsonResponse.lastIndexOf("}");
        if (startIndex != -1 && endIndex != -1)
            return jsonResponse.substring(startIndex, endIndex + 1);
        else
            return null;
    }

}
