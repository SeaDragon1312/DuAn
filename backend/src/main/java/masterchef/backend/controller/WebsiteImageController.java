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
import java.util.Optional; // Thêm import này
import org.slf4j.Logger; // Thêm import này
import org.slf4j.LoggerFactory; // Thêm import này

@RestController
@RequestMapping("/api/image")
public class WebsiteImageController {
    private static final Logger logger = LoggerFactory.getLogger(WebsiteImageController.class); // Thêm logger
    @Autowired
    WebsiteImageRepository websiteImageRepository;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestBody byte[] image) {
        // Cân nhắc kiểm tra image có null hoặc rỗng không
        if (image == null || image.length == 0) {
            logger.warn("Attempted to upload null or empty image.");
            return new ResponseEntity<>("Image data cannot be empty.", HttpStatus.BAD_REQUEST);
        }
        try {
            WebsiteImage savedImage = websiteImageRepository.save(new WebsiteImage(image));
            logger.info("Image uploaded successfully with ID: {}", savedImage.getId());
            // Trả về ID của ảnh đã lưu có thể hữu ích hơn
            return new ResponseEntity<>("Image uploaded with ID: " + savedImage.getId(), HttpStatus.CREATED); // Dùng
                                                                                                              // CREATED
                                                                                                              // (201)
                                                                                                              // thay vì
                                                                                                              // OK
                                                                                                              // (200)
        } catch (Exception e) {
            logger.error("Error uploading image", e);
            return new ResponseEntity<>("Error uploading image.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get")
    public ResponseEntity<?> getImage(@RequestParam Integer id) {
        logger.info("Request received for image with ID: {}", id);

        Optional<WebsiteImage> imageOptional = websiteImageRepository.findById(id);

        if (imageOptional.isEmpty()) {
            logger.warn("Image not found with ID: {}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Trả về 404 nếu không tìm thấy
        }

        WebsiteImage image = imageOptional.get();
        byte[] imageBytes = image.getImageData(); // *** SỬA Ở ĐÂY: Giả sử phương thức đúng là getImage() ***

        if (imageBytes == null || imageBytes.length == 0) {
            logger.warn("Image data is null or empty for ID: {}", id);
            // Quyết định trả về 404 hoặc 204 No Content tùy logic
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        try {
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();

            // --- Cân nhắc xác định Content-Type động ---
            // Cách đơn giản nhất là lưu Content-Type khi upload
            // Nếu không có, tạm thời vẫn dùng PNG hoặc JPEG
            // headers.setContentType(MediaType.IMAGE_PNG);
            headers.setContentType(MediaType.IMAGE_JPEG); // Hoặc thử JPEG nếu phổ biến hơn

            logger.info("Returning image data for ID: {}", id);
            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            // Exception ở đây thường không xảy ra nếu đã lấy được byte[]
            logger.error("Error processing image data for ID: {}", id, e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
