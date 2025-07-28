package com.taskhive.taskhive_backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "attachments")
public class Attachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filename;
    private String filepath;
    private String contentType;
    private LocalDateTime uploadedAt;

    @ManyToOne
    @JoinColumn(name = "card_id", nullable = false)
    private Card card;

    // Getters and setters
    public Long getId() {
    return id;
}

public void setId(Long id) {
    this.id = id;
}

public String getFilename() {
    return filename;
}

public void setFilename(String filename) {
    this.filename = filename;
}

public String getFilepath() {
    return filepath;
}

public void setFilepath(String filepath) {
    this.filepath = filepath;
}

public String getContentType() {
    return contentType;
}

public void setContentType(String contentType) {
    this.contentType = contentType;
}

public LocalDateTime getUploadedAt() {
    return uploadedAt;
}

public void setUploadedAt(LocalDateTime uploadedAt) {
    this.uploadedAt = uploadedAt;
}

public Card getCard() {
    return card;
}

public void setCard(Card card) {
    this.card = card;
}

}
