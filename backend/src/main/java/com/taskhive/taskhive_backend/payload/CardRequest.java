package com.taskhive.taskhive_backend.payload;

import java.time.LocalDateTime;

public class CardRequest {
    private String title;
    private String description;
    private Long listId;

    private Long assignedUserId;
    private LocalDateTime dueDate;

public LocalDateTime getDueDate() {
    return dueDate;
}

public void setDueDate(LocalDateTime dueDate) {
    this.dueDate = dueDate;
}


    // Getters and setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getListId() {
        return listId;
    }

    public void setListId(Long listId) {
        this.listId = listId;
    }
     public Long getAssignedUserId() {
        return assignedUserId;
    }

    public void setAssignedUserId(Long assignedUserId) {
        this.assignedUserId = assignedUserId;
    }
}
