package com.taskhive.taskhive_backend.repository;

import com.taskhive.taskhive_backend.model.Card;
import com.taskhive.taskhive_backend.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByCard(Card card);
}
