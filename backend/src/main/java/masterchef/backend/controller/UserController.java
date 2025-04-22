package masterchef.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import masterchef.backend.dto.UserDTO;
import masterchef.backend.model.User;
import masterchef.backend.repository.UserRepository;

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

    @PostMapping("signup")
    public String signUp(@RequestBody User user) {
        User existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser != null) {
            return "User already exists";
        }
        
        userRepository.save(user);
        return "User created successfully";
    }

    @PostMapping("login")
    public String login(@RequestBody UserDTO userForm) {
        User user = userRepository.findByUsername(userForm.getUsername());
        if (user == null) {
            return "User not found";
        }
        
        if (!user.getPassword().equals(userForm.getPassword())) {
            return "Invalid password";
        }
        
        return "Login successful";
    }
    
    

    @PostMapping("get")
    public ResponseEntity<?> getUser(@RequestBody String username) {
        User user = userRepository.findByUsername(username);
        
        return new ResponseEntity<>(user, HttpStatus.OK);
    }
    
}
