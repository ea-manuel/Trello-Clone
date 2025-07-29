package com.taskhive.taskhive_backend.payload;

public class CommentRequest {

    private String content;
    private Long cardId;

    // Getter for content
    public String getContent() {
        return content;
    }

    // Setter for content
    public void setContent(String content) {
        this.content = content;
    }

    // Getter for cardId
    public Long getCardId() {
        return cardId;
    }

    // Setter for cardId
    public void setCardId(Long cardId) {
        this.cardId = cardId;
    }
}
