package com.taskhive.taskhive_backend.controller;

import com.taskhive.taskhive_backend.model.Card;
import com.taskhive.taskhive_backend.model.TaskList;
import com.taskhive.taskhive_backend.model.User;
import com.taskhive.taskhive_backend.payload.CardRequest;
import com.taskhive.taskhive_backend.repository.CardRepository;
import com.taskhive.taskhive_backend.repository.TaskListRepository;
import com.taskhive.taskhive_backend.repository.UserRepository;
import com.taskhive.taskhive_backend.service.ActivityLogService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cards")
public class CardController {

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private TaskListRepository listRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityLogService activityLogService;

    // Create a card
    @PostMapping
    public ResponseEntity<?> createCard(@RequestBody CardRequest cardRequest, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            TaskList list = listRepository.findById(cardRequest.getListId())
                    .orElseThrow(() -> new RuntimeException("Task list not found"));

            if (!list.getBoard().getWorkspace().getUsers().contains(user)) {
                return ResponseEntity.status(403).body("Forbidden: You are not a collaborator on this workspace");
            }

            Card card = new Card();
            card.setTitle(cardRequest.getTitle());
            card.setDescription(cardRequest.getDescription());
            card.setList(list);
            card.setDueDate(cardRequest.getDueDate());

            if (cardRequest.getAssignedUserId() != null) {
                User assignee = userRepository.findById(cardRequest.getAssignedUserId())
                        .orElseThrow(() -> new RuntimeException("Assigned user not found with ID: " + cardRequest.getAssignedUserId()));

                if (!list.getBoard().getWorkspace().getUsers().contains(assignee)) {
                    return ResponseEntity.status(400).body("Assigned user is not part of this workspace");
                }

                card.setAssignedUser(assignee);
            }

            Card savedCard = cardRepository.save(card);

            String location = "List: " + list.getTitle() + " → Card: " + card.getTitle();
            activityLogService.logActivity(user, "created card", location);

            return ResponseEntity.ok(savedCard);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating card: " + e.getMessage());
        }
    }

    // Get cards by list
    @GetMapping("/list/{listId}")
    public ResponseEntity<?> getCardsByList(@PathVariable Long listId, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            TaskList list = listRepository.findById(listId)
                    .orElseThrow(() -> new RuntimeException("Task list not found"));

            if (!list.getBoard().getWorkspace().getUsers().contains(user)) {
                return ResponseEntity.status(403).body("Forbidden: You are not a collaborator on this workspace");
            }

            List<Card> cards = cardRepository.findByList(list);
            return ResponseEntity.ok(cards);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error retrieving cards: " + e.getMessage());
        }
    }

    // Update card (title, description, due date, assignee)
    @PutMapping("/{cardId}")
    public ResponseEntity<?> updateCard(@PathVariable Long cardId,
                                        @RequestBody CardRequest request,
                                        Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            Card card = cardRepository.findById(cardId)
                    .orElseThrow(() -> new RuntimeException("Card not found"));

            if (!card.getList().getBoard().getWorkspace().getUsers().contains(user)) {
                return ResponseEntity.status(403).body("Forbidden: You are not a collaborator on this workspace");
            }

            card.setTitle(request.getTitle());
            card.setDescription(request.getDescription());
            card.setDueDate(request.getDueDate());

            if (request.getAssignedUserId() != null) {
                User assignee = userRepository.findById(request.getAssignedUserId())
                        .orElseThrow(() -> new RuntimeException("Assigned user not found"));

                if (!card.getList().getBoard().getWorkspace().getUsers().contains(assignee)) {
                    return ResponseEntity.status(400).body("Assigned user is not part of this workspace");
                }

                card.setAssignedUser(assignee);
            } else {
                card.setAssignedUser(null); // allow unassigning
            }

            Card updatedCard = cardRepository.save(card);

            String location = "Card: " + card.getTitle();
            activityLogService.logActivity(user, "updated card", location);

            return ResponseEntity.ok(updatedCard);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating card: " + e.getMessage());
        }
    }
}
