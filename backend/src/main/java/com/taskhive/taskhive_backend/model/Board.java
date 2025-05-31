package com.taskhive.taskhive_backend.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "boards")
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    // Many boards belong to one user
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // One board can have many lists
    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL)
    private List<TaskList> lists = new ArrayList<>();

    // Getters and setters (can be generated)
}

