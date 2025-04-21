package masterchef.repository;

import org.springframework.stereotype.Repository;

import masterchef.backend.model.Recipe;

@Repository
public interface RecipeRepository {
    Recipe findById(Integer id);
}
