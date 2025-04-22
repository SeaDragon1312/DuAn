package masterchef.backend.service;

import java.sql.Blob;

import javax.sql.rowset.serial.SerialBlob;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import masterchef.backend.model.WebsiteImage;
import masterchef.backend.repository.WebsiteImageRepository;

@Service
public class WebsiteImageService {
    @Autowired
    private WebsiteImageRepository websiteImageRepository;

    public void saveImage(byte[] imageData) throws Exception {
        Blob blob = new SerialBlob(imageData);
        websiteImageRepository.save(new WebsiteImage(blob));
    }

}
