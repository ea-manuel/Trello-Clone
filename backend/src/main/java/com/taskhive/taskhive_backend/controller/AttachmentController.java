package com.taskhive.taskhive_backend.controller;

import com.taskhive.taskhive_backend.model.Attachment;
import com.taskhive.taskhive_backend.service.AttachmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.io.IOException;

@RestController
@RequestMapping("/api/cards/{cardId}/attachments")
public class AttachmentController {

    @Autowired
    private AttachmentService attachmentService;

   @PostMapping
public ResponseEntity<?> uploadAttachment(
    @PathVariable("cardId") Long cardId,
    @RequestParam("file") MultipartFile file  // ✅ Correct for Postman form-data
) {
    try {
        System.out.println("File name: " + file.getOriginalFilename());

        if (file == null || file.isEmpty()) {
            System.out.println("⚠️ MultipartFile is NULL");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("File is missing or empty");
        }

        Attachment attachment = attachmentService.uploadFile(cardId, file);
        return ResponseEntity.ok(attachment);

    } catch (MultipartException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body("Invalid multipart request: " + ex.getMessage());

    } catch (MethodArgumentTypeMismatchException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body("Invalid card ID format");

    } catch (IOException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("File storage error: " + ex.getMessage());

    } catch (Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Error uploading file: " + ex.getMessage());
    }
}

}
