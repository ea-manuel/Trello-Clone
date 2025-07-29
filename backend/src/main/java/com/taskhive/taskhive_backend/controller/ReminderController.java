package com.taskhive.taskhive_backend.controller;

import com.taskhive.taskhive_backend.model.Card;
import com.taskhive.taskhive_backend.service.ReminderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reminders")
public class ReminderController {

    @Autowired
    private ReminderService reminderService;

    // Manually trigger the scheduled reminder logic
    @PostMapping("/send")
    public ResponseEntity<String> sendRemindersManually() {
        reminderService.sendDueDateReminders();
        return ResponseEntity.ok("Reminder check triggered successfully.");
    }

    // View all cards due within 1 hour and not reminded
    @GetMapping("/due-soon")
    public ResponseEntity<List<Card>> getDueSoonCards() {
        List<Card> cards = reminderService.getUpcomingDueCards();
        return ResponseEntity.ok(cards);
    }

    // Get count of due soon cards with reminders not sent
    @GetMapping("/due-soon/count")
    public ResponseEntity<Integer> getDueSoonCount() {
        List<Card> cards = reminderService.getUpcomingDueCards();
        return ResponseEntity.ok(cards.size());
    }
}
