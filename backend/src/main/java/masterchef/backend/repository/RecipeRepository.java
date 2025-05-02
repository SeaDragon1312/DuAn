package masterchef.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import masterchef.backend.model.Recipe;
import masterchef.backend.model.WebUser;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Integer> {
    List<Recipe> findAllByUser(WebUser user);
    List<Recipe> findAllByDishNameContainingIgnoreCase(String dishName);
}
