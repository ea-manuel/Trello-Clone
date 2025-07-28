package com.taskhive.taskhive_backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String action; // e.g., "created card", "uploaded file"

    private String targetType; // e.g., "Card", "Board", "List"

    private Long targetId; // ID of the target object (card ID, board ID, etc.)

    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "user_id")

    private User user;
// Getters and Setters 
public void setLocation(String location) {
    this.location = location;
}
    private String location; // e.g., "Board A", "List B"

    @Override
    public String toString() {
        return "ActivityLog{" +
                "id=" + id +
                ", action='" + action + '\'' +
                ", targetType='" + targetType + '\'' +
                ", targetId=" + targetId +
                ", timestamp=" + timestamp +
                ", user=" + user.getUsername() +
                ", location='" + location + '\'' +
                '}';
    }   

}


