package masterchef.backend.controller;

import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.databind.JsonNode;

import masterchef.backend.model.WebUser;
import masterchef.backend.repository.UserRepository;

import java.util.Optional;

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
    public ResponseEntity<?> signUp(@RequestBody JsonNode clerkWebhookData) {
        if (!"user.created".equals(clerkWebhookData.get("type").asText())) {
            return new ResponseEntity<>("Not a user creation event", HttpStatus.BAD_REQUEST);
        }

        JsonNode userData = clerkWebhookData.get("data");

        String userId = userData.get("id").asText();

        Optional<WebUser> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            return new ResponseEntity<>("User already exists", HttpStatus.CONFLICT);
        }

        String email = "";
        if (userData.has("email_addresses") && userData.get("email_addresses").isArray() &&
                userData.get("email_addresses").size() > 0) {
            email = userData.get("email_addresses").get(0).get("email_address").asText();
        }

        WebUser newUser = new WebUser();
        newUser.setUserId(userId);
        newUser.setFirstName(userData.get("first_name").asText());
        newUser.setLastName(userData.get("last_name").asText());
        newUser.setEmail(email);

        if (userData.has("username") && !userData.get("username").isNull()) {
            newUser.setUsername(userData.get("username").asText());
        } else {
            newUser.setUsername(email.isEmpty() ? userId.substring(0, 8) : email.split("@")[0]);
        }

        newUser.setPassword("clerk_managed");

        WebUser savedUser = userRepository.save(newUser);

        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    @PostMapping("webhook/update")
    public ResponseEntity<?> updateUserWebhook(@RequestBody JsonNode clerkWebhookData) {
        if (!"user.updated".equals(clerkWebhookData.get("type").asText())) {
            return new ResponseEntity<>("Not a user update event", HttpStatus.BAD_REQUEST);
        }

        JsonNode userData = clerkWebhookData.get("data");

        String userId = userData.get("id").asText();

        Optional<WebUser> optionalUser = userRepository.findById(userId);
        if (!optionalUser.isPresent()) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        WebUser existingUser = optionalUser.get();

        if (userData.has("first_name") && !userData.get("first_name").isNull()) {
            existingUser.setFirstName(userData.get("first_name").asText());
        }

        if (userData.has("last_name") && !userData.get("last_name").isNull()) {
            existingUser.setLastName(userData.get("last_name").asText());
        }

        if (userData.has("email_addresses") && userData.get("email_addresses").isArray() &&
                userData.get("email_addresses").size() > 0) {
            String email = userData.get("email_addresses").get(0).get("email_address").asText();
            existingUser.setEmail(email);
        }

        if (userData.has("username") && !userData.get("username").isNull()) {
            existingUser.setUsername(userData.get("username").asText());
        }

        WebUser savedUser = userRepository.save(existingUser);
        return new ResponseEntity<>(savedUser, HttpStatus.OK);
    }

    @PostMapping("webhook/delete")
    public ResponseEntity<?> deleteUserWebhook(@RequestBody JsonNode clerkWebhookData) {
        if (!"user.deleted".equals(clerkWebhookData.get("type").asText())) {
            return new ResponseEntity<>("Not a user deletion event", HttpStatus.BAD_REQUEST);
        }
        JsonNode userData = clerkWebhookData.get("data");

        String userId = userData.get("id").asText();

        Optional<WebUser> optionalUser = userRepository.findById(userId);
        if (!optionalUser.isPresent()) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        userRepository.deleteById(userId);
        return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
    }

    // @PostMapping("login")
    // public String login(@RequestBody UserDTO userForm) {
    // User user = userRepository.findByUsername(userForm.getUsername());
    // if (user == null) {
    // return "User not found";
    // }

    // if (!user.getPassword().equals(userForm.getPassword())) {
    // return "Invalid password";
    // }

    // return "Login successful";
    // }

    @PostMapping("get")
    public ResponseEntity<?> getUser(@RequestBody String userId) {
        WebUser user = userRepository.findByUserId(userId);

        return new ResponseEntity<>(user, HttpStatus.OK);
    }

}
