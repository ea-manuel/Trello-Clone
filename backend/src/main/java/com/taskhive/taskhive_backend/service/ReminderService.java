package com.taskhive.taskhive_backend.service;

import com.taskhive.taskhive_backend.model.Card;
import com.taskhive.taskhive_backend.repository.CardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReminderService {

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private EmailService emailService;

    // Runs every 30 minutes
    @Scheduled(fixedRate = 30 * 60 * 1000)
    public void sendDueDateReminders() {
         sendDueDateReminders(); // manually trigger the logic
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime oneHourFromNow = now.plusHours(1);

        List<Card> upcomingCards = cardRepository.findByDueDateBetweenAndReminderSentFalse(now, oneHourFromNow);

        for (Card card : upcomingCards) {
            if (card.getAssignedUser() != null && card.getAssignedUser().getEmail() != null) {
                String email = card.getAssignedUser().getEmail();
                String subject = "Reminder: Card '" + card.getTitle() + "' is due soon!";
                String body = "Hi " + card.getAssignedUser().getUsernameRaw() + ",\n\n"

                        + "This is a reminder that the card **" + card.getTitle() + "** is due at "
                        + card.getDueDate() + ".\n\n"
                        + "Regards,\nTaskHive Team";

                emailService.sendReminderEmail(email, subject, body);

                card.setReminderSent(true);
                cardRepository.save(card);
            }
        }
    }
    public List<Card> getUpcomingDueCards() {
    LocalDateTime now = LocalDateTime.now();
    LocalDateTime oneHourFromNow = now.plusHours(1);
    return cardRepository.findByDueDateBetweenAndReminderSentFalse(now, oneHourFromNow);
}

}
