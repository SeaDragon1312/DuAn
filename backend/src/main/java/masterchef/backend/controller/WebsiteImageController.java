package masterchef.backend.controller;

import java.sql.Blob;
import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import masterchef.backend.model.WebsiteImage;
import masterchef.backend.repository.WebsiteImageRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/image")
public class WebsiteImageController {
    @Autowired
    WebsiteImageRepository websiteImageRepository;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestBody Blob image) {
        websiteImageRepository.save(new WebsiteImage(image));
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/get")
    public ResponseEntity<?> getImage(@RequestParam Integer id) {
        WebsiteImage image = websiteImageRepository.findById(id).get();

        try {
            Blob blob = image.getImageData();
            byte[] imageBytes = blob.getBytes(1, (int) blob.length());

            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);

        } catch (SQLException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
