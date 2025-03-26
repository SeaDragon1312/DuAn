package masterchef.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import masterchef.backend.service.GeminiTextService;
import masterchef.backend.service.ImagenService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
public class GeminiController {

    @Autowired 
    ImagenService imagenService;

    @Autowired
    GeminiTextService geminiTextService;

    @GetMapping("/path")
    public String getMethodName() {
        return imagenService.getImage("bun bo Hue");
    }

    @GetMapping("/hello")
    public String test() {
        return new String("heolo");
    }

    @GetMapping("/aitext")
    public String getMethodName(@RequestParam String param) {
        return geminiTextService.generateText("give me ingredient list of chocolate milk");
    }
    
    
}
