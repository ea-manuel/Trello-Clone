package com.taskhive.taskhive_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/test-upload")
public class TestUploadController {

    @PostMapping
    public ResponseEntity<String> testFileUpload(@RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file received");
        }

        String originalFileName = file.getOriginalFilename();
        System.out.println("File received: " + originalFileName);
        return ResponseEntity.ok("File received: " + originalFileName);
    }
}
