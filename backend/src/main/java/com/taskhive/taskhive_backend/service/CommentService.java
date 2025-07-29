package com.taskhive.taskhive_backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taskhive.taskhive_backend.model.Card;
import com.taskhive.taskhive_backend.model.Comment;
import com.taskhive.taskhive_backend.model.User;
import com.taskhive.taskhive_backend.repository.CardRepository;
import com.taskhive.taskhive_backend.repository.CommentRepository;
import com.taskhive.taskhive_backend.repository.UserRepository;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private UserRepository userRepository;

    public Comment addCommentToCard(Long cardId, String content, String userEmail) {
        Optional<Card> cardOpt = cardRepository.findById(cardId);
        Optional<User> userOpt = userRepository.findByEmail(userEmail);

        if (cardOpt.isEmpty()) {
            throw new IllegalArgumentException("Card not found");
        }

        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setCard(cardOpt.get());
        comment.setUser(userOpt.get());
        comment.setCreatedAt(LocalDateTime.now());

        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByCard(Long cardId) {
        return commentRepository.findByCardIdOrderByCreatedAtAsc(cardId);
    }

    public void deleteComment(Long commentId, String userEmail) {
        Optional<Comment> commentOpt = commentRepository.findById(commentId);
        if (commentOpt.isEmpty()) {
            throw new IllegalArgumentException("Comment not found");
        }

        Comment comment = commentOpt.get();
        if (!comment.getUser().getEmail().equals(userEmail)) {
            throw new SecurityException("You are not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }
}
