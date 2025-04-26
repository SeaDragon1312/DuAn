package masterchef.backend.controller;

import java.sql.Blob;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import masterchef.backend.model.WebsiteImage;
import masterchef.backend.repository.WebsiteImageRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


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
    
}
