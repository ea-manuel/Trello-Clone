package com.taskhive.taskhive_backend.service;

import com.taskhive.taskhive_backend.model.Attachment;
import com.taskhive.taskhive_backend.model.Card;
import com.taskhive.taskhive_backend.repository.AttachmentRepository;
import com.taskhive.taskhive_backend.repository.CardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AttachmentService {

    private static final String UPLOAD_DIR = "uploads";  // Relative to project root

    @Autowired
    private AttachmentRepository attachmentRepository;

    @Autowired
    private CardRepository cardRepository;

    public Attachment uploadFile(Long cardId, MultipartFile file) throws IOException {
    if (file == null || file.isEmpty()) {
        throw new IllegalArgumentException("File is missing or empty");
    }

    Card card = cardRepository.findById(cardId)
            .orElseThrow(() -> new IllegalArgumentException("Card not found with ID: " + cardId));

    String uploadPath = System.getProperty("user.dir") + "/uploads";
    File dir = new File(uploadPath);

    System.out.println("Upload directory path: " + uploadPath);
    System.out.println("Directory exists: " + dir.exists());
    System.out.println("Can write to directory: " + dir.canWrite());

    if (!dir.exists()) dir.mkdirs();

    String originalFilename = file.getOriginalFilename();
    String uniqueFilename = UUID.randomUUID() + "_" + originalFilename;
    File destination = new File(dir, uniqueFilename);

    System.out.println("Saving file to: " + destination.getAbsolutePath());

    try {
        file.transferTo(destination);
    } catch (IOException ex) {
        throw new IOException("Failed to save file: " + destination.getAbsolutePath(), ex);
    }

    Attachment attachment = new Attachment();
    attachment.setFilename(originalFilename);
    attachment.setFilepath(destination.getAbsolutePath());
    attachment.setContentType(file.getContentType());
    attachment.setUploadedAt(LocalDateTime.now());
    attachment.setCard(card);

    return attachmentRepository.save(attachment);
}

}
