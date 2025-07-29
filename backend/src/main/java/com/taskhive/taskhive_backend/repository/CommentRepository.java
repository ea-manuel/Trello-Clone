package com.taskhive.taskhive_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taskhive.taskhive_backend.model.Card;
import com.taskhive.taskhive_backend.model.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByCard(Card card);
      List<Comment> findByCardIdOrderByCreatedAtAsc(Long cardId);
}

