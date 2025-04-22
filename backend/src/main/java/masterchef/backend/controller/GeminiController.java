package masterchef.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import masterchef.backend.service.GeminiTextService;
import masterchef.backend.service.ImagenService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("/gemini")
public class GeminiController {

    @Autowired 
    ImagenService imagenService;

    @Autowired
    GeminiTextService geminiTextService;

    @GetMapping("/image")
    public String getImage(@RequestParam String prompt) {
        return imagenService.getImage(prompt);
    }

    @GetMapping("/hello")
    public String test() {
        return new String("hellolo");
    }

    @GetMapping("/aitext")
    public String getText(@RequestParam String prompt) {
        return geminiTextService.generateText(prompt);
    }
    
    
}
