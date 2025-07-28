package com.taskhive.taskhive_backend.repository;

import com.taskhive.taskhive_backend.model.Card;
import com.taskhive.taskhive_backend.model.TaskList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface CardRepository extends JpaRepository<Card, Long> {
    List<Card> findByList(TaskList list);
    List<Card> findByDueDateBeforeAndReminderSentFalseAndAssignedUserIsNotNull(LocalDateTime dueDateThreshold);
    List<Card> findByDueDateBetweenAndReminderSentFalse(LocalDateTime start, LocalDateTime end);


}
