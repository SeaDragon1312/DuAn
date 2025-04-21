package masterchef.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import masterchef.backend.model.Step;
import masterchef.repository.StepRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("/api/step/")
public class StepController {
    @Autowired
    StepRepository stepRepository;

    @PostMapping("get")
    public ResponseEntity<?> getStep(@RequestBody Integer id) {
        Step step = stepRepository.findById(id).get();
        
        return new ResponseEntity<>(step, HttpStatus.OK);
    }
    
}
