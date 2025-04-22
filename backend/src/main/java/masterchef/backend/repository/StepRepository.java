package masterchef.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import masterchef.backend.model.Step;

@Repository
public interface StepRepository extends JpaRepository<Step, Integer> {
}
