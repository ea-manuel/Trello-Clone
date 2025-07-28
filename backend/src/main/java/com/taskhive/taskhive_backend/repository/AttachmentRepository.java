package com.taskhive.taskhive_backend.repository;

import com.taskhive.taskhive_backend.model.Attachment;
import com.taskhive.taskhive_backend.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
    List<Attachment> findByCard(Card card);
}
