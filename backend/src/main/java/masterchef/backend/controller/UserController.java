package masterchef.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import masterchef.backend.model.User;
import masterchef.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("/api/user/")
public class UserController {
    @Autowired
    UserRepository userRepository;

    @PostMapping("get")
    public ResponseEntity<?> getUser(@RequestBody String username) {
        User user = userRepository.findByUsername(username);
        
        return new ResponseEntity<>(user, HttpStatus.OK);
    }
    
}
