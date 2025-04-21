package masterchef.repository;

import org.springframework.stereotype.Repository;

import masterchef.backend.model.Step;

@Repository
public interface StepRepository {
    Step findById(Integer id);
}
