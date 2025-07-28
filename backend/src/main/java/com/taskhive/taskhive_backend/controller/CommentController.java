package com.taskhive.taskhive_backend.controller;

import com.taskhive.taskhive_backend.model.*;
import com.taskhive.taskhive_backend.payload.CommentRequest;
import com.taskhive.taskhive_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createComment(@RequestBody CommentRequest request, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            Card card = cardRepository.findById(request.getCardId())
                    .orElseThrow(() -> new RuntimeException("Card not found"));

            Workspace workspace = card.getList().getBoard().getWorkspace();

            // ✅ Check if the user is a member of the workspace
            if (!workspace.getUsers().contains(user)) {
                return ResponseEntity.status(403).body("Forbidden: You do not have access to this card");
            }

            Comment comment = new Comment();
            comment.setContent(request.getContent());
            comment.setCard(card);
            comment.setUser(user);

            return ResponseEntity.ok(commentRepository.save(comment));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating comment: " + e.getMessage());
        }
    }

    @GetMapping("/card/{cardId}")
    public ResponseEntity<?> getCommentsByCard(@PathVariable Long cardId, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            Card card = cardRepository.findById(cardId)
                    .orElseThrow(() -> new RuntimeException("Card not found"));

            Workspace workspace = card.getList().getBoard().getWorkspace();

            // ✅ Check if the user is a member of the workspace
            if (!workspace.getUsers().contains(user)) {
                return ResponseEntity.status(403).body("Forbidden: You do not have access to this card");
            }

            List<Comment> comments = commentRepository.findByCard(card);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error retrieving comments: " + e.getMessage());
        }
    }
}
