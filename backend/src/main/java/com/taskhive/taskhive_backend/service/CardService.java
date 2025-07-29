package com.taskhive.taskhive_backend.service;

import com.taskhive.taskhive_backend.model.Card;
import com.taskhive.taskhive_backend.model.TaskList;
import com.taskhive.taskhive_backend.model.User;
import com.taskhive.taskhive_backend.payload.CardRequest;
import com.taskhive.taskhive_backend.repository.CardRepository;
import com.taskhive.taskhive_backend.repository.TaskListRepository;
import com.taskhive.taskhive_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CardService {

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private TaskListRepository taskListRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityLogService activityLogService;

    public Card createCard(CardRequest request, User user) {
        TaskList list = taskListRepository.findById(request.getListId())
                .orElseThrow(() -> new RuntimeException("TaskList not found with id: " + request.getListId()));

        Card card = new Card();
        card.setTitle(request.getTitle());
        card.setDescription(request.getDescription());
        card.setList(list);

        // Set due date
        card.setDueDate(request.getDueDate());

        if (request.getAssignedUserId() != null) {
            User assignee = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new RuntimeException("User to assign not found with id: " + request.getAssignedUserId()));
            card.setAssignedUser(assignee);
        }

        // Reset reminder flag
        card.setReminderSent(false);

        Card savedCard = cardRepository.save(card);

        // Log activity
        String location = "List: " + list.getTitle() + " → Card: " + card.getTitle();
        activityLogService.logActivity(user, "created card", location);

        return savedCard;
    }

    public Card updateCard(Long cardId, CardRequest request, User user) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found with id: " + cardId));

        card.setTitle(request.getTitle());
        card.setDescription(request.getDescription());

        // Update due date
        card.setDueDate(request.getDueDate());

        // Optional: Update assigned user
        if (request.getAssignedUserId() != null) {
            User assignee = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new RuntimeException("User to assign not found with id: " + request.getAssignedUserId()));
            card.setAssignedUser(assignee);
        } else {
            card.setAssignedUser(null);
        }

        // Reset reminder if due date is changed
        card.setReminderSent(false);

        Card updatedCard = cardRepository.save(card);

        // Log activity
        String location = "Card: " + card.getTitle();
        activityLogService.logActivity(user, "updated card", location);

        return updatedCard;
    }

    public void deleteCard(Long cardId, User user) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found with id: " + cardId));

        cardRepository.delete(card);

        // Log activity
        String location = "Card: " + card.getTitle();
        activityLogService.logActivity(user, "deleted card", location);
    }
}
